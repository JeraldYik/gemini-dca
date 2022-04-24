import { MAKER_TRADING_FEE, TICKERS } from "./utils/constants";
import { differenceInCalendarDays, startOfDay } from "date-fns";
import { googleSheetName, isSandboxEnv, startDate } from "./utils/config";

import bluebird from "bluebird";
import bulkInsertRowIntoDb from "./services/database/bulkInsertRowIntoDb";
import checkIfOrderIsFulfilled from "./services/gemini/checkIfOrderIsFulfilled";
import createNewOrder from "./services/gemini/createNewOrder";
import { flatten } from "lodash";
import getTickerBestBidPrice from "./services/gemini/getTickerBestBidPrice";
import { initialiseGoogleDocument } from "./setup/googleSheets";
import { logger } from "./utils/logger";
import updateCells from "./services/googleSheets/updateCells";

const main = async () => {
  const doc = await initialiseGoogleDocument();
  const todayDate = new Date().toLocaleDateString("en-SG", {
    timeZone: "Asia/Singapore",
  });
  const unflattenedTransactionValues = await bluebird.map(
    Object.entries(TICKERS),
    async (coinInfo) => {
      const tickerMetadata = coinInfo[1];
      // Assume that Gemini logic is well-tested with unit tests, hence Gemini portion is skipped for sandbox environment, as order books is sparsely populated
      if (isSandboxEnv) {
        return [
          todayDate,
          tickerMetadata.dailyFiatAmount * (1 + MAKER_TRADING_FEE),
          1000,
          1,
        ];
      }
      const tickerBestBidPrice = await getTickerBestBidPrice(
        tickerMetadata.symbol
      );
      const newOrder = await createNewOrder(tickerMetadata, tickerBestBidPrice);

      if (newOrder.is_cancelled) {
        logger.error({
          message: "Order has been cancelled upon creation",
          meta: { ...newOrder },
        });
      }

      // order fulfilled
      if (!newOrder.is_live) {
        const actualFiatDeposit = (
          parseFloat(newOrder.avg_execution_price) *
          parseFloat(newOrder.executed_amount) *
          (1 + MAKER_TRADING_FEE)
        ).toString();

        return [
          todayDate,
          actualFiatDeposit,
          newOrder.avg_execution_price,
          newOrder.executed_amount,
        ];
      }

      const fulfilledOrder = (await checkIfOrderIsFulfilled({
        orderId: newOrder.order_id,
        tickerSymbol: tickerMetadata.symbol,
      }))!;

      logger.info({
        message: "Order fulfilled",
        meta: {
          ...fulfilledOrder,
        },
      });
      const actualFiatDeposit = (
        parseFloat(fulfilledOrder.avg_execution_price) *
        parseFloat(fulfilledOrder.executed_amount) *
        (1 + MAKER_TRADING_FEE)
      ).toString();

      return [
        todayDate,
        actualFiatDeposit,
        fulfilledOrder!.avg_execution_price,
        fulfilledOrder!.executed_amount,
      ];
    },
    { concurrency: 1 }
  );
  const flattenedTransactionValues = flatten(unflattenedTransactionValues);

  const splitStartDate = startDate.split("/").map((d) => parseInt(d));
  const differenceInDays = differenceInCalendarDays(
    new Date(),
    new Date(splitStartDate[2], splitStartDate[1] - 1, splitStartDate[0])
  );

  if (differenceInDays < 0) {
    logger.error({
      message: "Start date of recording is later than today",
      meta: {
        startDate,
      },
    });
  }

  await updateCells(
    doc,
    googleSheetName,
    differenceInDays,
    flattenedTransactionValues
  );

  const bulkCreateTransactionRow = unflattenedTransactionValues.map(
    (transactionRow, idx) => {
      return {
        ticker: Object.values(TICKERS)[idx].symbol,
        createdForDay: startOfDay(new Date()),
        fiatDepositInSgd: transactionRow[1] as number,
        pricePerCoinInSgd: transactionRow[2] as number,
        coinAmount: transactionRow[3] as number,
      };
    }
  );

  await bulkInsertRowIntoDb(bulkCreateTransactionRow);
};

main();

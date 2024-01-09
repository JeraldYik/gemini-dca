import {
  googleSheetName,
  isSandboxEnv,
  startDate,
  startRows,
} from "./utils/config";
import {
  MAKER_TRADING_FEE,
  TICKERS,
  TODAY_DATE,
  TODAY_DATE_STR,
} from "./utils/constants";

import bluebird from "bluebird";
import { differenceInCalendarDays } from "date-fns";
import { OrderStatus } from "../types/index";
import elephantSqlBulkInsert from "./services/database/elephantSql_bulkInsertRowIntoDb";
import { OrderAttributes } from "./services/database/models/elephantSql_order";
import checkIfOrderIsFulfilled from "./services/gemini/checkIfOrderIsFulfilled";
import createNewOrder from "./services/gemini/createNewOrder";
import getTickerBestBidPrice from "./services/gemini/getTickerBestBidPrice";
import updateCells from "./services/googleSheets/updateCells";
import { initialiseGoogleDocument } from "./setup/googleSheets";
import { logger } from "./utils/logger";

const main = async () => {
  const doc = await initialiseGoogleDocument();

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
    throw new Error("Start date of recording is later than today");
  }

  const transactionValues = await bluebird.map(
    Object.entries(TICKERS),
    async (coinInfo) => {
      const tickerMetadata = coinInfo[1];
      // purchase for this coin is temporarily turned off
      if (tickerMetadata.dailyFiatAmount <= 0) {
        return [];
      }
      // Assume that Gemini logic is well-tested with unit tests, hence Gemini portion is skipped for sandbox environment, as order books are sparsely populated
      if (isSandboxEnv) {
        return [
          TODAY_DATE_STR,
          tickerMetadata.dailyFiatAmount * (1 + MAKER_TRADING_FEE),
          1000,
          1,
        ];
      }

      const MAX_COUNTER = 23;
      let counter = 0;
      let newOrder: OrderStatus = {} as OrderStatus;
      while (counter < MAX_COUNTER) {
        const tickerBestBidPrice = await getTickerBestBidPrice(
          tickerMetadata.symbol
        );
        newOrder = await createNewOrder(tickerMetadata, tickerBestBidPrice);

        if (!newOrder || newOrder.is_cancelled) {
          logger.error({
            message: "Order has been cancelled upon creation",
            meta: { ...newOrder },
          });

          return [];
        }

        // order fulfilled
        if (!newOrder.is_live) {
          const actualFiatDeposit =
            parseFloat(newOrder.avg_execution_price) *
            parseFloat(newOrder.executed_amount) *
            (1 + MAKER_TRADING_FEE);

          return [
            TODAY_DATE_STR,
            actualFiatDeposit,
            parseFloat(newOrder.avg_execution_price),
            parseFloat(newOrder.executed_amount),
          ];
        }

        const fulfilledOrder = await checkIfOrderIsFulfilled({
          orderId: newOrder.order_id,
          tickerSymbol: tickerMetadata.symbol,
          externalLoopCounter: counter,
        });

        if (fulfilledOrder) {
          if (fulfilledOrder.is_cancelled) {
            logger.info({
              message: "Order cancelled",
              meta: {
                ...fulfilledOrder,
              },
            });
            return [];
          }
          logger.info({
            message: "Order fulfilled",
            meta: {
              ...fulfilledOrder,
            },
          });

          const actualFiatDeposit =
            parseFloat(fulfilledOrder.avg_execution_price) *
            parseFloat(fulfilledOrder.executed_amount) *
            (1 + MAKER_TRADING_FEE);

          return [
            TODAY_DATE_STR,
            actualFiatDeposit,
            parseFloat(fulfilledOrder!.avg_execution_price),
            parseFloat(fulfilledOrder!.executed_amount),
          ];
        }
        counter++;
      }

      logger.warn({
        message: "Order not fulfilled within 23 hours",
        meta: {
          orderId: newOrder.order_id,
          symbol: tickerMetadata.symbol,
        },
      });

      return [];
    },

    { concurrency: Object.keys(TICKERS).length }
  );

  const possiblyUndefinedBulkCreateTransactionRows = await bluebird.map(
    transactionValues,
    async (values, idx) => {
      // for unpurchased coins, unfilled and then cancelled orders
      if (values.length === 0) {
        return undefined;
      }

      const startRow = parseInt(startRows[idx]);

      const googleSheetsCellRangeWithoutRowNumber =
        Object.values(TICKERS)[idx].googleSheetCellRange;
      const columnNumberString = (startRow + differenceInDays).toString();
      const googleSheetsCellRange =
        googleSheetsCellRangeWithoutRowNumber.replaceAll(
          "*",
          columnNumberString
        );

      await updateCells(doc, googleSheetName, googleSheetsCellRange, values);

      const orderAttributes: OrderAttributes = {
        ticker: Object.values(TICKERS)[idx].symbol,
        createdForDay: TODAY_DATE,
        fiatDepositInSgd: values[1] as number,
        pricePerCoinInSgd: values[2] as number,
        coinAmount: values[3] as number,
      };

      return orderAttributes;
    },
    { concurrency: 1 }
  );

  const bulkCreateTransactionRows =
    possiblyUndefinedBulkCreateTransactionRows.filter(
      (row): row is OrderAttributes => !!row
    );

  await elephantSqlBulkInsert(bulkCreateTransactionRows);
};

main();

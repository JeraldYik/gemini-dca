import { MAKER_TRADING_FEE, TICKERS } from "./utils/constants";
import { differenceInCalendarDays, startOfDay } from "date-fns";
import {
  googleSheetName,
  isSandboxEnv,
  startDates,
  startRows,
} from "./utils/config";

import { OrderAttributes } from "./services/database/models/heroku_order";
import { OrderStatus } from "../types/index";
import bluebird from "bluebird";
import checkIfOrderIsFulfilled from "./services/gemini/checkIfOrderIsFulfilled";
import createNewOrder from "./services/gemini/createNewOrder";
import elephantSqlBulkInsert from "./services/database/elephantSql_bulkInsertRowIntoDb";
import getTickerBestBidPrice from "./services/gemini/getTickerBestBidPrice";
import herokuBulkInsert from "./services/database/heroku_bulkInsertRowIntoDb";
import { initialiseGoogleDocument } from "./setup/googleSheets";
import { logger } from "./utils/logger";
import updateCells from "./services/googleSheets/updateCells";

const main = async () => {
  const doc = await initialiseGoogleDocument();
  const todayDate = new Date().toLocaleDateString("en-SG", {
    timeZone: "Asia/Singapore",
  });

  const transactionValues = await bluebird.map(
    Object.entries(TICKERS),
    async (coinInfo) => {
      const tickerMetadata = coinInfo[1];
      // Assume that Gemini logic is well-tested with unit tests, hence Gemini portion is skipped for sandbox environment, as order books are sparsely populated
      if (isSandboxEnv) {
        return [
          todayDate,
          tickerMetadata.dailyFiatAmount * (1 + MAKER_TRADING_FEE),
          1000,
          1,
        ];
      }

      const MAX_COUNTER = 12;
      let counter = 0;
      let newOrder: OrderStatus = {} as OrderStatus;
      while (counter < MAX_COUNTER) {
        const tickerBestBidPrice = await getTickerBestBidPrice(
          tickerMetadata.symbol
        );
        newOrder = await createNewOrder(tickerMetadata, tickerBestBidPrice);

        if (newOrder.is_cancelled) {
          logger.error({
            message: "Order has been cancelled upon creation",
            meta: { ...newOrder },
          });
        }

        // order fulfilled
        if (!newOrder.is_live) {
          const actualFiatDeposit =
            parseFloat(newOrder.avg_execution_price) *
            parseFloat(newOrder.executed_amount) *
            (1 + MAKER_TRADING_FEE);

          return [
            todayDate,
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
            todayDate,
            actualFiatDeposit,
            parseFloat(fulfilledOrder!.avg_execution_price),
            parseFloat(fulfilledOrder!.executed_amount),
          ];
        }
        counter++;
      }

      logger.warn({
        message: "Order not fulfilled within 10 hours",
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
      // for unfilled and then cancelled orders
      if (values.length === 0) {
        return undefined;
      }

      const startDate = startDates[idx];
      const startRow = parseInt(startRows[idx]);
      const splitStartDate = startDates[idx].split("/").map((d) => parseInt(d));
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
        createdForDay: startOfDay(new Date()),
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
  await herokuBulkInsert(bulkCreateTransactionRows);
  await elephantSqlBulkInsert(bulkCreateTransactionRows);
};

main();

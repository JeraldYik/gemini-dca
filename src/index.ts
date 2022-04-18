import { TICKERS } from "./utils/constants";
import bluebird from "bluebird";
import checkIfOrderIsFulfilled from "./services/gemini/checkIfOrderIsFulfilled";
import createNewOrder from "./services/gemini/createNewOrder";
import { differenceInCalendarDays } from "date-fns";
import getTickerBestBidPrice from "./services/gemini/getTickerBestBidPrice";
import { initialiseGoogleDocument } from "./utils/setup";
import { logger } from "./utils/logger";
import { startDate } from "./utils/config";
import updateCells from "./services/googleSheets/updateCells";

const main = async () => {
  const todayDate = new Date().toLocaleDateString();
  const unflattenedValues = await bluebird.map(
    Object.entries(TICKERS),
    async (coinInfo) => {
      const tickerMetadata = coinInfo[1];
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
      if (!newOrder.is_live)
        return [
          todayDate,
          tickerMetadata.dailyFiatAmount,
          newOrder.avg_execution_price,
          newOrder.executed_amount,
        ];

      const fulfilledOrder = await checkIfOrderIsFulfilled(newOrder.order_id);

      logger.info({
        message: "Order fulfilled",
        meta: {
          ...fulfilledOrder,
        },
      });
      return [
        todayDate,
        tickerMetadata.dailyFiatAmount,
        fulfilledOrder!.avg_execution_price,
        fulfilledOrder!.executed_amount,
      ];
    },
    { concurrency: 1 }
  );
  const flattenedValues = unflattenedValues.reduce(
    (acc, arr) => [...acc, ...arr],
    []
  );

  const doc = await initialiseGoogleDocument();

  const splitStartDate = startDate.split("/").map((d) => parseInt(d));
  const differenceInDays = differenceInCalendarDays(
    new Date(),
    new Date(splitStartDate[2], splitStartDate[1] - 1, splitStartDate[0])
  );

  await updateCells(doc, "Test", differenceInDays, flattenedValues);
};

main();

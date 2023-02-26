import { OrderStatus } from "../../../types";
import { restClient } from "../../setup/gemini";
import counterToTimeElapsed from "../../utils/counterToTimeElapsed";
import delay from "../../utils/delay";
import { logger } from "../../utils/logger";
import getOrderStatus from "./getOrderStatus";

const checkIfOrderIsFulfilled = async ({
  orderId,
  tickerSymbol,
  externalLoopCounter,
}: {
  orderId: string;
  tickerSymbol: string;
  externalLoopCounter: number;
}): Promise<OrderStatus | undefined> => {
  logger.info({
    message:
      "Order is not cancelled. Running loop to check for fulfillment of order",
    meta: {
      orderId,
      tickerSymbol,
    },
  });

  // do note that this method would be ran 23 times, each time 1 hour long
  const MAX_COUNTER = 60; // 1 hour / 1 min
  let counter = 0;
  while (counter < MAX_COUNTER) {
    const timeElapsed = counterToTimeElapsed(
      externalLoopCounter,
      60,
      counter,
      60
    );
    logger.info({
      message: "Delaying 1min",
      meta: {
        orderId,
        timeElapsed,
        tickerSymbol,
      },
    });

    await delay(60000);

    const orderStatusData = await getOrderStatus(orderId);
    if (!orderStatusData.is_live) return orderStatusData;

    counter++;
  }

  try {
    await restClient.cancelOrder({ order_id: orderId });
  } catch (error) {
    logger.error({
      message: "Failed to cancel order",
      meta: {
        orderId,
        tickerSymbol,
      },
      error,
    });
  }
};

export default checkIfOrderIsFulfilled;

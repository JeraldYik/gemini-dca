import { OrderStatus } from "../../../types";
import counterToTimeElapsed from "../../utils/counterToTimeElapsed";
import delay from "../../utils/delay";
import getOrderStatus from "./getOrderStatus";
import { logger } from "../../utils/logger";
import { restClient } from "../../setup/gemini";

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
      "Order is not cancelled. Running loop for 6 hours to check for fulfillment of order",
    meta: {
      orderId,
      tickerSymbol,
    },
  });

  // do note that this method would be ran 6 times, each time 1 hour long
  const MAX_COUNTER = 120; // 1 hour / 30 seconds
  let counter = 0;
  while (counter < MAX_COUNTER) {
    const timeElapsed = counterToTimeElapsed(
      externalLoopCounter,
      60,
      counter,
      30
    );
    logger.info({
      message: "Delaying 30s",
      meta: {
        orderId,
        timeElapsed,
        tickerSymbol,
      },
    });

    await delay(30000);

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

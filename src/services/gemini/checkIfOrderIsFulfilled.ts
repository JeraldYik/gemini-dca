import { OrderStatus } from "../../../types";
import counterToTimeElapsed from "../../utils/counterToTimeElapsed";
import delay from "../../utils/delay";
import getOrderStatus from "./getOrderStatus";
import { logger } from "../../utils/logger";
import { restClient } from "../../setup/gemini";

const checkIfOrderIsFulfilled = async ({
  orderId,
  tickerSymbol,
}: {
  orderId: string;
  tickerSymbol: string;
}): Promise<OrderStatus | undefined> => {
  logger.info({
    message:
      "Order is not cancelled. Running loop for 2 hours to check for fulfillment of order",
    meta: {
      orderId,
    },
  });

  const MAX_COUNTER = 720; // 2 hours / 10 seconds
  let counter = 0;
  while (counter < MAX_COUNTER) {
    const timeElapsed = counterToTimeElapsed(counter);
    logger.info({
      message: "Delaying 10s",
      meta: {
        orderId,
        timeElapsed,
        tickerSymbol,
      },
    });

    await delay(10000);

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
      },
      error,
    });
  }

  logger.error({
    message: "Order not fulfilled within 2 hours",
    meta: {
      orderId,
    },
  });
};

export default checkIfOrderIsFulfilled;

import { OrderStatus } from "../../../types";
import delay from "../../utils/delay";
import getOrderStatus from "./getOrderStatus";
import { logger } from "../../utils/logger";
import { restClient } from "../../setup/gemini";

const checkIfOrderIsFulfilled = async (
  orderId: string
): Promise<OrderStatus | undefined> => {
  logger.info({
    message:
      "Order is not cancelled. Running loop for an hour to check for fulfillment of order",
    meta: {
      orderId,
    },
  });

  const MAX_COUNTER = 360; // 60 minutes/10 seconds
  let counter = 1;
  while (counter <= MAX_COUNTER) {
    logger.info({
      message: "Delaying 10s",
      meta: {
        orderId,
        counter,
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
    message: "Order not fulfilled within 4 minutes",
    meta: {
      orderId,
    },
  });
};

export default checkIfOrderIsFulfilled;

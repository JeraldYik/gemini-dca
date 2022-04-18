import { OrderStatus } from "../types";
import { REST_CLIENT } from "./utils/setup";
import delay from "./utils/delay";
import getOrderStatus from "./getOrderStatus";
import { logger } from "./utils/logger";

const checkIfOrderIsFulfilled = async (
  orderId: string
): Promise<OrderStatus | undefined> => {
  logger.info({
    message:
      "Order is not cancelled. Running loop for 4 minutes to check for fulfillment of order",
    meta: {
      orderId,
    },
  });

  let counter = 1;
  // 4 minutes
  while (counter <= 8) {
    logger.info({
      message: "Delaying 30s",
      meta: {
        orderId,
        counter,
      },
    });

    await delay(30000);

    const orderStatusData = await getOrderStatus(orderId);
    if (!orderStatusData.is_live) return orderStatusData;

    counter++;
  }

  try {
    await REST_CLIENT.cancelOrder({ order_id: orderId });
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

import { OrderStatus } from "../../../types";
import delay from "../../utils/delay";
import { logger } from "./../../utils/logger";
import { restClient } from "../../setup/gemini";

const getOrderStatus = async (orderId: string): Promise<OrderStatus> => {
  let orderStatusData: OrderStatus;
  const MAX_COUNTER = 3;
  let counter = 1;
  while (counter <= MAX_COUNTER) {
    logger.info({
      message: `Getting order status data. attempt=${counter}`,
      meta: {
        orderId,
      },
    });

    try {
      orderStatusData = await restClient.getMyOrderStatus({
        order_id: orderId,
      });
      logger.info({
        message: "Order Status data",
        meta: {
          orderId,
          ...orderStatusData,
        },
      });
      break;
    } catch (error) {
      logger.error({
        message: "Failed to get order status data",
        meta: {
          orderId,
        },
        error,
      });
    }
    counter++;
    await delay(1000);
  }

  return orderStatusData!;
};

export default getOrderStatus;

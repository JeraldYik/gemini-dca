import GeminiAPI from "gemini-api";
import { OrderStatus } from "../types";
import { logger } from "./utils/logger";

const getOrderStatus = async (
  restClient: GeminiAPI,
  orderId: string
): Promise<OrderStatus> => {
  let orderStatusData: OrderStatus;
  try {
    orderStatusData = await restClient.getMyOrderStatus({ order_id: orderId });
    logger.info({
      message: "Order Status data",
      meta: {
        orderId,
        orderStatusData,
      },
    });
  } catch (error) {
    logger.error({
      message: "Failed to get order status data",
      meta: {
        orderId,
      },
      error,
    });
  }

  return orderStatusData!;
};

export default getOrderStatus;

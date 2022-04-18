import { OrderStatus } from "../types";
import { REST_CLIENT } from "./utils/setup";
import { logger } from "./utils/logger";

const getOrderStatus = async (orderId: string): Promise<OrderStatus> => {
  let orderStatusData: OrderStatus;
  try {
    orderStatusData = await REST_CLIENT.getMyOrderStatus({ order_id: orderId });
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

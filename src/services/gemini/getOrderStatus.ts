import { OrderStatus } from "../../../types";
import { logger } from "./../../utils/logger";
import { restClient } from "./../../utils/setup";

const getOrderStatus = async (orderId: string): Promise<OrderStatus> => {
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

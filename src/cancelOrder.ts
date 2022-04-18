import { OrderStatus } from "../types";
import { REST_CLIENT } from "./utils/setup";
import { logger } from "./utils/logger";

const cancelOrder = async (orderId: string): Promise<OrderStatus> => {
  let orderStatusData: OrderStatus;
  try {
    orderStatusData = await REST_CLIENT.cancelOrder({ order_id: orderId });
    logger.info({
      message: "Cancel order operation successful",
      meta: {
        orderId,
        orderStatusData,
      },
    });
  } catch (error) {
    logger.error({
      message: "Failed to cancel order",
      meta: {
        orderId,
      },
      error,
    });
  }

  return orderStatusData!;
};

export default cancelOrder;

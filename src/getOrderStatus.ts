import GeminiAPI from "gemini-api";
import { OrderStatus } from "../types";

const getOrderStatus = async (
  restClient: GeminiAPI,
  orderId: string
): Promise<OrderStatus> => {
  let orderStatusData: OrderStatus;
  try {
    orderStatusData = await restClient.getMyOrderStatus({ order_id: orderId });
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }

  return orderStatusData;
};

export default getOrderStatus;

import GeminiAPI from "gemini-api";
import { OrderStatus } from "../types";
import delay from "./utils/delay";
import getOrderStatus from "./getOrderStatus";

const checkIfOrderIsFulfilled = async (
  restClient: GeminiAPI,
  orderId: string
): Promise<OrderStatus> => {
  let counter = 1;
  // 4 minutes
  while (counter <= 8) {
    console.log("Delaying 30s ...");
    await delay(30000);
    console.log("Getting order status");
    const orderStatusData = await getOrderStatus(restClient, orderId);
    if (!orderStatusData.is_live) return orderStatusData;
    counter++;
  }

  try {
    await restClient.cancelOrder({ order_id: orderId });
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }

  throw new Error("Order not fulfilled within 4 minutes");
};

export default checkIfOrderIsFulfilled;

import { OrderStatus, TickerMetadata } from "../types";

import GeminiAPI from "gemini-api";
import { ORDER_PRICE_TO_BID_PRICE_RATIO } from "./utils/constants";

const createNewOrder = async (
  restClient: GeminiAPI,
  tickerMetadata: TickerMetadata,
  tickerBestBidPrice: number
): Promise<OrderStatus> => {
  const orderPrice = tickerBestBidPrice * ORDER_PRICE_TO_BID_PRICE_RATIO;
  const orderAmount = tickerMetadata.dailyFiatAmount / orderPrice;
  let orderStatusData: OrderStatus;
  try {
    orderStatusData = await restClient.newOrder({
      symbol: tickerMetadata.symbol,
      amount: orderAmount.toFixed(8),
      price: orderPrice.toFixed(2),
      side: "buy",
      options: ["maker-or-cancel"],
    });
    console.log(orderStatusData);
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }

  return orderStatusData;
};

export default createNewOrder;

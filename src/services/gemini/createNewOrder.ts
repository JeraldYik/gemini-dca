import { OrderStatus, TickerMetadata } from "../../../types";

import { ORDER_PRICE_TO_BID_PRICE_RATIO } from "../../utils/constants";
import { logger } from "../../utils/logger";
import { restClient } from "../../setup/gemini";

const createNewOrder = async (
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
    logger.info({
      message: "Created Order Status data",
      meta: {
        symbol: tickerMetadata.symbol,
        ...orderStatusData,
      },
    });
  } catch (error) {
    logger.error({
      message: "Failed to create order",
      meta: {
        symbol: tickerMetadata.symbol,
      },
      error,
    });
  }

  return orderStatusData!;
};

export default createNewOrder;

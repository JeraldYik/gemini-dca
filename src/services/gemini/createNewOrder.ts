import { OrderStatus, TickerMetadata } from "../../../types";

import { restClient } from "../../setup/gemini";
import { ORDER_PRICE_TO_BID_PRICE_RATIO } from "../../utils/constants";
import { logger } from "../../utils/logger";

const createNewOrder = async (
  tickerMetadata: TickerMetadata,
  tickerBestBidPrice: number
): Promise<OrderStatus> => {
  const orderPrice = tickerBestBidPrice * ORDER_PRICE_TO_BID_PRICE_RATIO;
  const orderAmount = tickerMetadata.dailyFiatAmount / orderPrice;
  logger.info({
    message: "Create Order data",
    meta: {
      tickerBestBidPrice,
      dailyFiatAmount: tickerMetadata.dailyFiatAmount,
      orderPrice,
      orderAmount,
    },
  });

  let orderStatusData: OrderStatus;
  try {
    orderStatusData = await restClient.newOrder({
      symbol: tickerMetadata.symbol,
      amount: orderAmount.toFixed(tickerMetadata.tickSizePrecision),
      price: orderPrice.toFixed(tickerMetadata.priceIncrementPrecision),
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

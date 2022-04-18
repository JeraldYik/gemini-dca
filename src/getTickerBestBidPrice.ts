import GeminiAPI, { Ticker } from "gemini-api";

import { logger } from "./utils/logger";

const getTickerBestBidPrice = async (
  restClient: GeminiAPI,
  ticker: string
): Promise<number> => {
  let tickerData: Ticker;
  try {
    tickerData = await restClient.getTicker(ticker);
    logger.info({
      message: "Ticker data",
      meta: {
        ticker,
        tickerData,
      },
    });
  } catch (error) {
    logger.error({
      message: "Failed to get ticker data",
      meta: {
        ticker,
      },
      error,
    });
  }

  return parseFloat(tickerData!.bid);
};

export default getTickerBestBidPrice;

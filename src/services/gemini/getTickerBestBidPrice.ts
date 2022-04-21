import { Ticker } from "gemini-api";
import { logger } from "./../../utils/logger";
import { restClient } from "./../../utils/setup";

const getTickerBestBidPrice = async (ticker: string): Promise<number> => {
  let tickerData: Ticker;
  try {
    tickerData = await restClient.getTicker(ticker);
    logger.info({
      message: "Ticker data",
      meta: {
        ticker,
        ...tickerData,
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

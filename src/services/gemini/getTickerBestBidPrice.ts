import { REST_CLIENT } from "./../../utils/setup";
import { Ticker } from "gemini-api";
import { logger } from "./../../utils/logger";

const getTickerBestBidPrice = async (ticker: string): Promise<number> => {
  let tickerData: Ticker;
  try {
    tickerData = await REST_CLIENT.getTicker(ticker);
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

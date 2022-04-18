import GeminiAPI, { Ticker } from "gemini-api";

const getTickerBestBidPrice = async (
  restClient: GeminiAPI,
  ticker: string
): Promise<number> => {
  let tickerData: Ticker;
  try {
    tickerData = await restClient.getTicker(ticker);
    console.log(tickerData);
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }

  return parseFloat(tickerData.bid);
};

export default getTickerBestBidPrice;

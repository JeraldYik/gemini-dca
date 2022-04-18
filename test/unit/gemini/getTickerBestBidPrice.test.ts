import { TICKERS } from "../../../src/utils/constants";
import { expect } from "chai";
import getTickerBestBidPrice from "../../../src/services/gemini/getTickerBestBidPrice";

describe("UNIT TEST: Get Ticker Best Bid Price on Gemini", async () => {
  const TICKER = TICKERS.BTC.symbol;

  it("Should successfully get ticker bid price", async () => {
    const tickerBestBidPrice = await getTickerBestBidPrice(TICKER);
    expect(tickerBestBidPrice).to.be.a("number");
  });
});

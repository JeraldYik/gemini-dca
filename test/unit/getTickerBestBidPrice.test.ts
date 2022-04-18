import { expect } from "chai";
import getTickerBestBidPrice from "../../src/getTickerBestBidPrice";

describe("UNIT TEST: Get Ticker Best Bid Price", async () => {
  const TICKER = "btcsgd";

  it("Should successfully get ticker bid price", async () => {
    const tickerBestBidPrice = await getTickerBestBidPrice(TICKER);
    expect(tickerBestBidPrice).to.be.a("number");
  });
});

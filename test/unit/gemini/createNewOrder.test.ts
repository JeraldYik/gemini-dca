import { TICKERS } from "../../../src/utils/constants";
import cancelOrder from "../../../src/services/gemini/cancelOrder";
import createNewOrder from "../../../src/services/gemini/createNewOrder";
import { expect } from "chai";
import getTickerBestBidPrice from "../../../src/services/gemini/getTickerBestBidPrice";

describe("UNIT TEST: Create New Order on Gemini", async () => {
  const TICKER = TICKERS.BTC.symbol;
  let tickerBestBidPrice: number;
  let orderId: string;

  before(async () => {
    tickerBestBidPrice = await getTickerBestBidPrice(TICKER);
  });

  it("Should successfully create new order", async () => {
    const newOrder = await createNewOrder(TICKERS.BTC, tickerBestBidPrice);
    orderId = newOrder.order_id;

    expect(newOrder).to.exist;
    expect(newOrder.order_id).to.be.a.string;
    expect(newOrder.avg_execution_price).to.be.a.string;
    expect(newOrder.is_live).to.be.a("boolean");
    expect(newOrder.is_cancelled).to.be.a("boolean");
    expect(newOrder.executed_amount).to.be.a.string;
  });

  after(async () => {
    await cancelOrder(orderId);
  });
});

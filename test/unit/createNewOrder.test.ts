import { TICKERS } from "../../src/utils/constants";
import cancelOrder from "../../src/cancelOrder";
import createNewOrder from "../../src/createNewOrder";
import { expect } from "chai";
import getTickerBestBidPrice from "../../src/getTickerBestBidPrice";

describe("UNIT TEST: Create New Order", async () => {
  const TICKER = "btcsgd";
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

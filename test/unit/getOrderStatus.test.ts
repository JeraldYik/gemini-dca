import { TICKERS } from "../../src/utils/constants";
import cancelOrder from "../../src/cancelOrder";
import createNewOrder from "../../src/createNewOrder";
import { expect } from "chai";
import getOrderStatus from "../../src/getOrderStatus";
import getTickerBestBidPrice from "../../src/getTickerBestBidPrice";

describe("UNIT TEST: Get Order Status", async () => {
  const TICKER = "btcsgd";
  let orderId: string;

  before(async () => {
    const tickerBestBidPrice = await getTickerBestBidPrice(TICKER);
    const newOrder = await createNewOrder(TICKERS.BTC, tickerBestBidPrice);
    orderId = newOrder.order_id;
  });

  it("Should successfully get order status", async () => {
    const {
      order_id,
      avg_execution_price,
      is_live,
      is_cancelled,
      executed_amount,
    } = await getOrderStatus(orderId);

    expect(order_id).to.be.a.string;
    expect(avg_execution_price).to.be.a.string;
    expect(is_live).to.be.a("boolean");
    expect(is_cancelled).to.be.a("boolean");
    expect(executed_amount).to.be.a.string;
  });

  after(async () => {
    await cancelOrder(orderId);
  });
});

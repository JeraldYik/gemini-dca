import { TICKERS } from "../../src/utils/constants";
import cancelOrder from "../../src/cancelOrder";
import createNewOrder from "../../src/createNewOrder";
import { expect } from "chai";
import getOrderStatus from "../../src/getOrderStatus";
import getTickerBestBidPrice from "../../src/getTickerBestBidPrice";

describe("UNIT TEST: Cancel New Order", async () => {
  const TICKER = "btcsgd";
  let orderId: string;

  before(async () => {
    const tickerBestBidPrice = await getTickerBestBidPrice(TICKER);
    const newOrder = await createNewOrder(TICKERS.BTC, tickerBestBidPrice);
    orderId = newOrder.order_id;
  });

  it("Should successfully cancel order", async () => {
    const cancelledOrder = await cancelOrder(orderId);

    expect(cancelledOrder).to.exist;
    expect(cancelledOrder.order_id).to.be.a.string;
    expect(cancelledOrder.order_id).to.be.eql(orderId);

    const { order_id, is_cancelled } = await getOrderStatus(orderId);
    expect(order_id).to.be.eql(orderId);
    expect(is_cancelled).to.be.true;
  });
});

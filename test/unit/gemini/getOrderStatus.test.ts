import { TICKERS } from "../../../src/utils/constants";
import cancelOrder from "../../../src/services/gemini/cancelOrder";
import createNewOrder from "../../../src/services/gemini/createNewOrder";
import { expect } from "chai";
import getOrderStatus from "../../../src/services/gemini/getOrderStatus";
import getTickerBestBidPrice from "../../../src/services/gemini/getTickerBestBidPrice";

describe("UNIT TEST: Get Order Status on Gemini", async () => {
  const TICKER = TICKERS.BTC.symbol;
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

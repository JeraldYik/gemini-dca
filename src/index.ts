import { TICKERS } from "./utils/constants";
import checkIfOrderIsFulfilled from "./checkIfOrderIsFulfilled";
import createNewOrder from "./createNewOrder";
import getTickerBestBidPrice from "./getTickerBestBidPrice";

const main = async () => {
  // TODO: use forEach loop to loop through TICKERS
  const tickerBestBidPrice = await getTickerBestBidPrice("btcsgd");
  const newOrder = await createNewOrder(TICKERS.BTC, tickerBestBidPrice);

  if (newOrder.is_cancelled) {
    throw new Error("Order has been cancelled upon creation");
  }

  // order fulfilled
  if (!newOrder.is_live) return;

  // const fulfilledOrder = await checkIfOrderIsFulfilled(newOrder.order_id);

  // console.log(fulfilledOrder);
};

main();

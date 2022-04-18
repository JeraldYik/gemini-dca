import { geminiApiKey, geminiApiSecret, isSandboxEnv } from "./utils/config";

import GeminiAPI from "gemini-api";
import { Setup } from "../types";
import { TICKERS } from "./utils/constants";
import checkIfOrderIsFulfilled from "./checkIfOrderIsFulfilled";
import createNewOrder from "./createNewOrder";
import getTickerBestBidPrice from "./getTickerBestBidPrice";

const setup = (): Setup => {
  const restClient = new GeminiAPI({
    key: geminiApiKey,
    secret: geminiApiSecret,
    sandbox: isSandboxEnv,
  });
  return { restClient };
};

const main = async () => {
  const { restClient } = setup();

  // TODO: use forEach loop to loop through TICKERS
  const tickerBestBidPrice = await getTickerBestBidPrice(restClient, "btcsgd");
  const newOrder = await createNewOrder(
    restClient,
    TICKERS.BTC,
    tickerBestBidPrice
  );

  if (newOrder.is_cancelled) {
    throw new Error("Order has been cancelled upon creation");
  }

  // order fulfilled
  if (!newOrder.is_live) return;

  const fulfilledOrder = await checkIfOrderIsFulfilled(
    restClient,
    newOrder.order_id
  );

  console.log(fulfilledOrder);
};

main();

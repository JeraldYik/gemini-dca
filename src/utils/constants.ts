import { Ticker } from "../../types";

export const ORDER_PRICE_TO_BID_PRICE_RATIO = 0.999;
export const TICKERS: Ticker = {
  BTC: {
    symbol: "btcsgd",
    dailyFiatAmount: 10,
  },
  ETH: {
    symbol: "ethsgd",
    dailyFiatAmount: 20,
  },
} as const;

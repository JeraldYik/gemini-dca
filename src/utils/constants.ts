import { Ticker } from "../../types";

export const ORDER_PRICE_TO_BID_PRICE_RATIO = 0.999;

export const TICKERS: Ticker = {
  BTC: {
    symbol: "btcsgd",
    dailyFiatAmount: 10,
    googleSheetCellRange: "E*:H*",
  },
  ETH: {
    symbol: "ethsgd",
    dailyFiatAmount: 20,
    googleSheetCellRange: "I*:L*",
  },
} as const;

export const MAKER_TRADING_FEE = 0.002;

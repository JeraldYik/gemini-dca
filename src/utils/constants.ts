import { Ticker } from "../../types";
import { dailyFiatAmounts } from "./config";

export const ORDER_PRICE_TO_BID_PRICE_RATIO = 0.999;

export const TICKERS: Ticker = {
  BTC: {
    symbol: "btcsgd",
    dailyFiatAmount: dailyFiatAmounts[0],
    googleSheetCellRange: "E*:H*",
  },
  ETH: {
    symbol: "ethsgd",
    dailyFiatAmount: dailyFiatAmounts[1],
    googleSheetCellRange: "I*:L*",
  },
} as const;

export const MAKER_TRADING_FEE = 0.002;

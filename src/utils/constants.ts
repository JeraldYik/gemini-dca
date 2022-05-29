import { dailyFiatAmounts, orderPriceToBidPriceRatio } from "./config";

import { Ticker } from "../../types";

export const ORDER_PRICE_TO_BID_PRICE_RATIO = orderPriceToBidPriceRatio;

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

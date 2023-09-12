import { add, startOfDay } from "date-fns";
import { dailyFiatAmounts, orderPriceToBidPriceRatio } from "./config";

import { Ticker } from "../../types";

export const ORDER_PRICE_TO_BID_PRICE_RATIO = orderPriceToBidPriceRatio;

// https://docs.gemini.com/rest-api/?python#symbols-and-minimums
export const TICKERS: Ticker = {
  BTC: {
    symbol: "btcsgd",
    dailyFiatAmount: dailyFiatAmounts[0],
    googleSheetCellRange: "E*:H*",
    tickSizePrecision: 8,
    priceIncrementPrecision: 2,
  },
  ETH: {
    symbol: "ethsgd",
    dailyFiatAmount: dailyFiatAmounts[1],
    googleSheetCellRange: "I*:L*",
    tickSizePrecision: 6,
    priceIncrementPrecision: 2,
  },
  LRC: {
    symbol: "lrcusd",
    dailyFiatAmount: dailyFiatAmounts[2],
    googleSheetCellRange: "M*:P*",
    tickSizePrecision: 6,
    priceIncrementPrecision: 5,
  },
  DOT: {
    symbol: "dotusd",
    dailyFiatAmount: dailyFiatAmounts[3],
    googleSheetCellRange: "Q*:T*",
    tickSizePrecision: 6,
    priceIncrementPrecision: 4,
  },
  MATIC: {
    symbol: "maticusd",
    dailyFiatAmount: dailyFiatAmounts[4],
    googleSheetCellRange: "U*:X*",
    tickSizePrecision: 6,
    priceIncrementPrecision: 5,
  },
} as const;

export const MAKER_TRADING_FEE = 0.002;

export const TODAY_DATE_STR = new Date().toLocaleDateString("en-SG", {
  timeZone: "Asia/Singapore",
});

export const TODAY_DATE = startOfDay(add(new Date(), { hours: 8 }));

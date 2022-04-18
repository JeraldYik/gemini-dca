import GeminiAPI from "gemini-api";

export type Setup = {
  restClient: GeminiAPI;
};

export type Ticker = Record<string, TickerMetadata>;

export type TickerMetadata = {
  symbol: string;
  dailyFiatAmount: number;
};

export type OrderStatus = {
  order_id: string;
  avg_execution_price: string;
  is_live: boolean;
  is_cancelled: boolean;
  executed_amount: string;
};

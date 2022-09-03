import errorIfMissing from "./errorIfMissing";
import transformArrayStringToArray from "./transformArrayStringToArray";

export const nodeEnv = process.env.NODE_ENV!;
errorIfMissing("NODE_ENV", nodeEnv);

export const isSandboxEnv = process.env.NODE_ENV !== "production";

export const geminiApiKey = process.env.GEMINI_API_KEY!;
errorIfMissing("GEMINI_API_KEY", geminiApiKey);

export const geminiApiSecret = process.env.GEMINI_API_SECRET!;
errorIfMissing("GEMINI_API_SECRET", geminiApiSecret);

const dailyFiatAmountsString = process.env.DAILY_FIAT_AMOUNTS!;
errorIfMissing("DAILY_FIAT_AMOUNTS", dailyFiatAmountsString);
export const dailyFiatAmounts = transformArrayStringToArray(
  dailyFiatAmountsString
).map((e) => parseInt(e));

const orderPriceToBidPriceRatioString =
  process.env.ORDER_PRICE_TO_BID_PRICE_RATIO!;
errorIfMissing(
  "ORDER_PRICE_TO_BID_PRICE_RATIO",
  orderPriceToBidPriceRatioString
);
export const orderPriceToBidPriceRatio = parseFloat(
  orderPriceToBidPriceRatioString
);

export const googleSheetId = process.env.GOOGLE_SHEET_ID!;
errorIfMissing("GOOGLE_SHEET_ID", googleSheetId);

export const googleServiceAccountEmail =
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
errorIfMissing("GOOGLE_SERVICE_ACCOUNT_EMAIL", googleServiceAccountEmail);

export const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY!.replace(
  /\\n/g,
  "\n"
);
errorIfMissing("GOOGLE_PRIVATE_KEY", googlePrivateKey);

export const googleSheetName = process.env.GOOGLE_SHEET_NAME!;
errorIfMissing("GOOGLE_SHEET_NAME", googleSheetName);

const startRowsString = process.env.START_ROWS!;
errorIfMissing("START_ROWS", startRowsString);
export const startRows = transformArrayStringToArray(startRowsString);

const startDatesString = process.env.START_DATES!;
errorIfMissing("START_DATES", startDatesString);
export const startDates = transformArrayStringToArray(startDatesString);

export const herokuDbUsername = process.env.HEROKU_DB_USERNAME!;
errorIfMissing("DB_USERNAME", herokuDbUsername);

export const herokuDbPassword = process.env.HEROKU_DB_PASSWORD!;
errorIfMissing("DB_PASSWORD", herokuDbPassword);

export const herokuDbName = process.env.HEROKU_DB_NAME!;
errorIfMissing("DB_NAME", herokuDbName);

export const herokuDbHost = process.env.HEROKU_DB_HOST!;
errorIfMissing("DB_HOST", herokuDbHost);

export const elephantSqlDbUsername = process.env.ELEPHANTSQL_DB_USERNAME!;
errorIfMissing("DB_USERNAME", elephantSqlDbUsername);

export const elephantSqlDbPassword = process.env.ELEPHANTSQL_DB_PASSWORD!;
errorIfMissing("DB_PASSWORD", elephantSqlDbPassword);

export const elephantSqlDbName = process.env.ELEPHANTSQL_DB_NAME!;
errorIfMissing("DB_NAME", elephantSqlDbName);

export const elephantSqlDbHost = process.env.ELEPHANTSQL_DB_HOST!;
errorIfMissing("DB_HOST", elephantSqlDbHost);

export const sentryDsn = process.env.SENTRY_DSN!;
errorIfMissing("SENTRY_DSN", sentryDsn);

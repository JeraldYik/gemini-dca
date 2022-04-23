import "@sentry/tracing";

import * as Sentry from "@sentry/node";

import { LogMeta, logger } from "./logger";
import {
  dbHost,
  dbName,
  dbPassword,
  dbUsername,
  geminiApiKey,
  geminiApiSecret,
  googlePrivateKey,
  googleServiceAccountEmail,
  googleSheetId,
  isSandboxEnv,
  nodeEnv,
  sentryDsn,
} from "./config";

import GeminiAPI from "gemini-api";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Sequelize } from "sequelize";

export const restClient = new GeminiAPI({
  key: geminiApiKey,
  secret: geminiApiSecret,
  sandbox: isSandboxEnv,
});

export const initialiseGoogleDocument = async () => {
  const doc = new GoogleSpreadsheet(googleSheetId);
  await doc.useServiceAccountAuth({
    client_email: googleServiceAccountEmail,
    private_key: googlePrivateKey,
  });
  await doc.loadInfo(); // loads document properties and worksheets

  return doc;
};

export const sequelize = new Sequelize({
  database: dbName,
  username: dbUsername,
  password: dbPassword,
  host: dbHost,
  dialect: "postgres",
  timezone: "+08:00",
});

Sentry.init({
  dsn: sentryDsn,
  sampleRate: 1.0,
  tracesSampleRate: 1.0,
  debug: true,
  environment: nodeEnv,
});

export const sentryTransaction = Sentry.startTransaction({
  op: "main",
  name: "sentry-error-handler",
});

export const sentryCaptureException = (
  message: string,
  meta: LogMeta,
  error: unknown
) => {
  logger.info({
    message: "Sending error to Sentry",
    meta: {
      ...meta,
      error,
    },
  });
  Sentry.captureException({ message, meta, error });
};

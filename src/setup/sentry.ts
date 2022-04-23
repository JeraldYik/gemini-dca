import "@sentry/tracing";

import * as Sentry from "@sentry/node";

import { LogMeta, logger } from "../utils/logger";
import { nodeEnv, sentryDsn } from "../utils/config";

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

export const sentryCaptureExceptionAndExit = (
  message: string,
  meta: LogMeta,
  error: unknown
) => {
  const eventId = Sentry.captureException({
    message,
    meta: JSON.stringify(meta),
    error: JSON.stringify(error),
  });
  logger.info({
    message: "Sentry event id",
    meta: {
      eventId,
    },
  });
  sentryTransaction.finish();
  // https://docs.sentry.io/platforms/node/configuration/draining/
  Sentry.close(2000).then(() => process.exit(1));
};

import "@sentry/tracing";

import { geminiApiKey, geminiApiSecret, isSandboxEnv } from "../utils/config";

import GeminiAPI from "gemini-api";

export const restClient = new GeminiAPI({
  key: geminiApiKey,
  secret: geminiApiSecret,
  sandbox: isSandboxEnv,
});

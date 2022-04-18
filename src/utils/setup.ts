import { geminiApiKey, geminiApiSecret, isSandboxEnv } from "./config";

import GeminiAPI from "gemini-api";

export const REST_CLIENT = new GeminiAPI({
  key: geminiApiKey,
  secret: geminiApiSecret,
  sandbox: isSandboxEnv,
});

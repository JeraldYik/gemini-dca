import { geminiApiKey, geminiApiSecret, isSandboxEnv } from "./utils/config";

import GeminiAPI from "gemini-api";
import { Setup } from "../types";

const setup = (): Setup => {
  const restClient = new GeminiAPI({
    key: geminiApiKey,
    secret: geminiApiSecret,
    sandbox: isSandboxEnv,
  });
  return { restClient };
};

const main = async () => {
  const { restClient } = setup();
  const { getTicker } = restClient;

  const data = await getTicker("btcsgd");
  console.log(data);
  console.log(`Last trade: $${data.last} / BTC`);
};

main();

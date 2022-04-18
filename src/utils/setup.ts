import {
  geminiApiKey,
  geminiApiSecret,
  googlePrivateKey,
  googleServiceAccountEmail,
  googleSheetId,
  isSandboxEnv,
} from "./config";

import GeminiAPI from "gemini-api";
import { GoogleSpreadsheet } from "google-spreadsheet";

export const REST_CLIENT = new GeminiAPI({
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

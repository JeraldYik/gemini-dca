import {
  dbName,
  dbPassword,
  dbUsername,
  geminiApiKey,
  geminiApiSecret,
  googlePrivateKey,
  googleServiceAccountEmail,
  googleSheetId,
  isSandboxEnv,
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
  dialect: "postgres",
  timezone: "+08:00",
});

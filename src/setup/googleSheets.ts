import "@sentry/tracing";

import {
  googlePrivateKey,
  googleServiceAccountEmail,
  googleSheetId,
} from "../utils/config";

import { GoogleSpreadsheet } from "google-spreadsheet";

export const initialiseGoogleDocument = async () => {
  const doc = new GoogleSpreadsheet(googleSheetId);
  await doc.useServiceAccountAuth({
    client_email: googleServiceAccountEmail,
    private_key: googlePrivateKey,
  });
  await doc.loadInfo(); // loads document properties and worksheets

  return doc;
};

import "@sentry/tracing";

import {
  googlePrivateKey,
  googleServiceAccountEmail,
  googleSheetId,
} from "../utils/config";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { logger } from "../utils/logger";

export const initialiseGoogleDocument =
  async (): Promise<GoogleSpreadsheet> => {
    const MAX_RETRY = 3;
    let doc: GoogleSpreadsheet | null = null;
    let counter = 0;
    let done = false;
    while (!done || counter > MAX_RETRY) {
      try {
        doc = new GoogleSpreadsheet(googleSheetId);
        await doc.useServiceAccountAuth({
          client_email: googleServiceAccountEmail,
          private_key: googlePrivateKey,
        });
        await doc.loadInfo(); // loads document properties and worksheets
        done = true;
      } catch (error) {
        logger.warn({
          message: "Error while instantiating Google Sheets, retrying",
          meta: {},
          error,
        });
        counter++;
      }
    }

    if (doc == null) {
      logger.error({
        message: "Error while instantiating Google Sheets",
        meta: {},
      });
    }
    return doc as GoogleSpreadsheet;
  };

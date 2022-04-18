import errorIfMissing from "./errorIfMissing";

export const isSandboxEnv = process.env.IS_SANDBOX_ENV === "true";

export const geminiApiKey = process.env.GEMINI_API_KEY!;
errorIfMissing("GEMINI_API_KEY", geminiApiKey);

export const geminiApiSecret = process.env.GEMINI_API_SECRET!;
errorIfMissing("GEMINI_API_SECRET", geminiApiSecret);

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

export const startDate = process.env.START_DATE!;
errorIfMissing("START_DATE", startDate);

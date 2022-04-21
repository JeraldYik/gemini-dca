import errorIfMissing from "./errorIfMissing";

export const isSandboxEnv = process.env.NODE_ENV !== "production";

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

export const googleSheetName = process.env.GOOGLE_SHEET_NAME!;
errorIfMissing("GOOGLE_SHEET_NAME", googleSheetName);

export const startDate = process.env.START_DATE!;
errorIfMissing("START_DATE", startDate);

export const dbUsername = process.env.DB_USERNAME!;
errorIfMissing("DB_USERNAME", dbUsername);

export const dbPassword = process.env.DB_PASSWORD!;
errorIfMissing("DB_PASSWORD", dbPassword);

export const dbName = process.env.DB_NAME!;
errorIfMissing("DB_NAME", dbName);

export const dbHost = process.env.DB_HOST!;
errorIfMissing("DB_HOST", dbHost);

export const raygunApiKey = process.env.RAYGUN_API_KEY!;
errorIfMissing("RAYGUN_API_KEY", raygunApiKey);

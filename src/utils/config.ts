import errorIfMissing from "./errorIfMissing";

export const isSandboxEnv = process.env.IS_SANDBOX_ENV === "true";

export const geminiApiKey = process.env.GEMINI_API_KEY!;
errorIfMissing("GEMINI_API_KEY", geminiApiKey);

export const geminiApiSecret = process.env.GEMINI_API_SECRET!;
errorIfMissing("GEMINI_API_SECRET", geminiApiSecret);

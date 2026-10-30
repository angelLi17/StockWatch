import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name} (see server/.env.example)`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  mongoUri: required("MONGODB_URI"),
  finnhubApiKey: required("FINNHUB_API_KEY"),
  firebase: {
    projectId: required("FIREBASE_PROJECT_ID"),
    clientEmail: required("FIREBASE_CLIENT_EMAIL"),
    // .env files store newlines as the two characters "\n"; turn them back into real newlines.
    privateKey: required("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  },
  // Email is optional: only enabled when SMTP_HOST is set.
  smtp: process.env.SMTP_HOST
    ? {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 465),
        user: required("SMTP_USER"),
        pass: required("SMTP_PASS"),
        from: process.env.MAIL_FROM ?? required("SMTP_USER"),
      }
    : null,
};

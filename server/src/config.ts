import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name} (see server/.env.example)`);
  return value;
}

// Private keys are easy to mangle when pasting into .env, so tidy up common mistakes
// and explain what's wrong (without ever printing the key itself).
function privateKey(): string {
  const key = required("FIREBASE_PRIVATE_KEY")
    .trim()
    .replace(/^["']|["'],?$/g, "") // leftover quotes/comma copied from the JSON file
    .replace(/\\n/g, "\n"); // .env stores newlines as the two characters "\n"

  const problems: string[] = [];
  if (!key.includes("-----BEGIN PRIVATE KEY-----")) problems.push("missing the -----BEGIN PRIVATE KEY----- line");
  if (!key.includes("-----END PRIVATE KEY-----")) problems.push("missing the -----END PRIVATE KEY----- line");
  if (key.includes("\n...\n")) problems.push("still the placeholder from .env.example");
  if (problems.length > 0) {
    throw new Error(
      `FIREBASE_PRIVATE_KEY is ${problems.join(" and ")}. In server/.env, put the whole key on ONE line inside ` +
        `double quotes, exactly as the "private_key" value appears in the service-account JSON (with \\n between lines).`,
    );
  }

  // Rebuild a clean key from just the base64 text between the BEGIN/END lines,
  // dropping stray spaces, quotes, and leftover "\n" escapes.
  const body = key
    .split("-----BEGIN PRIVATE KEY-----")[1]!
    .split("-----END PRIVATE KEY-----")[0]!
    .replace(/\\+n/g, "")
    .replace(/[^A-Za-z0-9+/=]/g, "");
  return `-----BEGIN PRIVATE KEY-----\n${body.match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----\n`;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  mongoUri: required("MONGODB_URI"),
  finnhubApiKey: required("FINNHUB_API_KEY"),
  firebase: {
    projectId: required("FIREBASE_PROJECT_ID"),
    clientEmail: required("FIREBASE_CLIENT_EMAIL"),
    privateKey: privateKey(),
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

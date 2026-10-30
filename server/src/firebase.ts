import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { config } from "./config.js";

function credential() {
  try {
    return cert(config.firebase);
  } catch {
    throw new Error(
      "Firebase could not read FIREBASE_PRIVATE_KEY. It has the BEGIN/END lines but the text between them is " +
        "damaged (extra spaces, missing characters, or a partial copy). Re-copy the private_key value from the service-account JSON.",
    );
  }
}

const app = initializeApp({ credential: credential() });

export const adminAuth = getAuth(app);

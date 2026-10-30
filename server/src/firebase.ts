import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { config } from "./config.js";

const app = initializeApp({ credential: cert(config.firebase) });

export const adminAuth = getAuth(app);

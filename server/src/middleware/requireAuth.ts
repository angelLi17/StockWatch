import type { NextFunction, Request, Response } from "express";
import { adminAuth } from "../firebase.js";

// Make req.uid available to every route that runs after requireAuth.
declare global {
  namespace Express {
    interface Request {
      uid?: string;
      email?: string;
    }
  }
}

// Checks the Firebase ID token the client sends as "Authorization: Bearer <token>".
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    req.uid = decoded.uid;
    req.email = decoded.email;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

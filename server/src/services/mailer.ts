import nodemailer from "nodemailer";
import { config } from "../config.js";

const smtp = config.smtp;
const transporter = smtp
  ? nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: { user: smtp.user, pass: smtp.pass },
    })
  : null;

export const emailEnabled = transporter !== null;

export async function sendEmail(to: string, subject: string, text: string) {
  if (!transporter || !smtp) return;
  await transporter.sendMail({ from: smtp.from, to, subject, text });
}

import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export async function sendMail(to: string, subject: string, text: string, html?: string) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !env.SMTP_PORT) {
    console.log('[MAIL:DEV]', { to, subject, text });
    return;
  }
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
  });
  await transporter.sendMail({ from: env.SMTP_USER, to, subject, text, html });
}

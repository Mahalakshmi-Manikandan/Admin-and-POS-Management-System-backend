import nodemailer from 'nodemailer';
import 'dotenv/config';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email function
export async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html,
  });
}

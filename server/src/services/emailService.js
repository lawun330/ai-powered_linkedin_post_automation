const nodemailer = require("nodemailer");
const env = require("../config/env");

function getSmtpConfig() {
  return {
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth:
      env.smtpUser && env.smtpPass
        ? {
            user: env.smtpUser,
            pass: env.smtpPass,
          }
        : undefined,
  };
}

async function sendVerificationOtpEmail({ toEmail, fullName, otpCode }) {
  if (!env.smtpHost || !env.emailFrom) {
    throw new Error("SMTP is not configured. Set SMTP_HOST and EMAIL_FROM.");
  }

  const transporter = nodemailer.createTransport(getSmtpConfig());

  const subject = "Verify your email address";
  const text = `Hello ${fullName},\n\nYour verification code is: ${otpCode}\nThis code will expire in ${env.otpExpiryMinutes} minutes.\n\nIf you did not create this account, you can ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <p>Hello ${fullName},</p>
      <p>Your verification code is:</p>
      <p style="font-size: 24px; letter-spacing: 4px; font-weight: bold;">${otpCode}</p>
      <p>This code will expire in <strong>${env.otpExpiryMinutes} minutes</strong>.</p>
      <p>If you did not create this account, you can ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: env.emailFrom,
    to: toEmail,
    subject,
    text,
    html,
  });
}

module.exports = {
  sendVerificationOtpEmail,
};

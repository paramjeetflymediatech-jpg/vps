import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ CRITICAL: EMAIL_USER or EMAIL_PASS is missing in env!");
      console.log("Details:", {
        hasUser: !!process.env.EMAIL_USER,
        hasPass: !!process.env.EMAIL_PASS
      });
    }

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

export const sendOtpEmail = async (email, otp) => {
  const mailer = getTransporter();
  await mailer.sendMail({
    from: `"EnglishRaj" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  });
};

export const sendEmail = async (to, subject, text) => {
  const mailer = getTransporter();
  await mailer.sendMail({
    from: `"EnglishRaj" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

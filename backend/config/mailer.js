import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"EnglishRaj" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  });
};

export const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"EnglishRaj" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

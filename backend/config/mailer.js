import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"EnglishRaj" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  });
};

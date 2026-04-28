import { sendEmail } from "./sendEmail.js";

export const sendVerificationCode = async (user) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.verificationCode = code;
  user.verificationCodeExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Verify Email",
    html: `<h1>Your OTP For Library Registration is ${code}</h1>`,
  });
};

import { User } from "../models/userModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendEmail } from "../utils/sendEmail.js";
import { forgotPasswordTemplate } from "../utils/emailTemplates.js";
import crypto from "crypto";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (await User.findOne({ email })) {
    return next(new ErrorHandler("Email already registered", 400));
  }

  const user = await User.create({ name, email, password });

  await sendVerificationCode(user);

  res.status(200).json({
    success: true,
    message: "OTP sent",
  });
});

// VERIFY OTP
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    verificationCode: otp,
    verificationCodeExpiry: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorHandler("Invalid or expired OTP", 400));

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiry = undefined;

  await user.save();

  sendToken(user, 200, res, "Account verified successfully");
});

// LOGIN
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  if (!user.isVerified) {
    return next(new ErrorHandler("Please verify your email first", 403));
  }

  user.accountActivityLog.push({ action: "login", ip: req.ip });

  await user.save({ validateBeforeSave: false });

  sendToken(user, 200, res, "Logged in successfully");
});

// LOGOUT ✅ FIXED HERE
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// FORGOT PASSWORD
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new ErrorHandler("No user with that email", 404));

  const resetToken = user.getResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: forgotPasswordTemplate(user.name, resetURL),
  });

  res.status(200).json({
    success: true,
    message: "Reset link sent to email",
  });
});

// RESET PASSWORD
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const hashed = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorHandler("Token is invalid or expired", 400));

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  sendToken(user, 200, res, "Password reset successfully");
});

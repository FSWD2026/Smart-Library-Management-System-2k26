import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    avatar: { public_id: String, url: String },
    isVerified: { type: Boolean, default: false },
    verificationCode: String,
    verificationCodeExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    accountActivityLog: [
      { action: String, ip: String, at: { type: Date, default: Date.now } },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
  return token;
};

export const User = mongoose.model("User", userSchema);

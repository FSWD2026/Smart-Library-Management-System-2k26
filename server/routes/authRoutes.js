import express from "express";
import {
  register,
  verifyOTP,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

console.log({
  register,
  verifyOTP,
  login,
  logout,
  forgotPassword,
  resetPassword,
});

const router = express.Router();

// ✅ Auth Routes
router.post("/register", register);
router.post("/verify", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;

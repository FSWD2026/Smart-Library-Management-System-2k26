import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userModel.js";
import { getAdminStats } from "../controllers/bookController.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const router = express.Router();

// Stats
router.get("/stats", isAuthenticated, isAdmin, getAdminStats);

// Get all users
router.get(
  "/users",
  isAuthenticated,
  isAdmin,
  catchAsyncErrors(async (req, res) => {
    const { search, limit = 100 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await User.find(query)
      .limit(Number(limit))
      .sort("-createdAt");
    res.status(200).json({ success: true, users });
  }),
);

// Toggle user role
router.put(
  "/users/:id/role",
  isAuthenticated,
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler("User not found", 404));
    user.role = user.role === "Admin" ? "User" : "Admin";
    await user.save();
    res.status(200).json({
      success: true,
      message: `User role changed to ${user.role}`,
      user,
    });
  }),
);

// Delete user
router.delete(
  "/users/:id",
  isAuthenticated,
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler("User not found", 404));
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted" });
  }),
);

export default router;

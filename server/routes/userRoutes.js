import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { upload } from "../middlewares/multer.js";
import cloudinary from "cloudinary";

const router = express.Router();

// Get my profile
router.get(
  "/me",
  isAuthenticated,
  catchAsyncErrors(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  }),
);

// Update profile
router.put(
  "/me/update",
  isAuthenticated,
  upload.single("avatar"),
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (req.body.name) user.name = req.body.name;

    if (req.file) {
      if (user.avatar?.public_id)
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "smart-library/avatars",
        transformation: [{ width: 200, height: 200, crop: "fill" }],
      });
      user.avatar = { public_id: result.public_id, url: result.secure_url };
    }

    await user.save();
    res.status(200).json({ success: true, message: "Profile updated", user });
  }),
);

// Change password
router.put(
  "/me/password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(oldPassword)))
      return next(new ErrorHandler("Current password is incorrect", 400));
    user.password = newPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  }),
);

export default router;

import { User } from "../models/userModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";

// GET MY PROFILE
export const getMyProfile = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// UPDATE PROFILE (name + avatar)
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  const updateData = {};
  if (name) updateData.name = name;

  if (req.file) {
    // delete old avatar
    if (req.user.avatar?.public_id) {
      await cloudinary.v2.uploader.destroy(req.user.avatar.public_id);
    }

    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "smart-library/avatars",
      transformation: [{ width: 200, height: 200, crop: "fill" }],
    });

    updateData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated",
    user,
  });
});

// CHANGE PASSWORD
export const changePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Please provide old and new password", 400));
  }

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return next(new ErrorHandler("Old password is incorrect", 401));

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

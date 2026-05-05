import { User } from "../models/userModel.js";
import { Book } from "../models/bookModel.js";
import { Borrow } from "../models/borrowModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// GET ALL USERS
export const getAllUsers = catchAsyncErrors(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query).sort("-createdAt").skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    users,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  });
});

// GET SINGLE USER
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

// UPDATE USER ROLE
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.role = user.role === "Admin" ? "User" : "Admin";
  await user.save();

  res.status(200).json({
    success: true,
    message: `User role updated to ${user.role}`,
    user,
  });
});

// DELETE USER
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted",
  });
});

// DASHBOARD STATS
export const getDashboardStats = catchAsyncErrors(async (req, res) => {
  const [
    totalUsers,
    totalBooks,
    totalBorrows,
    activeBorrows,
    overdueBorrows,
    fineData,
  ] = await Promise.all([
    User.countDocuments(),
    Book.countDocuments(),
    Borrow.countDocuments(),
    Borrow.countDocuments({ status: "borrowed" }),
    Borrow.countDocuments({ status: "overdue" }),
    Borrow.aggregate([
      { $group: { _id: null, totalFines: { $sum: "$fine" } } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalBooks,
      totalBorrows,
      activeBorrows,
      overdueBorrows,
      totalFinesCollected: fineData[0]?.totalFines || 0,
    },
  });
});

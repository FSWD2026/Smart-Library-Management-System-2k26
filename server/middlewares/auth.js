import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new ErrorHandler("Please login first", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(new ErrorHandler("Admin access only", 403));
  }
  next();
};

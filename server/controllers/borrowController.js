import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// Borrow a book
export const borrowBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) return next(new ErrorHandler("Book not found", 404));
  if (book.availableCopies < 1)
    return next(new ErrorHandler("No copies available", 400));

  // Check if user already has this book borrowed
  const existing = await Borrow.findOne({
    user: req.user._id,
    book: req.params.bookId,
    status: { $in: ["borrowed", "overdue"] },
  });
  if (existing)
    return next(new ErrorHandler("You already have this book borrowed", 400));

  const borrow = await Borrow.create({
    user: req.user._id,
    book: req.params.bookId,
  });

  book.availableCopies -= 1;
  await book.save();

  await borrow.populate("book");

  res.status(201).json({ success: true, borrow });
});

// Return a book
export const returnBook = catchAsyncErrors(async (req, res, next) => {
  const borrow = await Borrow.findById(req.params.borrowId);
  if (!borrow) return next(new ErrorHandler("Borrow record not found", 404));
  if (borrow.user.toString() !== req.user._id.toString())
    return next(new ErrorHandler("Not authorized", 403));
  if (borrow.status === "returned")
    return next(new ErrorHandler("Book already returned", 400));

  borrow.returnedAt = new Date();
  borrow.status = "returned";

  // Calculate fine: ₹10 per day overdue
  const now = new Date();
  if (now > borrow.dueDate) {
    const daysLate = Math.ceil((now - borrow.dueDate) / (1000 * 60 * 60 * 24));
    borrow.fine = daysLate * 10;
  }

  await borrow.save();

  const book = await Book.findById(borrow.book);
  if (book) {
    book.availableCopies += 1;
    await book.save();
  }

  await borrow.populate("book");

  res.status(200).json({ success: true, borrow, fine: borrow.fine });
});

// Get my borrows
export const getMyBorrows = catchAsyncErrors(async (req, res) => {
  const borrows = await Borrow.find({ user: req.user._id })
    .populate("book")
    .sort("-createdAt");

  // Update overdue status
  const now = new Date();
  for (const b of borrows) {
    if (b.status === "borrowed" && now > b.dueDate) {
      b.status = "overdue";
      await b.save();
    }
  }

  res.status(200).json({ success: true, borrows });
});

// Admin: Get all borrows
export const getAllBorrows = catchAsyncErrors(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [borrows, total] = await Promise.all([
    Borrow.find(query)
      .populate("book")
      .populate("user", "name email")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    Borrow.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    borrows,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

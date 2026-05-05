import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// BORROW A BOOK
export const borrowBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.bookId);

  if (!book) return next(new ErrorHandler("Book not found", 404));

  if (book.availableCopies === 0) {
    return next(new ErrorHandler("No copies available", 400));
  }

  // check if user already borrowed this book and not returned
  const existing = await Borrow.findOne({
    user: req.user._id,
    book: req.params.bookId,
    status: { $in: ["borrowed", "overdue"] },
  });

  if (existing) {
    return next(new ErrorHandler("You already borrowed this book", 400));
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 14 days

  const borrow = await Borrow.create({
    user: req.user._id,
    book: req.params.bookId,
    dueDate,
  });

  // reduce available copies
  book.availableCopies -= 1;
  await book.save();

  res.status(201).json({
    success: true,
    message: "Book borrowed successfully",
    borrow,
  });
});

// RETURN A BOOK
export const returnBook = catchAsyncErrors(async (req, res, next) => {
  const borrow = await Borrow.findById(req.params.borrowId);

  if (!borrow) return next(new ErrorHandler("Borrow record not found", 404));

  if (borrow.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized", 403));
  }

  if (borrow.status === "returned") {
    return next(new ErrorHandler("Book already returned", 400));
  }

  // calculate fine if overdue
  const today = new Date();
  let fine = 0;

  if (today > borrow.dueDate) {
    const daysOverdue = Math.ceil(
      (today - borrow.dueDate) / (1000 * 60 * 60 * 24),
    );
    fine = daysOverdue * 10; // ₹10 per day
  }

  borrow.returnedAt = today;
  borrow.status = "returned";
  borrow.fine = fine;
  await borrow.save();

  // increase available copies
  const book = await Book.findById(borrow.book);
  if (book) {
    book.availableCopies += 1;
    await book.save();
  }

  res.status(200).json({
    success: true,
    message: "Book returned successfully",
    fine,
    borrow,
  });
});

// MY BORROW HISTORY
export const myBorrows = catchAsyncErrors(async (req, res) => {
  const borrows = await Borrow.find({ user: req.user._id })
    .populate("book", "title author cover")
    .sort("-borrowedAt");

  res.status(200).json({
    success: true,
    borrows,
  });
});

// ADMIN - ALL BORROWS
export const getAllBorrows = catchAsyncErrors(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [borrows, total] = await Promise.all([
    Borrow.find(query)
      .populate("user", "name email")
      .populate("book", "title author")
      .sort("-borrowedAt")
      .skip(skip)
      .limit(Number(limit)),
    Borrow.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    borrows,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  });
});

// ADMIN - OVERDUE BORROWS
export const getOverdueBorrows = catchAsyncErrors(async (req, res) => {
  const borrows = await Borrow.find({
    status: "overdue",
  })
    .populate("user", "name email")
    .populate("book", "title author")
    .sort("dueDate");

  res.status(200).json({
    success: true,
    count: borrows.length,
    borrows,
  });
});

import { Book } from "../models/bookModel.js";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";

export const addBook = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    author,
    isbn,
    category,
    description,
    totalCopies,
    publisher,
    publishedYear,
    tags,
  } = req.body;

  if (!title || !author || !category || !totalCopies)
    return next(new ErrorHandler("Please provide all required fields", 400));

  let cover = {};
  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "smart-library/covers",
      transformation: [{ width: 400, height: 550, crop: "limit" }],
    });
    cover = { public_id: result.public_id, url: result.secure_url };
  }

  const book = await Book.create({
    title,
    author,
    isbn,
    category,
    description,
    totalCopies,
    availableCopies: totalCopies,
    publisher,
    publishedYear,
    tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    cover,
  });

  res.status(201).json({ success: true, message: "Book added", book });
});

export const getAllBooks = catchAsyncErrors(async (req, res) => {
  const {
    search,
    category,
    page = 1,
    limit = 12,
    sort = "-createdAt",
  } = req.query;
  const query = {};
  if (search) query.$text = { $search: search };
  if (category && category !== "All") query.category = category;

  const skip = (page - 1) * limit;
  const [books, total] = await Promise.all([
    Book.find(query).sort(sort).skip(skip).limit(Number(limit)),
    Book.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    books,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

export const getSingleBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));
  res.status(200).json({ success: true, book });
});

export const updateBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  if (req.file) {
    if (book.cover?.public_id)
      await cloudinary.v2.uploader.destroy(book.cover.public_id);
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "smart-library/covers",
    });
    req.body.cover = { public_id: result.public_id, url: result.secure_url };
  }

  // Handle tags if sent as string
  if (req.body.tags && typeof req.body.tags === "string") {
    req.body.tags = req.body.tags.split(",").map((t) => t.trim());
  }

  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, book: updated });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));
  if (book.cover?.public_id)
    await cloudinary.v2.uploader.destroy(book.cover.public_id);
  await book.deleteOne();
  res.status(200).json({ success: true, message: "Book deleted" });
});

// Reviews
export const addReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  // Check if already reviewed
  const alreadyReviewed = book.reviews?.find(
    (r) => r.user.toString() === req.user._id.toString(),
  );
  if (alreadyReviewed)
    return next(new ErrorHandler("You have already reviewed this book", 400));

  if (!book.reviews) book.reviews = [];
  book.reviews.push({
    user: req.user._id,
    rating: Number(rating),
    comment,
    createdAt: new Date(),
  });

  // Recalculate avg rating
  book.avgRating =
    book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length;
  book.avgRating = Math.round(book.avgRating * 10) / 10;

  await book.save();
  res.status(201).json({ success: true, message: "Review added" });
});

export const getReviews = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate(
    "reviews.user",
    "name avatar",
  );
  if (!book) return next(new ErrorHandler("Book not found", 404));
  res.status(200).json({ success: true, reviews: book.reviews || [] });
});

export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  const review = book.reviews?.find(
    (r) => r._id.toString() === req.params.reviewId,
  );
  if (!review) return next(new ErrorHandler("Review not found", 404));
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "Admin"
  )
    return next(new ErrorHandler("Not authorized", 403));

  book.reviews = book.reviews.filter(
    (r) => r._id.toString() !== req.params.reviewId,
  );
  book.avgRating = book.reviews.length
    ? Math.round(
        (book.reviews.reduce((sum, r) => sum + r.rating, 0) /
          book.reviews.length) *
          10,
      ) / 10
    : 0;

  await book.save();
  res.status(200).json({ success: true, message: "Review deleted" });
});

// Admin stats
export const getAdminStats = catchAsyncErrors(async (req, res) => {
  const [
    totalUsers,
    totalBooks,
    totalBorrows,
    activeBorrows,
    overdueBorrows,
    finesResult,
  ] = await Promise.all([
    User.countDocuments(),
    Book.countDocuments(),
    Borrow.countDocuments(),
    Borrow.countDocuments({ status: "borrowed" }),
    Borrow.countDocuments({ status: "overdue" }),
    Borrow.aggregate([{ $group: { _id: null, total: { $sum: "$fine" } } }]),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalBooks,
      totalBorrows,
      activeBorrows,
      overdueBorrows,
      totalFinesCollected: finesResult[0]?.total || 0,
    },
  });
});

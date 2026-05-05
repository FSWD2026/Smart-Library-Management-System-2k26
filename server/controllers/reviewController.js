import { Review } from "../models/reviewModel.js";
import { Book } from "../models/bookModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// ADD REVIEW
export const addReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;

  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  // check if already reviewed
  const existing = await Review.findOne({
    user: req.user._id,
    book: req.params.id,
  });

  if (existing) {
    return next(new ErrorHandler("You already reviewed this book", 400));
  }

  const review = await Review.create({
    user: req.user._id,
    book: req.params.id,
    rating,
    comment,
  });

  // update avgRating on book
  const allReviews = await Review.find({ book: req.params.id });
  const avg =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  book.avgRating = Math.round(avg * 10) / 10;
  await book.save();

  res.status(201).json({
    success: true,
    message: "Review added",
    review,
  });
});

// GET ALL REVIEWS FOR A BOOK
export const getBookReviews = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  const reviews = await Review.find({ book: req.params.id })
    .populate("user", "name avatar")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

// DELETE OWN REVIEW
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) return next(new ErrorHandler("Review not found", 404));

  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized", 403));
  }

  await review.deleteOne();

  // recalculate avgRating
  const allReviews = await Review.find({ book: review.book });

  const avg =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

  await Book.findByIdAndUpdate(review.book, {
    avgRating: Math.round(avg * 10) / 10,
  });

  res.status(200).json({
    success: true,
    message: "Review deleted",
  });
});

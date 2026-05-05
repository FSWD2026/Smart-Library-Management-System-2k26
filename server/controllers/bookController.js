import { Book } from "../models/bookModel.js";
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

  // ✅ Basic validation (prevents silent crashes)
  if (!title || !author || !category || !totalCopies) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  let cover = {};

  // ✅ Safe Cloudinary upload
  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "smart-library/covers",
      transformation: [
        {
          width: 400,
          height: 550,
          crop: "limit", // ✅ safest (prevents resize error)
        },
      ],
    });

    cover = {
      public_id: result.public_id,
      url: result.secure_url,
    };
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

  res.status(201).json({
    success: true,
    message: "Book added",
    book,
  });
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
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  });
});

export const updateBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  if (req.file) {
    // ✅ delete old image
    if (book.cover?.public_id) {
      await cloudinary.v2.uploader.destroy(book.cover.public_id);
    }

    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "smart-library/covers",
    });

    req.body.cover = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    book: updated,
  });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  if (book.cover?.public_id) {
    await cloudinary.v2.uploader.destroy(book.cover.public_id);
  }

  await book.deleteOne();

  res.status(200).json({
    success: true,
    message: "Book deleted",
  });
});

// GET SINGLE BOOK — add this to your existing bookController.js
export const getSingleBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  res.status(200).json({
    success: true,
    book,
  });
});

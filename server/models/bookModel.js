import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true },
    isbn: { type: String, unique: true, sparse: true },
    category: { type: String, required: true, index: true },
    description: String,
    cover: {
      public_id: String,
      url: { type: String, default: "/default-book.png" },
    },
    totalCopies: { type: Number, required: true, min: 1 },
    availableCopies: { type: Number, required: true },
    publisher: String,
    publishedYear: Number,
    tags: [String],
    avgRating: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true },
);

bookSchema.index({
  title: "text",
  author: "text",
  description: "text",
  tags: "text",
});

export const Book = mongoose.model("Book", bookSchema);

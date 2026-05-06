import express from "express";
import {
  addBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
  addReview,
  getReviews,
  deleteReview,
  getAdminStats,
} from "../controllers/bookController.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.post("/:id/review", isAuthenticated, addReview);
router.get("/:id/reviews", getReviews);
router.delete("/:id/review/:reviewId", isAuthenticated, deleteReview);

router.post(
  "/admin/add",
  isAuthenticated,
  isAdmin,
  upload.single("cover"),
  addBook,
);
router.put(
  "/admin/:id",
  isAuthenticated,
  isAdmin,
  upload.single("cover"),
  updateBook,
);
router.delete("/admin/:id", isAuthenticated, isAdmin, deleteBook);

export default router;

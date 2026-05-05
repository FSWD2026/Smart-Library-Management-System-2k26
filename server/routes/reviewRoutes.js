import express from "express";
import {
  addReview,
  getBookReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/:id/review", isAuthenticated, addReview);
router.get("/:id/reviews", getBookReviews);
router.delete("/:id/review/:reviewId", isAuthenticated, deleteReview);

export default router;

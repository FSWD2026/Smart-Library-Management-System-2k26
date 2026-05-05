import express from "express";
import {
  addBook,
  getAllBooks,
  getSingleBook, // add this import
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getSingleBook); // add this line
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

import express from "express";
import {
  borrowBook,
  returnBook,
  getMyBorrows,
  getAllBorrows,
} from "../controllers/borrowController.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/:bookId", isAuthenticated, borrowBook);
router.put("/return/:borrowId", isAuthenticated, returnBook);
router.get("/my", isAuthenticated, getMyBorrows);
router.get("/admin/all", isAuthenticated, isAdmin, getAllBorrows);

export default router;

import express from "express";
import {
  borrowBook,
  returnBook,
  myBorrows,
  getAllBorrows,
  getOverdueBorrows,
} from "../controllers/borrowController.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/:bookId", isAuthenticated, borrowBook);
router.put("/return/:borrowId", isAuthenticated, returnBook);
router.get("/my", isAuthenticated, myBorrows);
router.get("/admin/all", isAuthenticated, isAdmin, getAllBorrows);
router.get("/admin/overdue", isAuthenticated, isAdmin, getOverdueBorrows);

export default router;

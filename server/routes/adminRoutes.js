import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  getDashboardStats,
} from "../controllers/adminController.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.get("/users/:id", isAuthenticated, isAdmin, getSingleUser);
router.put("/users/:id/role", isAuthenticated, isAdmin, updateUserRole);
router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser);
router.get("/stats", isAuthenticated, isAdmin, getDashboardStats);

export default router;

import express from "express";
import {
  getMyProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/me", isAuthenticated, getMyProfile);
router.put(
  "/me/update",
  isAuthenticated,
  upload.single("avatar"),
  updateProfile,
);
router.put("/me/password", isAuthenticated, changePassword);

export default router;

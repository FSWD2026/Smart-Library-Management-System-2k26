import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/books", reviewRoutes);
app.use("/api/v1/borrow", borrowRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorMiddleware);
export default app;

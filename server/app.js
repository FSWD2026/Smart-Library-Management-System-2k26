import express from "express";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

const app = express();

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);

app.use(errorMiddleware);
export default app;

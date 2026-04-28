import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";
import cloudinary from "cloudinary";

dotenv.config({ path: "./config/config.env" });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

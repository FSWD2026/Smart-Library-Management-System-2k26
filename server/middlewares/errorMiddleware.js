export const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR:", err); // 👈 ADD THIS (important for debugging)

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

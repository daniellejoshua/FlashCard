import dotenv from "dotenv";

dotenv.config();
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Server error",
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { UserTable } from "./migrations/001-create-users.js";
const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use(errorHandler);
async function initializeDb() {
  try {
    console.log("DB CONNECTED SUCCESSFULLY");
    await UserTable();
  } catch (error) {
    console.log("ERROR INITILIAZING DB", error);
  }
}

initializeDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("server running on port 3000");
  });
});

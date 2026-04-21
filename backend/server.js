import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { UserTable } from "./migrations/001-create-users.js";
import { topicTable } from "./migrations/002-create-topic.js";
import { flashCardTable } from "./migrations/003-create-flashcard.js";
const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/topic", topicRoutes);

app.use(errorHandler);
async function initializeDb() {
  try {
    console.log("DB CONNECTED SUCCESSFULLY");
    await UserTable();
    await topicTable();
    await flashCardTable();
  } catch (error) {
    console.log("ERROR INITILIAZING DB", error);
  }
}

initializeDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("server running on port 3000");
  });
});

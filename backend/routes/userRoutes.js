import express from "express";
import {
  authUser,
  logOutUser,
  registerUser,
  tokenRefresher,
} from "../controllers/userController.js";
import { authToken } from "../middleware/authUser.js";
import { addTopic } from "../controllers/topicController.js";

const router = express.Router();

router.post("/createUser", registerUser);
router.post("/login", authUser);
router.post("/refreshToken", tokenRefresher);
router.post("/logout", logOutUser);
export default router;

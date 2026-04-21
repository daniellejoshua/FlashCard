import { createUser } from "../models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sql } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();
export async function registerUser(req, res, next) {
  try {
    const { username, password, email } = req.body;
    const user = await createUser(username, password, email);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function authUser(req, res, next) {
  try {
    const { identifier, password } = req.body;
    const [user] =
      await sql` SELECT *  FROM users WHERE username = ${identifier}  OR email  = ${identifier}`;
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const oldRefreshToken = req.cookies?.refreshToken;
    const oldAccessToken = req.cookies?.accessToken;
    if (oldAccessToken || oldRefreshToken) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "None",
      });
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "None",
      });
    }

    const accessToken = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30s" },
    );
    const refreshToken = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.REFRESH_TOKEN,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user_id: user.user_id,
      username: user.username,
    });
  } catch (error) {
    next(error);
  }
}

export async function tokenRefresher(req, res, next) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.json({ message: "No refresh token" });
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const [user] =
      await sql`SELECT * from users WHERE User_id = ${payload.user_id}`;
    if (!user) return res.json({ message: "No users found" });

    const newAccessToken = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30s" },
    );
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
    });
    res.status(200).json({
      message: "RefreshToken Successfulyy",
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function logOutUser(req, res, next) {
  const refreshToken = req.cookies?.refreshToken;
  const accessToken = req.cookies?.accessToken;
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "None",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "None",
    });
    res.status(200).json({ message: "log out successfully" });
  } catch (error) {
    next(error);
  }
}

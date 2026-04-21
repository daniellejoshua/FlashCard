import jwt from "jsonwebtoken";

export function authToken(req, res, next) {
  const token = req.cookie?.accessToken;
  if (!token) return res.status(403).json({ message: "You are not authorize" });
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "ERROR ON AUTH TOKEN" });
  }
}

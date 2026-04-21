import express from "express";

const Router = express.Router();

router.post("createToken", authToken, addTopic);
export default router;

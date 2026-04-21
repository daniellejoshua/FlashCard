import { createTopic } from "../models/topics.js";

export async function addTopic(req, res, next) {
  try {
    const user_id = req.user.user_id;
    const { title, description } = req.body;
    const topic = await createTopic({ user_id, title, description });
    res
      .status(200)
      .json({ message: "Topic created successfully", topic: topic });
  } catch (error) {
    next(error);
  }
}

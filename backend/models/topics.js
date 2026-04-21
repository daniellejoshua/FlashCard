import { sql } from "../config/db.js";

export async function createTopic({ user_id, title, description = "" }) {
  return await sql`
    INSERT INTO topics (user_id, title, description, difficulty)
    VALUES (${user_id}, ${title}, ${description}, ${difficulty})
    RETURNING *;
  `;
}

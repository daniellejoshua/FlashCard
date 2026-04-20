import { sql } from "../config/db.js";
export async function topicTable() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS topics(
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`;
  } catch (error) {
    console.log("ERROR ON TOPICS TABLE MIGRATIONS", error.message);
  }
}

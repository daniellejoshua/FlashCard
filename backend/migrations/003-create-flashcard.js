import { sql } from "../config/db.js";

export async function flashCardTable() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS flashcards(
            id SERIAL PRIMARY KEY,
            topic_id INTEGER NOT NULL,
            question TEXT,
            answer TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (topic_id) REFERENCES topics(id)
        )`;
  } catch (error) {
    console.log("ERROR ON FLASHCARD TABLE MIGRATIONS", error.message);
  }
}

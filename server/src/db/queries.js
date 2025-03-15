import { getDatabase } from "./index.js";
import { DatabaseError } from "../types/errors.js";

export const saveMessage = async (name, message, timestamp) => {
    if (!name || !message || !timestamp) {
        throw new DatabaseError("Missing required message fields", { code: 'INVALID_MESSAGE_DATA' });
    }

    const db = getDatabase();
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO messages (name, message, timestamp) VALUES (?, ?, ?)",
            [name, message, timestamp],
            function(error) {
                if (error) {
                    reject(new DatabaseError("Failed to save message", { 
                        code: 'DB_SAVE_ERROR',
                        originalError: error 
                    }));
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
};

export const getMessages = async () => {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM messages ORDER BY timestamp ASC",
            [],
            (error, rows) => {
                if (error) {
                    reject(new DatabaseError("Failed to fetch messages", {
                        code: 'DB_FETCH_ERROR',
                        originalError: error
                    }));
                } else {
                    resolve(rows);
                }
            }
        );
    });
};

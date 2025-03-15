import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { DatabaseError } from "../utils/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

export const connectToDatabase = async () => {
    try {
        const dbPath = path.join(__dirname, process.env.DB_PATH || "chat.db");
        db = new sqlite3.Database(dbPath);

        await initializeDatabase();
        console.log("Database connected and initialized successfully");
        return db;
    } catch (error) {
        throw new DatabaseError("Failed to connect to database", error);
    }
};

const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        const schema = `
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp INTEGER NOT NULL
            )
        `;

        db.run(schema, (error) => {
            if (error) reject(new DatabaseError("Failed to initialize database schema", error));
            else resolve();
        });
    });
};

export const getDatabase = () => {
    if (!db) throw new DatabaseError("Database not initialized");
    return db;
};
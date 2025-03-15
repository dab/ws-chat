import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';

const DB_PATH = './data/chat.db';
let dbInstance;

export const connectToDatabase = async () => {
    try {
        // Ensure the database directory exists
        const dbDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        // Open the database connection
        dbInstance = await open({
            filename: DB_PATH,
            driver: sqlite3.Database,
        });

        // Create the messages table if it doesn't exist
        await dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp INTEGER NOT NULL
            )
        `);

        console.log('Database connected and initialized.');
        return dbInstance;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

export const getDatabase = () => {
    if (!dbInstance) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return dbInstance;
};

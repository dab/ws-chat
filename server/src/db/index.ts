import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { Message } from '../types';

const dbPath = path.join(__dirname, 'chat.db');
const db = new sqlite3.Database(dbPath);

const defaultMessages: Message[] = [
    { 
        name: "Buddha",
        message: "The path to enlightenment begins with understanding...",
        timestamp: new Date('2023-01-01T12:00:00').getTime()
    },
    {
        name: "Michael Jackson",
        message: "Man, that's deep! You know, through my music and dance...",
        timestamp: new Date('2023-01-01T12:05:00').getTime()
    }
];

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        )
    `);
    
    db.get<{ count: number }>("SELECT COUNT(*) as count FROM messages", [], (err, row) => {
        if (err) {
            console.error('Database initialization error:', err);
            return;
        }
        
        if (row && row.count === 0) {
            const stmt = db.prepare("INSERT INTO messages (name, message, timestamp) VALUES (?, ?, ?)");
            
            defaultMessages.forEach(msg => {
                stmt.run(msg.name, msg.message, msg.timestamp);
            });
            
            stmt.finalize();
        }
    });
});

export default db;
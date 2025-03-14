import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import setupWebSocket from './websocket';
import db from './db';
import { Message } from './types';

const app = express();
const server = createServer(app);
const HTTP_PORT = Number(process.env.PORT) || 3000;

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET'],
    credentials: true
}));

app.use(express.json());

setupWebSocket(server);

app.get("/api/messages", (req: Request, res: Response) => {
    db.all<Message[]>(
        "SELECT * FROM messages ORDER BY timestamp ASC",
        (error: Error | null, messages: Message[]) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.json(messages);
        }
    );
});

app.use((req: Request, res: Response) => {
    res.status(404).send("Not found");
});

server.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});
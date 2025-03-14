const express = require("express");
const cors = require("cors");
const setupWebSocket = require("./websocket");
const db = require("./db");

const createServer = () => {
    const app = express();
    const server = require('http').createServer(app);
    const wss = setupWebSocket(server);

    return { app, server, wss };
};

const setupMiddleware = (app) => {
    const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

    app.use(cors({
        origin: CORS_ORIGIN,
        methods: ['GET'],
        credentials: true
    }));
    app.use(express.json());
};

const setupRoutes = (app) => {
    app.get("/api/messages", (req, res) => {
        db.all("SELECT * FROM messages ORDER BY timestamp ASC", (error, messages) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }

            res.json(messages);
        });
    });

    app.use((req, res) => res.status(404).send("Not found"));
};

const startServer = (server, port) => {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

const main = () => {
    const HTTP_PORT = process.env.PORT || 3000;
    const { app, server } = createServer();
    
    setupMiddleware(app);
    setupRoutes(app);
    startServer(server, HTTP_PORT);
};

main();

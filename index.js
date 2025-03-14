const express = require("express");
const WebSocket = require("ws");
const db = require("./db");

const cors = require("cors");
const { time } = require("console");
const HTTP_PORT = process.env.PORT || 3000;
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors({
    origin: 'http://localhost:5173', // React dev server
    methods: ['GET'],
    credentials: true
}));

app.use(express.json());

app.get("/api", (req, res) => {
    res.json({ message: "Hello World" });
});

app.get("/api/messages", (req, res) => {
    db.all("SELECT * FROM messages ORDER BY timestamp ASC", (error, messages) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json(messages);
    });
});

app.use((req, res) => res.status(404).send("Not found"));

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.type === "new_user") {
            ws.username = data.name;
            const connectedUsers = Array.from(wss.clients)
                .map(client => client.username)
                .filter(Boolean);

            wss.clients.forEach((client) => {
                client.send(JSON.stringify({
                    type: "users_list",
                    users: connectedUsers
                }));
            });
        }

        if (data.message) {
            const timestamp = new Date();
            db.run("INSERT INTO messages (name, message, timestamp) VALUES (?, ?, ?)",
                [data.name, data.message, timestamp],
                (error) => {
                    if (error) {
                        console.error("Error saving message:", error);
                        return;
                    }
                    data.type = "new_message";
                    wss.clients.forEach((client) => {
                        client.send(JSON.stringify({
                            data
                        }));
                    });
                }
            );
        }
    });

    ws.on("close", () => {
        const connectedUsers = Array.from(wss.clients)
            .map(client => client.username)
            .filter(Boolean);

        wss.clients.forEach((client) => {
            client.send(JSON.stringify({
                type: "users_list",
                users: connectedUsers
            }));
        });
    });
});

wss.on("error", (error) => {
    console.error(error);
});

server.listen(HTTP_PORT, () => {
    console.log(`Server is running on port ${HTTP_PORT}`);
});

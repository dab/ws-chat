const WebSocket = require('ws');
const db = require("../db/");

const handleNewUser = (wss, ws, data) => {
    ws.username = data.name;
    broadcastUserList(wss);
};

const handleChatMessage = (wss, data) => {
    const timestamp = new Date().getTime();
    db.run(
        "INSERT INTO messages (name, message, timestamp) VALUES (?, ?, ?)",
        [data.name, data.message, timestamp],
        (error) => {
            if (error) {
                console.error("Error saving message:", error);
                return;
            }
            broadcast(wss, {
                type: "new_message",
                data: {
                    name: data.name,
                    message: data.message,
                    timestamp
                }
            });
        }
    );
};

const broadcastUserList = (wss) => {
    const connectedUsers = Array.from(wss.clients)
        .map(client => client.username)
        .filter(Boolean);

    broadcast(wss, {
        type: "users_list",
        users: connectedUsers
    });
};

const broadcastMessage = (wss, data) => {
    broadcast(wss, { data });
};

const broadcast = (wss, message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

module.exports = {
    handleNewUser,
    handleChatMessage,
    broadcastUserList,
    broadcastMessage
};
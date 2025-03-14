import { WebSocketServer } from 'ws';
import { ExtendedWebSocket, WebSocketMessage, Message } from '../types';
import db from '../db';

const handleNewUser = (
    wss: WebSocketServer, 
    ws: ExtendedWebSocket, 
    data: WebSocketMessage
): void => {
    if (data.name) {
        ws.username = data.name;
        broadcastUserList(wss);
    }
};

const handleChatMessage = (
    wss: WebSocketServer, 
    data: { name: string; message: string }
): void => {
    const timestamp = Date.now();
    db.run(
        "INSERT INTO messages (name, message, timestamp) VALUES (?, ?, ?)",
        [data.name, data.message, timestamp],
        (error: Error | null) => {
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

const broadcastUserList = (wss: WebSocketServer): void => {
    const connectedUsers = Array.from(wss.clients)
        .map((client) => (client as ExtendedWebSocket).username)
        .filter((username): username is string => Boolean(username));

    broadcast(wss, {
        type: "users_list",
        users: connectedUsers
    });
};

const broadcast = (wss: WebSocketServer, message: WebSocketMessage): void => {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

export {
    handleNewUser,
    handleChatMessage,
    broadcastUserList
};
import { WebSocket } from 'ws';
import { saveMessage } from '../db/queries.js';
import { WebSocketError } from '../types/errors.js';

const handlers = {
    new_user: (wss, ws, data) => {
        if (!data.name) throw new WebSocketError("Username is required");
        ws.username = data.name;
        broadcastUserList(wss);
    },

    new_message: async (wss, ws, data) => {
        if (!data.name || !data.message) throw new WebSocketError("Invalid message format");
        
        const timestamp = Date.now();
        await saveMessage(data.name, data.message, timestamp);
        
        broadcast(wss, {
            type: 'new_message',
            data: { name: data.name, message: data.message, timestamp }
        });
    },

    request_user_list: (wss, ws) => {
        const users = Array.from(wss.clients)
            .filter(client => client.username)
            .map(client => client.username);

        ws.send(JSON.stringify({ type: 'users_list', users }));
    }
};

export const messageHandler = async (wss, ws, message) => {
    try {
        const handler = handlers[message.type];
        if (!handler) {
            throw new WebSocketError(`Unknown message type: ${message.type}`, 'INVALID_MESSAGE_TYPE');
        }
        
        await handler(wss, ws, message);
    } catch (error) {
        const errorResponse = {
            type: 'error',
            code: error instanceof WebSocketError ? error.code : 'INTERNAL_ERROR',
            message: error instanceof WebSocketError ? error.message : 'Internal server error'
        };
        ws.send(JSON.stringify(errorResponse));
    }
};

const broadcast = (wss, message) => {
    const payload = JSON.stringify(message);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
};

const broadcastUserList = (wss) => {
    const users = Array.from(wss.clients)
        .map(client => client.username)
        .filter(Boolean);

    broadcast(wss, {
        type: 'users_list',
        users
    });
};
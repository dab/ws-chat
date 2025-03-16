import { WebSocket } from 'ws';
import { WebSocketError } from '../../types/errors.js';
import { broadcastToClients } from '../utils.js';

export const handleNewUser = (wss, ws, data) => {
    if (!data.name) {
        throw new WebSocketError("Username is required");
    }
    ws.username = data.name;
    broadcastUserList(wss);
};

export const handleRequestUserList = (wss, ws) => {
    const users = Array.from(wss.clients)
        .filter(client => client.username)
        .map(client => client.username);

    ws.send(JSON.stringify({ 
        type: 'users_list', 
        users 
    }));
};

export const broadcastUserList = (wss) => {
    const users = Array.from(wss.clients)
        .filter(client => client.username)
        .map(client => client.username);

    broadcastToClients(wss, {
        type: 'users_list',
        users
    });
};

export const handleUserDisconnect = (wss, ws) => {
    if (ws.username) {
        delete ws.username;
        broadcastUserList(wss);
    }
}; 
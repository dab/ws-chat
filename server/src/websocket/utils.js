import { WebSocket } from 'ws';

export const broadcastToClients = (wss, message) => {
    const payload = JSON.stringify(message);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}; 
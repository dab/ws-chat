import { Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';
import { ExtendedWebSocket, WebSocketMessage } from '../types';
import { handleNewUser, handleChatMessage, broadcastUserList } from './handlers';

const setupWebSocket = (server: HttpServer): WebSocketServer => {
    const wss = new WebSocketServer({ server });

    const handleMessage = (ws: ExtendedWebSocket) => (message: Buffer | ArrayBuffer | Buffer[]) => {
        try {
            const data = JSON.parse(message.toString()) as WebSocketMessage;
            
            // Handle new user connection
            if (data.type === 'new_user' && data.name) {
                handleNewUser(wss, ws, data);
            }
            
            // Handle chat message - updated this part
            if (data.name && data.message) {
                handleChatMessage(wss, {
                    name: data.name,
                    message: data.message
                });
            }
            
        } catch (error) {
            console.error('Error handling message:', error);
        }
    };

    const handleConnection = (ws: ExtendedWebSocket) => {
        ws.on('message', handleMessage(ws));
        ws.on('close', () => broadcastUserList(wss));
    };

    wss.on('connection', handleConnection);

    return wss;
};

export default setupWebSocket;
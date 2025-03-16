import { WebSocketError } from '../../types/errors.js';
import { saveMessage } from '../../db/queries.js';
import { broadcastToClients } from '../utils.js';

export const handleNewMessage = async (wss, ws, data) => {
    if (!data.name || !data.message) {
        throw new WebSocketError("Invalid message format");
    }
    
    const timestamp = Date.now();
    await saveMessage(data.name, data.message, timestamp);
    
    broadcastToClients(wss, {
        type: 'new_message',
        data: { 
            name: data.name, 
            message: data.message, 
            timestamp 
        }
    });
}; 
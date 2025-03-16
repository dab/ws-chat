import { WebSocketError } from '../../types/errors.js';
import { handleNewUser, handleRequestUserList } from './userHandlers.js';
import { handleNewMessage } from './messageHandlers.js';

const handlers = {
    new_user: handleNewUser,
    new_message: handleNewMessage,
    request_user_list: handleRequestUserList
};

export const messageHandler = async (wss, ws, message) => {
    try {
        const handler = handlers[message.type];
        if (!handler) {
            throw new WebSocketError(
                `Unknown message type: ${message.type}`, 
                'INVALID_MESSAGE_TYPE'
            );
        }
        
        await handler(wss, ws, message);
    } catch (error) {
        const errorResponse = {
            type: 'error',
            code: error instanceof WebSocketError ? error.code : 'INTERNAL_ERROR',
            message: error.message || 'Internal server error'
        };
        ws.send(JSON.stringify(errorResponse));
    }
}; 
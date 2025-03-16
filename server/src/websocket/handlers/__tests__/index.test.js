import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WebSocket } from 'ws';
import { messageHandler } from '../index.js';
import { handleNewUser } from '../userHandlers.js';
import { handleNewMessage } from '../messageHandlers.js';
import { WebSocketError } from '../../../types/errors.js';

vi.mock('../userHandlers.js', () => ({
    handleNewUser: vi.fn(),
    handleRequestUserList: vi.fn()
}));

vi.mock('../messageHandlers.js', () => ({
    handleNewMessage: vi.fn()
}));

describe('Message Handler', () => {
    let wss, mockWs;

    beforeEach(() => {
        vi.clearAllMocks();
        mockWs = {
            send: vi.fn(),
            readyState: WebSocket.OPEN
        };
        wss = {
            clients: new Set([mockWs])
        };
    });

    it('should route new_user messages to user handler', async () => {
        const message = { type: 'new_user', name: 'testUser' };
        await messageHandler(wss, mockWs, message);
        
        expect(handleNewUser).toHaveBeenCalledWith(wss, mockWs, message);
    });

    it('should route new_message messages to message handler', async () => {
        const message = {
            type: 'new_message',
            name: 'testUser',
            message: 'test message'
        };
        await messageHandler(wss, mockWs, message);
        
        expect(handleNewMessage).toHaveBeenCalledWith(wss, mockWs, message);
    });

    it('should handle unknown message types', async () => {
        const message = { type: 'unknown_type' };
        await messageHandler(wss, mockWs, message);
        
        expect(mockWs.send).toHaveBeenCalledWith(
            expect.stringContaining('Unknown message type: unknown_type')
        );
    });

    describe('error handling', () => {
        it('should handle WebSocketError with custom message and code', async () => {
            const error = new WebSocketError('Invalid user data', 'INVALID_USER');
            handleNewUser.mockRejectedValueOnce(error);
            
            const message = { type: 'new_user', name: 'testUser' };
            await messageHandler(wss, mockWs, message);
            
            expect(mockWs.send).toHaveBeenCalledWith(
                JSON.stringify({
                    type: 'error',
                    code: 'INVALID_USER',
                    message: 'Invalid user data'
                })
            );
        });

        it('should handle generic errors and preserve their message', async () => {
            const error = new Error('Test error');
            handleNewUser.mockRejectedValueOnce(error);
            
            const message = { type: 'new_user', name: 'testUser' };
            await messageHandler(wss, mockWs, message);
            
            expect(mockWs.send).toHaveBeenCalledWith(
                JSON.stringify({
                    type: 'error',
                    code: 'INTERNAL_ERROR',
                    message: 'Test error'
                })
            );
        });

        it('should handle errors without message', async () => {
            const error = new Error();
            handleNewUser.mockRejectedValueOnce(error);
            
            const message = { type: 'new_user', name: 'testUser' };
            await messageHandler(wss, mockWs, message);
            
            expect(mockWs.send).toHaveBeenCalledWith(
                JSON.stringify({
                    type: 'error',
                    code: 'INTERNAL_ERROR',
                    message: 'Internal server error'
                })
            );
        });
    });
}); 
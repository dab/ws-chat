import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WebSocket } from 'ws';
import { messageHandler } from './handlers.js';
import { saveMessage } from '../db/queries.js';

vi.mock('../db/queries.js', () => ({
    saveMessage: vi.fn()
}));

describe('WebSocket Handlers', () => {
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

    describe('new_user handler', () => {
        it('should set username and broadcast user list', async () => {
            const message = { type: 'new_user', name: 'testUser' };
            await messageHandler(wss, mockWs, message);
            
            expect(mockWs.username).toBe('testUser');
            expect(mockWs.send).toHaveBeenCalledWith(
                expect.stringContaining('"type":"users_list"')
            );
        });

        it('should throw error if username is missing', async () => {
            const message = { type: 'new_user' };
            await messageHandler(wss, mockWs, message);
            
            expect(mockWs.send).toHaveBeenCalledWith(
                expect.stringContaining('"message":"Username is required"')
            );
        });
    });

    describe('new_message handler', () => {
        it('should save and broadcast message', async () => {
            const message = {
                type: 'new_message',
                name: 'testUser',
                message: 'test message'
            };
            
            await messageHandler(wss, mockWs, message);
            
            expect(saveMessage).toHaveBeenCalledWith(
                'testUser',
                'test message',
                expect.any(Number)
            );
            expect(mockWs.send).toHaveBeenCalledWith(
                expect.stringContaining('"type":"new_message"')
            );
        });

        it('should handle unknown message type', async () => {
            const message = {
                type: 'chat_message',  // Unknown type
                name: 'testUser',
                message: 'test message'
            };
            
            await messageHandler(wss, mockWs, message);
            
            expect(saveMessage).not.toHaveBeenCalled();
            expect(mockWs.send).toHaveBeenCalledWith(
                expect.stringContaining('Unknown message type: chat_message')
            );
        });

        it('should handle database errors', async () => {
            saveMessage.mockRejectedValueOnce(new Error('DB Error'));
            
            const message = {
                type: 'new_message',
                name: 'testUser',
                message: 'test message'
            };

            await messageHandler(wss, mockWs, message);
            
            expect(mockWs.send).toHaveBeenCalledWith(
                expect.stringContaining('"type":"error"')
            );
        });
    });

    describe('request_user_list handler', () => {
        it('should send user list to requesting client', async () => {
            mockWs.username = 'testUser';
            const message = { type: 'request_user_list' };
            
            await messageHandler(wss, mockWs, message);
            
            expect(mockWs.send).toHaveBeenCalledWith(
                expect.stringContaining('"type":"users_list"')
            );
        });
    });
});
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WebSocket } from 'ws';
import { handleNewMessage } from '../messageHandlers.js';
import { saveMessage } from '../../../db/queries.js';
import { broadcastToClients } from '../../utils.js';

vi.mock('../../../db/queries.js', () => ({
    saveMessage: vi.fn()
}));

vi.mock('../../utils.js', () => ({
    broadcastToClients: vi.fn()
}));

describe('Message Handlers', () => {
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

    describe('handleNewMessage', () => {
        it('should save and broadcast message', async () => {
            const data = {
                name: 'testUser',
                message: 'test message'
            };
            
            await handleNewMessage(wss, mockWs, data);
            
            expect(saveMessage).toHaveBeenCalledWith(
                'testUser',
                'test message',
                expect.any(Number)
            );
            expect(broadcastToClients).toHaveBeenCalledWith(
                wss,
                expect.objectContaining({
                    type: 'new_message',
                    data: expect.objectContaining({
                        name: 'testUser',
                        message: 'test message'
                    })
                })
            );
        });

        it('should throw error if message data is invalid', async () => {
            const invalidData = { name: 'testUser' }; // Missing message
            
            await expect(handleNewMessage(wss, mockWs, invalidData))
                .rejects
                .toThrow('Invalid message format');
            
            expect(saveMessage).not.toHaveBeenCalled();
            expect(broadcastToClients).not.toHaveBeenCalled();
        });

        it('should handle database errors', async () => {
            saveMessage.mockRejectedValueOnce(new Error('DB Error'));
            
            const data = {
                name: 'testUser',
                message: 'test message'
            };

            await expect(handleNewMessage(wss, mockWs, data))
                .rejects
                .toThrow('DB Error');
            
            expect(broadcastToClients).not.toHaveBeenCalled();
        });
    });
}); 
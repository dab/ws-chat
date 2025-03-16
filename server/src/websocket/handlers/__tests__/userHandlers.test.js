import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WebSocket } from 'ws';
import { handleNewUser, handleRequestUserList, handleUserDisconnect } from '../userHandlers.js';
import { broadcastToClients } from '../../utils.js';

vi.mock('../../utils.js', () => ({
    broadcastToClients: vi.fn()
}));

describe('User Handlers', () => {
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

    describe('handleNewUser', () => {
        it('should set username and broadcast user list', () => {
            const data = { name: 'testUser' };
            handleNewUser(wss, mockWs, data);
            
            expect(mockWs.username).toBe('testUser');
            expect(broadcastToClients).toHaveBeenCalledWith(
                wss,
                expect.objectContaining({
                    type: 'users_list',
                    users: ['testUser']
                })
            );
        });

        it('should throw error if username is missing', () => {
            expect(() => handleNewUser(wss, mockWs, {}))
                .toThrow('Username is required');
        });
    });

    describe('handleRequestUserList', () => {
        it('should send user list to requesting client', () => {
            mockWs.username = 'testUser';
            handleRequestUserList(wss, mockWs);
            
            expect(mockWs.send).toHaveBeenCalledWith(
                expect.stringContaining('"users":["testUser"]')
            );
        });

        it('should only include clients with usernames', () => {
            const mockWs2 = { readyState: WebSocket.OPEN };
            const mockWs3 = { readyState: WebSocket.OPEN, username: 'user3' };
            wss.clients = new Set([mockWs, mockWs2, mockWs3]);
            mockWs.username = 'user1';

            handleRequestUserList(wss, mockWs);
            
            const sentData = JSON.parse(mockWs.send.mock.calls[0][0]);
            expect(sentData.users).toHaveLength(2);
            expect(sentData.users).toContain('user1');
            expect(sentData.users).toContain('user3');
        });
    });

    describe('handleUserDisconnect', () => {
        it('should remove username and broadcast updated list', () => {
            mockWs.username = 'testUser';
            handleUserDisconnect(wss, mockWs);
            
            expect(mockWs.username).toBeUndefined();
            expect(broadcastToClients).toHaveBeenCalledWith(
                wss,
                expect.objectContaining({
                    type: 'users_list',
                    users: []
                })
            );
        });

        it('should do nothing if user has no username', () => {
            handleUserDisconnect(wss, mockWs);
            
            expect(broadcastToClients).not.toHaveBeenCalled();
        });
    });
}); 
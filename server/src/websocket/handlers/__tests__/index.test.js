import { describe, it, expect, beforeEach, vi } from 'vitest';
import { messageHandler } from '../index.js';
import { handleNewUser } from '../userHandlers.js';
import { handleNewMessage } from '../messageHandlers.js';
import { WebSocketMother } from '../../../test/mothers/WebSocketMother.js';
import { ErrorMother } from '../../../test/mothers/ErrorMother.js';

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
        mockWs = WebSocketMother.createMockWebSocket();
        wss = WebSocketMother.createMockServer(mockWs);
    });

    it('should route new_user messages to user handler', async () => {
        const message = WebSocketMother.createNewUserMessage();
        await messageHandler(wss, mockWs, message);
        
        expect(handleNewUser).toHaveBeenCalledWith(wss, mockWs, message);
    });

    it('should route new_message messages to message handler', async () => {
        const message = WebSocketMother.createNewChatMessage();
        await messageHandler(wss, mockWs, message);
        
        expect(handleNewMessage).toHaveBeenCalledWith(wss, mockWs, message);
    });

    it('should handle unknown message types', async () => {
        const message = WebSocketMother.createUnknownTypeMessage();
        await messageHandler(wss, mockWs, message);
        
        expect(mockWs.send).toHaveBeenCalledWith(
            JSON.stringify(
                ErrorMother.createErrorResponse(
                    'INVALID_MESSAGE_TYPE',
                    'Unknown message type: unknown_type'
                )
            )
        );
    });

    describe('error handling', () => {
        it('should handle WebSocketError with custom message and code', async () => {
            const error = ErrorMother.createWebSocketError();
            handleNewUser.mockRejectedValueOnce(error);
            
            const message = WebSocketMother.createNewUserMessage();
            await messageHandler(wss, mockWs, message);
            
            expect(mockWs.send).toHaveBeenCalledWith(
                JSON.stringify(
                    ErrorMother.createErrorResponse('INVALID_USER', 'Invalid user data')
                )
            );
        });

        it('should handle generic errors and preserve their message', async () => {
            const error = ErrorMother.createGenericError();
            handleNewUser.mockRejectedValueOnce(error);
            
            const message = WebSocketMother.createNewUserMessage();
            await messageHandler(wss, mockWs, message);
            
            expect(mockWs.send).toHaveBeenCalledWith(
                JSON.stringify(
                    ErrorMother.createErrorResponse('INTERNAL_ERROR', 'Test error')
                )
            );
        });

        it('should handle errors without message', async () => {
            const error = ErrorMother.createEmptyError();
            handleNewUser.mockRejectedValueOnce(error);
            
            const message = WebSocketMother.createNewUserMessage();
            await messageHandler(wss, mockWs, message);
            
            expect(mockWs.send).toHaveBeenCalledWith(
                JSON.stringify(
                    ErrorMother.createErrorResponse()
                )
            );
        });
    });
}); 
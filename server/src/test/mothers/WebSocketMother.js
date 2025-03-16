import { vi } from 'vitest';
import { WebSocket } from 'ws';
import { WebSocketError } from '../../types/errors.js';

export class WebSocketMother {
    static createMockWebSocket() {
        return {
            send: vi.fn(),
            readyState: WebSocket.OPEN
        };
    }

    static createMockServer(mockWs) {
        return {
            clients: new Set([mockWs])
        };
    }

    static createNewUserMessage(username = 'testUser') {
        return {
            type: 'new_user',
            name: username
        };
    }

    static createNewChatMessage(username = 'testUser', content = 'test message') {
        return {
            type: 'new_message',
            name: username,
            message: content
        };
    }

    static createRequestUserListMessage() {
        return {
            type: 'request_user_list'
        };
    }

    static createUnknownTypeMessage(type = 'unknown_type') {
        return { type };
    }
}
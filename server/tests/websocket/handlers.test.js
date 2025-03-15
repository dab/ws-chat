import { handleNewMessage, handleUserListRequest } from '../../src/websocket/handlers.js';
import { saveMessage } from '../../src/db/queries.js';
import { vi } from 'vitest';

vi.mock('../../src/db/queries.js', () => ({
    saveMessage: vi.fn(),
}));

describe('WebSocket Handlers', () => {
    let mockWss, mockWs;

    beforeEach(() => {
        mockWss = { clients: new Set() };
        mockWs = { send: vi.fn(), readyState: 1 }; // Ensure `send` is mocked
        mockWss.clients.add(mockWs);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should save a new message and broadcast it to all clients', async () => {
        const data = { name: 'John', message: 'Hello, world!' };

        await handleNewMessage(mockWss, mockWs, data);

        expect(saveMessage).toHaveBeenCalledWith('John', 'Hello, world!', expect.any(Number));
        expect(mockWs.send).toHaveBeenCalledWith(
            expect.stringContaining('"type":"new_message"')
        );
    });

    it('should send an error message if saving the message fails', async () => {
        saveMessage.mockRejectedValue(new Error('Database error'));
        const data = { name: 'John', message: 'Hello, world!' };

        await handleNewMessage(mockWss, mockWs, data);

        expect(mockWs.send).toHaveBeenCalledWith(
            JSON.stringify({ type: 'error', message: 'Failed to process message.' })
        );
    });

    it('should send the user list to the requesting client', () => {
        mockWs.username = 'John';
        handleUserListRequest(mockWss, mockWs);

        expect(mockWs.send).toHaveBeenCalledWith(
            expect.stringContaining('"type":"users_list"')
        );
    });
});

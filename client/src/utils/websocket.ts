import { Message, WebSocketMessage } from '../types/websocket';

type MessageHandler = (message: WebSocketMessage) => void;
type WebSocketState = {
    ws: WebSocket | null;
    handlers: Set<MessageHandler>;
};

const createWebSocketState = (): WebSocketState => ({
    ws: null,
    handlers: new Set()
});

export const createWebSocket = (url: string, username: string): Promise<WebSocketState> => {
    const state = createWebSocketState();

    return new Promise((resolve, reject) => {
        const ws = new WebSocket(url);
        state.ws = ws;

        ws.onopen = () => {
            sendMessage(state, { type: 'new_user', name: username } as WebSocketMessage);
            resolve(state);
        };

        ws.onerror = reject;

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                state.handlers.forEach(handler => handler(message));
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };
    });
};

export const sendMessage = (state: WebSocketState, message: Partial<Message>): void => {
    if (state.ws?.readyState === WebSocket.OPEN) {
        state.ws.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not connected');
    }
};

export const addMessageHandler = (
    state: WebSocketState,
    handler: MessageHandler
): () => void => {
    state.handlers.add(handler);
    return () => state.handlers.delete(handler);
};

export const closeWebSocket = (state: WebSocketState): void => {
    if (state.ws?.readyState === WebSocket.OPEN) {
        state.ws.close();
    }
    state.handlers.clear();
};
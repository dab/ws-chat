export class DatabaseError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = 'DatabaseError';
        this.originalError = originalError;
    }
}

export class WebSocketError extends Error {
    constructor(message, code = 'WEBSOCKET_ERROR') {
        super(message);
        this.name = 'WebSocketError';
        this.code = code;
    }
}

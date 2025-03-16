import { WebSocketError } from '../../types/errors.js';

export class ErrorMother {
    static createWebSocketError(message = 'Invalid user data', code = 'INVALID_USER') {
        return new WebSocketError(message, code);
    }

    static createGenericError(message = 'Test error') {
        return new Error(message);
    }

    static createEmptyError() {
        return new Error();
    }

    static createErrorResponse(code = 'INTERNAL_ERROR', message = 'Internal server error') {
        return {
            type: 'error',
            code,
            message
        };
    }
} 
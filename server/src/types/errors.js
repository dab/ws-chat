export class ApplicationError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = this.constructor.name;
        this.status = options.status || 500;
        this.code = options.code || 'INTERNAL_ERROR';
        this.originalError = options.originalError;
    }

    toJSON() {
        return {
            error: this.name,
            message: this.message,
            code: this.code,
            status: this.status
        };
    }
}

export class DatabaseError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, { 
            status: 500,
            code: options.code || 'DATABASE_ERROR',
            originalError: options.originalError
        });
    }
}

export class WebSocketError extends ApplicationError {
    constructor(message, code = 'WEBSOCKET_ERROR') {
        super(message, { 
            status: 400,
            code
        });
    }
}

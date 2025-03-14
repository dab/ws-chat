import { vi } from 'vitest'

// Mock console methods
global.console = {
    ...console,
    error: vi.fn()
}

vi.mock('sqlite3', () => ({
    verbose: () => ({
        Database: vi.fn(() => ({
            run: vi.fn(),
            get: vi.fn(),
            all: vi.fn(),
            close: vi.fn()
        }))
    })
}))

// Mock database
vi.mock('../src/db.js', () => ({
    default: {
        run: vi.fn()
    }
}))

// Mock database module
vi.mock('@/db', () => ({
    default: {
        run: vi.fn((query, params, callback) => callback(null))
    }
}), { virtual: true })

// Mock console
console.error = vi.fn()

class MockWebSocket {
    static OPEN = 1
    static CLOSED = 3

    constructor() {
        this.readyState = MockWebSocket.OPEN
        this.send = vi.fn()
        this.close = vi.fn()
    }
}

global.WebSocket = MockWebSocket
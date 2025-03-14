import { describe, it, expect, beforeEach, vi } from 'vitest'
import { WebSocket } from 'ws'
import { handleNewUser, handleChatMessage, broadcastUserList } from './handlers.js'
import db from '@/db'

describe('WebSocket Handlers', () => {
    let wss
    let mockWs
    let mockClients

    beforeEach(() => {
        vi.clearAllMocks()

        // Setup WebSocket mocks
        mockClients = new Set()
        mockWs = {
            send: vi.fn(),
            readyState: WebSocket.OPEN
        }
        wss = {
            clients: mockClients
        }
        mockClients.add(mockWs)

        // Reset database mock
        vi.mocked(db.run).mockImplementation((query, params, callback) => {
            if (callback) callback(null)
        })
    })

    describe('handleNewUser', () => {
        it('should set username and broadcast user list', () => {
            const data = { name: 'testUser' }
            handleNewUser(wss, mockWs, data)
            
            expect(mockWs.username).toBe('testUser')
            expect(mockWs.send).toHaveBeenCalledWith(
                expect.stringContaining('"type":"users_list"')
            )
        })
    })

    describe('handleChatMessage', () => {
        it('should broadcast message to all clients', (done) => {
            const message = {
                name: 'testUser',
                message: 'test message'
            }
            
            // Override db.run mock for this test
            vi.mocked(db.run).mockImplementation((query, params, callback) => {
                // Execute callback asynchronously to simulate DB operation
                setTimeout(() => {
                    callback(null)
                    
                    try {
                        expect(mockWs.send).toHaveBeenCalledWith(
                            expect.stringContaining('test message')
                        )
                        done()
                    } catch (error) {
                        done(error)
                    }
                }, 0)
            })

            handleChatMessage(wss, message)
        })

        it('should handle database errors', (done) => {
            const message = {
                name: 'testUser',
                message: 'test message'
            }

            const error = new Error('DB Error')
            
            vi.mocked(db.run).mockImplementation((query, params, callback) => {
                setTimeout(() => {
                    callback(error)
                    
                    try {
                        expect(console.error).toHaveBeenCalledWith(
                            'Error saving message:',
                            error
                        )
                        expect(mockWs.send).not.toHaveBeenCalled()
                        done()
                    } catch (err) {
                        done(err)
                    }
                }, 0)
            })

            handleChatMessage(wss, message)
        })
    })

    describe('broadcastUserList', () => {
        it('should send user list to all clients', () => {
            mockWs.username = 'testUser'
            
            broadcastUserList(wss)
            
            expect(mockWs.send).toHaveBeenCalledWith(
                expect.stringContaining('"type":"users_list"')
            )
        })
    })
})
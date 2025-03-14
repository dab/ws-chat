import { WebSocket } from 'ws';

export interface Message {
    id?: number;
    name: string;
    message: string;
    timestamp: number; // Changed from Date to number for consistency
}

export interface WebSocketMessage {
    type: 'new_message' | 'users_list' | 'new_user';
    name?: string;
    message?: string;
    data?: Message;
    users?: string[];
}

export interface ExtendedWebSocket extends WebSocket {
    username?: string;
}
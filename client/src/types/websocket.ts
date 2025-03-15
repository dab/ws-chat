export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export type WebSocketMessage = {
    type: 'new_message' | 'users_list' | 'new_user' | 'error';
    data?: Message;
    users?: string[];
    name?: string;
    message?: string;
    code?: string;
};

export type WebSocketState = {
    status: WebSocketStatus;
    error?: Error;
};

export interface Message {
    id?: number;
    name: string;
    message: string;
    timestamp: number;
}

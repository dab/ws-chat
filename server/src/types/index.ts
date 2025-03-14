export interface Message {
    id?: number;
    name: string;
    message: string;
    timestamp: number;
}

export type WebSocketMessage = {
    type: 'new_message' | 'users_list' | 'new_user';
    data?: Message;
    users?: string[];
}
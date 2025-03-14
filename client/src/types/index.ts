export type Username = string;

export interface Message {
    id?: number;
    name: string;
    message: string;
    timestamp: number;
}

export interface WebSocketMessage {
    type: 'new_message' | 'users_list' | 'new_user';
    data?: Message;
    users?: string[];
    name?: string;
}

export interface ChatLayoutProps {
    messages: Message[];
    name: string;
    userList: string[];
    user: string;
    sendMessage: (message: string) => void;
}
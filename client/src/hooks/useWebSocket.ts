import { useEffect, useRef, useState, useCallback } from 'react';
import { Message, WebSocketMessage } from '../types';

interface WebSocketHookResult {
    isConnected: boolean;
    messages: Message[];
    userList: string[];
    sendMessage: (message: string) => void;
}

export const useWebSocket = (url: string, username?: string): WebSocketHookResult => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userList, setUserList] = useState<string[]>([]);
    const ws = useRef<WebSocket | null>(null);

    const handleWebSocketMessage = useCallback((event: MessageEvent) => {
        try {
            const message: WebSocketMessage = JSON.parse(event.data);

            if (message.type === 'users_list' && message.users) {
                setUserList(message.users);
            }
            
            if (message.type === 'new_message' && message.data) {
                const newMessage = message.data as Message;
                setMessages(prev => [...prev, newMessage]);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error parsing message:', error.message);
            }
        }
    }, []);

    useEffect(() => {
        if (!username) return;

        const socket = new WebSocket(url);
        ws.current = socket;

        socket.onopen = () => {
            setIsConnected(true);
            socket.send(JSON.stringify({ type: 'new_user', name: username }));
        };

        socket.onmessage = handleWebSocketMessage;
        socket.onclose = () => setIsConnected(false);

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [url, username, handleWebSocketMessage]);

    const sendMessage = useCallback((message: string) => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN || !username) {
            return;
        }

        ws.current.send(JSON.stringify({
            type: 'new_message', // Add message type
            name: username,
            message,
            timestamp: Date.now()
        }));
    }, [username]);

    return {
        isConnected,
        messages,
        userList,
        sendMessage
    };
};
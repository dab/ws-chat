import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketMessage, WebSocketState, Message } from '../types/websocket';

export const useWebSocket = (url: string, username?: string) => {
    const [state, setState] = useState<WebSocketState>({ status: 'disconnected' });
    const [messages, setMessages] = useState<Message[]>([]);
    const [userList, setUserList] = useState<string[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const isWindowFocused = useRef(true);

    useEffect(() => {
        const handleFocus = () => isWindowFocused.current = true;
        const handleBlur = () => isWindowFocused.current = false;
        
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
        
        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    const handleMessage = useCallback((message: WebSocketMessage) => {
        switch (message.type) {
            case 'users_list':
                if (message.users) setUserList(message.users);
                break;
            case 'new_message':
                if (message.data && 'name' in message.data) {
                    setMessages(prev => [...prev, message.data as Message]);
                    if (!isWindowFocused.current && 
                        Notification.permission === 'granted' && 
                        message.data.name !== username) {
                        new Notification(`New message from ${message.data.name}`, {
                            body: message.data.message
                        });
                    }
                }
                break;
            case 'error':
                setState({ status: 'error', error: new Error(message.message) });
                break;
        }
    }, [username]);

    const connect = useCallback(() => {
        if (!username) return;

        try {
            setState({ status: 'connecting' });
            const ws = new WebSocket(url);
            wsRef.current = ws;

            ws.onopen = () => {
                setState({ status: 'connected' });
                ws.send(JSON.stringify({ type: 'new_user', name: username }));
            };

            ws.onmessage = (event) => {
                try {
                    handleMessage(JSON.parse(event.data));
                } catch (err) {
                    console.error('Failed to parse message:', err);
                }
            };

            ws.onclose = () => setState({ status: 'disconnected' });
            ws.onerror = () => setState({ 
                status: 'error', 
                error: new Error('WebSocket connection failed') 
            });

        } catch (err) {
            setState({ status: 'error', error: err instanceof Error ? err : new Error('Failed to connect') });
        }
    }, [url, username, handleMessage]);

    const sendMessage = useCallback((message: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !username) {
            return false;
        }

        wsRef.current.send(JSON.stringify({
            type: 'new_message',
            name: username,
            message,
            timestamp: Date.now()
        }));
        return true;
    }, [username]);

    useEffect(() => {
        connect();
        return () => wsRef.current?.close();
    }, [connect]);

    return {
        state,
        messages,
        userList,
        sendMessage
    };
};
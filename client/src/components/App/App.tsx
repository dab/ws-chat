import { useEffect, useState, useRef } from 'react';
import { ChatLayout } from '../Chat/Chat';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Message } from '../../types/websocket';
import './App.css';

const WS_URL = 'ws://localhost:3000';
const API_URL = 'http://localhost:3000';

export default function App() {
    const [username, setUsername] = useState<string>();
    const [history, setHistory] = useState<Message[]>([]);
    const hasPrompted = useRef(false);
    
    const { 
        state, 
        messages, 
        userList, 
        sendMessage 
    } = useWebSocket(WS_URL, username);

    useEffect(() => {
        if (!username && !hasPrompted.current) {
            hasPrompted.current = true;
            const name = prompt('Enter your username:');
            if (name?.trim()) {
                setUsername(name.trim());
            }
        }
    }, []);
    useEffect(() => {
        fetch(`${API_URL}/api/messages`)
            .then(res => res.json())
            .then(data => Array.isArray(data) && setHistory(data))
            .catch(console.error);
    }, []);

    if (!username) {
        return <div>Waiting for username...</div>;
    }

    if (state.status === 'error') {
        return <div>Error: {state.error?.message}</div>;
    }

    if (state.status !== 'connected') {
        return <div>Connecting to chat server...</div>;
    }

    return (
        <ChatLayout
            messages={[...history, ...messages]}
            username={username}
            userList={userList}
            onSendMessage={sendMessage}
        />
    );
}

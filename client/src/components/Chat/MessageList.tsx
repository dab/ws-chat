import { FC, useEffect, useRef } from 'react';
import { Message } from '../../types/websocket';

interface MessageListProps {
    messages: Message[];
    currentUser: string;
}

export const MessageList: FC<MessageListProps> = ({ messages, currentUser }) => {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-messages">
            {messages.map((msg) => (
                <div 
                    key={`${msg.timestamp}-${msg.name}`}
                    className={`chat-message ${msg.name === currentUser ? 'self' : ''}`}
                >
                    <strong>{msg.name}:</strong> {msg.message}
                </div>
            ))}
            <div ref={endRef} />
        </div>
    );
};

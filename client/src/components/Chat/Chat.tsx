import { FC } from "react";
import { Message } from '../../types/websocket';
import { UserList } from "../UserList/UserList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface ChatLayoutProps {
    messages: Message[];
    username: string;  // changed from name
    userList: string[];
    onSendMessage: (message: string) => void;  // changed from sendMessage
}

export const ChatLayout: FC<ChatLayoutProps> = ({ 
    messages,
    username,
    userList,
    onSendMessage
}) => {
    return (
        <>
            <div className="chat-layout">
                <MessageList 
                    messages={messages} 
                    currentUser={username} 
                />
                <MessageInput 
                    onSend={onSendMessage} 
                    username={username} 
                />
            </div>
            <UserList 
                userList={userList} 
                user={username} 
            />
        </>
    );
};



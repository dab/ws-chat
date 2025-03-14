import { useEffect, useRef } from "react"
import { Message } from "./App"
import { UserList } from "./UserList"

type ChatLayoutProps = {
    messages?: Message[];
    name?: string;
    userList: string[] | [];
    socket: WebSocket;
    user: string;
};

export const ChatLayout = ({ messages = [], name, socket, userList, user }: ChatLayoutProps) => {
    const chatEndRef = useRef<null | HTMLDivElement>(null)

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const onSubmit = (message: string) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                name: name,
                message,
                timestamp: Date.now()
            }));
        } else {
            console.error('WebSocket is not connected')
        }
    };
    
    return (
        <>
            <div className="chat-layout">
                <div className="chat-messages">
                    {messages?.map((msg) => msg && (
                        <div 
                            key={msg.timestamp} 
                            className={`chat-message ${msg.name === name ? 'self' : ''}`}
                        >
                            <strong>{msg.name}:</strong> {msg.message}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <div className="chat-input">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        const textarea = e.currentTarget.elements.namedItem('newMessage') as HTMLTextAreaElement
                        if (textarea.value.trim()) {
                          onSubmit(textarea.value)
                          textarea.value = ''
                        }
                      }}>
                      <label htmlFor="new-message">Press <strong>Enter</strong> to send</label>
          
                        <textarea 
                          name="newMessage" 
                          id="new-message" 
                          placeholder={`Hello ${user}! Enter your message here`}
                          autoFocus
                          onKeyUp={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              e.currentTarget.form?.requestSubmit();
                            }
                          }}
                        />
                      </form>
                </div>
            </div>
            <UserList userList={userList} user={user} />
        </>
    );
};



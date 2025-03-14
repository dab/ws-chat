import { useEffect, useRef, useState } from 'react'

import { ChatLayout } from './Chat'
import './App.css'

const WS_SERVER = 'ws://localhost:3000'
const API_SERVER = 'http://localhost:3000'

type Username = string
export interface Message  {
  name?: Username
  message: string
  timestamp: number
}

function App() {
  const [username, setUsername] = useState<Username>()
  const [messages, setMessages] = useState<Message[]>([])
  const [userList, setUserList] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([]);

  const ws = useRef<{ socket: WebSocket | null }>({ socket: null });
  const promptShown = useRef(false)

  useEffect(() => {
    if (!username && !promptShown.current) {
      promptShown.current = true
      const usernamePrompt = prompt('Enter your username:') as Username
      setUsername(usernamePrompt)
    }

        fetch(API_SERVER + '/api/messages')
          .then(response => response.json())
          .then(data => {
            if (Array.isArray(data)) {
              setChatLog(data);
            }
          })
          .catch(error => console.error('Error fetching messages:', error));
  }, [])

  useEffect(() => {
    if (username && (!ws.current.socket || ws.current.socket.readyState === WebSocket.CLOSED)) {
      ws.current.socket = new WebSocket(WS_SERVER)

      ws.current.socket.onopen = () => {
        username && ws.current.socket!.send(JSON.stringify({ name: username, type: 'new_user' }));
        setIsConnected(true);
      }

      ws.current.socket.onclose = () => {
        setIsConnected(false);
      }

      ws.current.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      }

      ws.current.socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.type === 'users_list') {
            setUserList(message.users);
        }
        if (message.data.type && message.data.type === 'new_message') {
            setMessages((prevMessages) => {

              if (!document.hasFocus()) {
              // Create notification if browser supports it
              if (Notification.permission === "granted") {
                new Notification("New Message", {
                body: `${message.data.name}: ${message.data.message}`,
                });
              } else if (Notification.permission !== "denied") {
                Notification.requestPermission();
              }
              }
              return [...prevMessages, message.data];
            });
        }
      }
    }

    return () => {
      if (ws.current.socket?.readyState === WebSocket.OPEN) {
        ws.current.socket?.close()
      }
    };
  }, [username])

  return (
    <>
      {isConnected && username ? (
        <ChatLayout 
          messages={chatLog.concat(messages)} 
          name={username} 
          socket={ws.current.socket!} 
          userList={userList}
          user={username}
        />
      ) : (
        <div>Connecting to server...</div>
      )}
    </>
  )
}

export default App

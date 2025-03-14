import { useEffect, useRef, useState } from 'react'
import { ChatLayout } from '../Chat/Chat'
import { useWebSocket } from '../../hooks/useWebSocket'
import { Message, Username } from '../../types'
import './App.css'

const WS_SERVER = 'ws://localhost:3000'
const API_SERVER = 'http://localhost:3000'

function App() {
  const [username, setUsername] = useState<Username>()
  const [chatLog, setChatLog] = useState<Message[]>([])
  const promptShown = useRef(false)

  const { 
    isConnected, 
    messages: wsMessages, 
    userList, 
    sendMessage 
  } = useWebSocket(WS_SERVER, username)

  // Handle initial username prompt
  useEffect(() => {
    if (!username && !promptShown.current) {
      promptShown.current = true
      const usernamePrompt = prompt('Enter your username:') as Username
      setUsername(usernamePrompt)
    }
  }, [])

  // Fetch message history
  useEffect(() => {
    fetch(API_SERVER + '/api/messages')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setChatLog(data)
        }
      })
      .catch(error => console.error('Error fetching messages:', error))
  }, [])

  return (
    <>
      {isConnected && username ? (
        <ChatLayout 
          messages={chatLog.concat(wsMessages)} 
          name={username}
          sendMessage={sendMessage}
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

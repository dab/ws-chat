# Real-time WebSocket Chat Application

A real-time chat application built with WebSocket protocol, featuring user presence, message history, and desktop notifications.

## Technologies Used

### Backend
- Node.js with Express.js
- WebSocket (ws) for real-time communication
- SQLite3 for message persistence
- CORS for handling cross-origin requests

### Frontend
- React 19 with TypeScript
- Vite.js for development and building
- TailwindCSS for styling
- Browser Notifications API

## Features
- Real-time messaging
- Message persistence
- User presence detection
- Desktop notifications for new messages
- Message history on connection
- Auto-scroll to latest messages

## Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ws-chat
```

2. Install dependencies for both backend and frontend:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

3. Start the development servers:
```bash
# Terminal 1 - Start backend server
npm run dev  # Runs on http://localhost:3000

# Terminal 2 - Start frontend development server
cd client
npm run dev  # Runs on http://localhost:5173
```

## Known Issues and Edge Cases Not Handled Yet. Plan for future iterations.

1. **Connection Management**
   - No automatic reconnection on connection loss
   - No handling of message delivery confirmation
   - No offline message queue

2. **User Management**
   - No user authentication
   - No duplicate username prevention
   - No user typing indicators
   - No user status (away, busy, etc.)

3. **Message Handling**
   - No message editing or deletion
   - No file attachments support
   - No message formatting (markdown, etc.)
   - No message delivery status
   - No read receipts

4. **Performance**
   - No message pagination
   - No message lazy loading
   - No connection pooling for database
   - No message caching

5. **Security**
   - No input sanitization
   - No rate limiting
   - No message encryption
   - No XSS protection


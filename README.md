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
git clone https://github.com/dab/ws-chat.git
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
cd server
npm run dev  # Runs on http://localhost:3000

# Terminal 2 - Start frontend development server
cd client
npm run dev  # Runs on http://localhost:5173
```

## Plan for future development iterations.

1. **Connection Management**
   - Implement automatic reconnection on connection loss
   - Add message delivery confirmation
   - Create offline message queue

2. **User Management**
   - Implement user authentication
   - Add duplicate username prevention
   - Enable user typing indicators
   - Add user status features (away, busy, etc.)

3. **Message Handling**
   - Add message editing and deletion
   - Implement file attachments support
   - Enable message formatting (markdown, etc.)
   - Add message delivery status
   - Implement read receipts

4. **Performance**
   - Implement message pagination
   - Add message lazy loading


5. **Security**
   - Implement input sanitization
   - Add rate limiting
   - Enable message encryption
   - Implement XSS protection


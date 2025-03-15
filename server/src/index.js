import express from "express";
import cors from "cors";
import { createServer } from "http";
import { setupWebSocket } from "./websocket/index.js";
import { connectToDatabase } from "./db/index.js";
import { setupRoutes } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        await connectToDatabase();
        setupWebSocket(server);
        
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

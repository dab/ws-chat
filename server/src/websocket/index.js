import { WebSocketServer } from "ws";
import { messageHandler } from "./handlers/index.js";
import { handleUserDisconnect } from "./handlers/userHandlers.js";

export const setupWebSocket = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        ws.isAlive = true;

        ws.on("pong", () => {
            ws.isAlive = true;
        });

        ws.on("message", (data) => {
            try {
                const message = JSON.parse(data);
                messageHandler(wss, ws, message);
            } catch (error) {
                console.error("WebSocket message error:", error);
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Invalid message format"
                }));
            }
        });

        ws.on("close", () => {
            handleUserDisconnect(wss, ws);
        });
    });

    // Connection health check
    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (!ws.isAlive) {
                handleUserDisconnect(wss, ws);
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on("close", () => {
        clearInterval(interval);
    });

    return wss;
};
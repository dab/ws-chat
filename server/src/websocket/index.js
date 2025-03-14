const WebSocket = require("ws");
const { handleNewUser, handleChatMessage, broadcastUserList } = require("./handlers");

const setupWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });

    const handleMessage = (ws) => (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === "new_user") {
                handleNewUser(wss, ws, data);
            }
            
            if (data.message) {
                handleChatMessage(wss, data);
            }
        } catch (error) {
            console.error("Error handling message:", error);
        }
    };

    const handleConnection = (ws) => {
        ws.on("message", handleMessage(ws));
        ws.on("close", () => broadcastUserList(wss));
        ws.on("error", (error) => console.error("WebSocket error:", error));
    };

    wss.on("connection", handleConnection);

    return wss;
};

module.exports = setupWebSocket;
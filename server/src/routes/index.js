import { getMessages } from "../db/queries.js";

export const setupRoutes = (app) => {
    app.get("/api/messages", async (req, res, next) => {
        try {
            const messages = await getMessages();
            res.json(messages);
        } catch (error) {
            next(error);
        }
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

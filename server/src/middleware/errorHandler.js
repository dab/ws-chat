import { ApplicationError } from "../types/errors.js";

export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    if (err instanceof ApplicationError) {
        return res.status(err.status).json(err.toJSON());
    }

    res.status(500).json({
        error: "InternalServerError",
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        status: 500
    });
};

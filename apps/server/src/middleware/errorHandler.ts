import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
	constructor(
		public statusCode: number,
		message: string,
		public isOperational = true,
	) {
		super(message);
		Object.setPrototypeOf(this, AppError.prototype);
	}
}

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// Zod validation errors
	if (err instanceof ZodError) {
		return res.status(400).json({
			status: "error",
			message: "Validation error",
			errors: err.errors,
		});
	}

	// Custom application errors
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			status: "error",
			message: err.message,
		});
	}

	// Database errors
	if (err.message.includes("duplicate key")) {
		return res.status(409).json({
			status: "error",
			message: "Resource already exists",
		});
	}

	// Default error
	console.error("❌ Error:", err);
	return res.status(500).json({
		status: "error",
		message:
			process.env.NODE_ENV === "production"
				? "Internal server error"
				: err.message,
	});
};

export const notFoundHandler = (req: Request, res: Response) => {
	res.status(404).json({
		status: "error",
		message: `Route ${req.originalUrl} not found`,
	});
};

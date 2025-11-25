import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import pinoHttp from "pino-http";
import xss from "xss-clean";
import { corsOptions } from "./config/cors.js";
import logger from "./config/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import healthRouter from "./routes/health.js";

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration with origin validation
// Supports multiple origins and strict security policies
app.use(cors(corsOptions));

// Body parsing middleware with size limits
// Prevents DoS attacks via large payloads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Data sanitization against XSS
// Cleans user input from malicious HTML/JS code
app.use(xss());

// Data sanitization against NoSQL injection
// Removes prohibited characters from user input
app.use(mongoSanitize());

// Compression middleware
app.use(compression());

// HTTP request logging with Pino
// Provides structured logging with automatic request correlation
if (process.env.NODE_ENV !== "test") {
	app.use(
		pinoHttp({
			logger,
			// Customize HTTP log serialization
			customLogLevel: (req, res, err) => {
				if (res.statusCode >= 500 || err) return "error";
				if (res.statusCode >= 400) return "warn";
				return "info";
			},
			// Customize success message
			customSuccessMessage: (req, res) => {
				return `${req.method} ${req.url} completed`;
			},
			// Customize error message
			customErrorMessage: (req, res, err) => {
				return `${req.method} ${req.url} failed: ${err.message}`;
			},
		}),
	);
}

// Rate limiting - apply to all requests
// Prevents abuse and brute force attacks
app.use("/api", apiLimiter);

// Routes
app.use("/api/v1/health", healthRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;

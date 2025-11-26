import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { corsOptions } from "./config/cors.js";
import logger from "./config/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import authRouter from "./routes/auth.js";
import healthRouter from "./routes/health.js";
import maintenanceRouter from "./routes/maintenance.js";
import vendorRouter from "./routes/vendor.js";

// Load environment variables
dotenv.config();

// App version for health checks
export const APP_VERSION = "1.0.0";

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

// Cookie parsing middleware for JWT auth
app.use(cookieParser());

// Compression middleware
app.use(compression());

// HTTP request logging with Pino
// Provides structured logging with automatic request correlation
if (process.env.NODE_ENV !== "test") {
	app.use(
		pinoHttp({
			logger,
			// Customize HTTP log serialization
			customLogLevel: (_req, res, err) => {
				if (res.statusCode >= 500 || err) return "error";
				if (res.statusCode >= 400) return "warn";
				return "info";
			},
			// Customize success message
			customSuccessMessage: (req, _res) => {
				return `${req.method} ${req.url} completed`;
			},
			// Customize error message
			customErrorMessage: (req, _res, err) => {
				return `${req.method} ${req.url} failed: ${err.message}`;
			},
		}),
	);
}

// Rate limiting - apply to all requests
// Prevents abuse and brute force attacks
app.use("/api", apiLimiter);

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/maintenance", maintenanceRouter);
app.use("/api/v1/vendors", vendorRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;

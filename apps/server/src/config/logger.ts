import pino from "pino";

/**
 * Centralized logger configuration using Pino
 * Provides structured logging with different levels for dev/prod
 *
 * In development: Pretty-printed, colorized logs
 * In production: JSON-formatted logs for log aggregation tools
 */

const isDevelopment = process.env.NODE_ENV !== "production";
const isTest = process.env.NODE_ENV === "test";

const logger = pino({
	level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
	// Pretty print in development for better readability
	transport: isDevelopment
		? {
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "HH:MM:ss Z",
					ignore: "pid,hostname",
				},
			}
		: undefined,
	// Disable logging in test environment
	enabled: !isTest,
	// Add timestamp to logs
	timestamp: pino.stdTimeFunctions.isoTime,
	// Format error objects properly
	formatters: {
		level: (label) => {
			return { level: label };
		},
	},
});

export default logger;

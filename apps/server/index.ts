import app from "./src/app.js";
import logger from "./src/config/logger.js";
import prisma from "./src/config/prisma.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
	logger.info(`Server running on http://localhost:${PORT}`);
	logger.info(`Health check: http://localhost:${PORT}/api/v1/health`);
	logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
// This ensures that we gracefully handle termination signals,
// allowing the server to finish pending requests and close database connections
// before the process exits. It's crucial for preventing data corruption and
// ensuring a clean shutdown in production environments.
const gracefulShutdown = async (signal: string) => {
	logger.info(`${signal} received. Starting graceful shutdown...`);

	server.close(async () => {
		logger.info("HTTP server closed");

		try {
			await prisma.$disconnect();
			logger.info("Database connections closed");
			process.exit(0);
		} catch (error) {
			logger.error({ error }, "Error during shutdown");
			process.exit(1);
		}
	});

	// Force shutdown after 10 seconds
	setTimeout(() => {
		logger.error("Forced shutdown after timeout");
		process.exit(1);
	}, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

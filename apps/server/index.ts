import app from "./src/app.js";
import prisma from "./src/config/prisma.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
	console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
	console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
// This ensures that we gracefully handle termination signals,
// allowing the server to finish pending requests and close database connections
// before the process exits. It's crucial for preventing data corruption and
// ensuring a clean shutdown in production environments.
const gracefulShutdown = async (signal: string) => {
	console.log(`\n${signal} received. Starting graceful shutdown...`);

	server.close(async () => {
		console.log("HTTP server closed");

		try {
			await prisma.$disconnect();
			console.log("Database connections closed");
			process.exit(0);
		} catch (error) {
			console.error("Error during shutdown:", error);
			process.exit(1);
		}
	});

	// Force shutdown after 10 seconds
	setTimeout(() => {
		console.error("Forced shutdown after timeout");
		process.exit(1);
	}, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

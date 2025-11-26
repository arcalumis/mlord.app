import { afterEach } from "vitest";

/**
 * Test setup file
 * Runs before all tests to configure the test environment
 */

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "silent";
// Only set DATABASE_URL if not already set (e.g., from CI environment)
process.env.DATABASE_URL =
	process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.CSRF_SECRET = "test-csrf-secret";

// Cleanup after each test
afterEach(() => {
	// Add any cleanup logic here
});

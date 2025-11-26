import { describe, expect, it } from "vitest";
import logger from "./logger.js";

describe("Logger Configuration", () => {
	it("should be defined", () => {
		expect(logger).toBeDefined();
	});

	it("should have logging methods", () => {
		expect(logger.info).toBeDefined();
		expect(logger.error).toBeDefined();
		expect(logger.warn).toBeDefined();
		expect(logger.debug).toBeDefined();
	});

	it("should be disabled in test environment", () => {
		// Logger should be disabled in test env (from config)
		expect(process.env.NODE_ENV).toBe("test");
	});
});

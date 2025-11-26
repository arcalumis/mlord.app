import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("Health Check API", () => {
	describe("GET /api/v1/health", () => {
		it("should return 200 and health status", async () => {
			const response = await request(app)
				.get("/api/v1/health")
				.expect("Content-Type", /json/)
				.expect(200);

			expect(response.body).toHaveProperty("status");
			expect(response.body).toHaveProperty("timestamp");
			expect(response.body.status).toBe("ok");
		});

		it("should include database status", async () => {
			const response = await request(app).get("/api/v1/health");

			expect(response.body).toHaveProperty("database");
			expect(["connected", "disconnected"]).toContain(response.body.database);
		});

		it("should include ISO timestamp", async () => {
			const response = await request(app).get("/api/v1/health");

			const timestamp = response.body.timestamp;
			expect(timestamp).toBeDefined();
			// Check if it's a valid ISO 8601 date string
			expect(new Date(timestamp).toISOString()).toBe(timestamp);
		});
	});
});

import { Router } from "express";
import { getHealth } from "../services/healthService.js";

const router = Router();

router.get("/", async (_req, res) => {
	const health = await getHealth();
	if (health.db === "error") {
		res.status(503).json({
			status: "error",
			timestamp: new Date().toISOString(),
			database: "disconnected",
		});
		return;
	}

	res.json({
		status: "ok",
		timestamp: new Date().toISOString(),
		database: "connected",
	});
});

export default router;
// test

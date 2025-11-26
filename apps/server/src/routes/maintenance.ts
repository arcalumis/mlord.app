import type { Request, Response } from "express";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
	createMaintenanceRequest,
	deleteMaintenanceRequest,
	getMaintenanceRequestById,
	getMaintenanceRequests,
	updateMaintenanceRequest,
} from "../services/maintenanceService";
import { getAILogs } from "../services/openaiService";

const router = Router();

// All maintenance routes require authentication
router.use(authenticateToken);

/**
 * POST /api/v1/maintenance/requests
 * Create a new maintenance request with AI classification
 */
router.post("/requests", async (req: Request, res: Response): Promise<void> => {
	try {
		const { title, description, propertyAddress, category, priority } =
			req.body;

		if (!title || !description || !propertyAddress) {
			res.status(400).json({
				error: "Bad Request",
				message: "Title, description, and property address are required",
			});
			return;
		}

		const result = await createMaintenanceRequest({
			title,
			description,
			propertyAddress,
			category,
			priority,
			userId: req.user?.id,
		});

		res.status(201).json({
			success: true,
			data: result.request,
			aiClassification: result.aiClassification,
		});
	} catch (error) {
		console.error("Error creating maintenance request:", error);
		res.status(500).json({
			error: "Internal Server Error",
			message: "Failed to create maintenance request",
		});
	}
});

/**
 * GET /api/v1/maintenance/requests
 * Get all maintenance requests with optional filters
 */
router.get("/requests", async (req: Request, res: Response): Promise<void> => {
	try {
		const { status, category, priority, vendorId, page, limit } = req.query;

		const result = await getMaintenanceRequests(
			{
				status: status as string | undefined,
				category: category as string | undefined,
				priority: priority as string | undefined,
				assignedVendorId: vendorId as string | undefined,
			},
			page ? Number.parseInt(page as string, 10) : 1,
			limit ? Number.parseInt(limit as string, 10) : 20,
		);

		res.json({
			success: true,
			data: result.requests,
			pagination: result.pagination,
		});
	} catch (error) {
		console.error("Error fetching maintenance requests:", error);
		res.status(500).json({
			error: "Internal Server Error",
			message: "Failed to fetch maintenance requests",
		});
	}
});

/**
 * GET /api/v1/maintenance/requests/:id
 * Get a single maintenance request by ID
 */
router.get(
	"/requests/:id",
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			const request = await getMaintenanceRequestById(id);

			if (!request) {
				res.status(404).json({
					error: "Not Found",
					message: "Maintenance request not found",
				});
				return;
			}

			res.json({
				success: true,
				data: request,
			});
		} catch (error) {
			console.error("Error fetching maintenance request:", error);
			res.status(500).json({
				error: "Internal Server Error",
				message: "Failed to fetch maintenance request",
			});
		}
	},
);

/**
 * PUT /api/v1/maintenance/requests/:id
 * Update a maintenance request
 */
router.put(
	"/requests/:id",
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;
			const updateData = req.body;

			const request = await updateMaintenanceRequest(id, updateData);

			res.json({
				success: true,
				data: request,
			});
		} catch (error) {
			console.error("Error updating maintenance request:", error);
			res.status(500).json({
				error: "Internal Server Error",
				message: "Failed to update maintenance request",
			});
		}
	},
);

/**
 * DELETE /api/v1/maintenance/requests/:id
 * Delete a maintenance request
 */
router.delete(
	"/requests/:id",
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			await deleteMaintenanceRequest(id);

			res.json({
				success: true,
				message: "Maintenance request deleted successfully",
			});
		} catch (error) {
			console.error("Error deleting maintenance request:", error);
			res.status(500).json({
				error: "Internal Server Error",
				message: "Failed to delete maintenance request",
			});
		}
	},
);

/**
 * GET /api/v1/maintenance/ai-logs
 * Get recent AI classification logs
 */
router.get("/ai-logs", async (_req: Request, res: Response): Promise<void> => {
	try {
		const logs = getAILogs();

		res.json({
			success: true,
			data: logs,
		});
	} catch (error) {
		console.error("Error fetching AI logs:", error);
		res.status(500).json({
			error: "Internal Server Error",
			message: "Failed to fetch AI logs",
		});
	}
});

export default router;

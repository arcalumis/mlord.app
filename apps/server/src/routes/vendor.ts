import type { Request, Response } from "express";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
	createVendor,
	deleteVendor,
	getVendorById,
	getVendors,
	updateVendor,
} from "../services/vendorService";

const router = Router();

// All vendor routes require authentication
router.use(authenticateToken);

/**
 * POST /api/v1/vendors
 * Create a new vendor
 */
router.post("/", async (req: Request, res: Response): Promise<void> => {
	try {
		const {
			name,
			category,
			contactName,
			email,
			phone,
			address,
			rating,
			notes,
		} = req.body;

		if (!name || !category || !phone) {
			res.status(400).json({
				error: "Bad Request",
				message: "Name, category, and phone are required",
			});
			return;
		}

		const vendor = await createVendor({
			name,
			category,
			contactName,
			email,
			phone,
			address,
			rating,
			notes,
		});

		res.status(201).json({
			success: true,
			data: vendor,
		});
	} catch (error) {
		console.error("Error creating vendor:", error);
		res.status(500).json({
			error: "Internal Server Error",
			message: "Failed to create vendor",
		});
	}
});

/**
 * GET /api/v1/vendors
 * Get all vendors with optional filters
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
	try {
		const { category, isActive, search, page, limit } = req.query;

		const result = await getVendors(
			{
				category: category as string | undefined,
				isActive:
					isActive === "true" ? true : isActive === "false" ? false : undefined,
				search: search as string | undefined,
			},
			page ? Number.parseInt(page as string, 10) : 1,
			limit ? Number.parseInt(limit as string, 10) : 20,
		);

		res.json({
			success: true,
			data: result.vendors,
			pagination: result.pagination,
		});
	} catch (error) {
		console.error("Error fetching vendors:", error);
		res.status(500).json({
			error: "Internal Server Error",
			message: "Failed to fetch vendors",
		});
	}
});

/**
 * GET /api/v1/vendors/:id
 * Get a single vendor by ID
 */
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;

		const vendor = await getVendorById(id);

		if (!vendor) {
			res.status(404).json({
				error: "Not Found",
				message: "Vendor not found",
			});
			return;
		}

		res.json({
			success: true,
			data: vendor,
		});
	} catch (error) {
		console.error("Error fetching vendor:", error);
		res.status(500).json({
			error: "Internal Server Error",
			message: "Failed to fetch vendor",
		});
	}
});

/**
 * PUT /api/v1/vendors/:id
 * Update a vendor
 */
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		const vendor = await updateVendor(id, updateData);

		res.json({
			success: true,
			data: vendor,
		});
	} catch (error) {
		console.error("Error updating vendor:", error);
		res.status(500).json({
			error: "Internal Server Error",
			message: "Failed to update vendor",
		});
	}
});

/**
 * DELETE /api/v1/vendors/:id
 * Delete a vendor
 */
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;

		await deleteVendor(id);

		res.json({
			success: true,
			message: "Vendor deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting vendor:", error);
		res.status(500).json({
			error: "Internal Server Error",
			message: "Failed to delete vendor",
		});
	}
});

export default router;

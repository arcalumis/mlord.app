import type {
	MaintenanceCategory,
	MaintenanceStatus,
	Priority,
} from "@prisma/client";
import prisma from "../config/prisma";
import { classifyMaintenanceRequest } from "./openaiService";

export interface CreateMaintenanceRequestInput {
	title: string;
	description: string;
	propertyAddress: string;
	category?: MaintenanceCategory;
	priority?: Priority;
	userId?: string;
}

export interface MaintenanceRequestFilters {
	status?: MaintenanceStatus;
	category?: MaintenanceCategory;
	priority?: Priority;
	assignedVendorId?: string;
}

/**
 * Creates a new maintenance request and triggers AI classification
 */
export async function createMaintenanceRequest(
	input: CreateMaintenanceRequestInput,
) {
	// First, get available vendors for the AI to consider
	const vendors = await prisma.vendor.findMany({
		where: { isActive: true },
		select: {
			id: true,
			name: true,
			category: true,
			rating: true,
		},
	});

	// Use AI to classify the request
	const aiResult = await classifyMaintenanceRequest(
		input.title,
		input.description,
		input.propertyAddress,
		vendors,
	);

	// Create the request with AI suggestions
	const request = await prisma.maintenanceRequest.create({
		data: {
			title: input.title,
			description: input.description,
			propertyAddress: input.propertyAddress,
			category: input.category ?? aiResult.category,
			priority: input.priority ?? aiResult.priority,
			aiCategory: aiResult.category,
			aiPriority: aiResult.priority,
			assignedVendorId: aiResult.vendorId,
			userId: input.userId,
		},
		include: {
			assignedVendor: true,
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});

	return {
		request,
		aiClassification: {
			category: aiResult.category,
			priority: aiResult.priority,
			vendorId: aiResult.vendorId,
			reasoning: aiResult.reasoning,
			confidence: aiResult.confidence,
		},
	};
}

/**
 * Get all maintenance requests with optional filters
 */
export async function getMaintenanceRequests(
	filters: MaintenanceRequestFilters = {},
	page = 1,
	limit = 20,
) {
	const where: Record<string, unknown> = {};

	if (filters.status) where.status = filters.status;
	if (filters.category) where.category = filters.category;
	if (filters.priority) where.priority = filters.priority;
	if (filters.assignedVendorId)
		where.assignedVendorId = filters.assignedVendorId;

	const [requests, total] = await Promise.all([
		prisma.maintenanceRequest.findMany({
			where,
			include: {
				assignedVendor: true,
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
			skip: (page - 1) * limit,
			take: limit,
		}),
		prisma.maintenanceRequest.count({ where }),
	]);

	return {
		requests,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
}

/**
 * Get a single maintenance request by ID
 */
export async function getMaintenanceRequestById(id: string) {
	return prisma.maintenanceRequest.findUnique({
		where: { id },
		include: {
			assignedVendor: true,
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});
}

/**
 * Update a maintenance request
 */
export async function updateMaintenanceRequest(
	id: string,
	data: {
		title?: string;
		description?: string;
		category?: MaintenanceCategory;
		priority?: Priority;
		status?: MaintenanceStatus;
		assignedVendorId?: string | null;
		estimatedCost?: number;
		actualCost?: number;
		scheduledDate?: Date;
		completedDate?: Date;
	},
) {
	return prisma.maintenanceRequest.update({
		where: { id },
		data,
		include: {
			assignedVendor: true,
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});
}

/**
 * Delete a maintenance request
 */
export async function deleteMaintenanceRequest(id: string) {
	return prisma.maintenanceRequest.delete({
		where: { id },
	});
}

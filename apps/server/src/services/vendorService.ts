import type { MaintenanceCategory } from "@prisma/client";
import prisma from "../config/prisma";

export interface CreateVendorInput {
	name: string;
	category: MaintenanceCategory;
	contactName?: string;
	email?: string;
	phone: string;
	address?: string;
	rating?: number;
	notes?: string;
}

export interface UpdateVendorInput {
	name?: string;
	category?: MaintenanceCategory;
	contactName?: string;
	email?: string;
	phone?: string;
	address?: string;
	rating?: number;
	notes?: string;
	isActive?: boolean;
}

export interface VendorFilters {
	category?: MaintenanceCategory;
	isActive?: boolean;
	search?: string;
}

/**
 * Create a new vendor
 */
export async function createVendor(input: CreateVendorInput) {
	return prisma.vendor.create({
		data: input,
	});
}

/**
 * Get all vendors with optional filters
 */
export async function getVendors(
	filters: VendorFilters = {},
	page = 1,
	limit = 20,
) {
	const where: Record<string, unknown> = {};

	if (filters.category) where.category = filters.category;
	if (filters.isActive !== undefined) where.isActive = filters.isActive;
	if (filters.search) {
		where.OR = [
			{ name: { contains: filters.search, mode: "insensitive" } },
			{ contactName: { contains: filters.search, mode: "insensitive" } },
			{ email: { contains: filters.search, mode: "insensitive" } },
		];
	}

	const [vendors, total] = await Promise.all([
		prisma.vendor.findMany({
			where,
			orderBy: { name: "asc" },
			skip: (page - 1) * limit,
			take: limit,
		}),
		prisma.vendor.count({ where }),
	]);

	return {
		vendors,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
}

/**
 * Get a single vendor by ID
 */
export async function getVendorById(id: string) {
	return prisma.vendor.findUnique({
		where: { id },
		include: {
			maintenanceRequests: {
				orderBy: { createdAt: "desc" },
				take: 10,
			},
		},
	});
}

/**
 * Update a vendor
 */
export async function updateVendor(id: string, data: UpdateVendorInput) {
	return prisma.vendor.update({
		where: { id },
		data,
	});
}

/**
 * Delete a vendor
 */
export async function deleteVendor(id: string) {
	// First, unassign any maintenance requests
	await prisma.maintenanceRequest.updateMany({
		where: { assignedVendorId: id },
		data: { assignedVendorId: null },
	});

	return prisma.vendor.delete({
		where: { id },
	});
}

/**
 * Get vendors by category
 */
export async function getVendorsByCategory(category: MaintenanceCategory) {
	return prisma.vendor.findMany({
		where: {
			category,
			isActive: true,
		},
		orderBy: { rating: "desc" },
	});
}

import { useAuthStore } from "../../stores/authStore";
import { apiUrl } from "./config";
import type { ApiResponse, MaintenanceCategory, Vendor } from "./types";

function getAuthHeaders(): HeadersInit {
	const token = useAuthStore.getState().token;
	return {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
}

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
	page?: number;
	limit?: number;
}

/**
 * Create a new vendor
 */
export async function createVendor(
	input: CreateVendorInput,
): Promise<ApiResponse<Vendor>> {
	const response = await fetch(apiUrl("/v1/vendors"), {
		method: "POST",
		headers: getAuthHeaders(),
		credentials: "include",
		body: JSON.stringify(input),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to create vendor");
	}

	return response.json();
}

/**
 * Get all vendors
 */
export async function getVendors(
	filters: VendorFilters = {},
): Promise<ApiResponse<Vendor[]>> {
	const params = new URLSearchParams();
	if (filters.category) params.set("category", filters.category);
	if (filters.isActive !== undefined)
		params.set("isActive", String(filters.isActive));
	if (filters.search) params.set("search", filters.search);
	if (filters.page) params.set("page", String(filters.page));
	if (filters.limit) params.set("limit", String(filters.limit));

	const response = await fetch(apiUrl(`/v1/vendors?${params}`), {
		method: "GET",
		headers: getAuthHeaders(),
		credentials: "include",
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to fetch vendors");
	}

	return response.json();
}

/**
 * Get a single vendor
 */
export async function getVendor(id: string): Promise<ApiResponse<Vendor>> {
	const response = await fetch(apiUrl(`/v1/vendors/${id}`), {
		method: "GET",
		headers: getAuthHeaders(),
		credentials: "include",
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to fetch vendor");
	}

	return response.json();
}

/**
 * Update a vendor
 */
export async function updateVendor(
	id: string,
	data: UpdateVendorInput,
): Promise<ApiResponse<Vendor>> {
	const response = await fetch(apiUrl(`/v1/vendors/${id}`), {
		method: "PUT",
		headers: getAuthHeaders(),
		credentials: "include",
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to update vendor");
	}

	return response.json();
}

/**
 * Delete a vendor
 */
export async function deleteVendor(id: string): Promise<void> {
	const response = await fetch(apiUrl(`/v1/vendors/${id}`), {
		method: "DELETE",
		headers: getAuthHeaders(),
		credentials: "include",
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to delete vendor");
	}
}

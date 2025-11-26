import { useAuthStore } from "../../stores/authStore";
import type {
	AILogEntry,
	ApiResponse,
	CreateMaintenanceRequestResponse,
	MaintenanceCategory,
	MaintenanceRequest,
	MaintenanceStatus,
	Priority,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getAuthHeaders(): HeadersInit {
	const token = useAuthStore.getState().token;
	return {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
}

export interface CreateMaintenanceRequestInput {
	title: string;
	description: string;
	propertyAddress: string;
	category?: MaintenanceCategory;
	priority?: Priority;
}

export interface MaintenanceRequestFilters {
	status?: MaintenanceStatus;
	category?: MaintenanceCategory;
	priority?: Priority;
	vendorId?: string;
	page?: number;
	limit?: number;
}

/**
 * Create a new maintenance request
 */
export async function createMaintenanceRequest(
	input: CreateMaintenanceRequestInput,
): Promise<CreateMaintenanceRequestResponse> {
	const response = await fetch(`${API_BASE_URL}/api/v1/maintenance/requests`, {
		method: "POST",
		headers: getAuthHeaders(),
		credentials: "include",
		body: JSON.stringify(input),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to create maintenance request");
	}

	return response.json();
}

/**
 * Get all maintenance requests
 */
export async function getMaintenanceRequests(
	filters: MaintenanceRequestFilters = {},
): Promise<ApiResponse<MaintenanceRequest[]>> {
	const params = new URLSearchParams();
	if (filters.status) params.set("status", filters.status);
	if (filters.category) params.set("category", filters.category);
	if (filters.priority) params.set("priority", filters.priority);
	if (filters.vendorId) params.set("vendorId", filters.vendorId);
	if (filters.page) params.set("page", String(filters.page));
	if (filters.limit) params.set("limit", String(filters.limit));

	const response = await fetch(
		`${API_BASE_URL}/api/v1/maintenance/requests?${params}`,
		{
			method: "GET",
			headers: getAuthHeaders(),
			credentials: "include",
		},
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to fetch maintenance requests");
	}

	return response.json();
}

/**
 * Get a single maintenance request
 */
export async function getMaintenanceRequest(
	id: string,
): Promise<ApiResponse<MaintenanceRequest>> {
	const response = await fetch(
		`${API_BASE_URL}/api/v1/maintenance/requests/${id}`,
		{
			method: "GET",
			headers: getAuthHeaders(),
			credentials: "include",
		},
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to fetch maintenance request");
	}

	return response.json();
}

/**
 * Update a maintenance request
 */
export async function updateMaintenanceRequest(
	id: string,
	data: Partial<MaintenanceRequest>,
): Promise<ApiResponse<MaintenanceRequest>> {
	const response = await fetch(
		`${API_BASE_URL}/api/v1/maintenance/requests/${id}`,
		{
			method: "PUT",
			headers: getAuthHeaders(),
			credentials: "include",
			body: JSON.stringify(data),
		},
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to update maintenance request");
	}

	return response.json();
}

/**
 * Delete a maintenance request
 */
export async function deleteMaintenanceRequest(id: string): Promise<void> {
	const response = await fetch(
		`${API_BASE_URL}/api/v1/maintenance/requests/${id}`,
		{
			method: "DELETE",
			headers: getAuthHeaders(),
			credentials: "include",
		},
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to delete maintenance request");
	}
}

/**
 * Get AI logs
 */
export async function getAILogs(): Promise<ApiResponse<AILogEntry[]>> {
	const response = await fetch(`${API_BASE_URL}/api/v1/maintenance/ai-logs`, {
		method: "GET",
		headers: getAuthHeaders(),
		credentials: "include",
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to fetch AI logs");
	}

	return response.json();
}

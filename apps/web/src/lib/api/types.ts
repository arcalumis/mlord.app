export type MaintenanceCategory =
	| "PLUMBING"
	| "ELECTRICAL"
	| "HVAC"
	| "APPLIANCES"
	| "LANDSCAPING"
	| "PEST_CONTROL"
	| "PAINTING"
	| "ROOFING"
	| "STRUCTURAL"
	| "OTHER";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type MaintenanceStatus =
	| "PENDING"
	| "SCHEDULED"
	| "IN_PROGRESS"
	| "COMPLETED"
	| "CANCELLED";

export interface User {
	id: string;
	name: string | null;
	email: string;
}

export interface Vendor {
	id: string;
	name: string;
	category: MaintenanceCategory;
	contactName: string | null;
	email: string | null;
	phone: string;
	address: string | null;
	rating: number | null;
	notes: string | null;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface MaintenanceRequest {
	id: string;
	title: string;
	description: string;
	propertyAddress: string;
	category: MaintenanceCategory | null;
	priority: Priority | null;
	aiCategory: string | null;
	aiPriority: Priority | null;
	status: MaintenanceStatus;
	estimatedCost: number | null;
	actualCost: number | null;
	scheduledDate: string | null;
	completedDate: string | null;
	assignedVendorId: string | null;
	assignedVendor: Vendor | null;
	userId: string | null;
	user: User | null;
	createdAt: string;
	updatedAt: string;
}

export interface AIClassification {
	category: MaintenanceCategory;
	priority: Priority;
	vendorId: string | null;
	reasoning: string;
	confidence: number;
}

export interface AILogEntry {
	timestamp: string;
	requestTitle: string;
	requestDescription: string;
	classification: AIClassification;
	availableVendors: {
		id: string;
		name: string;
		category: MaintenanceCategory;
		rating: number | null;
	}[];
}

export interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	pagination?: Pagination;
}

export interface CreateMaintenanceRequestResponse {
	success: boolean;
	data: MaintenanceRequest;
	aiClassification: AIClassification;
}

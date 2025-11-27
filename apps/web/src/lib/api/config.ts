/**
 * API Configuration
 * Handles the base URL for API requests, accounting for different environments
 */

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

// If VITE_API_URL already ends with /api, don't add it again
export const API_BASE_URL = rawApiUrl.endsWith("/api") ? rawApiUrl : rawApiUrl;
export const API_PREFIX = rawApiUrl.endsWith("/api") ? "" : "/api";

/**
 * Build a full API URL
 */
export function apiUrl(path: string): string {
	// Ensure path starts with /v1/ for versioned endpoints
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${API_BASE_URL}${API_PREFIX}${normalizedPath}`;
}

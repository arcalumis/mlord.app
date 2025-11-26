/**
 * API Client for backend communication
 * Reads API URL from environment variables (defaults to /api for same-domain requests)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
	constructor(
		public status: number,
		public statusText: string,
		message: string,
		public data?: unknown,
	) {
		super(message);
		this.name = "ApiError";
	}
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;

	try {
		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new ApiError(
				response.status,
				response.statusText,
				errorData.message || `HTTP ${response.status}: ${response.statusText}`,
				errorData,
			);
		}

		return response.json();
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		throw new ApiError(
			0,
			"Network Error",
			error instanceof Error ? error.message : "An unknown error occurred",
		);
	}
}

/**
 * API methods
 */
export const api = {
	/**
	 * Health check endpoint
	 */
	health: async () => {
		return fetchApi<{ status: string; timestamp: string; database?: string }>(
			"/v1/health",
		);
	},

	// Add more API methods as needed
	// Example:
	// users: {
	//   list: () => fetchApi<User[]>('/v1/users'),
	//   get: (id: string) => fetchApi<User>(`/v1/users/${id}`),
	//   create: (data: CreateUserDto) => fetchApi<User>('/v1/users', {
	//     method: 'POST',
	//     body: JSON.stringify(data),
	//   }),
	// },
};

export default api;

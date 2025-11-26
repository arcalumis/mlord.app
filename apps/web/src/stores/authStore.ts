import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
	id: string;
	email: string;
	name: string;
	role: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;

	// Actions
	setUser: (user: User, token: string) => void;
	clearAuth: () => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			setUser: (user, token) =>
				set({
					user,
					token,
					isAuthenticated: true,
					error: null,
				}),

			clearAuth: () =>
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					error: null,
				}),

			setLoading: (isLoading) => set({ isLoading }),

			setError: (error) => set({ error, isLoading: false }),
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);

/**
 * Login API call
 */
export async function loginApi(
	email: string,
	password: string,
): Promise<{ user: User; token: string }> {
	const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		const data = await response.json();
		throw new Error(data.message || "Login failed");
	}

	const data = await response.json();
	return { user: data.user, token: data.token };
}

/**
 * Logout API call
 */
export async function logoutApi(): Promise<void> {
	await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
		method: "POST",
		credentials: "include",
	});
}

/**
 * Get current user API call
 */
export async function getCurrentUserApi(token: string): Promise<User> {
	const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Not authenticated");
	}

	const data = await response.json();
	return data.user;
}

import { useCallback } from "react";
import {
	getCurrentUserApi,
	loginApi,
	logoutApi,
	useAuthStore,
} from "../stores/authStore";

export function useAuth() {
	const {
		user,
		token,
		isAuthenticated,
		isLoading,
		error,
		setUser,
		clearAuth,
		setLoading,
		setError,
	} = useAuthStore();

	const login = useCallback(
		async (email: string, password: string) => {
			setLoading(true);
			setError(null);

			try {
				const { user, token } = await loginApi(email, password);
				setUser(user, token);
				return { success: true };
			} catch (err) {
				const message = err instanceof Error ? err.message : "Login failed";
				setError(message);
				return { success: false, error: message };
			}
		},
		[setLoading, setError, setUser],
	);

	const logout = useCallback(async () => {
		setLoading(true);

		try {
			await logoutApi();
		} catch {
			// Ignore logout errors - clear local state anyway
		}

		clearAuth();
		setLoading(false);
	}, [clearAuth, setLoading]);

	const checkAuth = useCallback(async () => {
		if (!token) {
			clearAuth();
			return false;
		}

		setLoading(true);

		try {
			const user = await getCurrentUserApi(token);
			setUser(user, token);
			return true;
		} catch {
			clearAuth();
			return false;
		} finally {
			setLoading(false);
		}
	}, [token, clearAuth, setLoading, setUser]);

	return {
		user,
		token,
		isAuthenticated,
		isLoading,
		error,
		login,
		logout,
		checkAuth,
	};
}

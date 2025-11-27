import type { User } from "@prisma/client";
import { signToken } from "../utils/jwt";

interface LoginCredentials {
	email: string;
	password: string;
}

interface AuthResponse {
	user: {
		id: string;
		email: string;
		name: string | null;
		role: string;
	};
	token: string;
}

/**
 * Hardcoded demo credentials
 * In production, this would query a database
 */
const DEMO_CREDENTIALS = {
	email: "admin",
	password: "password", // In production, this would be hashed in the database
	user: {
		id: "demo-admin-id",
		email: "admin@mlord.app",
		name: "Admin User",
		role: "ADMIN",
	},
};

/**
 * Authenticates a user with email and password
 */
export async function login(
	credentials: LoginCredentials,
): Promise<AuthResponse> {
	const { email, password } = credentials;

	// For demo purposes, check hardcoded credentials
	if (
		email === DEMO_CREDENTIALS.email &&
		password === DEMO_CREDENTIALS.password
	) {
		const user = DEMO_CREDENTIALS.user;
		const token = signToken(user as User);

		return {
			user,
			token,
		};
	}

	// For now, only demo credentials are supported
	// Database authentication will be added when DATABASE_URL is configured
	throw new Error("Invalid credentials");
}

/**
 * Gets user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
	// For demo purposes, return hardcoded user if ID matches
	if (userId === DEMO_CREDENTIALS.user.id) {
		return DEMO_CREDENTIALS.user as User;
	}

	// Database lookup will be added when DATABASE_URL is configured
	return null;
}

/**
 * Validates if a user exists and is active
 */
export async function validateUser(userId: string): Promise<boolean> {
	const user = await getUserById(userId);
	return user !== null;
}

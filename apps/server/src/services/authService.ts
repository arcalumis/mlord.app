import type { User } from "@prisma/client";
import prisma from "../config/prisma";
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
		// In production, we'd fetch the user from the database
		// and compare hashed passwords
		const user = DEMO_CREDENTIALS.user;
		const token = signToken(user as User);

		return {
			user,
			token,
		};
	}

	// Try to find user in database (for future real authentication)
	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw new Error("Invalid credentials");
	}

	// Note: In a real implementation, you'd have a password field on the User model
	// and compare it here using bcrypt.compare()
	// For now, this is just a placeholder for future implementation

	const token = signToken(user);

	return {
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
		},
		token,
	};
}

/**
 * Gets user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
	// For demo purposes, return hardcoded user if ID matches
	if (userId === DEMO_CREDENTIALS.user.id) {
		return DEMO_CREDENTIALS.user as User;
	}

	return prisma.user.findUnique({
		where: { id: userId },
	});
}

/**
 * Validates if a user exists and is active
 */
export async function validateUser(userId: string): Promise<boolean> {
	const user = await getUserById(userId);
	return user !== null;
}

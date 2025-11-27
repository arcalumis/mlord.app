import type { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { signToken } from "../utils/jwt";

const SALT_ROUNDS = 12;

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
 * Authenticates a user with email and password
 */
export async function login(
	credentials: LoginCredentials,
): Promise<AuthResponse> {
	const { email, password } = credentials;

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw new Error("Invalid credentials");
	}

	const isValidPassword = await bcrypt.compare(password, user.passwordHash);

	if (!isValidPassword) {
		throw new Error("Invalid credentials");
	}

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

/**
 * Creates a new user with hashed password
 */
export async function createUser(
	email: string,
	password: string,
	name?: string,
	role: "ADMIN" | "MANAGER" | "VIEWER" = "ADMIN",
): Promise<User> {
	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

	return prisma.user.create({
		data: {
			email,
			passwordHash,
			name,
			role,
		},
	});
}

/**
 * Hashes a password (utility for seeding)
 */
export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, SALT_ROUNDS);
}

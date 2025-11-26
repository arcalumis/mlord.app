import type { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

interface JWTPayload {
	id: string;
	email: string;
	name: string | null;
	role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as StringValue;

/**
 * Generates a JWT token for the given user
 */
export function signToken(user: User): string {
	const payload: JWTPayload = {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
}

/**
 * Verifies and decodes a JWT token
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): JWTPayload {
	try {
		return jwt.verify(token, JWT_SECRET) as JWTPayload;
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new Error("Token has expired");
		}
		if (error instanceof jwt.JsonWebTokenError) {
			throw new Error("Invalid token");
		}
		throw error;
	}
}

/**
 * Extracts the token from the Authorization header or cookie
 */
export function extractToken(
	authHeader?: string,
	cookieToken?: string,
): string | null {
	// Try Authorization header first (Bearer token)
	if (authHeader?.startsWith("Bearer ")) {
		return authHeader.substring(7);
	}

	// Fall back to cookie
	if (cookieToken) {
		return cookieToken;
	}

	return null;
}

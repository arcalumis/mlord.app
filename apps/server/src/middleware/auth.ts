import type { NextFunction, Request, Response } from "express";
import { validateUser } from "../services/authService";
import { extractToken, verifyToken } from "../utils/jwt";

// Extend Express Request type to include user
declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
				name: string | null;
				role: string;
			};
		}
	}
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export async function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		// Extract token from header or cookie
		const token = extractToken(req.headers.authorization, req.cookies?.token);

		if (!token) {
			res.status(401).json({
				error: "Unauthorized",
				message: "No authentication token provided",
			});
			return;
		}

		// Verify token
		const payload = verifyToken(token);

		// Validate user still exists and is active
		const isValid = await validateUser(payload.id);
		if (!isValid) {
			res.status(401).json({
				error: "Unauthorized",
				message: "User not found or inactive",
			});
			return;
		}

		// Attach user to request
		req.user = payload;

		next();
	} catch (error) {
		if (error instanceof Error) {
			res.status(401).json({
				error: "Unauthorized",
				message: error.message,
			});
		} else {
			res.status(401).json({
				error: "Unauthorized",
				message: "Invalid authentication token",
			});
		}
	}
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(...roles: string[]) {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({
				error: "Unauthorized",
				message: "Authentication required",
			});
			return;
		}

		if (!roles.includes(req.user.role)) {
			res.status(403).json({
				error: "Forbidden",
				message: "Insufficient permissions",
			});
			return;
		}

		next();
	};
}

/**
 * Optional authentication - attaches user if token is present but doesn't fail if missing
 */
export async function optionalAuth(
	req: Request,
	_res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const token = extractToken(req.headers.authorization, req.cookies?.token);

		if (token) {
			const payload = verifyToken(token);
			const isValid = await validateUser(payload.id);

			if (isValid) {
				req.user = payload;
			}
		}

		next();
	} catch {
		// Silently ignore auth errors for optional auth
		next();
	}
}

import { doubleCsrf } from "csrf-csrf";
import type { Request } from "express";

/**
 * CSRF Protection Configuration
 *
 * IMPORTANT: Only needed when using cookie-based authentication
 * NOT needed for JWT-based authentication with Authorization headers
 *
 * This middleware protects against Cross-Site Request Forgery attacks
 * by validating CSRF tokens on state-changing operations (POST, PUT, DELETE, PATCH)
 */

const { invalidCsrfTokenError, doubleCsrfProtection } = doubleCsrf({
	getSecret: () => process.env.CSRF_SECRET || "default-csrf-secret-change-me",
	getSessionIdentifier: (req: Request) =>
		(req.headers["x-session-id"] as string) || "anonymous",
	cookieName: "__Host-psifi.x-csrf-token",
	cookieOptions: {
		sameSite: "strict",
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
	},
	size: 64,
});

/**
 * CSRF Protection Middleware
 * Apply this to routes that need CSRF protection (typically routes with cookies/sessions)
 *
 * Usage:
 * app.post('/api/protected', csrfProtection, (req, res) => { ... })
 */
export const csrfProtection = doubleCsrfProtection;

/**
 * CSRF Error Checker
 * Returns true if the error is a CSRF token error
 */
export const isCsrfError = (error: unknown) => {
	return error === invalidCsrfTokenError;
};

import rateLimit from "express-rate-limit";

/**
 * General API rate limiter
 * Limits requests to 1000 per 15 minutes per IP address
 * Helps prevent abuse and DoS attacks
 */
export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 1000 requests per windowMs
	message: {
		status: "error",
		message:
			"Too many requests from this IP, please try again after 15 minutes",
	},
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	// Store in memory (for production, consider using Redis)
	// For distributed systems, use: store: new RedisStore({...})
});

/**
 * Stricter rate limiter for authentication endpoints
 * Limits to 20 requests per 15 minutes per IP
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // Limit each IP to 20 requests per windowMs
	message: {
		status: "error",
		message:
			"Too many authentication attempts, please try again after 15 minutes",
	},
	standardHeaders: true,
	legacyHeaders: false,
	skipSuccessfulRequests: true, // Skip successful logins from count
});

/**
 * More lenient rate limiter for read-only endpoints
 * Limits to 2000 requests per 15 minutes per IP
 */
export const readLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 2000, // Limit each IP to 2000 requests per windowMs
	message: {
		status: "error",
		message: "Too many requests, please try again later",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

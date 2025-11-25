import type { CorsOptions } from "cors";

/**
 * CORS Configuration
 *
 * Configures Cross-Origin Resource Sharing to control which domains
 * can access the API. This is critical for security in production.
 */

// Parse allowed origins from environment variable
// Supports comma-separated list: "https://app.com,https://admin.app.com"
const getAllowedOrigins = (): string[] => {
	const originsEnv = process.env.CORS_ORIGIN || "http://localhost:5173";
	return originsEnv.split(",").map((origin) => origin.trim());
};

const allowedOrigins = getAllowedOrigins();

export const corsOptions: CorsOptions = {
	// Origin validation function
	origin: (origin, callback) => {
		// Allow requests with no origin (mobile apps, Postman, etc.)
		if (!origin) {
			return callback(null, true);
		}

		// Check if origin is in the allowed list
		if (allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			const allowedList = allowedOrigins.join(", ");
			callback(
				new Error(
					`Origin ${origin} not allowed by CORS policy. Allowed origins: ${allowedList}`,
				),
			);
		}
	},

	// Allow credentials (cookies, authorization headers, TLS client certificates)
	credentials: true,

	// Allowed HTTP methods
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

	// Allowed headers
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"X-Requested-With",
		"X-CSRF-Token",
		"Accept",
		"Origin",
	],

	// Headers exposed to the client
	exposedHeaders: ["X-Total-Count", "X-Page-Count", "RateLimit-Remaining"],

	// Cache preflight requests for 1 hour (3600 seconds)
	// Reduces the number of OPTIONS requests
	maxAge: 3600,

	// Pass the CORS preflight response to the next handler
	preflightContinue: false,

	// Provide a status code for successful OPTIONS requests
	optionsSuccessStatus: 204,
};

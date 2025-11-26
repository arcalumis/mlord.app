import type { Request, Response } from "express";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { getUserById, login } from "../services/authService";

const router = Router();

/**
 * POST /api/v1/auth/login
 * Authenticate user and return JWT token
 */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({
				error: "Bad Request",
				message: "Email and password are required",
			});
			return;
		}

		const result = await login({ email, password });

		// Set HTTP-only cookie with the token
		res.cookie("token", result.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		res.json({
			success: true,
			user: result.user,
			token: result.token, // Also return token for clients that prefer header auth
		});
	} catch (error) {
		if (error instanceof Error && error.message === "Invalid credentials") {
			res.status(401).json({
				error: "Unauthorized",
				message: "Invalid email or password",
			});
		} else {
			res.status(500).json({
				error: "Internal Server Error",
				message: "An error occurred during login",
			});
		}
	}
});

/**
 * POST /api/v1/auth/logout
 * Clear authentication cookie
 */
router.post("/logout", (_req: Request, res: Response): void => {
	res.clearCookie("token", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});

	res.json({
		success: true,
		message: "Logged out successfully",
	});
});

/**
 * GET /api/v1/auth/me
 * Get current authenticated user info
 */
router.get(
	"/me",
	authenticateToken,
	async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({
					error: "Unauthorized",
					message: "Not authenticated",
				});
				return;
			}

			const user = await getUserById(req.user.id);

			if (!user) {
				res.status(404).json({
					error: "Not Found",
					message: "User not found",
				});
				return;
			}

			res.json({
				success: true,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
				},
			});
		} catch {
			res.status(500).json({
				error: "Internal Server Error",
				message: "An error occurred fetching user info",
			});
		}
	},
);

export default router;

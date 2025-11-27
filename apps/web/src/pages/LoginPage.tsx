import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Crown, KeyRound } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../hooks/useAuth";

const loginSchema = z.object({
	email: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
	const { login, isLoading, error, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		if (isAuthenticated) {
			navigate({ to: "/dashboard" });
		}
	}, [isAuthenticated, navigate]);

	const onSubmit = async (data: LoginFormData) => {
		const result = await login(data.email, data.password);
		if (result.success) {
			navigate({ to: "/dashboard" });
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
			<header className="border-b bg-card/50 backdrop-blur-sm">
				<div className="container mx-auto flex h-16 items-center px-4">
					<Link to="/" className="flex items-center gap-2">
						<Crown className="h-7 w-7 text-primary" />
						<span className="text-xl font-bold tracking-tight">M'Lord</span>
					</Link>
				</div>
			</header>

			<main className="flex flex-1 items-center justify-center p-4">
				<Card className="w-full max-w-md shadow-lg">
					<CardHeader className="space-y-4 text-center pb-2">
						<div className="mx-auto rounded-full bg-primary/10 p-3 w-fit">
							<KeyRound className="h-8 w-8 text-primary" />
						</div>
						<div>
							<CardTitle className="text-2xl font-bold">
								Enter the Keep
							</CardTitle>
							<CardDescription className="mt-2">
								Present your credentials to access the realm
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="pt-4">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<div className="space-y-2">
								<Label htmlFor="email">Username</Label>
								<Input
									id="email"
									type="text"
									placeholder="Your title, m'lord"
									autoComplete="username"
									{...register("email")}
								/>
								{errors.email && (
									<p className="text-sm text-destructive">
										{errors.email.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Secret passphrase"
									autoComplete="current-password"
									{...register("password")}
								/>
								{errors.password && (
									<p className="text-sm text-destructive">
										{errors.password.message}
									</p>
								)}
							</div>

							<Button
								type="submit"
								className="w-full gap-2"
								disabled={isLoading}
							>
								{isLoading ? (
									"Opening gates..."
								) : (
									<>
										<Crown className="h-4 w-4" />
										Enter the Realm
									</>
								)}
							</Button>

							<div className="rounded-lg bg-muted/50 p-3 text-center">
								<p className="text-sm text-muted-foreground">
									<span className="font-medium text-foreground">
										Demo credentials:
									</span>
									<br />
									admin / password
								</p>
							</div>
						</form>
					</CardContent>
				</Card>
			</main>

			<footer className="border-t py-4 bg-card/30">
				<div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
					M'Lord — AI-Powered Property Management
				</div>
			</footer>
		</div>
	);
}

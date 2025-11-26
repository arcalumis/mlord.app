import { Link } from "@tanstack/react-router";
import { Button } from "../components/ui/button";

export function LandingPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="border-b">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<h1 className="text-xl font-bold">MLord Property Management</h1>
					<Link to="/login">
						<Button>Sign In</Button>
					</Link>
				</div>
			</header>

			<main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
				<div className="max-w-2xl space-y-6">
					<h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
						AI-Powered Property Management
					</h2>
					<p className="text-xl text-muted-foreground">
						Streamline maintenance requests with intelligent vendor assignment.
						Our AI analyzes each request and matches it with the best available
						vendor automatically.
					</p>
					<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
						<Link to="/login">
							<Button size="lg">Get Started</Button>
						</Link>
					</div>
				</div>
			</main>

			<footer className="border-t py-6">
				<div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
					Built with React, TypeScript, and OpenAI
				</div>
			</footer>
		</div>
	);
}

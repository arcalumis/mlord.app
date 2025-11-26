import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { useAuth } from "../hooks/useAuth";

export function DashboardPage() {
	const { user, logout } = useAuth();

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<h1 className="text-xl font-bold">Dashboard</h1>
					<div className="flex items-center gap-4">
						<span className="text-sm text-muted-foreground">{user?.name}</span>
						<Button variant="outline" onClick={logout}>
							Sign Out
						</Button>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Card>
						<CardHeader>
							<CardTitle>Maintenance Requests</CardTitle>
							<CardDescription>
								View and manage maintenance requests
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold">0</p>
							<p className="text-sm text-muted-foreground">Active requests</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Vendors</CardTitle>
							<CardDescription>Manage your vendor network</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold">0</p>
							<p className="text-sm text-muted-foreground">Active vendors</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>AI Assignments</CardTitle>
							<CardDescription>Recent AI-powered assignments</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold">0</p>
							<p className="text-sm text-muted-foreground">This week</p>
						</CardContent>
					</Card>
				</div>

				<div className="mt-8">
					<Card>
						<CardHeader>
							<CardTitle>Welcome to MLord Property Management</CardTitle>
							<CardDescription>
								Your AI-powered maintenance management system
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<p>This dashboard will allow you to:</p>
							<ul className="list-inside list-disc space-y-2 text-muted-foreground">
								<li>Submit and track maintenance requests</li>
								<li>Manage your vendor network</li>
								<li>View AI assignment logs and reasoning</li>
								<li>Monitor request status and priorities</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}

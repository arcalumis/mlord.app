import { Link } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";

export function DashboardPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<h1 className="text-2xl font-bold">Dashboard</h1>
				<p className="text-muted-foreground">
					Welcome to your AI-powered property management system
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Maintenance Requests</CardTitle>
						<CardDescription>
							View and manage maintenance requests
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Link to="/dashboard/requests">
							<Button variant="outline" className="w-full">
								View Requests
							</Button>
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Vendors</CardTitle>
						<CardDescription>Manage your vendor network</CardDescription>
					</CardHeader>
					<CardContent>
						<Link to="/dashboard/vendors">
							<Button variant="outline" className="w-full">
								Manage Vendors
							</Button>
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>AI Assignments</CardTitle>
						<CardDescription>View AI-powered assignment logs</CardDescription>
					</CardHeader>
					<CardContent>
						<Link to="/dashboard/ai-logs">
							<Button variant="outline" className="w-full">
								View AI Logs
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>

			<div className="mt-8">
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>Common tasks you can perform</CardDescription>
					</CardHeader>
					<CardContent className="flex gap-4">
						<Link to="/dashboard/requests/new">
							<Button>Submit New Request</Button>
						</Link>
						<Link to="/dashboard/vendors">
							<Button variant="outline">Add Vendor</Button>
						</Link>
					</CardContent>
				</Card>
			</div>

			<div className="mt-8">
				<Card>
					<CardHeader>
						<CardTitle>How It Works</CardTitle>
						<CardDescription>AI-powered maintenance management</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<ol className="list-inside list-decimal space-y-2 text-muted-foreground">
							<li>
								<strong className="text-foreground">Submit a request</strong> -
								Describe the maintenance issue
							</li>
							<li>
								<strong className="text-foreground">AI analyzes</strong> -
								OpenAI classifies the request and suggests priority
							</li>
							<li>
								<strong className="text-foreground">Vendor assigned</strong> -
								Best matching vendor is automatically selected
							</li>
							<li>
								<strong className="text-foreground">Track progress</strong> -
								Monitor status and view AI reasoning
							</li>
						</ol>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

import { Link } from "@tanstack/react-router";
import {
	Brain,
	Castle,
	Plus,
	ScrollText,
	Sparkles,
	Users,
	Wrench,
} from "lucide-react";
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
			{/* Welcome Banner */}
			<div className="mb-8 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border p-6">
				<div className="flex items-start gap-4">
					<div className="rounded-full bg-primary/10 p-3">
						<Castle className="h-8 w-8 text-primary" />
					</div>
					<div>
						<h1 className="text-2xl font-bold">Welcome to Your Throne Room</h1>
						<p className="text-muted-foreground mt-1">
							Command your estate with AI-powered wisdom. Your realm awaits your
							decrees.
						</p>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="mb-8">
				<h2 className="text-lg font-semibold mb-4">Royal Decrees</h2>
				<div className="flex flex-wrap gap-3">
					<Link to="/dashboard/requests/new">
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Submit New Petition
						</Button>
					</Link>
					<Link to="/dashboard/vendors">
						<Button variant="outline" className="gap-2">
							<Users className="h-4 w-4" />
							Summon Craftsmen
						</Button>
					</Link>
				</div>
			</div>

			{/* Main Cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
				<Link to="/dashboard/requests" className="group">
					<Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="rounded-full bg-primary/10 p-2">
									<ScrollText className="h-5 w-5 text-primary" />
								</div>
								<div>
									<CardTitle className="group-hover:text-primary transition-colors">
										Petitions
									</CardTitle>
									<CardDescription>
										Maintenance requests from your realm
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Review and manage all maintenance petitions submitted by your
								subjects.
							</p>
						</CardContent>
					</Card>
				</Link>

				<Link to="/dashboard/vendors" className="group">
					<Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="rounded-full bg-primary/10 p-2">
									<Wrench className="h-5 w-5 text-primary" />
								</div>
								<div>
									<CardTitle className="group-hover:text-primary transition-colors">
										Craftsmen Guild
									</CardTitle>
									<CardDescription>
										Your network of skilled vendors
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Manage the artisans and tradespeople who keep your estates in
								order.
							</p>
						</CardContent>
					</Card>
				</Link>

				<Link to="/dashboard/ai-logs" className="group">
					<Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="rounded-full bg-primary/10 p-2">
									<Brain className="h-5 w-5 text-primary" />
								</div>
								<div>
									<CardTitle className="group-hover:text-primary transition-colors">
										Oracle's Wisdom
									</CardTitle>
									<CardDescription>AI classification insights</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Peer into the oracle's reasoning and see how requests are
								analyzed.
							</p>
						</CardContent>
					</Card>
				</Link>
			</div>

			{/* How It Works */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="rounded-full bg-primary/10 p-2">
							<Sparkles className="h-5 w-5 text-primary" />
						</div>
						<div>
							<CardTitle>How the Oracle Works</CardTitle>
							<CardDescription>
								Your AI-powered steward in action
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<StepItem
							number="I"
							title="Petition Received"
							description="A subject describes their maintenance woe"
						/>
						<StepItem
							number="II"
							title="Oracle Consults"
							description="AI analyzes and classifies the request"
						/>
						<StepItem
							number="III"
							title="Craftsman Matched"
							description="The ideal vendor is identified"
						/>
						<StepItem
							number="IV"
							title="Order Restored"
							description="Track progress to resolution"
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function StepItem({
	number,
	title,
	description,
}: {
	number: string;
	title: string;
	description: string;
}) {
	return (
		<div className="flex gap-3">
			<div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
				{number}
			</div>
			<div>
				<h4 className="font-medium">{title}</h4>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</div>
	);
}

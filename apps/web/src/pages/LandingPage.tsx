import { Link } from "@tanstack/react-router";
import {
	Castle,
	Crown,
	ScrollText,
	Shield,
	Sparkles,
	Wrench,
} from "lucide-react";
import { Button } from "../components/ui/button";

export function LandingPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<div className="flex items-center gap-2">
						<Crown className="h-7 w-7 text-primary" />
						<h1 className="text-xl font-bold tracking-tight">M'Lord</h1>
					</div>
					<Link to="/login">
						<Button>Enter the Keep</Button>
					</Link>
				</div>
			</header>

			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative overflow-hidden py-20 sm:py-32">
					<div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
					<div className="container relative mx-auto px-4 text-center">
						<div className="mx-auto max-w-3xl space-y-8">
							<div className="flex justify-center">
								<div className="rounded-full bg-primary/10 p-4">
									<Castle className="h-16 w-16 text-primary" />
								</div>
							</div>
							<h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
								Your Estate,{" "}
								<span className="text-primary">Intelligently Managed</span>
							</h2>
							<p className="text-xl text-muted-foreground leading-relaxed">
								M'Lord brings the wisdom of artificial intelligence to property
								management. Submit maintenance requests and let our AI classify,
								prioritize, and match them with the perfect
								vendor—automatically.
							</p>
							<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
								<Link to="/login">
									<Button size="lg" className="gap-2">
										<Crown className="h-5 w-5" />
										Claim Your Throne
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="border-t bg-card/30 py-20">
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-2xl text-center mb-16">
							<h3 className="text-3xl font-bold tracking-tight mb-4">
								Rule Your Properties with Ease
							</h3>
							<p className="text-muted-foreground text-lg">
								Modern AI meets timeless property management wisdom
							</p>
						</div>
						<div className="grid gap-8 md:grid-cols-3">
							<FeatureCard
								icon={<Sparkles className="h-8 w-8" />}
								title="AI Classification"
								description="Our intelligent steward analyzes each request, determining category, urgency, and the best course of action."
							/>
							<FeatureCard
								icon={<Wrench className="h-8 w-8" />}
								title="Vendor Matching"
								description="Like a wise chamberlain, M'Lord matches each task to the most suitable craftsman in your realm."
							/>
							<FeatureCard
								icon={<ScrollText className="h-8 w-8" />}
								title="Complete Records"
								description="Every decree and action is chronicled. Track the full history of your estate's maintenance."
							/>
						</div>
					</div>
				</section>

				{/* How It Works */}
				<section className="border-t py-20">
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-2xl text-center mb-16">
							<h3 className="text-3xl font-bold tracking-tight mb-4">
								How the Kingdom Operates
							</h3>
							<p className="text-muted-foreground text-lg">
								A seamless journey from request to resolution
							</p>
						</div>
						<div className="mx-auto max-w-4xl">
							<div className="grid gap-6 md:grid-cols-4">
								<StepCard
									number="I"
									title="Submit Petition"
									description="Describe the issue plaguing your domain"
								/>
								<StepCard
									number="II"
									title="AI Counsel"
									description="Our oracle analyzes and classifies the request"
								/>
								<StepCard
									number="III"
									title="Dispatch Orders"
									description="The perfect craftsman is summoned"
								/>
								<StepCard
									number="IV"
									title="Resolution"
									description="Track progress until order is restored"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="border-t bg-primary/5 py-20">
					<div className="container mx-auto px-4 text-center">
						<div className="mx-auto max-w-2xl space-y-6">
							<Shield className="h-12 w-12 mx-auto text-primary" />
							<h3 className="text-3xl font-bold tracking-tight">
								Ready to Rule?
							</h3>
							<p className="text-lg text-muted-foreground">
								Join the landlords who've elevated their property management
								with the power of AI.
							</p>
							<Link to="/login">
								<Button size="lg" className="gap-2">
									Begin Your Reign
								</Button>
							</Link>
						</div>
					</div>
				</section>
			</main>

			<footer className="border-t py-8 bg-card/50">
				<div className="container mx-auto px-4">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="flex items-center gap-2">
							<Crown className="h-5 w-5 text-primary" />
							<span className="font-semibold">M'Lord</span>
						</div>
						<p className="text-sm text-muted-foreground">
							AI-Powered Property Management for the Modern Landlord
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-lg border bg-card p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
			<div className="mx-auto w-fit rounded-full bg-primary/10 p-3 text-primary">
				{icon}
			</div>
			<h4 className="text-xl font-semibold">{title}</h4>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
}

function StepCard({
	number,
	title,
	description,
}: {
	number: string;
	title: string;
	description: string;
}) {
	return (
		<div className="text-center space-y-3">
			<div className="mx-auto h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
				{number}
			</div>
			<h4 className="font-semibold">{title}</h4>
			<p className="text-sm text-muted-foreground">{description}</p>
		</div>
	);
}

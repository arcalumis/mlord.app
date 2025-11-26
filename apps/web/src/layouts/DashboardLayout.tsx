import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";

const navItems = [
	{ path: "/dashboard", label: "Overview" },
	{ path: "/dashboard/requests", label: "Requests" },
	{ path: "/dashboard/vendors", label: "Vendors" },
	{ path: "/dashboard/ai-logs", label: "AI Logs" },
];

export function DashboardLayout() {
	const { user, logout } = useAuth();
	const location = useLocation();

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-card">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<div className="flex items-center gap-8">
						<Link to="/dashboard" className="text-xl font-bold">
							MLord
						</Link>
						<nav className="hidden md:flex items-center gap-1">
							{navItems.map((item) => (
								<Link key={item.path} to={item.path}>
									<Button
										variant={
											location.pathname === item.path ? "secondary" : "ghost"
										}
										size="sm"
									>
										{item.label}
									</Button>
								</Link>
							))}
						</nav>
					</div>
					<div className="flex items-center gap-4">
						<span className="hidden sm:inline text-sm text-muted-foreground">
							{user?.name || user?.email}
						</span>
						<Button variant="outline" size="sm" onClick={logout}>
							Sign Out
						</Button>
					</div>
				</div>
			</header>

			<main>
				<Outlet />
			</main>
		</div>
	);
}

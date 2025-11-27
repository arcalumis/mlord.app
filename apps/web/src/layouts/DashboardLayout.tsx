import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
	Brain,
	Crown,
	LayoutDashboard,
	LogOut,
	ScrollText,
	Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";

const navItems = [
	{ path: "/dashboard", label: "Throne Room", icon: LayoutDashboard },
	{ path: "/dashboard/requests", label: "Petitions", icon: ScrollText },
	{ path: "/dashboard/vendors", label: "Craftsmen", icon: Users },
	{ path: "/dashboard/ai-logs", label: "Oracle Logs", icon: Brain },
];

export function DashboardLayout() {
	const { user, logout } = useAuth();
	const location = useLocation();

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<div className="flex items-center gap-8">
						<Link to="/dashboard" className="flex items-center gap-2">
							<Crown className="h-7 w-7 text-primary" />
							<span className="text-xl font-bold tracking-tight">M'Lord</span>
						</Link>
						<nav className="hidden md:flex items-center gap-1">
							{navItems.map((item) => {
								const Icon = item.icon;
								const isActive = location.pathname === item.path;
								return (
									<Link key={item.path} to={item.path}>
										<Button
											variant={isActive ? "secondary" : "ghost"}
											size="sm"
											className="gap-2"
										>
											<Icon className="h-4 w-4" />
											{item.label}
										</Button>
									</Link>
								);
							})}
						</nav>
					</div>
					<div className="flex items-center gap-4">
						<div className="hidden sm:flex items-center gap-2 text-sm">
							<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
								<Crown className="h-4 w-4 text-primary" />
							</div>
							<span className="text-muted-foreground">
								{user?.name || user?.email}
							</span>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={logout}
							className="gap-2"
						>
							<LogOut className="h-4 w-4" />
							<span className="hidden sm:inline">Leave Court</span>
						</Button>
					</div>
				</div>
			</header>

			{/* Mobile Navigation */}
			<nav className="md:hidden border-b bg-card/50 overflow-x-auto">
				<div className="container mx-auto flex items-center gap-1 px-4 py-2">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.path;
						return (
							<Link key={item.path} to={item.path}>
								<Button
									variant={isActive ? "secondary" : "ghost"}
									size="sm"
									className="gap-2 whitespace-nowrap"
								>
									<Icon className="h-4 w-4" />
									{item.label}
								</Button>
							</Link>
						);
					})}
				</div>
			</nav>

			<main className="pb-8">
				<Outlet />
			</main>
		</div>
	);
}

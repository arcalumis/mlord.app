import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
} from "@tanstack/react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AILogsPage } from "./pages/AILogsPage";
import { CreateRequestPage } from "./pages/CreateRequestPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RequestDetailPage } from "./pages/RequestDetailPage";
import { RequestsListPage } from "./pages/RequestsListPage";
import { VendorsPage } from "./pages/VendorsPage";

// Root route
const rootRoute = createRootRoute({
	component: () => <Outlet />,
});

// Public routes
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: LandingPage,
});

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: LoginPage,
});

// Dashboard layout route (protected)
const dashboardLayoutRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/dashboard",
	component: () => (
		<ProtectedRoute>
			<DashboardLayout />
		</ProtectedRoute>
	),
});

// Dashboard child routes
const dashboardIndexRoute = createRoute({
	getParentRoute: () => dashboardLayoutRoute,
	path: "/",
	component: DashboardPage,
});

const requestsRoute = createRoute({
	getParentRoute: () => dashboardLayoutRoute,
	path: "/requests",
	component: RequestsListPage,
});

const newRequestRoute = createRoute({
	getParentRoute: () => dashboardLayoutRoute,
	path: "/requests/new",
	component: CreateRequestPage,
});

const requestDetailRoute = createRoute({
	getParentRoute: () => dashboardLayoutRoute,
	path: "/requests/$id",
	component: RequestDetailPage,
});

const vendorsRoute = createRoute({
	getParentRoute: () => dashboardLayoutRoute,
	path: "/vendors",
	component: VendorsPage,
});

const aiLogsRoute = createRoute({
	getParentRoute: () => dashboardLayoutRoute,
	path: "/ai-logs",
	component: AILogsPage,
});

// Route tree
const routeTree = rootRoute.addChildren([
	indexRoute,
	loginRoute,
	dashboardLayoutRoute.addChildren([
		dashboardIndexRoute,
		requestsRoute,
		newRequestRoute,
		requestDetailRoute,
		vendorsRoute,
		aiLogsRoute,
	]),
]);

// Create router
export const router = createRouter({ routeTree });

// Register router for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

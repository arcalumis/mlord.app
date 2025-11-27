import { Link } from "@tanstack/react-router";
import { Filter, Plus, ScrollText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../components/ui/table";
import { getMaintenanceRequests } from "../lib/api/maintenance";
import type {
	MaintenanceCategory,
	MaintenanceRequest,
	MaintenanceStatus,
	Pagination,
	Priority,
} from "../lib/api/types";

const STATUS_OPTIONS: MaintenanceStatus[] = [
	"PENDING",
	"SCHEDULED",
	"IN_PROGRESS",
	"COMPLETED",
	"CANCELLED",
];

const CATEGORY_OPTIONS: MaintenanceCategory[] = [
	"PLUMBING",
	"ELECTRICAL",
	"HVAC",
	"APPLIANCES",
	"LANDSCAPING",
	"PEST_CONTROL",
	"PAINTING",
	"ROOFING",
	"STRUCTURAL",
	"OTHER",
];

export function RequestsListPage() {
	const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
	const [pagination, setPagination] = useState<Pagination | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<string>("");
	const [categoryFilter, setCategoryFilter] = useState<string>("");

	const fetchRequests = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await getMaintenanceRequests({
				status: statusFilter as MaintenanceStatus | undefined,
				category: categoryFilter as MaintenanceCategory | undefined,
			});
			setRequests(result.data);
			setPagination(result.pagination || null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch requests");
		} finally {
			setIsLoading(false);
		}
	}, [statusFilter, categoryFilter]);

	useEffect(() => {
		fetchRequests();
	}, [fetchRequests]);

	const getStatusBadge = (status: MaintenanceStatus) => {
		const variants: Record<
			MaintenanceStatus,
			"default" | "secondary" | "destructive" | "outline"
		> = {
			PENDING: "secondary",
			SCHEDULED: "outline",
			IN_PROGRESS: "default",
			COMPLETED: "default",
			CANCELLED: "destructive",
		};
		return (
			<Badge variant={variants[status]}>{status.replace(/_/g, " ")}</Badge>
		);
	};

	const getPriorityBadge = (priority: Priority | null) => {
		if (!priority) return null;
		const variants: Record<
			Priority,
			"default" | "secondary" | "destructive" | "outline"
		> = {
			LOW: "outline",
			MEDIUM: "secondary",
			HIGH: "destructive",
			URGENT: "destructive",
		};
		return <Badge variant={variants[priority]}>{priority}</Badge>;
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="rounded-full bg-primary/10 p-2">
						<ScrollText className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h1 className="text-2xl font-bold">Petitions</h1>
						<p className="text-muted-foreground">
							Review the maintenance requests from across your realm
						</p>
					</div>
				</div>
				<Link to="/dashboard/requests/new">
					<Button className="gap-2">
						<Plus className="h-4 w-4" />
						New Petition
					</Button>
				</Link>
			</div>

			<Card className="mb-6">
				<CardHeader className="pb-3">
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-muted-foreground" />
						<CardTitle className="text-base">Filters</CardTitle>
					</div>
					<CardDescription>
						Sort through the petitions of your subjects
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex gap-4">
						<Select
							value={statusFilter}
							onValueChange={(value) =>
								setStatusFilter(value === "all" ? "" : value)
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="All Statuses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								{STATUS_OPTIONS.map((status) => (
									<SelectItem key={status} value={status}>
										{status.replace(/_/g, " ")}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={categoryFilter}
							onValueChange={(value) =>
								setCategoryFilter(value === "all" ? "" : value)
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="All Categories" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								{CATEGORY_OPTIONS.map((category) => (
									<SelectItem key={category} value={category}>
										{category.replace(/_/g, " ")}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="p-0">
					{isLoading ? (
						<div className="p-6 space-y-4">
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="h-12 w-full" />
							))}
						</div>
					) : error ? (
						<div className="p-6 text-center text-destructive">{error}</div>
					) : requests.length === 0 ? (
						<div className="p-12 text-center">
							<ScrollText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
							<p className="text-muted-foreground mb-4">
								No petitions have been submitted to the realm.
							</p>
							<Link to="/dashboard/requests/new">
								<Button variant="outline" className="gap-2">
									<Plus className="h-4 w-4" />
									Submit the First Petition
								</Button>
							</Link>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Title</TableHead>
									<TableHead>Property</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Priority</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Craftsman</TableHead>
									<TableHead>Submitted</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{requests.map((request) => (
									<TableRow
										key={request.id}
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => {
											window.location.href = `/dashboard/requests/${request.id}`;
										}}
									>
										<TableCell className="font-medium">
											{request.title}
										</TableCell>
										<TableCell className="max-w-[200px] truncate">
											{request.propertyAddress}
										</TableCell>
										<TableCell>
											{request.category?.replace(/_/g, " ") || "—"}
										</TableCell>
										<TableCell>{getPriorityBadge(request.priority)}</TableCell>
										<TableCell>{getStatusBadge(request.status)}</TableCell>
										<TableCell>
											{request.assignedVendor?.name || "Unassigned"}
										</TableCell>
										<TableCell>
											{new Date(request.createdAt).toLocaleDateString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{pagination && pagination.totalPages > 1 && (
				<div className="mt-4 text-center text-sm text-muted-foreground">
					Showing page {pagination.page} of {pagination.totalPages} (
					{pagination.total} total petitions)
				</div>
			)}
		</div>
	);
}

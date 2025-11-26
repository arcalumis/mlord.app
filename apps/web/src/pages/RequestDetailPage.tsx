import { Link, useParams } from "@tanstack/react-router";
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
	deleteMaintenanceRequest,
	getMaintenanceRequest,
	updateMaintenanceRequest,
} from "../lib/api/maintenance";
import type {
	MaintenanceRequest,
	MaintenanceStatus,
	Priority,
	Vendor,
} from "../lib/api/types";
import { getVendors } from "../lib/api/vendors";

const STATUS_OPTIONS: MaintenanceStatus[] = [
	"PENDING",
	"SCHEDULED",
	"IN_PROGRESS",
	"COMPLETED",
	"CANCELLED",
];

export function RequestDetailPage() {
	const { id } = useParams({ from: "/dashboard/requests/$id" });
	const [request, setRequest] = useState<MaintenanceRequest | null>(null);
	const [vendors, setVendors] = useState<Vendor[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isUpdating, setIsUpdating] = useState(false);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const [requestResult, vendorsResult] = await Promise.all([
				getMaintenanceRequest(id),
				getVendors({ isActive: true }),
			]);
			setRequest(requestResult.data);
			setVendors(vendorsResult.data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch data");
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleStatusChange = async (status: MaintenanceStatus) => {
		if (!request) return;
		setIsUpdating(true);
		try {
			const result = await updateMaintenanceRequest(request.id, { status });
			setRequest(result.data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update status");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleVendorChange = async (vendorId: string) => {
		if (!request) return;
		setIsUpdating(true);
		try {
			const result = await updateMaintenanceRequest(request.id, {
				assignedVendorId: vendorId === "unassigned" ? null : vendorId,
			});
			setRequest(result.data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to assign vendor");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDelete = async () => {
		if (!request || !confirm("Are you sure you want to delete this request?"))
			return;
		try {
			await deleteMaintenanceRequest(request.id);
			window.location.href = "/dashboard/requests";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete request");
		}
	};

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

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8 space-y-6">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-48 w-full" />
				<Skeleton className="h-48 w-full" />
			</div>
		);
	}

	if (error || !request) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardContent className="p-6 text-center text-destructive">
						{error || "Request not found"}
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<Link
						to="/dashboard/requests"
						className="text-sm text-muted-foreground hover:underline"
					>
						&larr; Back to Requests
					</Link>
					<h1 className="text-2xl font-bold mt-2">{request.title}</h1>
					<p className="text-muted-foreground">
						Created {new Date(request.createdAt).toLocaleDateString()}
					</p>
				</div>
				<Button variant="destructive" onClick={handleDelete}>
					Delete Request
				</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Request Details</CardTitle>
						<CardDescription>Information about this request</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Description
							</label>
							<p className="mt-1">{request.description}</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Property Address
							</label>
							<p className="mt-1">{request.propertyAddress}</p>
						</div>
						<div className="flex gap-4">
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Category
								</label>
								<p className="mt-1">
									{request.category?.replace(/_/g, " ") || "Uncategorized"}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Priority
								</label>
								<div className="mt-1">
									{getPriorityBadge(request.priority) || "Not set"}
								</div>
							</div>
						</div>
						{request.scheduledDate && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Scheduled Date
								</label>
								<p className="mt-1">
									{new Date(request.scheduledDate).toLocaleDateString()}
								</p>
							</div>
						)}
						{request.estimatedCost && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Estimated Cost
								</label>
								<p className="mt-1">${request.estimatedCost.toFixed(2)}</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Management</CardTitle>
						<CardDescription>Update status and assignment</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Current Status
							</label>
							<div className="mt-2">{getStatusBadge(request.status)}</div>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Update Status
							</label>
							<Select
								value={request.status}
								onValueChange={(value) =>
									handleStatusChange(value as MaintenanceStatus)
								}
								disabled={isUpdating}
							>
								<SelectTrigger className="mt-2">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{STATUS_OPTIONS.map((status) => (
										<SelectItem key={status} value={status}>
											{status.replace(/_/g, " ")}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Assigned Vendor
							</label>
							<Select
								value={request.assignedVendorId || "unassigned"}
								onValueChange={handleVendorChange}
								disabled={isUpdating}
							>
								<SelectTrigger className="mt-2">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="unassigned">Unassigned</SelectItem>
									{vendors.map((vendor) => (
										<SelectItem key={vendor.id} value={vendor.id}>
											{vendor.name} ({vendor.category.replace(/_/g, " ")})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{request.aiCategory && (
					<Card className="md:col-span-2">
						<CardHeader>
							<CardTitle>AI Classification</CardTitle>
							<CardDescription>
								Automatic categorization by AI assistant
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 sm:grid-cols-3">
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										AI Suggested Category
									</label>
									<p className="mt-1">
										{request.aiCategory.replace(/_/g, " ")}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										AI Suggested Priority
									</label>
									<div className="mt-1">
										{getPriorityBadge(request.aiPriority) || "Not set"}
									</div>
								</div>
								{request.assignedVendor && (
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											AI Matched Vendor
										</label>
										<p className="mt-1">{request.assignedVendor.name}</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}

import { useEffect, useState } from "react";
import { Badge } from "../components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import { getAILogs } from "../lib/api/maintenance";
import type { AILogEntry, Priority } from "../lib/api/types";

export function AILogsPage() {
	const [logs, setLogs] = useState<AILogEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchLogs = async () => {
			try {
				const result = await getAILogs();
				setLogs(result.data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch AI logs",
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLogs();
	}, []);

	const getPriorityColor = (priority: Priority) => {
		switch (priority) {
			case "URGENT":
			case "HIGH":
				return "destructive";
			case "MEDIUM":
				return "secondary";
			case "LOW":
				return "outline";
			default:
				return "secondary";
		}
	};

	const formatDate = (timestamp: string) => {
		return new Date(timestamp).toLocaleString();
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<h1 className="text-2xl font-bold">AI Assignment Logs</h1>
				<p className="text-muted-foreground">
					View the AI's reasoning for each maintenance request classification
				</p>
			</div>

			{isLoading ? (
				<div className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<Card key={i}>
							<CardContent className="p-6">
								<Skeleton className="h-6 w-1/3 mb-4" />
								<Skeleton className="h-4 w-full mb-2" />
								<Skeleton className="h-4 w-2/3" />
							</CardContent>
						</Card>
					))}
				</div>
			) : error ? (
				<Card>
					<CardContent className="p-6 text-center text-destructive">
						{error}
					</CardContent>
				</Card>
			) : logs.length === 0 ? (
				<Card>
					<CardContent className="p-6 text-center text-muted-foreground">
						No AI logs yet. Submit a maintenance request to see AI
						classification in action.
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{logs.map((log, index) => (
						<Card key={index}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div>
										<CardTitle className="text-lg">
											{log.requestTitle}
										</CardTitle>
										<CardDescription>
											{formatDate(log.timestamp)}
										</CardDescription>
									</div>
									<div className="flex gap-2">
										<Badge variant="outline">
											{log.classification.category.replace(/_/g, " ")}
										</Badge>
										<Badge
											variant={getPriorityColor(log.classification.priority)}
										>
											{log.classification.priority}
										</Badge>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<h4 className="font-medium text-sm mb-1">
										Request Description
									</h4>
									<p className="text-sm text-muted-foreground">
										{log.requestDescription}
									</p>
								</div>

								<Separator />

								<div>
									<h4 className="font-medium text-sm mb-1">AI Reasoning</h4>
									<p className="text-sm">{log.classification.reasoning}</p>
								</div>

								<div className="flex items-center gap-4 text-sm">
									<span>
										<span className="text-muted-foreground">Confidence:</span>{" "}
										<span className="font-medium">
											{Math.round(log.classification.confidence * 100)}%
										</span>
									</span>
									{log.classification.vendorId && (
										<span>
											<span className="text-muted-foreground">
												Assigned Vendor:
											</span>{" "}
											<span className="font-medium">
												{log.availableVendors.find(
													(v) => v.id === log.classification.vendorId,
												)?.name || "Unknown"}
											</span>
										</span>
									)}
								</div>

								{log.availableVendors.length > 0 && (
									<>
										<Separator />
										<div>
											<h4 className="font-medium text-sm mb-2">
												Available Vendors Considered
											</h4>
											<div className="flex flex-wrap gap-2">
												{log.availableVendors.map((vendor) => (
													<Badge
														key={vendor.id}
														variant={
															vendor.id === log.classification.vendorId
																? "default"
																: "outline"
														}
													>
														{vendor.name} ({vendor.category.replace(/_/g, " ")}
														{vendor.rating ? ` - ${vendor.rating}★` : ""})
													</Badge>
												))}
											</div>
										</div>
									</>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

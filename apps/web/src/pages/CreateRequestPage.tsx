import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { createMaintenanceRequest } from "../lib/api/maintenance";
import type {
	AIClassification,
	MaintenanceCategory,
	Priority,
} from "../lib/api/types";

const CATEGORIES: MaintenanceCategory[] = [
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

const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const requestSchema = z.object({
	title: z.string().min(1, "Title is required").max(100, "Title too long"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	propertyAddress: z.string().min(1, "Property address is required"),
	category: z.string().optional(),
	priority: z.string().optional(),
});

type RequestFormData = z.infer<typeof requestSchema>;

export function CreateRequestPage() {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [aiResult, setAiResult] = useState<AIClassification | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<RequestFormData>({
		resolver: zodResolver(requestSchema),
		defaultValues: {
			title: "",
			description: "",
			propertyAddress: "",
		},
	});

	const selectedCategory = watch("category");
	const selectedPriority = watch("priority");

	const onSubmit = async (data: RequestFormData) => {
		setIsSubmitting(true);
		setError(null);

		try {
			const result = await createMaintenanceRequest({
				title: data.title,
				description: data.description,
				propertyAddress: data.propertyAddress,
				category: data.category as MaintenanceCategory | undefined,
				priority: data.priority as Priority | undefined,
			});

			setAiResult(result.aiClassification);

			// Wait a moment to show the AI result, then redirect
			setTimeout(() => {
				navigate({ to: "/dashboard/requests" });
			}, 3000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create request");
		} finally {
			setIsSubmitting(false);
		}
	};

	const getPriorityColor = (priority: Priority) => {
		switch (priority) {
			case "URGENT":
				return "destructive";
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

	return (
		<div className="container mx-auto max-w-2xl px-4 py-8">
			<Card>
				<CardHeader>
					<CardTitle>Submit Maintenance Request</CardTitle>
					<CardDescription>
						Describe your maintenance issue and our AI will automatically
						categorize it and assign the best vendor.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{aiResult && (
						<Alert className="mb-6">
							<AlertTitle>AI Classification Complete</AlertTitle>
							<AlertDescription className="mt-2 space-y-2">
								<div className="flex flex-wrap gap-2">
									<Badge variant="outline">Category: {aiResult.category}</Badge>
									<Badge variant={getPriorityColor(aiResult.priority)}>
										Priority: {aiResult.priority}
									</Badge>
									<Badge variant="secondary">
										Confidence: {Math.round(aiResult.confidence * 100)}%
									</Badge>
								</div>
								<p className="mt-2 text-sm">{aiResult.reasoning}</p>
								{aiResult.vendorId && (
									<p className="text-sm text-muted-foreground">
										A vendor has been automatically assigned.
									</p>
								)}
								<p className="text-sm text-muted-foreground">
									Redirecting to requests list...
								</p>
							</AlertDescription>
						</Alert>
					)}

					{error && (
						<Alert variant="destructive" className="mb-6">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								placeholder="Brief description of the issue"
								{...register("title")}
							/>
							{errors.title && (
								<p className="text-sm text-destructive">
									{errors.title.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								placeholder="Provide detailed information about the maintenance issue..."
								rows={5}
								{...register("description")}
							/>
							{errors.description && (
								<p className="text-sm text-destructive">
									{errors.description.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="propertyAddress">Property Address</Label>
							<Input
								id="propertyAddress"
								placeholder="123 Main St, City, State 12345"
								{...register("propertyAddress")}
							/>
							{errors.propertyAddress && (
								<p className="text-sm text-destructive">
									{errors.propertyAddress.message}
								</p>
							)}
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="category">
									Category (optional - AI will suggest)
								</Label>
								<Select
									value={selectedCategory}
									onValueChange={(value) => setValue("category", value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Let AI decide" />
									</SelectTrigger>
									<SelectContent>
										{CATEGORIES.map((cat) => (
											<SelectItem key={cat} value={cat}>
												{cat.replace(/_/g, " ")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="priority">
									Priority (optional - AI will suggest)
								</Label>
								<Select
									value={selectedPriority}
									onValueChange={(value) => setValue("priority", value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Let AI decide" />
									</SelectTrigger>
									<SelectContent>
										{PRIORITIES.map((pri) => (
											<SelectItem key={pri} value={pri}>
												{pri}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate({ to: "/dashboard" })}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Submitting..." : "Submit Request"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

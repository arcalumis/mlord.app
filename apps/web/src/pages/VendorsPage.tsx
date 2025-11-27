import { Filter, Plus, Search, Users, Wrench } from "lucide-react";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
import { Textarea } from "../components/ui/textarea";
import type { MaintenanceCategory, Vendor } from "../lib/api/types";
import {
	createVendor,
	deleteVendor,
	getVendors,
	updateVendor,
} from "../lib/api/vendors";

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

interface VendorFormData {
	name: string;
	category: MaintenanceCategory;
	contactName: string;
	email: string;
	phone: string;
	address: string;
	rating: string;
	notes: string;
}

const emptyForm: VendorFormData = {
	name: "",
	category: "OTHER",
	contactName: "",
	email: "",
	phone: "",
	address: "",
	rating: "",
	notes: "",
};

export function VendorsPage() {
	const [vendors, setVendors] = useState<Vendor[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
	const [formData, setFormData] = useState<VendorFormData>(emptyForm);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [categoryFilter, setCategoryFilter] = useState<string>("");
	const [searchQuery, setSearchQuery] = useState("");

	const fetchVendors = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await getVendors({
				category: categoryFilter as MaintenanceCategory | undefined,
				search: searchQuery || undefined,
			});
			setVendors(result.data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch vendors");
		} finally {
			setIsLoading(false);
		}
	}, [categoryFilter, searchQuery]);

	useEffect(() => {
		fetchVendors();
	}, [fetchVendors]);

	const handleOpenDialog = (vendor?: Vendor) => {
		if (vendor) {
			setEditingVendor(vendor);
			setFormData({
				name: vendor.name,
				category: vendor.category,
				contactName: vendor.contactName || "",
				email: vendor.email || "",
				phone: vendor.phone,
				address: vendor.address || "",
				rating: vendor.rating?.toString() || "",
				notes: vendor.notes || "",
			});
		} else {
			setEditingVendor(null);
			setFormData(emptyForm);
		}
		setIsDialogOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const data = {
				name: formData.name,
				category: formData.category,
				contactName: formData.contactName || undefined,
				email: formData.email || undefined,
				phone: formData.phone,
				address: formData.address || undefined,
				rating: formData.rating
					? Number.parseFloat(formData.rating)
					: undefined,
				notes: formData.notes || undefined,
			};

			if (editingVendor) {
				await updateVendor(editingVendor.id, data);
			} else {
				await createVendor(data);
			}

			setIsDialogOpen(false);
			fetchVendors();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save vendor");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Banish this craftsman from your realm?")) return;

		try {
			await deleteVendor(id);
			fetchVendors();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete vendor");
		}
	};

	const handleToggleActive = async (vendor: Vendor) => {
		try {
			await updateVendor(vendor.id, { isActive: !vendor.isActive });
			fetchVendors();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update vendor");
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="rounded-full bg-primary/10 p-2">
						<Wrench className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h1 className="text-2xl font-bold">Craftsmen Guild</h1>
						<p className="text-muted-foreground">
							Manage the artisans and tradespeople who serve your realm
						</p>
					</div>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => handleOpenDialog()} className="gap-2">
							<Plus className="h-4 w-4" />
							Recruit Craftsman
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>
								{editingVendor ? "Update Craftsman" : "Recruit New Craftsman"}
							</DialogTitle>
							<DialogDescription>
								{editingVendor
									? "Update the details of this artisan"
									: "Add a new tradesperson to your guild"}
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name *</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="category">Trade *</Label>
								<Select
									value={formData.category}
									onValueChange={(value) =>
										setFormData({
											...formData,
											category: value as MaintenanceCategory,
										})
									}
								>
									<SelectTrigger>
										<SelectValue />
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
								<Label htmlFor="phone">Messenger Raven (Phone) *</Label>
								<Input
									id="phone"
									value={formData.phone}
									onChange={(e) =>
										setFormData({ ...formData, phone: e.target.value })
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Electronic Scroll (Email)</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="contactName">Contact Name</Label>
								<Input
									id="contactName"
									value={formData.contactName}
									onChange={(e) =>
										setFormData({ ...formData, contactName: e.target.value })
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="rating">Reputation (0-5)</Label>
								<Input
									id="rating"
									type="number"
									min="0"
									max="5"
									step="0.1"
									value={formData.rating}
									onChange={(e) =>
										setFormData({ ...formData, rating: e.target.value })
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="notes">Notes</Label>
								<Textarea
									id="notes"
									value={formData.notes}
									onChange={(e) =>
										setFormData({ ...formData, notes: e.target.value })
									}
								/>
							</div>

							<div className="flex justify-end gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsDialogOpen(false)}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? "Enrolling..." : "Enroll in Guild"}
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<Card className="mb-6">
				<CardHeader className="pb-3">
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-muted-foreground" />
						<CardTitle className="text-base">Filters</CardTitle>
					</div>
					<CardDescription>
						Search through your guild of craftsmen
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex gap-4">
						<div className="relative flex-1 max-w-xs">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search craftsmen..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
						<Select
							value={categoryFilter}
							onValueChange={(value) =>
								setCategoryFilter(value === "all" ? "" : value)
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="All Trades" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Trades</SelectItem>
								{CATEGORIES.map((cat) => (
									<SelectItem key={cat} value={cat}>
										{cat.replace(/_/g, " ")}
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
					) : vendors.length === 0 ? (
						<div className="p-12 text-center">
							<Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
							<p className="text-muted-foreground mb-4">
								No craftsmen have joined your guild yet.
							</p>
							<Button
								variant="outline"
								className="gap-2"
								onClick={() => handleOpenDialog()}
							>
								<Plus className="h-4 w-4" />
								Recruit Your First Craftsman
							</Button>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Trade</TableHead>
									<TableHead>Contact</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Reputation</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{vendors.map((vendor) => (
									<TableRow key={vendor.id}>
										<TableCell className="font-medium">{vendor.name}</TableCell>
										<TableCell>{vendor.category.replace(/_/g, " ")}</TableCell>
										<TableCell>{vendor.phone}</TableCell>
										<TableCell>{vendor.email || "—"}</TableCell>
										<TableCell>
											{vendor.rating ? `${vendor.rating}/5` : "—"}
										</TableCell>
										<TableCell>
											<Badge
												variant={vendor.isActive ? "default" : "secondary"}
											>
												{vendor.isActive ? "Active" : "Inactive"}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex gap-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleOpenDialog(vendor)}
												>
													Edit
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleToggleActive(vendor)}
												>
													{vendor.isActive ? "Suspend" : "Reinstate"}
												</Button>
												<Button
													size="sm"
													variant="ghost"
													className="text-destructive"
													onClick={() => handleDelete(vendor.id)}
												>
													Banish
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

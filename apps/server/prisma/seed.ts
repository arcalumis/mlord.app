import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
	console.log("Seeding database...");

	// Create admin user
	const adminPassword = await bcrypt.hash("password", SALT_ROUNDS);

	const admin = await prisma.user.upsert({
		where: { email: "admin@mlord.app" },
		update: {},
		create: {
			email: "admin@mlord.app",
			passwordHash: adminPassword,
			name: "Admin User",
			role: "ADMIN",
		},
	});

	console.log("Created admin user:", admin.email);

	// Create some sample vendors
	const vendors = [
		{
			name: "Quick Fix Plumbing",
			category: "PLUMBING" as const,
			contactName: "John Smith",
			email: "john@quickfixplumbing.com",
			phone: "555-0101",
			rating: 4.5,
		},
		{
			name: "Bright Spark Electric",
			category: "ELECTRICAL" as const,
			contactName: "Sarah Johnson",
			email: "sarah@brightsparkelectric.com",
			phone: "555-0102",
			rating: 4.8,
		},
		{
			name: "Cool Breeze HVAC",
			category: "HVAC" as const,
			contactName: "Mike Davis",
			email: "mike@coolbreezehvac.com",
			phone: "555-0103",
			rating: 4.2,
		},
		{
			name: "Green Thumb Landscaping",
			category: "LANDSCAPING" as const,
			contactName: "Emily Brown",
			email: "emily@greenthumb.com",
			phone: "555-0104",
			rating: 4.7,
		},
	];

	for (const vendor of vendors) {
		const created = await prisma.vendor.upsert({
			where: {
				id: `seed-${vendor.name.toLowerCase().replace(/\s+/g, "-")}`
			},
			update: vendor,
			create: {
				id: `seed-${vendor.name.toLowerCase().replace(/\s+/g, "-")}`,
				...vendor,
			},
		});
		console.log("Created vendor:", created.name);
	}

	console.log("Seeding complete!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

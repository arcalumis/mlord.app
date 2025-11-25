import { PrismaClient } from "@prisma/client";

/**
 * PrismaClient is attached to the `global` object in development to prevent
 * exhausting your database connection limit during hot-reloading in development.
 *
 * Learn more:
 * https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaClientSingleton = () => {
	return new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "info", "warn", "error"]
				: ["error"],
		// Connection pool settings
		// Adjust based on your database's max_connections setting
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	});
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import prisma from "../config/prisma";

export const getHealth = async () => {
	try {
		await prisma.$queryRaw`SELECT 1`;
		return { status: "ok", db: "ok" };
	} catch (e) {
		return { status: "ok", db: "error" };
	}
};

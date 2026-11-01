import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// biome-ignore lint/style/noNonNullAssertion: "DATABASE_URL is defined"
const connectionString = process.env.DATABASE_URL!; 

// Reuse one client across dev hot reloads so connection pools don't pile up.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };

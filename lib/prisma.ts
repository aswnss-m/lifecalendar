import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// biome-ignore lint/style/noNonNullAssertion: "DATABASE_URL is defined"
const connectionString = process.env.DATABASE_URL!; 

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
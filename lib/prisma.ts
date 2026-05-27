// Singleton Prisma client.
//
// In dev, Next.js hot-reloads server modules on every request which would
// otherwise create a new PrismaClient (and a new DB connection pool) each
// time. Stashing the instance on `globalThis` keeps one client across reloads.
//
// The generated client lives at lib/generated/prisma per prisma/schema.prisma.

import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

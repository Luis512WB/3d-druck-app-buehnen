import { PrismaClient } from "@prisma/client";

// Im Entwicklungsmodus lädt Next.js Module neu – ohne diesen Zwischenspeicher
// entstünde bei jedem Neuladen eine weitere Datenbankverbindung.
const global = globalThis as unknown as { prisma?: PrismaClient };

export const db = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = db;

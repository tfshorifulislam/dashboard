import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

declare global {
  var __prismaClient: PrismaClient | undefined
  var __pgPool: pg.Pool | undefined
}

function getPrismaInstance(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    // Fallback instance when DATABASE_URL is not set (e.g. during build or static analysis)
    return new PrismaClient()
  }

  // Reuse pg.Pool across hot-reloads in development
  const pool = globalThis.__pgPool ?? new pg.Pool({ connectionString })
  if (process.env.NODE_ENV !== "production") {
    globalThis.__pgPool = pool
  }

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma: PrismaClient =
  globalThis.__prismaClient ?? getPrismaInstance()

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaClient = prisma
}


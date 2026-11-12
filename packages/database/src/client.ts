import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/index.js'

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL
const isProduction = process.env.NODE_ENV === 'production'
const pool = new Pool({
	connectionString,
	max: 10,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 15000,
	allowExitOnIdle: true,
	ssl: isProduction
		? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true' }
		: false,
})
const adapter = new PrismaPg(pool)

export const prisma: PrismaClient =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
	})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

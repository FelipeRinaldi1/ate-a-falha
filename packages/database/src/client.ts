import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/index.js'
import dotenv from 'dotenv'
import path from 'path'

if (!process.env.DATABASE_URL) {
	dotenv.config({ path: path.resolve(__dirname, '../../../apps/api/.env') })
}

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL
const isProduction = process.env.NODE_ENV === 'production'
const pool = new Pool({
	connectionString,
	max: 10,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
	ssl: isProduction ? { rejectUnauthorized: false } : false
})
const adapter = new PrismaPg(pool)

export const prisma: PrismaClient =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
	})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

import { defineConfig } from 'prisma/config'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../apps/api/.env') })

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
		seed: 'npx tsx src/seeds/index.ts',
	},
	datasource: {
		url: process.env.DIRECT_URL || process.env.DATABASE_URL,
	},
})

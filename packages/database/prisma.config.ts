import { defineConfig } from 'prisma/config'

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
		seed: 'npx tsx src/seeds/index.ts',
	},
	datasource: {
		url: process.env.DIRECT_URL,
	},
})

import { defineConfig } from 'prisma/config'

// DATABASE_URL resolution:
// - Inside Docker: injected by docker-compose via env_file (process.env)
// - Local dev:     set in .env.local at the repo root (loaded by dotenv before this runs)
export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
		seed: 'npx tsx src/seeds/index.ts',
	},
	datasource: {
		url: process.env.DATABASE_URL,
	},
})

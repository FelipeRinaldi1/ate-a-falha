import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll } from 'vitest'

process.env.NODE_ENV = 'test'

const apiRootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const testEnvPath = path.resolve(apiRootDir, '.env.test')
const fallbackEnvPath = path.resolve(apiRootDir, '.env')
const envPath = fs.existsSync(testEnvPath) ? testEnvPath : fallbackEnvPath

const loaded = dotenv.config({ path: envPath, override: true })
expand(loaded)

afterAll(async () => {
	const { prisma } = await import('@ate-a-falha/database')
	await prisma.$disconnect()
})

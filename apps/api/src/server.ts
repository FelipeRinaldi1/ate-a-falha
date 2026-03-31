import { ENV } from './config/env.js'
import app from './app.js'
import { prisma } from '@ate-a-falha/database'

const PORT = ENV.PORT

async function main() {
	await prisma.$connect()
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
}

main()
	.catch((e: any) => {
		console.error(e.message)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

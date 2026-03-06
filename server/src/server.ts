import app from './app.js'
import { prisma } from './infra/prisma.client.js'
const PORT = 3000
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

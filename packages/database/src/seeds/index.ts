import { seedFoods } from './food.seed.js'
import { prisma } from '../client.js'
async function main() {
	console.log('Starting seeding...')
	await seedFoods()
	console.log('Finishing seeding...')
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.log(e)
		await prisma.$disconnect()
		process.exit(1)
	})

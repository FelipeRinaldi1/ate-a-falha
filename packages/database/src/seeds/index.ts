import { seedFoods } from './food.seed.js'
import { seedExercises } from './exercise.seed.js'
import { prisma } from '@ate-a-falha/database/src/client.js'

try {
	console.log('Starting seeding...')
	await seedFoods()
	await seedExercises()
	console.log('Finishing seeding...')
} catch (e) {
	console.error(e)
	await prisma.$disconnect()
	process.exit(1)
} finally {
	await prisma.$disconnect()
}

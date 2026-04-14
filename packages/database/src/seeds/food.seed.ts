import 'dotenv/config'
import { prisma } from '../client.js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Food } from '@/generated/prisma/client.js'

export async function seedFoods() {
	console.log('Starting food seed')
	try {
		const goldPath = resolve(process.cwd(), '../../data/gold/taco.gold.json')
		const fileContent = readFileSync(goldPath, 'utf-8')
		const foods: Food[] = JSON.parse(fileContent)

		console.log(`${foods.length} foods found`)

		await prisma.food.deleteMany({
			where: { userId: null },
		})

		console.log('Deleted all system foods')

		const result = await prisma.food.createMany({
			data: foods,
			skipDuplicates: true,
		})

		console.log(`Created ${result.count} new foods`)
	} catch (error) {
		console.error('No seed', error)
		process.exit(1)
	}
}

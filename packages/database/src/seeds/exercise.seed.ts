import 'dotenv/config'
import { prisma } from '../client.js'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { Exercise } from '@/generated/prisma/client.js'

export async function seedExercises() {
	console.log('Starting exercise seed')
	try {
		const goldPath = path.join(process.env.DATA_GOLD_PATH!, 'exercises.gold.json')
		const exercises: Exercise[] = JSON.parse(readFileSync(goldPath, 'utf-8'))

		for (const exercise of exercises) {
			await prisma.exercise.upsert({
				where: { externalId: exercise.externalId },
				update: exercise,
				create: exercise,
			})
		}
	} catch (error) {
		console.error('No seed', error)
		process.exit(1)
	}
}

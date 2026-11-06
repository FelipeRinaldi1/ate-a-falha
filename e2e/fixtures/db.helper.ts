import { prisma } from '@ate-a-falha/database'

export { prisma }

export async function cleanupUserByEmail(email: string): Promise<void> {
	try {
		const auth = await prisma.auth.findUnique({ where: { email } })
		if (auth) {
			await prisma.user.delete({ where: { id: auth.userId } })
		}
	} catch {
		// Ignore if already deleted
	}
}

export async function cleanupUserById(userId: string): Promise<void> {
	try {
		await prisma.user.delete({ where: { id: userId } })
	} catch {
		// Ignore if already deleted
	}
}

export async function getFirstCatalogExercise() {
	return prisma.exercise.findFirst({
		orderBy: { name: 'asc' },
	})
}

export async function getFirstGlobalFood() {
	return prisma.food.findFirst({
		where: { userId: null },
		orderBy: { name: 'asc' },
	})
}

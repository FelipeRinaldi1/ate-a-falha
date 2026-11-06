import { test, expect } from '../fixtures/auth.fixture'
import { prisma, getFirstCatalogExercise, cleanupUserById } from '../fixtures/db.helper'
import { ShareLogic } from '@ate-a-falha/shared'

test.describe('Suíte 05: Compartilhamento Híbrido (Código Curto T-XXXXXX e Deep Copy) (BDD)', () => {
	let authorUserId = ''
	let authorPlanId = ''
	let shortCode = ''

	test.beforeAll(async () => {
		const exercise = await getFirstCatalogExercise()
		const unique = `${Date.now()}-${Math.floor(Math.random() * 10000)}`

		// Cria um autor (Usuário A) e uma ficha com exercício/séries diretamente no BD para ser compartilhada
		const author = await prisma.user.create({
			data: {
				name: 'Autor da Ficha Original',
				birthDate: new Date('1995-01-10'),
				gender: 'MALE',
				auth: {
					create: {
						email: `autor.share.${unique}@ateafalha.com.br`,
						password: 'HashedPassword123!',
					},
				},
			},
		})
		authorUserId = author.id

		const plan = await prisma.plan.create({
			data: {
				name: 'Treino Força Exportado E2E',
				goal: 'forca',
				isActive: true,
				isExported: true,
				userId: author.id,
				workouts: {
					create: {
						name: 'Peito e Tríceps Pesado',
						day: 'A',
						workoutExercises: {
							create: {
								orderIndex: 0,
								exerciseId: exercise!.id,
								sets: {
									create: [
										{ setNumber: 1, repetitions: 8, weight: 100, restTimeSeconds: 90 },
										{ setNumber: 2, repetitions: 8, weight: 100, restTimeSeconds: 90 },
									],
								},
							},
						},
					},
				},
			},
		})
		authorPlanId = plan.id
		shortCode = ShareLogic.generateShareCode('workout', plan.id)
	})

	test.afterAll(async () => {
		if (authorUserId) {
			await cleanupUserById(authorUserId)
		}
	})

	test('Deve resolver código curto (T-XXXXXX) no modal de importação, clonar profundamente (deep copy) para o destinatário e preservar o original intacto', async ({
		page,
		authUser,
	}) => {
		await test.step('Dado que o usuário destinatário (Usuário B) abre o modal de importação em /workout/plans', async () => {
			await page.goto('/workout/plans')
			await page.getByRole('button', { name: 'Importar via Código ou QR Code' }).click()
			await expect(page.getByText('Importar Rotina Compartilhada')).toBeVisible()
		})

		await test.step(`Quando digita o código curto ${shortCode} e busca a rotina`, async () => {
			await page.getByLabel('Código ou Link da Rotina').fill(shortCode)
			await page.getByRole('button', { name: 'Buscar e Visualizar Rotina' }).click()
		})

		await test.step('Então é redirecionado para a página pública (/share/workout/:id) exibindo a ficha completa do autor', async () => {
			await expect(page).toHaveURL(new RegExp(`/share/workout/${authorPlanId}`))
			await expect(page.getByText('Treino Força Exportado E2E')).toBeVisible()
			await expect(page.getByText('Peito e Tríceps Pesado')).toBeVisible()
		})

		await test.step('Quando clica em Importar Treino para Minha Conta', async () => {
			await page.getByRole('button', { name: 'Importar Treino para Minha Conta' }).click()
			await expect(page).toHaveURL(/\/workout\/plans/)
			await expect(page.getByText('Treino Força Exportado E2E')).toBeVisible()
		})

		await test.step('Então o PostgreSQL possui uma cópia independente (deep copy) vinculada ao Usuário B e preserva a ficha do Usuário A', async () => {
			const recipientPlans = await prisma.plan.findMany({
				where: { userId: authUser.id },
				include: {
					workouts: {
						include: {
							workoutExercises: {
								include: { sets: true },
							},
						},
					},
				},
			})

			expect(recipientPlans.length).toBe(1)
			const clonedPlan = recipientPlans[0]

			// Garante que o ID do plano clonado é diferente do original
			expect(clonedPlan.id).not.toBe(authorPlanId)
			expect(clonedPlan.name).toContain('Treino Força Exportado E2E')
			expect(clonedPlan.workouts.length).toBe(1)
			expect(clonedPlan.workouts[0].workoutExercises.length).toBe(1)
			expect(clonedPlan.workouts[0].workoutExercises[0].sets.length).toBe(2)
			expect(clonedPlan.workouts[0].workoutExercises[0].sets[0].weight).toBe(100)

			// Verifica se excluir o plano clonado do Usuário B NÃO afeta o plano original do Usuário A
			await prisma.plan.delete({ where: { id: clonedPlan.id } })
			const originalPlanStillExists = await prisma.plan.findUnique({
				where: { id: authorPlanId },
				include: { workouts: true },
			})
			expect(originalPlanStillExists).not.toBeNull()
			expect(originalPlanStillExists?.workouts.length).toBe(1)
		})
	})
})

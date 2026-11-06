import { test, expect } from '../fixtures/auth.fixture'
import { prisma, getFirstCatalogExercise } from '../fixtures/db.helper'

test.describe('Suíte 03: Ciclo Completo de Treino — Criação, Persistência Local e Execução (BDD)', () => {
	test('Deve criar ficha de treino, adicionar exercício e séries, executar treino com persistência em localStorage e registrar conclusão no BD e calendário', async ({
		page,
		authUser,
	}) => {
		const planName = 'Ficha Hipertrofia E2E'
		const catalogExercise = await getFirstCatalogExercise()
		expect(catalogExercise).not.toBeNull()

		let createdPlanId = ''
		let createdWorkoutId = ''

		await test.step('Dado que o usuário acessa Minhas Fichas (/workout/plans) e cria uma nova ficha', async () => {
			await page.goto('/workout/plans')
			await expect(page.getByText('Minhas Fichas')).toBeVisible()

			await page.getByRole('button', { name: 'Nova Ficha' }).click()
			await expect(page.getByText('Criar Nova Ficha de Treino')).toBeVisible()

			await page.getByLabel('Nome da Ficha').fill(planName)
			await page.getByRole('button', { name: 'Criar Ficha' }).click()

			await expect(page.getByText(planName)).toBeVisible()

			const planInDb = await prisma.plan.findFirst({
				where: { userId: authUser.id, name: planName },
			})
			expect(planInDb).not.toBeNull()
			createdPlanId = planInDb!.id
		})

		await test.step('Quando verifica que a primeira ficha já nasce ativa e entra na edição (/workout/plans/:id/edit), adiciona exercício do catálogo e ajusta carga', async () => {
			// A primeira ficha do usuário já nasce com isActive = true (botão exibe "Ativar" quando isActive=true; clicamos direto no card para editar)
			await page.getByText(planName).click()
			await expect(page).toHaveURL(new RegExp(`/workout/plans/${createdPlanId}/edit`))

			// Adiciona exercício ao Treino A
			await page.getByRole('button', { name: 'Adicionar Exercício' }).first().click()
			await expect(page.getByText('Adicionar Exercício ao Treino A')).toBeVisible()

			// Busca e seleciona o exercício do catálogo
			const searchInput = page.getByPlaceholder('Buscar no catálogo...')
			await searchInput.fill(catalogExercise!.name.slice(0, 12))
			await page.getByText(catalogExercise!.name).first().click()

			// Aguarda fechar o modal e exibir o exercício com 3 séries padrão
			await expect(page.getByText('3 séries x 10 reps (60s desc.)')).toBeVisible()

			// Abre o modal de séries clicando no card do exercício
			await page.getByText('3 séries x 10 reps (60s desc.)').click()
			await expect(page.getByText('Configurar Séries e Repetições')).toBeVisible()

			// Altera a carga da Série 1 para 90 Kg
			const weightInput = page.getByLabel('Carga (Kg)').first()
			await weightInput.click()
			await weightInput.fill('90')
			await weightInput.blur()
			await page.getByRole('button', { name: 'Confirmar Alterações' }).click()
			await expect(page.getByText('Configurar Séries e Repetições')).toBeHidden()

			// Conclui a edição do plano
			await page.getByRole('button', { name: 'Concluir' }).click()
			await expect(page).toHaveURL(/\/workout\/plans/)
		})

		await test.step('Então o PostgreSQL armazena Plan, Workout A, WorkoutExercise e as 3 séries com a carga atualizada', async () => {
			await expect
				.poll(async () => {
					const p = await prisma.plan.findUnique({
						where: { id: createdPlanId },
						include: {
							workouts: {
								include: {
									workoutExercises: {
										include: {
											sets: { orderBy: { setNumber: 'asc' } },
										},
									},
								},
							},
						},
					})
					return p?.workouts.find((w) => w.day === 'A')?.workoutExercises[0]?.sets[0]?.weight
				})
				.toBe(90)

			const planWithDetails = await prisma.plan.findUnique({
				where: { id: createdPlanId },
				include: {
					workouts: {
						include: {
							workoutExercises: {
								include: {
									sets: { orderBy: { setNumber: 'asc' } },
								},
							},
						},
					},
				},
			})

			expect(planWithDetails).not.toBeNull()
			expect(planWithDetails?.name).toBe(planName)
			const workoutA = planWithDetails?.workouts.find((w) => w.day === 'A')
			expect(workoutA).toBeDefined()
			createdWorkoutId = workoutA!.id

			expect(workoutA?.workoutExercises.length).toBe(1)
			const sets = workoutA!.workoutExercises[0].sets
			expect(sets.length).toBe(3)
			expect(sets[0].weight).toBe(90)
			expect(sets[0].repetitions).toBe(10)
		})

		await test.step('Quando inicia a execução ativa (/workout/active/:id), marca séries, recarrega a página (localStorage) e finaliza o treino', async () => {
			await page.goto(`/workout/active/${createdPlanId}?workoutId=${createdWorkoutId}`)
			await expect(page.getByText(catalogExercise!.name)).toBeVisible()

			// Expande o card do exercício
			await page.getByText(catalogExercise!.name).click()
			await expect(page.getByText('90 kg')).toBeVisible()

			// Marca a 1ª série como feita clicando na linha da série
			await page.getByText('90 kg').click()

			// Verifica persistência em localStorage antes e após reload da página
			await page.reload()
			await expect(page.getByText('90 kg')).toBeVisible()

			const savedChecked = await page.evaluate((wId) => {
				return localStorage.getItem(`ate-a-falha:active-workout:${wId}:checked`)
			}, createdWorkoutId)
			expect(savedChecked).toBeTruthy()
			expect(Object.values(JSON.parse(savedChecked!)).some(Boolean)).toBe(true)

			// Finaliza o treino
			await page.getByRole('button', { name: 'Finalizar Treino' }).click()
			await expect(page).toHaveURL(/\/workout/)
		})

		await test.step('Então o calendário registra o treino concluído hoje e o banco persiste a notificação WORKOUT', async () => {
			const completedMap = await page.evaluate((uId) => {
				return localStorage.getItem(`ate-a-falha:completed-workouts:${uId}`)
			}, authUser.id)
			expect(completedMap).toBeTruthy()
			expect(Object.values(JSON.parse(completedMap!)).some(Boolean)).toBe(true)

			await expect
				.poll(async () => {
					return prisma.notification.findFirst({
						where: {
							userId: authUser.id,
							type: 'WORKOUT',
							title: 'Treino Concluído',
						},
					})
				})
				.not.toBeNull()
		})
	})
})

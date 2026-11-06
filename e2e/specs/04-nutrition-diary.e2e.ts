import { test, expect } from '../fixtures/auth.fixture'
import { prisma } from '../fixtures/db.helper'

test.describe('Suíte 04: Nutrição — Metas em g/kg, Alimento Personalizado, Diário Alimentar e Hidratação (BDD)', () => {
	test('Deve configurar metas por g/kg (Atwater), criar alimento customizado, registrar refeição no diário e atingir 100% da meta de água', async ({
		page,
		authUser,
	}) => {
		const customFoodName = `Whey Isolado E2E ${Date.now().toString().slice(-4)}`

		await test.step('Dado que o usuário com 80 kg acessa /nutrition/goals e configura multiplicadores em g/kg', async () => {
			await page.goto('/nutrition/goals')
			await expect(page.getByText('Meta Diária', { exact: true }).first()).toBeVisible()

			await page.getByRole('button', { name: 'Editar' }).click()
			await expect(page.getByText('Configurar Metas de Macronutrientes')).toBeVisible()

			// Peso do usuário = 80 kg -> 2.0 g/kg Prot (160g), 1.0 g/kg Gord (80g), 4.0 g/kg Carb (320g)
			// Atwater: (160 * 4) + (320 * 4) + (80 * 9) = 640 + 1280 + 720 = 2640 Kcal
			await page.getByLabel('Proteína (g/kg)').fill('2.0')
			await page.getByLabel('Gordura (g/kg)').fill('1.0')
			await page.getByLabel('Carboidratos (g/kg)').fill('4.0')
			await page.getByLabel('Fibras (g)').fill('30')

			await expect(page.getByText('2640 Kal')).toBeVisible()
			await page.getByRole('button', { name: 'Salvar Configuração' }).click()
			await expect(page.getByText('Configurar Metas de Macronutrientes')).toBeHidden()
		})

		await test.step('Então a tabela Diet no PostgreSQL reflete exatamente os macronutrientes e calorias de Atwater', async () => {
			const dietInDb = await prisma.diet.findFirst({
				where: { userId: authUser.id },
			})
			expect(dietInDb).not.toBeNull()
			expect(dietInDb?.dailyProteinGoal).toBe(160)
			expect(dietInDb?.dailyFatGoal).toBe(80)
			expect(dietInDb?.dailyCarbGoal).toBe(320)
			expect(dietInDb?.dailyFiberGoal).toBe(30)
			expect(dietInDb?.dailyKcalGoal).toBe(2640)
		})

		await test.step('Quando cadastra um alimento personalizado em /nutrition/create-food', async () => {
			await page.goto('/nutrition/create-food')
			await expect(page.getByText('Criar Alimento').first()).toBeVisible()

			await page.getByLabel('Nome Alimento').fill(customFoodName)
			await page.getByLabel('Proteina (g)').fill('80')
			await page.getByLabel('Carboidrato (g)').fill('10')
			await page.getByLabel('Gordura (g)').fill('0')
			await page.getByLabel('Fibra (g)').fill('0')

			// 80*4 + 10*4 = 360 Kal
			await expect(page.getByText('360 Kal')).toBeVisible()
			await page.getByRole('button', { name: 'Criar Alimento' }).click()
			await expect(page).toHaveURL(/\/nutrition\/search/)

			const customFoodInDb = await prisma.food.findFirst({
				where: { userId: authUser.id, name: customFoodName },
			})
			expect(customFoodInDb).not.toBeNull()
			expect(customFoodInDb?.calories).toBe(360)
			expect(customFoodInDb?.protein).toBe(80)
		})

		await test.step('Quando registra uma refeição no diário (/nutrition) e inclui 50g do alimento criado', async () => {
			await page.goto('/nutrition')
			await page.getByRole('button', { name: 'Adicionar Refeição' }).click()

			await page.getByLabel('Nome da Refeição').fill('Pós-Treino E2E')
			await page.getByLabel('Horário').fill('18:00')
			await page.getByRole('button', { name: 'Adicionar', exact: true }).click()

			// Abre os detalhes da refeição recém-criada
			await page.getByText('Pós-Treino E2E').click()
			await expect(page).toHaveURL(/\/nutrition\/meals\//)

			await page.getByRole('button', { name: 'Adicionar Alimento +' }).click()
			await expect(page).toHaveURL(/\/nutrition\/search\?mealLogId=/)

			// Pesquisa pelo alimento customizado
			await page.getByPlaceholder('Pesquisar...').fill(customFoodName)
			await page.getByText(customFoodName).first().click()

			// Define porção de 50g -> 180 Kcal e 40g de proteína
			await page.getByLabel('Quantidade consumida (g)').fill('50')
			await expect(page.getByText('180 Kcal')).toBeVisible()
			await page.getByRole('button', { name: 'Adicionar à Refeição' }).click()

			await expect(page).toHaveURL(/\/nutrition\/meals\//)
			await expect(page.getByText('180 Kcal')).toBeVisible()
			await expect(page.getByText('Porção: 50g')).toBeVisible()
		})

		await test.step('E quando retorna ao diário (/nutrition) e atinge 100% da meta de água', async () => {
			await page.goto('/nutrition')
			await expect(page.getByText('180 / 2640 Kcal')).toBeVisible()

			// Ajusta a meta de água para 250 ml para atingir 100% em um clique
			// Clica no ícone de lápis ao lado do texto "Água -"
			await page.getByText('Água - 0 / 3000 ml').locator('..').locator('button').click()
			await expect(page.getByText('Editar Meta de Água')).toBeVisible()

			await page.getByLabel('Nova Meta de Água (ml)').fill('250')
			await page.getByRole('button', { name: 'Salvar' }).click()
			await expect(page.getByText('Água - 0 / 250 ml')).toBeVisible()

			// Clica no botão "+" de água (+250 ml)
			await page.getByText('Água - 0 / 250 ml').locator('..').locator('..').locator('button').last().click()

			await expect(page.getByText('Água - 250 / 250 ml')).toBeVisible()
		})

		await test.step('Então o PostgreSQL persiste DietLog, MealLog, FoodLog e dispara notificação DIET de hidratação', async () => {
			const dietLogInDb = await prisma.dietLog.findFirst({
				where: { userId: authUser.id },
				include: {
					meals: {
						include: { foods: true },
					},
				},
			})

			expect(dietLogInDb).not.toBeNull()
			expect(dietLogInDb?.waterIntake).toBe(250)
			expect(dietLogInDb?.meals.length).toBe(1)
			expect(dietLogInDb?.meals[0].name).toBe('Pós-Treino E2E')
			expect(dietLogInDb?.meals[0].foods[0].quantity).toBe(50)

			await expect
				.poll(async () => {
					return prisma.notification.findFirst({
						where: {
							userId: authUser.id,
							type: 'DIET',
						},
					})
				})
				.not.toBeNull()
		})
	})
})

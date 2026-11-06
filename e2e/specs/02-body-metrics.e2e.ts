import { test, expect } from '../fixtures/auth.fixture'
import { prisma } from '../fixtures/db.helper'

test.describe('Suíte 02: Evolução Corporal e Recálculo Metabólico (BDD)', () => {
	test('Deve registrar nova pesagem pelo frontend, atualizar IMC/TMB/TDEE no Perfil, renderizar gráficos e disparar notificação no BD', async ({
		page,
		authUser,
	}) => {
		await test.step('Dado que o usuário autenticado visualiza suas métricas iniciais em /profile', async () => {
			await page.goto('/profile')
			await expect(page.getByText(authUser.name)).toBeVisible()
			await expect(page.getByText('80 kg')).toBeVisible()
			await expect(page.getByText('180 cm')).toBeVisible()
		})

		await test.step('Quando clica em Registrar Peso e submete uma nova avaliação de 85 kg', async () => {
			await page.getByRole('button', { name: 'Registrar Peso' }).click()
			await expect(page).toHaveURL(/\/profile\/new-metric/)

			const weightInput = page.getByLabel('Peso Atual (kg)')
			await weightInput.fill('85')

			const fatInput = page.getByLabel('% de Gordura Corporal (Opcional)')
			await fatInput.fill('16')

			const muscleInput = page.getByLabel('% de Massa Muscular (Opcional)')
			await muscleInput.fill('41')

			await page.getByRole('button', { name: 'Registrar Pesagem' }).click()
		})

		await test.step('Então o Perfil exibe 85 kg, persiste o histórico no PostgreSQL e gera notificação automática', async () => {
			await expect(page).toHaveURL(/\/profile/)
			await expect(page.getByText('85 kg')).toBeVisible()
			// IMC para 85kg e 1.80m = 85 / 3.24 = 26.23 (exibido na UI como 26.2 - Sobrepeso)
			await expect(page.getByText('26.2')).toBeVisible()
			await expect(page.getByText(/Sobrepeso/)).toBeVisible()

			const metricsInDb = await prisma.bodyMetric.findMany({
				where: { userId: authUser.id },
				orderBy: { createdAt: 'desc' },
			})
			expect(metricsInDb.length).toBe(2)
			expect(metricsInDb[0].weight).toBe(85)
			expect(metricsInDb[0].bmi).toBeCloseTo(26.23, 1)

			// Verifica se o gatilho de notificação de evolução corporal disparou no banco
			const metricNotif = await prisma.notification.findFirst({
				where: {
					userId: authUser.id,
					type: 'SUCCESS',
					title: 'Evolução Física Atualizada',
				},
			})
			expect(metricNotif).not.toBeNull()
		})

		await test.step('Quando acessa a tela de Evolução (/profile/evolution), os gráficos temporais são exibidos', async () => {
			await page.getByRole('button', { name: 'Evolução' }).click()
			await expect(page).toHaveURL(/\/profile\/evolution/)
			await expect(page.getByText('Evolução Corporal')).toBeVisible()
		})
	})
})

import { test, expect } from '@playwright/test'
import { prisma, cleanupUserByEmail } from '../fixtures/db.helper'

test.describe('Suíte 01: Autenticação, Onboarding Antropométrico e Controle de Acesso (BDD)', () => {
	const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`
	const userEmail = `novo.atleta.${uniqueId}@ateafalha.com.br`
	const userPassword = 'Password123!'
	const userName = 'Carlos Atleta E2E'

	test.afterAll(async () => {
		await cleanupUserByEmail(userEmail)
	})

	test('Deve realizar cadastro completo, configurar métricas iniciais, validar persistência no BD e testar ciclo de login/logout', async ({
		page,
	}) => {
		await test.step('Dado que um visitante não autenticado tenta acessar uma rota protegida (/workout)', async () => {
			await page.goto('/workout')
			await expect(page).toHaveURL(/\/login/)
		})

		await test.step('Quando navega para /register e preenche os dados cadastrais válidos', async () => {
			await page.goto('/register')
			await expect(page.getByRole('heading', { name: 'Criar uma conta' })).toBeVisible()

			await page.getByLabel('Nome').fill(userName)
			await page.getByLabel('Email').fill(userEmail)
			await page.getByLabel('Senha').fill(userPassword)

			await page.getByRole('button', { name: 'Criar Conta' }).click()
		})

		await test.step('Então é redirecionado para /setup-metrics e o usuário está persistido no PostgreSQL', async () => {
			await expect(page).toHaveURL(/\/setup-metrics/)
			await expect(page.getByRole('heading', { name: 'Registros Corporais' })).toBeVisible()

			const authInDb = await prisma.auth.findUnique({
				where: { email: userEmail },
				include: { user: true },
			})
			expect(authInDb).not.toBeNull()
			expect(authInDb?.user.name).toBe(userName)
			expect(authInDb?.password).not.toBe(userPassword) // Senha com hash bcrypt

			// Garante data de nascimento de adulto (26 anos) para validação exata da equação de Mifflin-St Jeor
			await prisma.user.update({
				where: { id: authInDb!.userId },
				data: { birthDate: new Date('2000-01-01T00:00:00.000Z') },
			})
		})

		await test.step('Quando preenche a anamnese antropométrica inicial em /setup-metrics', async () => {
			await page.getByLabel('Altura (cm)').fill('180')
			await page.getByLabel('Peso (kg)').fill('80')
			await page.getByLabel('% de Gordura Corporal').fill('14')
			await page.getByLabel('% de Massa Muscular').fill('42')

			await page.getByRole('button', { name: 'Criar registro' }).click()
		})

		await test.step('Então acessa o painel principal (/workout) e o banco armazena IMC, TMB (Mifflin-St Jeor) e TDEE calculados', async () => {
			await expect(page).toHaveURL(/\/workout/)
			await expect(page.getByText('Treino do Dia')).toBeVisible()

			const authInDb = await prisma.auth.findUnique({ where: { email: userEmail } })
			const metricInDb = await prisma.bodyMetric.findFirst({
				where: { userId: authInDb!.userId },
			})

			expect(metricInDb).not.toBeNull()
			expect(metricInDb?.weight).toBe(80)
			expect(metricInDb?.height).toBe(180)
			expect(metricInDb?.bmi).toBeCloseTo(24.69, 1)
			expect(metricInDb?.bmr).toBeGreaterThan(1500)
			expect(metricInDb?.tdee).toBeGreaterThan(1800)
		})

		await test.step('Quando realiza logout em /profile e faz login novamente em /login', async () => {
			await page.goto('/profile')
			await expect(page.getByText(userName)).toBeVisible()

			await page.getByRole('button', { name: 'Sair da Conta' }).click()
			await expect(page).toHaveURL(/\/login/)

			await page.getByLabel('Email').fill(userEmail)
			await page.getByLabel('Senha').fill(userPassword)
			await page.getByRole('button', { name: 'Entrar' }).click()

			await expect(page).toHaveURL(/\/(workout|profile)/)
		})
	})
})

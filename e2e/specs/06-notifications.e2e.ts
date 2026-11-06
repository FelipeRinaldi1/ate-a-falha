import { test, expect } from '../fixtures/auth.fixture'
import { prisma } from '../fixtures/db.helper'

test.describe('Suíte 06: Central de Notificações Reativa (BDD)', () => {
	test('Deve exibir contador de não lidas no sino do cabeçalho, listar alertas por categoria, marcar todas como lidas e limpar o histórico no BD', async ({
		page,
		authUser,
	}) => {
		await test.step('Dado que o usuário possui 2 notificações não lidas persistidas no PostgreSQL', async () => {
			// Limpa notificações iniciais geradas no setup e insere 2 notificações controladas
			await prisma.notification.deleteMany({ where: { userId: authUser.id } })

			await prisma.notification.createMany({
				data: [
					{
						userId: authUser.id,
						title: 'Treino Concluído E2E',
						message: 'Você concluiu o Treino A com sucesso!',
						type: 'WORKOUT',
						read: false,
						link: '/workout',
					},
					{
						userId: authUser.id,
						title: 'Meta de Água Atingida E2E',
						message: 'Parabéns! Você atingiu 100% da meta hídrica.',
						type: 'DIET',
						read: false,
						link: '/nutrition',
					},
				],
			})
		})

		await test.step('Quando acessa /workout e abre o painel suspenso da central de notificações', async () => {
			await page.goto('/workout')

			const bellButton = page.getByRole('button', { name: 'Abrir notificações' })
			await expect(bellButton).toBeVisible()
			await bellButton.click()

			await expect(page.getByText('Notificações')).toBeVisible()
			await expect(page.getByText('2 novas')).toBeVisible()
			await expect(page.getByText('Treino Concluído E2E')).toBeVisible()
			await expect(page.getByText('Meta de Água Atingida E2E')).toBeVisible()
		})

		await test.step('Quando aciona o botão de marcar todas como lidas, o banco atualiza read = true', async () => {
			// O botão de marcar todas como lidas fica no cabeçalho do popover ao lado do badge "2 novas"
			const popoverHeader = page
				.locator('div')
				.filter({ hasText: /^Notificações2 novas$/ })
				.first()
			await popoverHeader.locator('button').click()

			await expect(page.getByText('2 novas')).toBeHidden()

			const unreadInDb = await prisma.notification.count({
				where: { userId: authUser.id, read: false },
			})
			expect(unreadInDb).toBe(0)
		})

		await test.step('E quando clica em Limpar todas, o painel exibe estado vazio e a tabela Notification é esvaziada', async () => {
			await page.getByRole('button', { name: 'Limpar todas' }).click()
			await expect(page.getByText('Nenhuma notificação por aqui')).toBeVisible()

			const totalInDb = await prisma.notification.count({
				where: { userId: authUser.id },
			})
			expect(totalInDb).toBe(0)
		})
	})
})

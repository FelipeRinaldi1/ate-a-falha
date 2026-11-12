import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { DietLogPage } from './DietLog.page'
import { renderWithProviders } from '../../../test/testUtils'
import { nutritionApi } from '../api/nutritionApi'
import { notificationApi } from '../../notification/api/notificationApi'

vi.mock('../../user/hooks/useAuth', () => ({
	useAuth: () => ({
		user: { id: 'user-1', name: 'Teste', role: 'USER' },
		isAuthenticated: true,
		isLoading: false,
		login: vi.fn(),
		logout: vi.fn(),
		refreshUser: vi.fn(),
	}),
}))

describe('DietLogPage', () => {
	const todayStr = (() => {
		const d = new Date()
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
	})()

	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(notificationApi, 'getUnreadCount').mockResolvedValue({ unreadCount: 0 })
		vi.spyOn(nutritionApi, 'getDiets').mockResolvedValue([
			{
				id: 'diet-1',
				userId: 'user-1',
				name: 'Minha Dieta',
				dailyKcalGoal: 2500,
				dailyProteinGoal: 160,
				dailyCarbGoal: 250,
				dailyFatGoal: 70,
				dailyFiberGoal: 30,
				dailyWaterGoal: 3000,
				dailyWater: 0,
				isExported: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		])
		vi.spyOn(nutritionApi, 'getDietLogs').mockResolvedValue([
			{
				id: 'log-today',
				userId: 'user-1',
				date: new Date(`${todayStr}T00:00:00`),
				waterIntake: 500,
				meals: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		])
		vi.spyOn(nutritionApi, 'getMeals').mockResolvedValue([
			{
				id: 'target-meal-1',
				dietId: 'diet-1',
				name: 'Café da Manhã',
				time: '08:00',
				orderIndex: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
				foods: [
					{
						id: 'fim-1',
						foodId: 'food-1',
						mealId: 'target-meal-1',
						quantity: 150,
						createdAt: new Date(),
						updatedAt: new Date(),
						food: {
							id: 'food-1',
							userId: null,
							name: 'Aveia',
							calories: 389,
							carbohydrate: 66,
							protein: 17,
							lipids: 7,
							fiber: 10,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					},
				],
			},
		])
	})

	it('renders reference meals and toggles a reference meal with atomic foods payload', async () => {
		const createMealLogSpy = vi.spyOn(nutritionApi, 'createMealLog').mockResolvedValue({
			id: 'meal-log-1',
			dietLogId: 'log-today',
			name: 'Café da Manhã',
			time: '08:00',
			orderIndex: 0,
			foods: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		})

		renderWithProviders(<DietLogPage />)

		const mealTitle = await screen.findByText('Café da Manhã')
		expect(mealTitle).toBeInTheDocument()
		fireEvent.click(mealTitle)

		await waitFor(() => {
			expect(createMealLogSpy).toHaveBeenCalledWith('log-today', {
				name: 'Café da Manhã',
				time: '08:00',
				orderIndex: 0,
				foods: [{ foodId: 'food-1', quantity: 150 }],
			})
		})
	})
})

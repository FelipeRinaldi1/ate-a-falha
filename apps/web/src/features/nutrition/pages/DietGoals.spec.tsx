import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { DietGoalsPage } from './DietGoals.page'
import { renderWithProviders } from '../../../test/testUtils'
import { nutritionApi } from '../api/nutritionApi'
import { userApi } from '../../user/api/userApi'
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

describe('DietGoalsPage', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(notificationApi, 'getUnreadCount').mockResolvedValue({ unreadCount: 0 })
		vi.spyOn(userApi, 'getBodyMetrics').mockResolvedValue([
			{
				id: 'bm-1',
				userId: 'user-1',
				weight: 80,
				height: 180,
				activityLevel: 2,
				bodyFat: 15,
				muscleRate: 40,
				bmi: 24.7,
				bmr: 1800,
				tdee: 2790,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		])
		vi.spyOn(nutritionApi, 'getDiets').mockResolvedValue([
			{
				id: '550e8400-e29b-41d4-a716-446655440010',
				userId: '550e8400-e29b-41d4-a716-446655440000',
				name: 'Dieta Cutting',
				dailyKcalGoal: 2400,
				dailyProteinGoal: 180,
				dailyCarbGoal: 240,
				dailyFatGoal: 70,
				dailyFiberGoal: 30,
				dailyWaterGoal: 3500,
				dailyWater: 0,
				isExported: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		])
		vi.spyOn(nutritionApi, 'getMeals').mockResolvedValue([])
	})

	it('renders synced calorie and macro goals from active diet', async () => {
		renderWithProviders(<DietGoalsPage />)

		expect(await screen.findByText('2400 Kal')).toBeInTheDocument()
		expect(screen.getByText('180g')).toBeInTheDocument()
		expect(screen.getByText('240g')).toBeInTheDocument()
	})
})

import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { EditPlanPage } from './EditPlan.page'
import { renderWithProviders } from '../../../test/testUtils'
import { workoutApi } from '../api/workoutApi'
import { notificationApi } from '../../notification/api/notificationApi'

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
	return {
		...actual,
		useParams: () => ({ id: 'plan-1' }),
		useNavigate: () => vi.fn(),
	}
})

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

describe('EditPlanPage', () => {
	const mockPlan = {
		id: 'plan-1',
		userId: 'user-1',
		name: 'Treino Hipertrofia',
		isActive: true,
		goal: 'hipertrofia' as const,
		coverImageUrl: null,
		coverExerciseId: null,
		isExported: false,
		createdAt: new Date(),
		updatedAt: new Date(),
		workouts: [
			{
				id: 'workout-a',
				planId: 'plan-1',
				name: 'Peito e Tríceps',
				day: 'A' as const,
				weekDay: 'SEG',
				workoutExercises: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		],
	}

	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(notificationApi, 'getUnreadCount').mockResolvedValue({ unreadCount: 0 })
		vi.spyOn(workoutApi, 'getPlanById').mockResolvedValue(mockPlan)
		vi.spyOn(workoutApi, 'getExerciseCatalog').mockResolvedValue([])
	})

	it('synchronizes planName state via useEffect after fetching plan details', async () => {
		renderWithProviders(<EditPlanPage />)

		const nameInput = (await screen.findByPlaceholderText('Nome da ficha de treino')) as HTMLInputElement
		expect(nameInput.value).toBe('Treino Hipertrofia')
	})

	it('blocks saving when plan name has fewer than 3 characters', async () => {
		const updatePlanSpy = vi.spyOn(workoutApi, 'updatePlan').mockResolvedValue(mockPlan)
		renderWithProviders(<EditPlanPage />)

		const nameInput = (await screen.findByPlaceholderText('Nome da ficha de treino')) as HTMLInputElement
		fireEvent.change(nameInput, { target: { value: 'AB' } })

		fireEvent.click(screen.getByRole('button', { name: 'Concluir' }))

		await waitFor(() => {
			expect(updatePlanSpy).not.toHaveBeenCalled()
		})
	})

	it('saves plan and workout updates when names have at least 3 characters', async () => {
		const updatePlanSpy = vi.spyOn(workoutApi, 'updatePlan').mockResolvedValue(mockPlan)
		const updateWorkoutSpy = vi.spyOn(workoutApi, 'updateWorkout').mockResolvedValue(mockPlan.workouts[0])

		renderWithProviders(<EditPlanPage />)

		const nameInput = (await screen.findByPlaceholderText('Nome da ficha de treino')) as HTMLInputElement
		fireEvent.change(nameInput, { target: { value: 'Treino Força ABC' } })

		fireEvent.click(screen.getByRole('button', { name: 'Concluir' }))

		await waitFor(() => {
			expect(updatePlanSpy).toHaveBeenCalledWith('plan-1', {
				name: 'Treino Força ABC',
				coverImageUrl: null,
				coverExerciseId: null,
			})
			expect(updateWorkoutSpy).toHaveBeenCalledWith('workout-a', {
				name: 'Peito e Tríceps',
				weekDay: 'SEG',
			})
		})
	})
})

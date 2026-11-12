import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { BodyMetricRegisterForm } from './BodyMetricsForm'
import { renderWithProviders } from '../../../../test/testUtils'
import { userApi } from '../../api/userApi'

const mockNavigate = vi.fn()
const mockRefreshUser = vi.fn()

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
	return {
		...actual,
		useNavigate: () => mockNavigate,
	}
})

vi.mock('../../hooks/useAuth', () => ({
	useAuth: () => ({
		user: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Teste', hasBodyMetrics: false },
		isAuthenticated: true,
		isLoading: false,
		refreshUser: mockRefreshUser,
		login: vi.fn(),
		logout: vi.fn(),
	}),
}))

describe('BodyMetricRegisterForm', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockRefreshUser.mockResolvedValue(undefined)
	})

	it('validates positive height and weight before submitting', async () => {
		const spy = vi.spyOn(userApi, 'createBodyMetric')
		renderWithProviders(<BodyMetricRegisterForm />)

		fireEvent.click(screen.getByRole('button', { name: 'Criar registro' }))

		await waitFor(() => {
			expect(spy).not.toHaveBeenCalled()
		})
	})

	it('normalizes empty optional fields to null and submits numeric body metric values', async () => {
		const createSpy = vi.spyOn(userApi, 'createBodyMetric').mockResolvedValue({
			id: '550e8400-e29b-41d4-a716-446655440001',
			userId: '550e8400-e29b-41d4-a716-446655440000',
			weight: 78,
			height: 180,
			activityLevel: 0,
			bodyFat: null,
			muscleRate: null,
			bmi: 24.1,
			bmr: 1750,
			tdee: 2100,
			createdAt: new Date(),
			updatedAt: new Date(),
		})

		renderWithProviders(<BodyMetricRegisterForm />)

		fireEvent.change(screen.getByPlaceholderText('175cm'), { target: { value: '180' } })
		fireEvent.change(screen.getByPlaceholderText('60kg'), { target: { value: '78' } })

		fireEvent.click(screen.getByRole('button', { name: 'Criar registro' }))

		await waitFor(() => {
			expect(createSpy).toHaveBeenCalledWith({
				height: 180,
				weight: 78,
				activityLevel: 0,
				bodyFat: null,
				muscleRate: null,
			})
		})
		expect(mockRefreshUser).toHaveBeenCalled()
		expect(mockNavigate).toHaveBeenCalledWith('/workout', { replace: true })
	})
})

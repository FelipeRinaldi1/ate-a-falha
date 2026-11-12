import { api } from '../../../api/axiosInstance'
import type {
	BodyMetricDTO,
	CreateBodyMetricDTO,
	UpdateBodyMetricDTO,
	LoginDTO,
	CreateUserWithAuthDTO,
	UpdateUserDTO,
	UserResponseDTO,
} from '@ate-a-falha/shared'

export const userApi = {
	login: async (credentials: LoginDTO): Promise<{ user: UserResponseDTO }> => {
		const res = await api.post<{ user: UserResponseDTO }>('/users/login', credentials)
		return res.data
	},

	register: async (data: CreateUserWithAuthDTO): Promise<{ user: UserResponseDTO }> => {
		const res = await api.post<{ user: UserResponseDTO }>('/users/register', data)
		return res.data
	},

	getMe: async (): Promise<UserResponseDTO> => {
		const res = await api.get<UserResponseDTO>('/users/me')
		return res.data
	},

	updateMe: async (data: UpdateUserDTO): Promise<UserResponseDTO> => {
		const res = await api.put<UserResponseDTO>('/users/me', data)
		return res.data
	},

	changePassword: async (data: { oldPassword: string; newPassword: string }): Promise<void> => {
		await api.patch('/users/me/password', data)
	},

	getBodyMetrics: async (take?: number): Promise<BodyMetricDTO[]> => {
		const res = await api.get<BodyMetricDTO[]>('/users/body-metrics', {
			params: take ? { take } : undefined,
		})
		return res.data
	},

	createBodyMetric: async (data: CreateBodyMetricDTO): Promise<BodyMetricDTO> => {
		const res = await api.post<BodyMetricDTO>('/users/body-metrics', data)
		return res.data
	},

	updateBodyMetric: async (id: string, data: UpdateBodyMetricDTO): Promise<BodyMetricDTO> => {
		const res = await api.patch<BodyMetricDTO>(`/users/body-metrics/${id}`, data)
		return res.data
	},

	deleteBodyMetric: async (id: string): Promise<void> => {
		await api.delete(`/users/body-metrics/${id}`)
	},
}

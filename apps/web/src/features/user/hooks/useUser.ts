import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../api/userApi'
import type {
	CreateBodyMetricDTO,
	UpdateBodyMetricDTO,
	UpdateUserDTO,
	LoginDTO,
	CreateUserWithAuthDTO,
	UserResponseDTO,
} from '@ate-a-falha/shared'
import { NOTIFICATION_QUERY_KEYS } from '../../notification/hooks/useNotifications'
import type { AxiosError } from 'axios'

export const USER_QUERY_KEYS = {
	bodyMetricsAll: ['body-metrics'] as const,
	bodyMetrics: (take?: number) => (take ? (['body-metrics', { take }] as const) : (['body-metrics'] as const)),
}

interface MutationCallbacks<T = unknown> {
	onSuccess?: (data: T) => void | Promise<void>
	onError?: (error: AxiosError) => void
}

export function useBodyMetrics(options?: { take?: number; enabled?: boolean }) {
	return useQuery({
		queryKey: USER_QUERY_KEYS.bodyMetrics(options?.take),
		queryFn: () => userApi.getBodyMetrics(options?.take),
		enabled: options?.enabled ?? true,
	})
}

export function useCreateBodyMetric(callbacks?: MutationCallbacks) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateBodyMetricDTO) => userApi.createBodyMetric(data),
		onSuccess: async (data) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.bodyMetricsAll }),
				queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all }),
			])
			await callbacks?.onSuccess?.(data)
		},
		onError: callbacks?.onError,
	})
}

export function useUpdateBodyMetric(callbacks?: MutationCallbacks) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateBodyMetricDTO }) => userApi.updateBodyMetric(id, data),
		onSuccess: async (data) => {
			await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.bodyMetricsAll })
			await callbacks?.onSuccess?.(data)
		},
		onError: callbacks?.onError,
	})
}

export function useDeleteBodyMetric(callbacks?: MutationCallbacks<void>) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => userApi.deleteBodyMetric(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.bodyMetricsAll })
			await callbacks?.onSuccess?.()
		},
		onError: callbacks?.onError,
	})
}

export function useLogin(callbacks?: MutationCallbacks<{ user: UserResponseDTO }>) {
	return useMutation({
		mutationFn: (credentials: LoginDTO) => userApi.login(credentials) as unknown as Promise<{ user: UserResponseDTO }>,
		onSuccess: callbacks?.onSuccess,
		onError: callbacks?.onError,
	})
}

export function useRegister(callbacks?: MutationCallbacks<{ user: UserResponseDTO }>) {
	return useMutation({
		mutationFn: (data: CreateUserWithAuthDTO) => userApi.register(data),
		onSuccess: callbacks?.onSuccess,
		onError: callbacks?.onError,
	})
}

export function useUpdateProfile() {
	return useMutation({
		mutationFn: (data: UpdateUserDTO) => userApi.updateMe(data),
	})
}

export function useChangePassword() {
	return useMutation({
		mutationFn: (data: { oldPassword: string; newPassword: string }) => userApi.changePassword(data),
	})
}

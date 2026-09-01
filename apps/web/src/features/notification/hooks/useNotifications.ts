import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '../api/notificationApi'
import type { NotificationSearchDTO } from '@ate-a-falha/shared'

export const NOTIFICATION_QUERY_KEYS = {
	all: ['notifications'] as const,
	list: (params?: NotificationSearchDTO) => ['notifications', 'list', params] as const,
	unreadCount: ['notifications', 'unread-count'] as const,
}

export function useNotifications(params?: NotificationSearchDTO) {
	return useQuery({
		queryKey: NOTIFICATION_QUERY_KEYS.list(params),
		queryFn: () => notificationApi.getNotifications(params),
		refetchInterval: 30000,
	})
}

export function useUnreadNotificationCount() {
	return useQuery({
		queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
		queryFn: notificationApi.getUnreadCount,
		refetchInterval: 30000,
		select: (data) => data.unreadCount,
	})
}

export function useMarkAsRead() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => notificationApi.markAsRead(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })
		},
	})
}

export function useMarkAllAsRead() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => notificationApi.markAllAsRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })
		},
	})
}

export function useDeleteNotification() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => notificationApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })
		},
	})
}

export function useClearAllNotifications() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => notificationApi.clearAll(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })
		},
	})
}

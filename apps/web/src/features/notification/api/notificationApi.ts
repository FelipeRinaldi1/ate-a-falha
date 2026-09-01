import { api } from '../../../api/axiosInstance'
import type {
	NotificationDTO,
	NotificationListResponseDTO,
	NotificationSearchDTO,
} from '@ate-a-falha/shared'

export const notificationApi = {
	getNotifications: async (params?: NotificationSearchDTO): Promise<NotificationListResponseDTO> => {
		const res = await api.get<NotificationListResponseDTO>('/notifications', { params })
		return res.data
	},

	getUnreadCount: async (): Promise<{ unreadCount: number }> => {
		const res = await api.get<{ unreadCount: number }>('/notifications/unread-count')
		return res.data
	},

	getById: async (id: string): Promise<NotificationDTO> => {
		const res = await api.get<NotificationDTO>(`/notifications/${id}`)
		return res.data
	},

	markAsRead: async (id: string): Promise<NotificationDTO> => {
		const res = await api.patch<NotificationDTO>(`/notifications/${id}/read`)
		return res.data
	},

	markAllAsRead: async (): Promise<{ count: number }> => {
		const res = await api.patch<{ count: number }>('/notifications/mark-all-read')
		return res.data
	},

	delete: async (id: string): Promise<void> => {
		await api.delete(`/notifications/${id}`)
	},

	clearAll: async (): Promise<{ count: number }> => {
		const res = await api.delete<{ count: number }>('/notifications')
		return res.data
	},
}

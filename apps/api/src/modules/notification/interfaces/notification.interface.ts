import {
	CreateNotificationDTO,
	NotificationSearchDTO,
	NotificationListResponseDTO,
	Result,
} from '@ate-a-falha/shared'
import { NotificationFull } from '@ate-a-falha/database'

export interface INotificationRepository {
	create(data: CreateNotificationDTO, userId: string): Promise<Result<NotificationFull>>
	findById(id: string, userId: string): Promise<Result<NotificationFull>>
	findAll(params: NotificationSearchDTO, userId: string): Promise<Result<NotificationListResponseDTO>>
	getUnreadCount(userId: string): Promise<Result<number>>
	markAsRead(id: string, userId: string): Promise<Result<NotificationFull>>
	markAllAsRead(userId: string): Promise<Result<{ count: number }>>
	delete(id: string, userId: string): Promise<Result<void>>
	deleteAll(userId: string): Promise<Result<{ count: number }>>
}

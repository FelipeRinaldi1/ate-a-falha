import {
	type CreateNotificationDTO,
	type NotificationSearchDTO,
	type NotificationListResponseDTO,
	type Result,
	success,
	failure,
	type authenticatedUser,
} from '@ate-a-falha/shared'
import { type NotificationFull } from '@ate-a-falha/database'
import type { INotificationRepository } from '../interfaces/notification.interface.js'

export class NotificationService {
	constructor(private readonly notificationRepository: INotificationRepository) {}

	async create(data: CreateNotificationDTO, authUser: authenticatedUser): Promise<Result<NotificationFull>> {
		const targetUserId = data.userId || authUser.id
		const result = await this.notificationRepository.create(data, targetUserId)
		return result
	}

	async findById(id: string, authUser: authenticatedUser): Promise<Result<NotificationFull>> {
		const result = await this.notificationRepository.findById(id, authUser.id)
		return result
	}

	async findAll(
		params: NotificationSearchDTO,
		authUser: authenticatedUser
	): Promise<Result<NotificationListResponseDTO>> {
		const result = await this.notificationRepository.findAll(params, authUser.id)
		return result
	}

	async getUnreadCount(authUser: authenticatedUser): Promise<Result<{ unreadCount: number }>> {
		const result = await this.notificationRepository.getUnreadCount(authUser.id)
		if (result.isFailure()) {
			return failure(result.error)
		}
		return success({ unreadCount: result.value })
	}

	async markAsRead(id: string, authUser: authenticatedUser): Promise<Result<NotificationFull>> {
		const result = await this.notificationRepository.markAsRead(id, authUser.id)
		return result
	}

	async markAllAsRead(authUser: authenticatedUser): Promise<Result<{ count: number }>> {
		const result = await this.notificationRepository.markAllAsRead(authUser.id)
		return result
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const result = await this.notificationRepository.delete(id, authUser.id)
		return result
	}

	async deleteAll(authUser: authenticatedUser): Promise<Result<{ count: number }>> {
		const result = await this.notificationRepository.deleteAll(authUser.id)
		return result
	}
}

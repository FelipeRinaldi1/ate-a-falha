import { prisma, safeCall } from '@ate-a-falha/database'
import type { INotificationRepository } from '../interfaces/notification.interface.js'
import {
	type CreateNotificationDTO,
	type NotificationSearchDTO,
	type NotificationListResponseDTO,
	type Result,
	success,
	failure,
} from '@ate-a-falha/shared'
import { type NotificationFull } from '@ate-a-falha/database'

export class NotificationRepository implements INotificationRepository {
	async create(data: CreateNotificationDTO, userId: string): Promise<Result<NotificationFull>> {
		const result = await safeCall(
			prisma.notification.create({
				data: {
					title: data.title,
					message: data.message,
					type: data.type || 'INFO',
					link: data.link,
					userId: data.userId || userId,
				},
			})
		)
		return result
	}

	async findById(id: string, userId: string): Promise<Result<NotificationFull>> {
		const result = await safeCall(
			prisma.notification.findFirstOrThrow({
				where: { id, userId },
			})
		)
		return result
	}

	async findAll(params: NotificationSearchDTO, userId: string): Promise<Result<NotificationListResponseDTO>> {
		const whereClause = {
			userId,
			...(params.unreadOnly ? { read: false } : {}),
		}

		const queryResult = await safeCall(
			Promise.all([
				prisma.notification.findMany({
					take: params.take || 20,
					skip: params.cursorId ? 1 : 0,
					cursor: params.cursorId ? { id: params.cursorId } : undefined,
					where: whereClause,
					orderBy: { createdAt: 'desc' },
				}),
				prisma.notification.count({
					where: { userId, read: false },
				}),
				prisma.notification.count({
					where: { userId },
				}),
			])
		)

		if (queryResult.isFailure()) {
			return failure(queryResult.error)
		}

		const [notifications, unreadCount, totalCount] = queryResult.value

		return success({
			notifications,
			unreadCount,
			totalCount,
		})
	}

	async getUnreadCount(userId: string): Promise<Result<number>> {
		const result = await safeCall(
			prisma.notification.count({
				where: { userId, read: false },
			})
		)
		return result
	}

	async markAsRead(id: string, userId: string): Promise<Result<NotificationFull>> {
		const checkResult = await this.findById(id, userId)
		if (checkResult.isFailure()) {
			return failure(checkResult.error)
		}

		const result = await safeCall(
			prisma.notification.update({
				where: { id },
				data: { read: true },
			})
		)
		return result
	}

	async markAllAsRead(userId: string): Promise<Result<{ count: number }>> {
		const result = await safeCall(
			prisma.notification.updateMany({
				where: { userId, read: false },
				data: { read: true },
			})
		)
		return result
	}

	async delete(id: string, userId: string): Promise<Result<void>> {
		const checkResult = await this.findById(id, userId)
		if (checkResult.isFailure()) {
			return failure(checkResult.error)
		}

		const result = await safeCall(
			prisma.notification.delete({
				where: { id },
			})
		)

		if (result.isFailure()) {
			return failure(result.error)
		}

		return success(undefined)
	}

	async deleteAll(userId: string): Promise<Result<{ count: number }>> {
		const result = await safeCall(
			prisma.notification.deleteMany({
				where: { userId },
			})
		)
		return result
	}
}

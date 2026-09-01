import { z } from 'zod'

export const notificationTypeEnum = z.enum(['INFO', 'SUCCESS', 'WARNING', 'WORKOUT', 'DIET', 'SYSTEM'])

export const notificationSchema = z.object({
	id: z.uuid(),
	title: z.string().min(1).max(128),
	message: z.string().min(1).max(512),
	type: notificationTypeEnum.default('INFO'),
	read: z.boolean().default(false),
	link: z.string().max(256).nullable().optional(),
	userId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createNotificationSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }).max(128),
	message: z.string().min(1, { message: 'Message is required' }).max(512),
	type: notificationTypeEnum.optional().default('INFO'),
	link: z.string().max(256).nullable().optional(),
	userId: z.uuid().optional(),
})

export const updateNotificationSchema = z.object({
	read: z.boolean().optional(),
	title: z.string().min(1).max(128).optional(),
	message: z.string().min(1).max(512).optional(),
	link: z.string().max(256).nullable().optional(),
})

export const notificationSearchSchema = z.object({
	cursorId: z.string().optional(),
	take: z.coerce.number().min(1).max(100).default(20),
	unreadOnly: z
		.preprocess((val) => val === 'true' || val === true, z.boolean())
		.optional()
		.default(false),
})

export type NotificationType = z.infer<typeof notificationTypeEnum>
export type NotificationDTO = z.infer<typeof notificationSchema>
export type CreateNotificationDTO = z.infer<typeof createNotificationSchema>
export type UpdateNotificationDTO = z.infer<typeof updateNotificationSchema>
export type NotificationSearchDTO = Partial<z.infer<typeof notificationSearchSchema>>

export interface NotificationListResponseDTO {
	notifications: NotificationDTO[]
	unreadCount: number
	totalCount: number
}

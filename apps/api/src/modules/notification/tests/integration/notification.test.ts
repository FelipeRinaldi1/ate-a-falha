import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import app from '../../../../app.js'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import { setupTestUser, cleanupTestUser } from '../../../../tests/auth.helper.js'
import { setupTestNotification } from '../helpers/notification.helper.js'
import { overrideNotificationMock } from '../mocks/notification.mock.js'
import { NotificationDTO, NotificationListResponseDTO } from '@ate-a-falha/shared'

describe('Notification Module Integration Tests', () => {
	let userContext: Awaited<ReturnType<typeof setupTestUser>>
	let otherUserContext: Awaited<ReturnType<typeof setupTestUser>>

	beforeEach(async () => {
		userContext = await setupTestUser()
		otherUserContext = await setupTestUser()
	})

	afterEach(async () => {
		if (userContext) {
			await cleanupTestUser(userContext.user.id, userContext.cookie)
		}
		if (otherUserContext) {
			await cleanupTestUser(otherUserContext.user.id, otherUserContext.cookie)
		}
	})

	describe('POST /notifications', () => {
		test('Should create a notification for the authenticated user', async () => {
			const payload = overrideNotificationMock({
				title: 'Novo Treino Disponível',
				message: 'O treino de pernas foi atualizado.',
				type: 'WORKOUT',
				link: '/workouts/123',
			})

			const res = await request(app)
				.post(`${BASE_API_URL}/notifications`)
				.set('Cookie', userContext.cookie || '')
				.send(payload)

			expect(res.status).toBe(201)
			expect(res.body).toMatchObject({
				title: payload.title,
				message: payload.message,
				type: 'WORKOUT',
				link: '/workouts/123',
				read: false,
				userId: userContext.user.id,
			})
			expect(res.body.id).toBeDefined()
			expect(res.body.createdAt).toBeDefined()
		})

		test('Should create a notification with default type INFO when type is omitted', async () => {
			const res = await request(app)
				.post(`${BASE_API_URL}/notifications`)
				.set('Cookie', userContext.cookie || '')
				.send({
					title: 'Aviso do Sistema',
					message: 'Manutenção programada para o fim de semana.',
				})

			expect(res.status).toBe(201)
			expect(res.body.type).toBe('INFO')
			expect(res.body.read).toBe(false)
		})

		test('Should return 400 when title or message is empty', async () => {
			const res = await request(app)
				.post(`${BASE_API_URL}/notifications`)
				.set('Cookie', userContext.cookie || '')
				.send({
					title: '',
					message: '',
				})

			expect(res.status).toBe(400)
		})

		test('Should return 400 when notification type is invalid', async () => {
			const res = await request(app)
				.post(`${BASE_API_URL}/notifications`)
				.set('Cookie', userContext.cookie || '')
				.send({
					title: 'Teste',
					message: 'Mensagem válida',
					type: 'INVALID_TYPE_123',
				})

			expect(res.status).toBe(400)
		})

		test('Should return 401 when request is not authenticated', async () => {
			const res = await request(app)
				.post(`${BASE_API_URL}/notifications`)
				.send(overrideNotificationMock())

			expect(res.status).toBe(401)
		})
	})

	describe('GET /notifications', () => {
		test('Should return empty list and zero unread count when user has no notifications', async () => {
			const res = await request(app)
				.get(`${BASE_API_URL}/notifications`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(200)
			const body: NotificationListResponseDTO = res.body
			expect(body.notifications).toEqual([])
			expect(body.unreadCount).toBe(0)
			expect(body.totalCount).toBe(0)
		})

		test('Should list notifications and calculate unread count correctly', async () => {
			await setupTestNotification(userContext.cookie || '', { title: 'Notif 1', message: 'Msg 1' })
			const notif2 = await setupTestNotification(userContext.cookie || '', { title: 'Notif 2', message: 'Msg 2' })
			await setupTestNotification(userContext.cookie || '', { title: 'Notif 3', message: 'Msg 3' })

			// Mark one notification as read
			await request(app)
				.patch(`${BASE_API_URL}/notifications/${notif2.id}/read`)
				.set('Cookie', userContext.cookie || '')

			const res = await request(app)
				.get(`${BASE_API_URL}/notifications`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(200)
			const body: NotificationListResponseDTO = res.body
			expect(body.notifications.length).toBe(3)
			expect(body.unreadCount).toBe(2)
			expect(body.totalCount).toBe(3)
		})

		test('Should filter notifications by unreadOnly=true', async () => {
			const notif1 = await setupTestNotification(userContext.cookie || '', { title: 'Notif 1', message: 'Msg 1' })
			await setupTestNotification(userContext.cookie || '', { title: 'Notif 2', message: 'Msg 2' })

			// Mark notif1 as read
			await request(app)
				.patch(`${BASE_API_URL}/notifications/${notif1.id}/read`)
				.set('Cookie', userContext.cookie || '')

			const res = await request(app)
				.get(`${BASE_API_URL}/notifications?unreadOnly=true`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(200)
			const body: NotificationListResponseDTO = res.body
			expect(body.notifications.length).toBe(1)
			expect(body.notifications[0].read).toBe(false)
			expect(body.unreadCount).toBe(1)
		})

		test('Should paginate notifications using take parameter', async () => {
			for (let i = 1; i <= 5; i++) {
				await setupTestNotification(userContext.cookie || '', { title: `Notif ${i}`, message: `Msg ${i}` })
			}

			const res = await request(app)
				.get(`${BASE_API_URL}/notifications?take=2`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(200)
			const body: NotificationListResponseDTO = res.body
			expect(body.notifications.length).toBe(2)
			expect(body.totalCount).toBe(5)
			expect(body.unreadCount).toBe(5)
		})

		test('Should not return other users notifications (User Isolation)', async () => {
			await setupTestNotification(userContext.cookie || '', { title: 'User 1 Notif', message: 'Msg' })
			await setupTestNotification(otherUserContext.cookie || '', { title: 'User 2 Notif', message: 'Msg' })

			const resUser1 = await request(app)
				.get(`${BASE_API_URL}/notifications`)
				.set('Cookie', userContext.cookie || '')

			expect(resUser1.status).toBe(200)
			expect(resUser1.body.notifications.length).toBe(1)
			expect(resUser1.body.notifications[0].title).toBe('User 1 Notif')

			const resUser2 = await request(app)
				.get(`${BASE_API_URL}/notifications`)
				.set('Cookie', otherUserContext.cookie || '')

			expect(resUser2.status).toBe(200)
			expect(resUser2.body.notifications.length).toBe(1)
			expect(resUser2.body.notifications[0].title).toBe('User 2 Notif')
		})

		test('Should return 401 when request is not authenticated', async () => {
			const res = await request(app).get(`${BASE_API_URL}/notifications`)
			expect(res.status).toBe(401)
		})
	})

	describe('GET /notifications/unread-count', () => {
		test('Should return fast unread count for header badge', async () => {
			const resEmpty = await request(app)
				.get(`${BASE_API_URL}/notifications/unread-count`)
				.set('Cookie', userContext.cookie || '')

			expect(resEmpty.status).toBe(200)
			expect(resEmpty.body).toEqual({ unreadCount: 0 })

			await setupTestNotification(userContext.cookie || '')
			await setupTestNotification(userContext.cookie || '')

			const resPopulated = await request(app)
				.get(`${BASE_API_URL}/notifications/unread-count`)
				.set('Cookie', userContext.cookie || '')

			expect(resPopulated.status).toBe(200)
			expect(resPopulated.body).toEqual({ unreadCount: 2 })
		})

		test('Should return 401 when unauthenticated', async () => {
			const res = await request(app).get(`${BASE_API_URL}/notifications/unread-count`)
			expect(res.status).toBe(401)
		})
	})

	describe('GET /notifications/:id', () => {
		test('Should return a single notification by ID', async () => {
			const created = await setupTestNotification(userContext.cookie || '', {
				title: 'Notificação Específica',
				message: 'Detalhes da notificação',
			})

			const res = await request(app)
				.get(`${BASE_API_URL}/notifications/${created.id}`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(200)
			expect(res.body.id).toBe(created.id)
			expect(res.body.title).toBe('Notificação Específica')
		})

		test('Should return 400 for invalid UUID param', async () => {
			const res = await request(app)
				.get(`${BASE_API_URL}/notifications/not-a-valid-uuid`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(400)
		})

		test('Should return 404 when trying to get notification belonging to another user', async () => {
			const otherNotif = await setupTestNotification(otherUserContext.cookie || '')

			const res = await request(app)
				.get(`${BASE_API_URL}/notifications/${otherNotif.id}`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(404)
		})

		test('Should return 401 when unauthenticated', async () => {
			const notif = await setupTestNotification(userContext.cookie || '')
			const res = await request(app).get(`${BASE_API_URL}/notifications/${notif.id}`)
			expect(res.status).toBe(401)
		})
	})

	describe('PATCH /notifications/:id/read', () => {
		test('Should mark a single notification as read', async () => {
			const created = await setupTestNotification(userContext.cookie || '')
			expect(created.read).toBe(false)

			const res = await request(app)
				.patch(`${BASE_API_URL}/notifications/${created.id}/read`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(200)
			expect(res.body.read).toBe(true)

			// Verify in DB via GET
			const verifyRes = await request(app)
				.get(`${BASE_API_URL}/notifications/${created.id}`)
				.set('Cookie', userContext.cookie || '')

			expect(verifyRes.body.read).toBe(true)
		})

		test('Should return 400 for invalid UUID param', async () => {
			const res = await request(app)
				.patch(`${BASE_API_URL}/notifications/invalid-uuid/read`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(400)
		})

		test('Should return 404 when attempting to mark another user notification as read', async () => {
			const otherNotif = await setupTestNotification(otherUserContext.cookie || '')

			const res = await request(app)
				.patch(`${BASE_API_URL}/notifications/${otherNotif.id}/read`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(404)
		})

		test('Should return 401 when unauthenticated', async () => {
			const created = await setupTestNotification(userContext.cookie || '')
			const res = await request(app).patch(`${BASE_API_URL}/notifications/${created.id}/read`)
			expect(res.status).toBe(401)
		})
	})

	describe('PATCH /notifications/mark-all-read', () => {
		test('Should mark all unread notifications of the user as read', async () => {
			await setupTestNotification(userContext.cookie || '')
			await setupTestNotification(userContext.cookie || '')
			await setupTestNotification(userContext.cookie || '')

			const otherNotif = await setupTestNotification(otherUserContext.cookie || '')

			const res = await request(app)
				.patch(`${BASE_API_URL}/notifications/mark-all-read`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(200)

			// User 1 unread count should be 0
			const unreadRes = await request(app)
				.get(`${BASE_API_URL}/notifications/unread-count`)
				.set('Cookie', userContext.cookie || '')

			expect(unreadRes.body.unreadCount).toBe(0)

			// Other user unread count should still be 1
			const otherUnreadRes = await request(app)
				.get(`${BASE_API_URL}/notifications/unread-count`)
				.set('Cookie', otherUserContext.cookie || '')

			expect(otherUnreadRes.body.unreadCount).toBe(1)
		})

		test('Should return 401 when unauthenticated', async () => {
			const res = await request(app).patch(`${BASE_API_URL}/notifications/mark-all-read`)
			expect(res.status).toBe(401)
		})
	})

	describe('DELETE /notifications/:id', () => {
		test('Should delete a single notification', async () => {
			const created = await setupTestNotification(userContext.cookie || '')

			const res = await request(app)
				.delete(`${BASE_API_URL}/notifications/${created.id}`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(200)

			// Verify it's gone
			const verifyRes = await request(app)
				.get(`${BASE_API_URL}/notifications/${created.id}`)
				.set('Cookie', userContext.cookie || '')

			expect(verifyRes.status).toBe(404)
		})

		test('Should return 400 for invalid UUID param', async () => {
			const res = await request(app)
				.delete(`${BASE_API_URL}/notifications/invalid-uuid`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(400)
		})

		test('Should return 404 when trying to delete another user notification', async () => {
			const otherNotif = await setupTestNotification(otherUserContext.cookie || '')

			const res = await request(app)
				.delete(`${BASE_API_URL}/notifications/${otherNotif.id}`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(404)
		})

		test('Should return 401 when unauthenticated', async () => {
			const created = await setupTestNotification(userContext.cookie || '')
			const res = await request(app).delete(`${BASE_API_URL}/notifications/${created.id}`)
			expect(res.status).toBe(401)
		})
	})

	describe('DELETE /notifications', () => {
		test('Should delete all notifications for the authenticated user', async () => {
			await setupTestNotification(userContext.cookie || '')
			await setupTestNotification(userContext.cookie || '')
			const otherNotif = await setupTestNotification(otherUserContext.cookie || '')

			const res = await request(app)
				.delete(`${BASE_API_URL}/notifications`)
				.set('Cookie', userContext.cookie || '')

			expect(res.status).toBe(200)

			// User 1 notifications should be empty
			const listRes = await request(app)
				.get(`${BASE_API_URL}/notifications`)
				.set('Cookie', userContext.cookie || '')

			expect(listRes.body.notifications).toEqual([])
			expect(listRes.body.totalCount).toBe(0)

			// Other user notification should still exist
			const otherListRes = await request(app)
				.get(`${BASE_API_URL}/notifications`)
				.set('Cookie', otherUserContext.cookie || '')

			expect(otherListRes.body.totalCount).toBe(1)
		})

		test('Should return 401 when unauthenticated', async () => {
			const res = await request(app).delete(`${BASE_API_URL}/notifications`)
			expect(res.status).toBe(401)
		})
	})
})

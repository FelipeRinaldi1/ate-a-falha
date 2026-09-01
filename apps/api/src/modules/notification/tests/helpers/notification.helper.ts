import request from 'supertest'
import app from '../../../../app.js'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import { overrideNotificationMock } from '../mocks/notification.mock.js'
import { NotificationDTO, CreateNotificationDTO } from '@ate-a-falha/shared'

export const setupTestNotification = async (
	cookie: string,
	customData?: Partial<CreateNotificationDTO>
): Promise<NotificationDTO> => {
	const data = overrideNotificationMock(customData)
	const res = await request(app)
		.post(`${BASE_API_URL}/notifications`)
		.set('Cookie', cookie)
		.send(data)

	if (res.status !== 201) {
		throw new Error(`Failed to create test notification. Status: ${res.status}, body: ${JSON.stringify(res.body)}`)
	}

	return res.body
}

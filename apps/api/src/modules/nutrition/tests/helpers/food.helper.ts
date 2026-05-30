import request from 'supertest'
import app from '../../../../app.js'
import { CreateFoodDTO } from '@ate-a-falha/shared'
import { overrideFoodMock } from '../mocks/food.mock.js'
import { BASE_API_URL } from '@/constants/global/baseURL.js'

export const setupTestFood = async (cookie: string, overrides?: Partial<CreateFoodDTO>) => {
	const foodData = overrideFoodMock(overrides)
	const result = await request(app)
		.post(`${BASE_API_URL}/nutrition/food-catalog`)
		.set('Cookie', cookie)
		.send(foodData)

	return result.body
}

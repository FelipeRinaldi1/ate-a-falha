import { CreateFoodDTO, UpdateFoodDTO } from '@ate-a-falha/shared'

export const createFoodMock: CreateFoodDTO = {
	name: 'Banana',
	calories: 89,
	carbohydrate: 23,
	protein: 1.1,
	lipids: 0.3,
	fiber: 2.6,
}

export const updateFoodMock: UpdateFoodDTO = {
	name: 'Banana da Terra',
	calories: 120,
	carbohydrate: 32,
	protein: 1.3,
	lipids: 0.4,
	fiber: 3.0,
}

export const overrideFoodMock = (overrides?: Partial<CreateFoodDTO>): CreateFoodDTO => ({
	...createFoodMock,
	...overrides,
})

import { CreateBodyMetricDTO, UpdateBodyMetricDTO } from '@ate-a-falha/shared'

export const createBodyMetricMocK: CreateBodyMetricDTO = {
	weight: 80,
	height: 177,
	activityLevel: 4,
	bodyFat: 20,
	muscleRate: 36,
}

export const updateBodyMetricMocK: UpdateBodyMetricDTO = {
	weight: 75,
	height: 180,
	activityLevel: 3,
	bodyFat: 15,
	muscleRate: 37,
}

export const overrideBodyMetricMock = (overrides?: Partial<CreateBodyMetricDTO>): CreateBodyMetricDTO => ({
	...createBodyMetricMocK,
	...overrides,
})

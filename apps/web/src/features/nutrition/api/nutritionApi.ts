import { api } from '../../../api/axiosInstance'
import type {
	DietDTO,
	DietLogDTO,
	FoodDTO,
	MealDTO,
	MealLogDTO,
	CreateFoodDTO,
} from '@ate-a-falha/shared'

export const nutritionApi = {
	// Diets
	getDiets: async (): Promise<DietDTO[]> => {
		const res = await api.get<DietDTO[]>('/nutrition/diets')
		return res.data
	},

	createDiet: async (payload: Partial<DietDTO>): Promise<DietDTO> => {
		const res = await api.post<DietDTO>('/nutrition/diets', payload)
		return res.data
	},

	updateDiet: async (id: string, payload: Partial<DietDTO>): Promise<DietDTO> => {
		const res = await api.patch<DietDTO>(`/nutrition/diets/${id}`, payload)
		return res.data
	},

	exportDiet: async (id: string): Promise<DietDTO & { meals?: MealDTO[] }> => {
		const res = await api.get<DietDTO & { meals?: MealDTO[] }>(`/nutrition/diets/${id}/export`)
		return res.data
	},

	importDiet: async (id: string): Promise<DietDTO> => {
		const res = await api.post<DietDTO>(`/nutrition/diets/${id}/import`)
		return res.data
	},

	// Meals (template)
	getMeals: async (dietId: string): Promise<MealDTO[]> => {
		const res = await api.get<MealDTO[]>(`/nutrition/diets/${dietId}/meals`)
		return res.data
	},

	createMeal: async (dietId: string, data: { name: string; time: string; orderIndex: number }): Promise<MealDTO> => {
		const res = await api.post<MealDTO>(`/nutrition/diets/${dietId}/meals`, data)
		return res.data
	},

	updateMeal: async (mealId: string, data: { name?: string; time?: string }): Promise<MealDTO> => {
		const res = await api.patch<MealDTO>(`/nutrition/meals/${mealId}`, data)
		return res.data
	},

	deleteMeal: async (mealId: string): Promise<void> => {
		await api.delete(`/nutrition/meals/${mealId}`)
	},

	addFoodToMeal: async (mealId: string, data: { foodId: string; quantity: number }) => {
		const res = await api.post(`/nutrition/meals/${mealId}/foods`, data)
		return res.data
	},

	updateFoodInMeal: async (foodInMealId: string, data: { quantity: number }) => {
		const res = await api.patch(`/nutrition/food-in-meals/${foodInMealId}`, data)
		return res.data
	},

	deleteFoodInMeal: async (foodInMealId: string): Promise<void> => {
		await api.delete(`/nutrition/food-in-meals/${foodInMealId}`)
	},

	// DietLogs & MealLogs
	getDietLogs: async (): Promise<DietLogDTO[]> => {
		const res = await api.get<DietLogDTO[]>('/nutrition/diet-logs')
		return res.data
	},

	createDietLog: async (date: string): Promise<DietLogDTO> => {
		const res = await api.post<DietLogDTO>('/nutrition/diet-logs', { date })
		return res.data
	},

	updateDietLog: async (id: string, data: { waterIntake: number }): Promise<DietLogDTO> => {
		const res = await api.patch<DietLogDTO>(`/nutrition/diet-logs/${id}`, data)
		return res.data
	},

	getMealLog: async (id: string): Promise<MealLogDTO> => {
		const res = await api.get<MealLogDTO>(`/nutrition/meal-logs/${id}`)
		return res.data
	},

	createMealLog: async (
		dietLogId: string,
		data: { name: string; time: string; orderIndex: number; foods?: Array<{ foodId: string; quantity: number }> }
	): Promise<MealLogDTO> => {
		const res = await api.post<MealLogDTO>(`/nutrition/diet-logs/${dietLogId}/meals`, data)
		return res.data
	},

	updateMealLog: async (id: string, data: { name?: string; time?: string }): Promise<MealLogDTO> => {
		const res = await api.patch<MealLogDTO>(`/nutrition/meal-logs/${id}`, data)
		return res.data
	},

	deleteMealLog: async (id: string): Promise<void> => {
		await api.delete(`/nutrition/meal-logs/${id}`)
	},

	addFoodToMealLog: async (mealLogId: string, data: { foodId: string; quantity: number }) => {
		const res = await api.post(`/nutrition/meal-logs/${mealLogId}/foods`, data)
		return res.data
	},

	updateFoodLog: async (foodLogId: string, data: { quantity: number }) => {
		const res = await api.patch(`/nutrition/food-logs/${foodLogId}`, data)
		return res.data
	},

	deleteFoodLog: async (foodLogId: string): Promise<void> => {
		await api.delete(`/nutrition/food-logs/${foodLogId}`)
	},

	// Food catalog
	searchFoods: async (params: {
		name?: string
		onlyMine?: boolean
		take?: number
		cursorId?: string
	}): Promise<FoodDTO[]> => {
		const res = await api.get<FoodDTO[]>('/nutrition/food-catalog', { params })
		return res.data
	},

	getFoodById: async (id: string): Promise<FoodDTO> => {
		const res = await api.get<FoodDTO>(`/nutrition/food-catalog/${id}`)
		return res.data
	},

	createFood: async (data: CreateFoodDTO): Promise<FoodDTO> => {
		const res = await api.post<FoodDTO>('/nutrition/food-catalog', data)
		return res.data
	},

	deleteFood: async (id: string): Promise<void> => {
		await api.delete(`/nutrition/food-catalog/${id}`)
	},
}

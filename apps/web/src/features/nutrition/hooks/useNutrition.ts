import { useQuery, useMutation, useInfiniteQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { nutritionApi } from '../api/nutritionApi'
import type { CreateFoodDTO, DietDTO } from '@ate-a-falha/shared'
import { NOTIFICATION_QUERY_KEYS } from '../../notification/hooks/useNotifications'

export const NUTRITION_QUERY_KEYS = {
	diets: ['diets'] as const,
	targetMealsAll: ['target-meals'] as const,
	targetMeals: (dietId?: string) => ['target-meals', dietId] as const,
	dietLogs: ['diet-logs'] as const,
	mealLog: (id?: string) => ['meal-log', id] as const,
	foodCatalog: ['food-catalog'] as const,
	foodSearch: (search: string) => ['food-catalog', search] as const,
	foodDetail: (id?: string) => ['food-catalog-detail', id] as const,
	exportDiet: (id?: string) => ['export-diet', id] as const,
}

export function useDiets() {
	return useQuery({
		queryKey: NUTRITION_QUERY_KEYS.diets,
		queryFn: nutritionApi.getDiets,
	})
}

export function useTargetMeals(dietId?: string) {
	return useQuery({
		queryKey: NUTRITION_QUERY_KEYS.targetMeals(dietId),
		queryFn: () => nutritionApi.getMeals(dietId!),
		enabled: !!dietId,
	})
}

export function useDietLogs() {
	return useQuery({
		queryKey: NUTRITION_QUERY_KEYS.dietLogs,
		queryFn: nutritionApi.getDietLogs,
	})
}

export function useMealLog(id?: string) {
	return useQuery({
		queryKey: NUTRITION_QUERY_KEYS.mealLog(id),
		queryFn: () => nutritionApi.getMealLog(id!),
		enabled: !!id,
	})
}

export function useFoodById(id?: string) {
	return useQuery({
		queryKey: NUTRITION_QUERY_KEYS.foodDetail(id),
		queryFn: () => nutritionApi.getFoodById(id!),
		enabled: !!id,
	})
}

export function useExportDiet(id?: string) {
	return useQuery({
		queryKey: NUTRITION_QUERY_KEYS.exportDiet(id),
		queryFn: () => nutritionApi.exportDiet(id!),
		enabled: !!id,
		retry: false,
	})
}

export function useInfiniteFoods(search: string) {
	return useInfiniteQuery({
		queryKey: NUTRITION_QUERY_KEYS.foodSearch(search),
		queryFn: ({ pageParam }) =>
			nutritionApi.searchFoods({
				name: search || undefined,
				take: search ? 30 : 20,
				cursorId: pageParam as string | undefined,
			}),
		initialPageParam: undefined as string | undefined,
		placeholderData: keepPreviousData,
		getNextPageParam: (lastPage) => {
			if (search || lastPage.length < 20) return undefined
			return lastPage[lastPage.length - 1]?.id
		},
	})
}

export function useCreateDiet() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: Partial<DietDTO>) => nutritionApi.createDiet(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.diets })
		},
	})
}

export function useUpdateDiet() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<DietDTO> }) => nutritionApi.updateDiet(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.diets })
		},
	})
}

export function useUpdateMeal(dietId?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ mealId, name, time }: { mealId: string; name: string; time: string }) =>
			nutritionApi.updateMeal(mealId, { name, time }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.targetMeals(dietId) })
		},
	})
}

export function useDeleteMeal(dietId?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (mealId: string) => nutritionApi.deleteMeal(mealId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.targetMeals(dietId) })
		},
	})
}

export function useDeleteFoodInMeal(dietId?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (foodInMealId: string) => nutritionApi.deleteFoodInMeal(foodInMealId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.targetMeals(dietId) })
		},
	})
}

export function useUpdateFoodInMeal(dietId?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ foodInMealId, quantity }: { foodInMealId: string; quantity: number }) =>
			nutritionApi.updateFoodInMeal(foodInMealId, { quantity }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.targetMeals(dietId) })
		},
	})
}

export function useImportDiet() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => nutritionApi.importDiet(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.diets })
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })
		},
	})
}

export function useCreateFood() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (data: CreateFoodDTO) => nutritionApi.createFood(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.foodCatalog })
		},
	})
}

export function useDeleteFood() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => nutritionApi.deleteFood(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.foodCatalog })
		},
	})
}

export function useCreateDietLog() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (dateStr: string) => nutritionApi.createDietLog(dateStr),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.dietLogs })
		},
	})
}

export function useUpdateDietLog() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: { waterIntake: number } }) => nutritionApi.updateDietLog(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.dietLogs })
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })
		},
	})
}

export function useCreateMealLog() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			dietLogId,
			name,
			time,
			orderIndex,
			foods,
		}: {
			dietLogId: string
			name: string
			time: string
			orderIndex: number
			foods?: Array<{ foodId: string; quantity: number }>
		}) => nutritionApi.createMealLog(dietLogId, { name, time, orderIndex, foods }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.dietLogs })
		},
	})
}

export function useDeleteMealLog() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => nutritionApi.deleteMealLog(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.dietLogs })
		},
	})
}

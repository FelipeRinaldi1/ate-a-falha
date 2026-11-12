import { useQuery, useMutation, useInfiniteQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { workoutApi } from '../api/workoutApi'
import { NOTIFICATION_QUERY_KEYS } from '../../notification/hooks/useNotifications'

export const WORKOUT_QUERY_KEYS = {
	plans: ['workout-plans'] as const,
	planDetail: (id?: string) => ['workout-plans-detail', id] as const,
	exerciseCatalog: ['exercise-catalog'] as const,
	exerciseCatalogAll: ['exercise-catalog-all-options'] as const,
	exerciseInfinite: (search: string, category: string | null, muscle: string | null) =>
		['exercise-catalog-infinite', search, category, muscle] as const,
	exerciseDetail: (id?: string) => ['exercise', id] as const,
	exportPlan: (id?: string) => ['export-plan', id] as const,
}

export function usePlans() {
	return useQuery({
		queryKey: WORKOUT_QUERY_KEYS.plans,
		queryFn: workoutApi.getPlans,
	})
}

export function usePlanDetail(id?: string) {
	return useQuery({
		queryKey: WORKOUT_QUERY_KEYS.planDetail(id),
		queryFn: () => workoutApi.getPlanById(id!),
		enabled: !!id,
		refetchOnWindowFocus: false,
		staleTime: 300000,
	})
}

export function useExerciseCatalogAll() {
	return useQuery({
		queryKey: WORKOUT_QUERY_KEYS.exerciseCatalogAll,
		queryFn: () => workoutApi.getExerciseCatalog({ take: 800 }),
		staleTime: 1000 * 60 * 10,
	})
}

export function useRandomExercises() {
	return useQuery({
		queryKey: WORKOUT_QUERY_KEYS.exerciseCatalog,
		queryFn: () => workoutApi.getExerciseCatalog({ random: true }),
	})
}

export function useInfiniteExercises(search: string, category: string | null, muscle: string | null) {
	return useInfiniteQuery({
		queryKey: WORKOUT_QUERY_KEYS.exerciseInfinite(search, category, muscle),
		queryFn: ({ pageParam }) =>
			workoutApi.getExerciseCatalog({
				name: search || undefined,
				category: category || undefined,
				primaryMuscles: muscle || undefined,
				take: 20,
				cursorId: pageParam as string | undefined,
			}),
		initialPageParam: undefined as string | undefined,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5,
		getNextPageParam: (lastPage) => {
			if (lastPage.length < 20) return undefined
			return lastPage[lastPage.length - 1]?.id
		},
	})
}

export function useExerciseById(id?: string) {
	return useQuery({
		queryKey: WORKOUT_QUERY_KEYS.exerciseDetail(id),
		queryFn: () => workoutApi.getExerciseById(id!),
		enabled: !!id,
	})
}

export function useExportPlan(id?: string) {
	return useQuery({
		queryKey: WORKOUT_QUERY_KEYS.exportPlan(id),
		queryFn: () => workoutApi.exportPlan(id!),
		enabled: !!id,
		retry: false,
	})
}

export function useCreatePlan() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (data: { name: string; goal: string }) => workoutApi.createPlan(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.plans })
		},
	})
}

export function useUpdatePlan() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string
			data: Parameters<typeof workoutApi.updatePlan>[1]
		}) => workoutApi.updatePlan(id, data),
		onSuccess: (_data, vars) => {
			queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.plans })
			queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.planDetail(vars.id) })
		},
	})
}

export function useDeletePlan() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => workoutApi.deletePlan(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.plans })
		},
	})
}

export function useImportPlan() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => workoutApi.importPlan(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.plans })
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })
		},
	})
}

export function useReplaceSets(planId?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			workoutExerciseId,
			sets,
		}: {
			workoutExerciseId: string
			sets: Array<{ repetitions: number; weight?: number | null; restTimeSeconds: number }>
		}) => workoutApi.replaceSets(workoutExerciseId, sets),
		onSuccess: () => {
			if (planId) {
				queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.planDetail(planId) })
			}
		},
	})
}

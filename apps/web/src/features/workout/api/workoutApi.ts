import { api } from '../../../api/axiosInstance'
import type { PlanDTO, ExerciseDTO, WorkoutDTO, SetDTO } from '@ate-a-falha/shared'

export const workoutApi = {
	// Plans
	getPlans: async (): Promise<PlanDTO[]> => {
		const res = await api.get<PlanDTO[]>('/workout/plans')
		return res.data
	},

	getPlanById: async (id: string): Promise<PlanDTO> => {
		const res = await api.get<PlanDTO>(`/workout/plans/${id}`)
		return res.data
	},

	createPlan: async (data: { name: string; goal: string }): Promise<PlanDTO> => {
		const res = await api.post<PlanDTO>('/workout/plans', data)
		return res.data
	},

	updatePlan: async (
		id: string,
		data: {
			name?: string
			goal?: string
			isActive?: boolean
			isExported?: boolean
			coverImageUrl?: string | null
			coverExerciseId?: string | null
		}
	): Promise<PlanDTO> => {
		const res = await api.patch<PlanDTO>(`/workout/plans/${id}`, data)
		return res.data
	},

	deletePlan: async (id: string): Promise<void> => {
		await api.delete(`/workout/plans/${id}`)
	},

	exportPlan: async (id: string): Promise<PlanDTO> => {
		const res = await api.get<PlanDTO>(`/workout/plans/${id}/export`)
		return res.data
	},

	importPlan: async (id: string): Promise<PlanDTO> => {
		const res = await api.post<PlanDTO>(`/workout/plans/${id}/import`)
		return res.data
	},

	// Workouts
	createWorkout: async (
		planId: string,
		data: { name: string; day: string; weekDay?: string | null }
	): Promise<WorkoutDTO> => {
		const res = await api.post<WorkoutDTO>(`/workout/plans/${planId}/workouts`, data)
		return res.data
	},

	updateWorkout: async (id: string, data: { name?: string; weekDay?: string | null }): Promise<WorkoutDTO> => {
		const res = await api.patch<WorkoutDTO>(`/workout/workouts/${id}`, data)
		return res.data
	},

	deleteWorkout: async (id: string): Promise<void> => {
		await api.delete(`/workout/workouts/${id}`)
	},

	// Workout exercises & sets
	addExerciseToWorkout: async (workoutId: string, data: { exerciseId: string; orderIndex: number }) => {
		const res = await api.post(`/workout/workouts/${workoutId}/exercises`, data)
		return res.data
	},

	deleteWorkoutExercise: async (workoutExerciseId: string): Promise<void> => {
		await api.delete(`/workout/workout-exercises/${workoutExerciseId}`)
	},

	addSet: async (
		workoutExerciseId: string,
		data: { setNumber?: number; repetitions: number; weight?: number | null; restTimeSeconds: number }
	): Promise<SetDTO> => {
		const res = await api.post<SetDTO>(`/workout/workout-exercises/${workoutExerciseId}/sets`, data)
		return res.data
	},

	replaceSets: async (
		workoutExerciseId: string,
		sets: Array<{ repetitions: number; weight?: number | null; restTimeSeconds: number }>
	): Promise<SetDTO[]> => {
		const res = await api.put<SetDTO[]>(`/workout/workout-exercises/${workoutExerciseId}/sets`, { sets })
		return res.data
	},

	// Exercise catalog
	getExerciseCatalog: async (params?: {
		name?: string
		category?: string
		primaryMuscles?: string
		secondaryMuscles?: string
		take?: number
		cursorId?: string
		random?: boolean
	}): Promise<ExerciseDTO[]> => {
		const res = await api.get<ExerciseDTO[]>('/workout/exercise-catalog', { params })
		return res.data
	},

	getExerciseById: async (id: string): Promise<ExerciseDTO> => {
		const res = await api.get<ExerciseDTO>(`/workout/exercise-catalog/${id}`)
		return res.data
	},
}

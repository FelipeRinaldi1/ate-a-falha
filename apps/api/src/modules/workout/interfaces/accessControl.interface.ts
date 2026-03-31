import { Result } from "@ate-a-falha/shared"


export interface IWorkoutAccessControl {
	canAccessSet(setId: string, userId: string): Promise<Result<boolean>>

	canAccessWorkoutExercise(workoutExerciseId: string, userId: string): Promise<Result<boolean>>

	canAccessWorkout(workoutId: string, userId: string): Promise<Result<boolean>>

	canAccessPlan(planId: string, userId: string): Promise<Result<boolean>>
}

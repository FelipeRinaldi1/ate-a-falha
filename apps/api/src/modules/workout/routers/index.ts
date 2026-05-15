import { Router } from 'express'
import { exerciseRouter } from './exercise.router.js'
import { setRouter } from './set.router.js'
import { workoutExerciseRouter } from './workoutExercise.router.js'
import { workoutRouter } from './workout.router.js'
import { planRouter } from './plan.router.js'

const workoutModuleRouter = Router()

workoutModuleRouter.use('/plan', planRouter)
workoutModuleRouter.use('/workout', workoutRouter)
workoutModuleRouter.use('/workout-exercise', workoutExerciseRouter)
workoutModuleRouter.use('/set', setRouter)
workoutModuleRouter.use('/exercise-catalog', exerciseRouter)

export { workoutModuleRouter }

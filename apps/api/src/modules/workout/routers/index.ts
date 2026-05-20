import { Router } from 'express'
import { exerciseRouter } from './exercise.router.js'
import { setRouter } from './set.router.js'
import { workoutExerciseRouter } from './workoutExercise.router.js'
import { workoutRouter } from './workout.router.js'
import { planRouter } from './plan.router.js'

const workoutModuleRouter = Router()

workoutModuleRouter.use('/', planRouter)
workoutModuleRouter.use('/', workoutRouter)
workoutModuleRouter.use('/', workoutExerciseRouter)
workoutModuleRouter.use('/', setRouter)
workoutModuleRouter.use('/', exerciseRouter)

export { workoutModuleRouter }

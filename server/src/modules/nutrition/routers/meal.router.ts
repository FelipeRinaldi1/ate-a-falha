import { Router } from 'express'
import { MealFactory } from '../factory/meal.factory.js'

const router = Router()
const mealController = MealFactory.createController()

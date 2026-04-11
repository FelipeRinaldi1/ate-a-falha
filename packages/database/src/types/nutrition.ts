import { Prisma } from '../generated/prisma/client.js'

export type DietFull = Prisma.DietGetPayload<{
	include: { Meal: { include: { foods: { include: { food: true } } } } }
}>

export type FoodFull = Prisma.FoodGetPayload<{
	include: { foodInMeals: true }
}>

export type FoodInMealFull = Prisma.FoodInMealGetPayload<{
	include: { food: true }
}>

export type MealFull = Prisma.MealGetPayload<{
	include: { foods: { include: { food: true } } }
}>

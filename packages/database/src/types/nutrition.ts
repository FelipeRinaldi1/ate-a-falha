import { Prisma } from '../generated/prisma/index.js'

export type DietFull = Prisma.DietGetPayload<{
	include: { meals: { include: { foods: { include: { food: true } } } } }
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

export type FoodLogFull = Prisma.FoodLogGetPayload<{
	include: { food: true }
}>

export type MealLogFull = Prisma.MealLogGetPayload<{
	include: { foods: { include: { food: true } } }
}>

export type DietLogFull = Prisma.DietLogGetPayload<{
	include: { meals: { include: { foods: { include: { food: true } } } } }
}>

/*
  Warnings:

  - The primary key for the `BodyComposition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `body_composition_activity_level` on the `BodyComposition` table. All the data in the column will be lost.
  - You are about to drop the column `body_composition_birth` on the `BodyComposition` table. All the data in the column will be lost.
  - You are about to drop the column `body_composition_gender` on the `BodyComposition` table. All the data in the column will be lost.
  - You are about to drop the column `body_composition_height` on the `BodyComposition` table. All the data in the column will be lost.
  - You are about to drop the column `body_composition_id` on the `BodyComposition` table. All the data in the column will be lost.
  - You are about to drop the column `body_composition_weight` on the `BodyComposition` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `BodyComposition` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `BodyComposition` table. All the data in the column will be lost.
  - The primary key for the `Diet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Diet` table. All the data in the column will be lost.
  - You are about to drop the column `diet_goal_id` on the `Diet` table. All the data in the column will be lost.
  - You are about to drop the column `diet_id` on the `Diet` table. All the data in the column will be lost.
  - You are about to drop the column `diet_name` on the `Diet` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Diet` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Diet` table. All the data in the column will be lost.
  - The primary key for the `DietGoal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `DietGoal` table. All the data in the column will be lost.
  - You are about to drop the column `diet_goal_carbohydrate` on the `DietGoal` table. All the data in the column will be lost.
  - You are about to drop the column `diet_goal_fat` on the `DietGoal` table. All the data in the column will be lost.
  - You are about to drop the column `diet_goal_fiber` on the `DietGoal` table. All the data in the column will be lost.
  - You are about to drop the column `diet_goal_id` on the `DietGoal` table. All the data in the column will be lost.
  - You are about to drop the column `diet_goal_protein` on the `DietGoal` table. All the data in the column will be lost.
  - You are about to drop the column `diet_goal_water` on the `DietGoal` table. All the data in the column will be lost.
  - You are about to drop the column `diet_id` on the `DietGoal` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `DietGoal` table. All the data in the column will be lost.
  - The primary key for the `Exercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `exercise_description` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `exercise_id` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `exercise_name` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Exercise` table. All the data in the column will be lost.
  - The primary key for the `Food` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `food_carbohydrate` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `food_fat` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `food_fiber` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `food_id` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `food_name` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `food_protein` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Food` table. All the data in the column will be lost.
  - The primary key for the `Meal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `diet_id` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `meal_id` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `meal_name` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `meal_time` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Meal` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `EspecificWorkout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExerciseWithSets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GlobalWorkout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealWithFood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sets` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Diet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dietId]` on the table `DietGoal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activityLevel` to the `BodyComposition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth` to the `BodyComposition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `BodyComposition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `BodyComposition` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `BodyComposition` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `BodyComposition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `BodyComposition` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Diet` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `Diet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Diet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Diet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbohydrate` to the `DietGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dietId` to the `DietGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fat` to the `DietGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiber` to the `DietGoal` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `DietGoal` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `protein` to the `DietGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DietGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `water` to the `DietGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Exercise` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbohydrate` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fat` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiber` to the `Food` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Food` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dietId` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Meal` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."GENDER" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."WorkoutDay" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F');

-- DropForeignKey
ALTER TABLE "public"."BodyComposition" DROP CONSTRAINT "BodyComposition_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Diet" DROP CONSTRAINT "Diet_diet_goal_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Diet" DROP CONSTRAINT "Diet_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."EspecificWorkout" DROP CONSTRAINT "EspecificWorkout_globalWorkoutGlobal_workout_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExerciseWithSets" DROP CONSTRAINT "ExerciseWithSets_especificWorkoutEspecific_workout_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExerciseWithSets" DROP CONSTRAINT "ExerciseWithSets_exercise_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExerciseWithSets" DROP CONSTRAINT "ExerciseWithSets_set_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."GlobalWorkout" DROP CONSTRAINT "GlobalWorkout_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Meal" DROP CONSTRAINT "Meal_diet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."MealWithFood" DROP CONSTRAINT "MealWithFood_food_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."MealWithFood" DROP CONSTRAINT "MealWithFood_meal_id_fkey";

-- DropIndex
DROP INDEX "public"."Diet_diet_goal_id_key";

-- DropIndex
DROP INDEX "public"."Diet_user_id_key";

-- DropIndex
DROP INDEX "public"."DietGoal_diet_id_key";

-- DropIndex
DROP INDEX "public"."User_user_email_key";

-- AlterTable
ALTER TABLE "public"."BodyComposition" DROP CONSTRAINT "BodyComposition_pkey",
DROP COLUMN "body_composition_activity_level",
DROP COLUMN "body_composition_birth",
DROP COLUMN "body_composition_gender",
DROP COLUMN "body_composition_height",
DROP COLUMN "body_composition_id",
DROP COLUMN "body_composition_weight",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "activityLevel" INTEGER NOT NULL,
ADD COLUMN     "birth" DATE NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gender" "public"."GENDER" NOT NULL,
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "weight" INTEGER NOT NULL,
ADD CONSTRAINT "BodyComposition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Diet" DROP CONSTRAINT "Diet_pkey",
DROP COLUMN "created_at",
DROP COLUMN "diet_goal_id",
DROP COLUMN "diet_id",
DROP COLUMN "diet_name",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" VARCHAR(64) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Diet_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."DietGoal" DROP CONSTRAINT "DietGoal_pkey",
DROP COLUMN "created_at",
DROP COLUMN "diet_goal_carbohydrate",
DROP COLUMN "diet_goal_fat",
DROP COLUMN "diet_goal_fiber",
DROP COLUMN "diet_goal_id",
DROP COLUMN "diet_goal_protein",
DROP COLUMN "diet_goal_water",
DROP COLUMN "diet_id",
DROP COLUMN "updated_at",
ADD COLUMN     "carbohydrate" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dietId" TEXT NOT NULL,
ADD COLUMN     "fat" INTEGER NOT NULL,
ADD COLUMN     "fiber" INTEGER NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "protein" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "water" INTEGER NOT NULL,
ADD CONSTRAINT "DietGoal_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Exercise" DROP CONSTRAINT "Exercise_pkey",
DROP COLUMN "created_at",
DROP COLUMN "exercise_description",
DROP COLUMN "exercise_id",
DROP COLUMN "exercise_name",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" VARCHAR(64) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL,
ADD CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Food" DROP CONSTRAINT "Food_pkey",
DROP COLUMN "created_at",
DROP COLUMN "food_carbohydrate",
DROP COLUMN "food_fat",
DROP COLUMN "food_fiber",
DROP COLUMN "food_id",
DROP COLUMN "food_name",
DROP COLUMN "food_protein",
DROP COLUMN "updated_at",
ADD COLUMN     "carbohydrate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fiber" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" VARCHAR(64) NOT NULL,
ADD COLUMN     "protein" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL,
ADD CONSTRAINT "Food_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Meal" DROP CONSTRAINT "Meal_pkey",
DROP COLUMN "created_at",
DROP COLUMN "diet_id",
DROP COLUMN "meal_id",
DROP COLUMN "meal_name",
DROP COLUMN "meal_time",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dietId" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" VARCHAR(64) NOT NULL,
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL,
ADD CONSTRAINT "Meal_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
DROP COLUMN "user_email",
DROP COLUMN "user_id",
DROP COLUMN "user_name",
DROP COLUMN "user_password",
ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."EspecificWorkout";

-- DropTable
DROP TABLE "public"."ExerciseWithSets";

-- DropTable
DROP TABLE "public"."GlobalWorkout";

-- DropTable
DROP TABLE "public"."MealWithFood";

-- DropTable
DROP TABLE "public"."Sets";

-- CreateTable
CREATE TABLE "public"."FoodInMeal" (
    "id" TEXT NOT NULL,
    "quantityPer100g" DOUBLE PRECISION NOT NULL,
    "mealId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "FoodInMeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Set" (
    "id" TEXT NOT NULL,
    "load" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "restTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SetInExercise" (
    "setInExerciseId" TEXT NOT NULL,
    "workoutId" TEXT,
    "exerciseId" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "SetInExercise_pkey" PRIMARY KEY ("setInExerciseId")
);

-- CreateTable
CREATE TABLE "public"."Workout" (
    "id" TEXT NOT NULL,
    "day" "public"."WorkoutDay" NOT NULL,
    "workoutRoutine" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkoutRoutine" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "WorkoutRoutine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Diet_userId_key" ON "public"."Diet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DietGoal_dietId_key" ON "public"."DietGoal"("dietId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."BodyComposition" ADD CONSTRAINT "BodyComposition_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DietGoal" ADD CONSTRAINT "DietGoal_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES "public"."Diet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diet" ADD CONSTRAINT "Diet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Meal" ADD CONSTRAINT "Meal_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES "public"."Diet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FoodInMeal" ADD CONSTRAINT "FoodInMeal_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "public"."Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FoodInMeal" ADD CONSTRAINT "FoodInMeal_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "public"."Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SetInExercise" ADD CONSTRAINT "SetInExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "public"."Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SetInExercise" ADD CONSTRAINT "SetInExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "public"."Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SetInExercise" ADD CONSTRAINT "SetInExercise_setId_fkey" FOREIGN KEY ("setId") REFERENCES "public"."Set"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workout" ADD CONSTRAINT "Workout_workoutRoutine_fkey" FOREIGN KEY ("workoutRoutine") REFERENCES "public"."WorkoutRoutine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkoutRoutine" ADD CONSTRAINT "WorkoutRoutine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

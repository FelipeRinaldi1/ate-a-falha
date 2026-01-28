/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Exercise` table. All the data in the column will be lost.
  - You are about to alter the column `carbohydrate` on the `Food` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `fat` on the `Food` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `fiber` on the `Food` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `protein` on the `Food` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `quantityPer100g` on the `FoodInMeal` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `workoutRoutine` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the `DietGoal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Set` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SetInExercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserMetrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutRoutine` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dailyCarbGoal` to the `Diet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyFatGoal` to the `Diet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyKcalGoal` to the `Diet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyProteinGoal` to the `Diet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyWaterGoal` to the `Diet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calories` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `FoodInMeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderIndex` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workoutPlanId` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."DietGoal" DROP CONSTRAINT "DietGoal_dietId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Meal" DROP CONSTRAINT "Meal_dietId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SetInExercise" DROP CONSTRAINT "SetInExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SetInExercise" DROP CONSTRAINT "SetInExercise_setId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SetInExercise" DROP CONSTRAINT "SetInExercise_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserMetrics" DROP CONSTRAINT "UserMetrics_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Workout" DROP CONSTRAINT "Workout_workoutRoutine_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkoutRoutine" DROP CONSTRAINT "WorkoutRoutine_userId_fkey";

-- DropIndex
DROP INDEX "public"."Diet_userId_key";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "public"."Diet" ADD COLUMN     "dailyCarbGoal" INTEGER NOT NULL,
ADD COLUMN     "dailyFatGoal" INTEGER NOT NULL,
ADD COLUMN     "dailyKcalGoal" INTEGER NOT NULL,
ADD COLUMN     "dailyProteinGoal" INTEGER NOT NULL,
ADD COLUMN     "dailyWaterGoal" INTEGER NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Exercise" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Food" ADD COLUMN     "baseAmount" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "baseUnit" TEXT NOT NULL DEFAULT 'g',
ADD COLUMN     "calories" INTEGER NOT NULL,
ALTER COLUMN "carbohydrate" SET DATA TYPE INTEGER,
ALTER COLUMN "fat" SET DATA TYPE INTEGER,
ALTER COLUMN "fiber" SET DATA TYPE INTEGER,
ALTER COLUMN "protein" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."FoodInMeal" DROP COLUMN "quantityPer100g",
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Meal" ADD COLUMN     "orderIndex" INTEGER NOT NULL,
ALTER COLUMN "time" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "email",
DROP COLUMN "password",
ADD COLUMN     "birth" DATE NOT NULL,
ADD COLUMN     "gender" "public"."GENDER" NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Workout" DROP COLUMN "workoutRoutine",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "workoutPlanId" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "public"."DietGoal";

-- DropTable
DROP TABLE "public"."Set";

-- DropTable
DROP TABLE "public"."SetInExercise";

-- DropTable
DROP TABLE "public"."UserMetrics";

-- DropTable
DROP TABLE "public"."WorkoutRoutine";

-- CreateTable
CREATE TABLE "public"."Auth" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PhysicalAssessment" (
    "id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" INTEGER NOT NULL,
    "activityLevel" INTEGER NOT NULL,
    "fatPercentage" DOUBLE PRECISION,
    "muscleMass" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhysicalAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkoutPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkoutExercise" (
    "id" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "workoutId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "WorkoutExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkoutSet" (
    "id" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "restTimeSeconds" INTEGER NOT NULL,
    "workoutExerciseId" TEXT NOT NULL,

    CONSTRAINT "WorkoutSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "public"."Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "public"."Auth"("userId");

-- CreateIndex
CREATE INDEX "WorkoutExercise_workoutId_idx" ON "public"."WorkoutExercise"("workoutId");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_key" ON "public"."Exercise"("name");

-- AddForeignKey
ALTER TABLE "public"."Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhysicalAssessment" ADD CONSTRAINT "PhysicalAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Meal" ADD CONSTRAINT "Meal_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES "public"."Diet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkoutPlan" ADD CONSTRAINT "WorkoutPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workout" ADD CONSTRAINT "Workout_workoutPlanId_fkey" FOREIGN KEY ("workoutPlanId") REFERENCES "public"."WorkoutPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "public"."Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "public"."Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkoutSet" ADD CONSTRAINT "WorkoutSet_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "public"."WorkoutExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

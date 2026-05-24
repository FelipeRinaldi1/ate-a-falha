/*
  Warnings:

  - You are about to drop the column `workoutPlanId` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the `WorkoutPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutSet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,userId]` on the table `Diet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdAt` to the `Auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyWater` to the `Diet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planId` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_workoutPlanId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutPlan" DROP CONSTRAINT "WorkoutPlan_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutSet" DROP CONSTRAINT "WorkoutSet_workoutExerciseId_fkey";

-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Diet" ADD COLUMN     "dailyWater" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "workoutPlanId",
ADD COLUMN     "planId" TEXT NOT NULL;

-- DropTable
DROP TABLE "WorkoutPlan";

-- DropTable
DROP TABLE "WorkoutSet";

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Set" (
    "id" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "restTimeSeconds" INTEGER NOT NULL,
    "workoutExerciseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_id_userId_key" ON "Plan"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Diet_id_userId_key" ON "Diet"("id", "userId");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "WorkoutExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

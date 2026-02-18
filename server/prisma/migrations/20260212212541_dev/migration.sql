/*
  Warnings:

  - You are about to drop the `PhysicalAssessment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `muscularGroup` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `day` on the `Workout` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "WORKOUT_DAY" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F');

-- DropForeignKey
ALTER TABLE "PhysicalAssessment" DROP CONSTRAINT "PhysicalAssessment_userId_fkey";

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "muscularGroup" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "fiber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "day",
ADD COLUMN     "day" "WORKOUT_DAY" NOT NULL;

-- DropTable
DROP TABLE "PhysicalAssessment";

-- DropEnum
DROP TYPE "WorkoutDay";

-- CreateTable
CREATE TABLE "BodyMetric" (
    "id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" INTEGER NOT NULL,
    "activityLevel" INTEGER NOT NULL,
    "bodyFat" DOUBLE PRECISION,
    "muscleRate" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BodyMetric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BodyMetric" ADD CONSTRAINT "BodyMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

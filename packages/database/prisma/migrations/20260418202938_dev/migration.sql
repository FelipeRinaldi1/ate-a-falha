/*
  Warnings:

  - You are about to drop the column `description` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `muscleGroup` on the `Exercise` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Exercise_name_key";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "muscleGroup",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "instructions" TEXT[],
ADD COLUMN     "primaryMuscles" TEXT[],
ADD COLUMN     "secondaryMuscles" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_externalId_key" ON "Exercise"("externalId");

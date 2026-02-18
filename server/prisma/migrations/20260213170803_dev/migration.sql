/*
  Warnings:

  - You are about to drop the column `muscularGroup` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `muscleGroup` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "muscularGroup",
ADD COLUMN     "muscleGroup" TEXT NOT NULL;

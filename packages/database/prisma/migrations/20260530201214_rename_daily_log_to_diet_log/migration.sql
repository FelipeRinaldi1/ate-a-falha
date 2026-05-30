/*
  Warnings:

  - You are about to drop the column `dailyLogId` on the `MealLog` table. All the data in the column will be lost.
  - You are about to drop the `DailyLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dietLogId` to the `MealLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DailyLog" DROP CONSTRAINT "DailyLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "MealLog" DROP CONSTRAINT "MealLog_dailyLogId_fkey";

-- AlterTable
ALTER TABLE "MealLog" DROP COLUMN "dailyLogId",
ADD COLUMN     "dietLogId" TEXT NOT NULL;

-- DropTable
DROP TABLE "DailyLog";

-- CreateTable
CREATE TABLE "DietLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DietLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DietLog_userId_date_key" ON "DietLog"("userId", "date");

-- AddForeignKey
ALTER TABLE "DietLog" ADD CONSTRAINT "DietLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealLog" ADD CONSTRAINT "MealLog_dietLogId_fkey" FOREIGN KEY ("dietLogId") REFERENCES "DietLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

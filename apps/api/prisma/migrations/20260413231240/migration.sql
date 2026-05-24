/*
  Warnings:

  - You are about to drop the column `baseAmount` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `baseUnit` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `fat` on the `Food` table. All the data in the column will be lost.
  - Added the required column `lipids` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Made the column `fiber` on table `Food` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Food" DROP COLUMN "baseAmount",
DROP COLUMN "baseUnit",
DROP COLUMN "fat",
ADD COLUMN     "lipids" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(128),
ALTER COLUMN "calories" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "carbohydrate" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "protein" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "fiber" SET NOT NULL,
ALTER COLUMN "fiber" SET DATA TYPE DOUBLE PRECISION;

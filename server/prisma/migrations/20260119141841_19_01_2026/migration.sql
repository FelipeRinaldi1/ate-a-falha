/*
  Warnings:

  - You are about to drop the `BodyComposition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BodyComposition" DROP CONSTRAINT "BodyComposition_user_id_fkey";

-- DropTable
DROP TABLE "public"."BodyComposition";

-- CreateTable
CREATE TABLE "public"."UserMetrics" (
    "id" TEXT NOT NULL,
    "birth" DATE NOT NULL,
    "weight" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "gender" "public"."GENDER" NOT NULL,
    "activityLevel" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "UserMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMetrics_user_id_key" ON "public"."UserMetrics"("user_id");

-- AddForeignKey
ALTER TABLE "public"."UserMetrics" ADD CONSTRAINT "UserMetrics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `headcount` on the `herd_groups` table. All the data in the column will be lost.
  - Added the required column `live_weight_kg` to the `herd_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ugm` to the `herd_groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "herd_groups" DROP COLUMN "headcount",
ADD COLUMN     "head_count" INTEGER,
ADD COLUMN     "live_weight_kg" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "ugm" DECIMAL(10,4) NOT NULL;

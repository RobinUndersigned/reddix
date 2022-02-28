/*
  Warnings:

  - You are about to drop the column `Vote` on the `Vote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "Vote",
ADD COLUMN     "voteValue" INTEGER NOT NULL DEFAULT 0;

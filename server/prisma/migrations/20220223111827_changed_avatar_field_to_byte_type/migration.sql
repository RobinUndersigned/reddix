/*
  Warnings:

  - The `avatar` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "avatar",
ADD COLUMN     "avatar" BYTEA;

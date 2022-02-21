/*
  Warnings:

  - Added the required column `subreddixId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "subreddixId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Subreddix" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subreddix_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subreddix_name_key" ON "Subreddix"("name");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_subreddixId_fkey" FOREIGN KEY ("subreddixId") REFERENCES "Subreddix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

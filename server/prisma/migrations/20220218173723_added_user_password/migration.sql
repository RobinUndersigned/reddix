-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" VARCHAR(255),
ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'USER';

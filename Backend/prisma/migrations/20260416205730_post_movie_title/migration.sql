/*
  Warnings:

  - You are about to drop the column `movieId` on the `post` table. All the data in the column will be lost.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_movieId_fkey";

-- DropIndex
DROP INDEX "post_movieId_createdAt_idx";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "movieId",
ADD COLUMN     "movieTitle" TEXT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;

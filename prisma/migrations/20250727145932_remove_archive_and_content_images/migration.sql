/*
  Warnings:

  - You are about to drop the column `contentImages` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the `Archive` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Archive" DROP CONSTRAINT "Archive_userId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "contentImages";

-- DropTable
DROP TABLE "Archive";

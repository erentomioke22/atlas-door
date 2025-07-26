/*
  Warnings:

  - You are about to drop the column `email` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `issuerId` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "issuerId" TEXT NOT NULL,
ADD COLUMN     "teamId" TEXT,
ALTER COLUMN "recipientId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

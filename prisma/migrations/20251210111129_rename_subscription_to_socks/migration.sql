/*
  Warnings:

  - You are about to drop the column `subscription` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "quantity" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "subscription",
ADD COLUMN     "socks" INTEGER NOT NULL DEFAULT 0;

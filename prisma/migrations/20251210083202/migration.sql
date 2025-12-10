-- AlterTable
ALTER TABLE "User" ADD COLUMN     "premium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeId" TEXT,
ADD COLUMN     "subscription" BOOLEAN NOT NULL DEFAULT false;

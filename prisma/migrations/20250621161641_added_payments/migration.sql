-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscriptionActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subscriptionExpires" TIMESTAMP(3);

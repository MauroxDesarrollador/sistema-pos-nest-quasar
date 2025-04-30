-- CreateEnum
CREATE TYPE "instancesStatus" AS ENUM ('UP', 'DOWN', 'BLOCK');

-- AlterTable
ALTER TABLE "sigmaliteInstance" ADD COLUMN     "status" "instancesStatus" NOT NULL DEFAULT 'UP';

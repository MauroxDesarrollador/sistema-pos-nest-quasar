-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clientInstanceId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientInstanceId_fkey" FOREIGN KEY ("clientInstanceId") REFERENCES "sigmaliteInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

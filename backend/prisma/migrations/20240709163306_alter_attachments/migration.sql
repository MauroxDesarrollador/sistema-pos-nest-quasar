/*
  Warnings:

  - The `attachments` column on the `SupportTicket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `attachments` column on the `SupportTicketComments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SupportTicket" DROP COLUMN "attachments",
ADD COLUMN     "attachments" JSONB[];

-- AlterTable
ALTER TABLE "SupportTicketComments" DROP COLUMN "attachments",
ADD COLUMN     "attachments" JSONB[];

/*
  Warnings:

  - You are about to drop the column `clientInstanceId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `freescoutJSON` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isClient` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isZoneRestriction` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Marcaciones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupportTicket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupportTicketComments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `configMarcacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sigmaliteInstance` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CAJERO', 'ANALISTA');

-- DropForeignKey
ALTER TABLE "Marcaciones" DROP CONSTRAINT "Marcaciones_userId_fkey";

-- DropForeignKey
ALTER TABLE "SupportTicket" DROP CONSTRAINT "SupportTicket_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "SupportTicketComments" DROP CONSTRAINT "SupportTicketComments_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "SupportTicketComments" DROP CONSTRAINT "SupportTicketComments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clientInstanceId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clientInstanceId",
DROP COLUMN "freescoutJSON",
DROP COLUMN "isAdmin",
DROP COLUMN "isClient",
DROP COLUMN "isZoneRestriction",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CAJERO';

-- DropTable
DROP TABLE "Marcaciones";

-- DropTable
DROP TABLE "Roles";

-- DropTable
DROP TABLE "SupportTicket";

-- DropTable
DROP TABLE "SupportTicketComments";

-- DropTable
DROP TABLE "configMarcacion";

-- DropTable
DROP TABLE "sigmaliteInstance";

-- DropEnum
DROP TYPE "TicketPriority";

-- DropEnum
DROP TYPE "TicketStatus";

-- DropEnum
DROP TYPE "instancesStatus";

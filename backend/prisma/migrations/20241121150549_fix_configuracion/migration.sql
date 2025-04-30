/*
  Warnings:

  - You are about to drop the column `horarioEntrada` on the `configMarcacion` table. All the data in the column will be lost.
  - You are about to drop the column `horarioSalida` on the `configMarcacion` table. All the data in the column will be lost.
  - The `latitudBase` column on the `configMarcacion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `longitudBase` column on the `configMarcacion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "configMarcacion" DROP COLUMN "horarioEntrada",
DROP COLUMN "horarioSalida",
ADD COLUMN     "area" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "latitudBase",
ADD COLUMN     "latitudBase" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "longitudBase",
ADD COLUMN     "longitudBase" DOUBLE PRECISION NOT NULL DEFAULT 0;

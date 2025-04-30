-- CreateTable
CREATE TABLE "configMarcacion" (
    "id" TEXT NOT NULL,
    "latitudBase" TEXT,
    "longitudBase" TEXT,
    "horarioEntrada" TEXT,
    "horarioSalida" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configMarcacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acceso" (
    "id" SERIAL NOT NULL,
    "usuarioAsignado" TEXT NOT NULL,
    "tokenLlave" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Acceso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Acceso_tokenLlave_key" ON "Acceso"("tokenLlave");

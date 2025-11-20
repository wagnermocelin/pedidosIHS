-- Script de Inicialização Completa do Banco de Dados
-- Execute este script no SQL Editor do Supabase

-- Criar ENUMs
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COLABORADOR', 'COMPRADOR', 'ESTOQUISTA');
CREATE TYPE "PRStatus" AS ENUM ('PENDING', 'ORDERED', 'PURCHASED', 'RECEIVED', 'CANCELLED');
CREATE TYPE "POStatus" AS ENUM ('ORDERED', 'FINISHED', 'CANCELLED');

-- Criar tabela User
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela Supplier
CREATE TABLE "Supplier" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela Item
CREATE TABLE "Item" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "preferredSupplierId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Item_preferredSupplierId_fkey" FOREIGN KEY ("preferredSupplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Criar tabela PurchaseRequest
CREATE TABLE "PurchaseRequest" (
    "id" SERIAL PRIMARY KEY,
    "itemId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION,
    "requestedBy" INTEGER NOT NULL,
    "status" "PRStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PurchaseRequest_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PurchaseRequest_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Criar tabela PurchaseOrder
CREATE TABLE "PurchaseOrder" (
    "id" SERIAL PRIMARY KEY,
    "purchaseRequestId" INTEGER NOT NULL UNIQUE,
    "supplierId" INTEGER NOT NULL,
    "orderedBy" INTEGER NOT NULL,
    "status" "POStatus" NOT NULL DEFAULT 'ORDERED',
    "totalPrice" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PurchaseOrder_purchaseRequestId_fkey" FOREIGN KEY ("purchaseRequestId") REFERENCES "PurchaseRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PurchaseOrder_orderedBy_fkey" FOREIGN KEY ("orderedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Criar tabela PurchaseHistory
CREATE TABLE "PurchaseHistory" (
    "id" SERIAL PRIMARY KEY,
    "prId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "byUserId" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PurchaseHistory_prId_fkey" FOREIGN KEY ("prId") REFERENCES "PurchaseRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PurchaseHistory_byUserId_fkey" FOREIGN KEY ("byUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Criar índices
CREATE INDEX "Item_preferredSupplierId_idx" ON "Item"("preferredSupplierId");
CREATE INDEX "PurchaseRequest_itemId_idx" ON "PurchaseRequest"("itemId");
CREATE INDEX "PurchaseRequest_requestedBy_idx" ON "PurchaseRequest"("requestedBy");
CREATE INDEX "PurchaseRequest_status_idx" ON "PurchaseRequest"("status");
CREATE INDEX "PurchaseOrder_supplierId_idx" ON "PurchaseOrder"("supplierId");
CREATE INDEX "PurchaseOrder_orderedBy_idx" ON "PurchaseOrder"("orderedBy");
CREATE INDEX "PurchaseHistory_prId_idx" ON "PurchaseHistory"("prId");
CREATE INDEX "PurchaseHistory_byUserId_idx" ON "PurchaseHistory"("byUserId");

-- Verificar tabelas criadas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

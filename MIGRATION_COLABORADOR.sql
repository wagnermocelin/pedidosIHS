-- Migration: Renomear COZINHEIRA para COLABORADOR
-- Execute este script no SQL Editor do Supabase

-- Passo 1: Alterar o enum Role para adicionar COLABORADOR
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'COLABORADOR';

-- Passo 2: Atualizar todos os registros existentes de COZINHEIRA para COLABORADOR
UPDATE "User" SET role = 'COLABORADOR' WHERE role = 'COZINHEIRA';

-- Passo 3: Criar um novo enum sem COZINHEIRA
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'COLABORADOR', 'COMPRADOR', 'ESTOQUISTA');

-- Passo 4: Alterar a coluna para usar o novo enum
ALTER TABLE "User" ALTER COLUMN role TYPE "Role_new" USING (role::text::"Role_new");

-- Passo 5: Remover o enum antigo e renomear o novo
DROP TYPE "Role";
ALTER TYPE "Role_new" RENAME TO "Role";

-- Verificar os dados
SELECT role, COUNT(*) as total FROM "User" GROUP BY role;

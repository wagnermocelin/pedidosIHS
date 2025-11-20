-- Script para Limpar Dados de Teste
-- Execute este script no SQL Editor do Supabase para remover todos os dados de teste

-- Limpar dados na ordem correta (respeitando foreign keys)
DELETE FROM "PurchaseHistory";
DELETE FROM "PurchaseOrder";
DELETE FROM "PurchaseRequest";
DELETE FROM "Item";
DELETE FROM "Supplier";
DELETE FROM "User";

-- Resetar sequences (IDs voltam para 1)
ALTER SEQUENCE "User_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Supplier_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Item_id_seq" RESTART WITH 1;
ALTER SEQUENCE "PurchaseRequest_id_seq" RESTART WITH 1;
ALTER SEQUENCE "PurchaseOrder_id_seq" RESTART WITH 1;
ALTER SEQUENCE "PurchaseHistory_id_seq" RESTART WITH 1;

-- Verificar que está tudo limpo
SELECT 'Users' as tabela, COUNT(*) as total FROM "User"
UNION ALL
SELECT 'Suppliers', COUNT(*) FROM "Supplier"
UNION ALL
SELECT 'Items', COUNT(*) FROM "Item"
UNION ALL
SELECT 'PurchaseRequests', COUNT(*) FROM "PurchaseRequest"
UNION ALL
SELECT 'PurchaseOrders', COUNT(*) FROM "PurchaseOrder"
UNION ALL
SELECT 'PurchaseHistory', COUNT(*) FROM "PurchaseHistory";

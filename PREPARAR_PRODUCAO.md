# 🚀 Preparar Sistema para Produção

## ✅ Arquivos Criados

Foram criados os seguintes arquivos para preparação de produção:

1. **CLEAN_DATABASE.sql** - Script SQL para limpar todos os dados de teste
2. **seed-production.js** - Script Node.js para criar apenas o usuário admin
3. **DEPLOY_PRODUCTION.md** - Guia completo de deploy
4. **INIT_DATABASE.sql** - Script de inicialização do banco (já existe)

## 📋 Passo a Passo para Produção

### 1️⃣ Limpar Banco de Dados

Execute o script `CLEAN_DATABASE.sql` no **SQL Editor do Supabase**:

```sql
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
```

### 2️⃣ Criar Usuário Administrador

**Opção A**: Execute o script Node.js (se a conexão com Supabase estiver funcionando):
```bash
npm run seed:prod
```

**Opção B**: Execute SQL diretamente no Supabase:
```sql
-- Criar usuário administrador
-- Senha: admin123 (hash bcrypt)
INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt")
VALUES (
  'Administrador',
  'admin@ihopso.com',
  '$2a$10$S/q9r6fA91MotjAGrMY5..hGk1UxyKQAOXxTYG3bdfZSxsbsrTp5e',
  'ADMIN',
  NOW(),
  NOW()
);
```

### 3️⃣ Verificar Dados

Execute no SQL Editor:
```sql
SELECT 'Users' as tabela, COUNT(*) as total FROM "User"
UNION ALL
SELECT 'Suppliers', COUNT(*) FROM "Supplier"
UNION ALL
SELECT 'Items', COUNT(*) FROM "Item"
UNION ALL
SELECT 'PurchaseRequests', COUNT(*) FROM "PurchaseRequest";
```

Resultado esperado:
- Users: 1 (apenas admin)
- Suppliers: 0
- Items: 0
- PurchaseRequests: 0

### 4️⃣ Primeiro Acesso

1. Acesse o sistema
2. Login: **admin@ihopso.com** / **admin123**
3. ⚠️ **ALTERE A SENHA IMEDIATAMENTE**
4. Vá em "Usuários" e crie os usuários reais do sistema

### 5️⃣ Configurar Sistema

1. **Fornecedores**: Cadastre os fornecedores reais da empresa
2. **Itens**: Cadastre os produtos/itens que serão pedidos
3. **Usuários**: Crie os colaboradores, compradores e estoquistas

## 🔒 Segurança

### Checklist Antes de Ir para Produção:

- [ ] Senha do admin alterada
- [ ] Variável `JWT_SECRET` configurada com valor forte
- [ ] `NODE_ENV=production` no .env
- [ ] CORS configurado apenas para domínio de produção
- [ ] HTTPS configurado (SSL/TLS)
- [ ] Backups automáticos do Supabase ativados
- [ ] Remover usuários de teste
- [ ] Remover dados de exemplo

## 📊 Diferenças: Desenvolvimento vs Produção

### Desenvolvimento (atual):
- Múltiplos usuários de teste
- Dados de exemplo (fornecedores, itens, pedidos)
- Senhas simples
- CORS aberto para localhost

### Produção (após limpeza):
- Apenas 1 usuário admin
- Banco de dados vazio
- Senha deve ser alterada
- CORS restrito ao domínio

## 🎯 Próximos Passos

Após limpar e configurar:

1. **Build do Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy do Backend**: Configure em seu servidor/plataforma

3. **Deploy do Frontend**: Faça upload da pasta `dist`

4. **Teste Completo**: Valide todo o fluxo de pedidos

## 📞 Credenciais Padrão

**Usuário Admin**:
- Email: admin@ihopso.com
- Senha: admin123

⚠️ **IMPORTANTE**: Esta senha DEVE ser alterada no primeiro acesso!

## 🔄 Para Voltar ao Ambiente de Desenvolvimento

Se precisar voltar aos dados de teste:
```bash
npm run seed
```

Isso recriará todos os usuários e dados de exemplo.

---

**Status Atual**: Sistema pronto para limpeza e deploy em produção  
**Próxima Ação**: Execute CLEAN_DATABASE.sql no Supabase

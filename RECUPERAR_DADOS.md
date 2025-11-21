# 🔄 Recuperar Dados do Banco

## Opção 1: Usar Backup do Supabase (Recomendado)

1. **Acesse o Supabase Dashboard:**
   - https://supabase.com/dashboard

2. **Vá em "Database" → "Backups"**
   - O Supabase faz backups automáticos diários
   - Você pode restaurar para um ponto anterior

3. **Restaurar Backup:**
   - Selecione o backup de antes da migration
   - Clique em "Restore"
   - Aguarde a restauração

---

## Opção 2: Reverter a Migration

Se você não quer usar o backup, podemos reverter a migration:

### Passo 1: Verificar migrations aplicadas
```bash
npx prisma migrate status
```

### Passo 2: Reverter última migration
```bash
npx prisma migrate resolve --rolled-back 20251121012821_add_must_change_password
```

### Passo 3: Aplicar migration novamente (sem reset)
```bash
npx prisma migrate deploy
```

---

## Opção 3: Adicionar o Campo Manualmente (Sem Perder Dados)

Execute este SQL direto no Supabase:

```sql
-- Adicionar coluna mustChangePassword sem resetar dados
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;

-- Comentário: Novos usuários terão true, existentes terão false
```

Depois, atualize o Prisma:
```bash
npx prisma db pull
npx prisma generate
```

---

## ⚠️ Importante

- **Opção 1** é a mais segura (usa backup do Supabase)
- **Opção 2** pode não funcionar se os dados já foram deletados
- **Opção 3** é a melhor se você quer manter os dados atuais e só adicionar o campo

---

## 🎯 Recomendação

Use a **Opção 1** (Backup do Supabase) se você tinha dados importantes.

Se os dados não eram importantes, pode continuar com o banco limpo atual.

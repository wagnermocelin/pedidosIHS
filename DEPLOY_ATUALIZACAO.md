# 🚀 Deploy das Novas Funcionalidades

## 📦 O que foi adicionado:

1. ✅ **Importação de Itens via Excel**
   - Rota backend: `/api/import/items`
   - Página frontend: `/importar`
   - Dependência nova: `xlsx`, `multer`

2. ✅ **Troca de Senha Obrigatória**
   - Campo `mustChangePassword` no banco
   - Rota: `/api/auth/change-password`
   - Página: `/change-password`
   - Migration: `20251121012821_add_must_change_password`

3. ✅ **Login Personalizado**
   - Removidos exemplos de usuários
   - Adicionados créditos do desenvolvedor
   - Espaço para logo do bar

---

## 🔧 Passo a Passo do Deploy

### 1️⃣ Backend (Render/Railway)

O deploy do backend será **automático** via GitHub:

1. **Acesse seu dashboard:**
   - Render: https://dashboard.render.com
   - Ou Railway: https://railway.app

2. **Verifique o deploy:**
   - O sistema detectará o push no GitHub
   - Iniciará o build automaticamente
   - Aguarde 3-5 minutos

3. **⚠️ IMPORTANTE - Aplicar Migration:**

Após o deploy, você DEVE aplicar a migration no banco de produção:

**Opção A: Via Render/Railway Console**
```bash
npx prisma migrate deploy
```

**Opção B: Via Supabase SQL Editor**
```sql
-- Adicionar campo mustChangePassword
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;
```

---

### 2️⃣ Frontend (Vercel)

O deploy do frontend também será **automático**:

1. **Acesse:** https://vercel.com/dashboard

2. **Verifique o deploy:**
   - Vercel detectará o push
   - Build iniciará automaticamente
   - Aguarde 2-3 minutos

3. **Adicionar Logo (Opcional):**
   - Após o deploy, você pode adicionar o logo via Vercel Dashboard
   - Ou fazer novo commit com o logo em `frontend/public/logo.png`

---

### 3️⃣ Verificações Pós-Deploy

#### Backend:
```bash
# Testar rota de importação
curl https://seu-backend.onrender.com/api/import/template

# Testar rota de troca de senha
curl https://seu-backend.onrender.com/api/auth/change-password
```

#### Frontend:
1. Acesse: https://seu-app.vercel.app
2. Verifique a tela de login (sem exemplos de usuários)
3. Teste criar um novo usuário
4. Faça login com o novo usuário
5. Deve ser redirecionado para trocar senha

---

## ⚠️ ATENÇÃO - Migration no Banco

**CRÍTICO:** A migration deve ser aplicada no banco de produção!

### Se você usa Render:
1. Vá em "Shell" no dashboard do Render
2. Execute: `npx prisma migrate deploy`

### Se você usa Railway:
1. Vá em "Deploy Logs"
2. A migration deve rodar automaticamente
3. Se não rodar, execute via console

### Se você usa Supabase:
1. Vá em SQL Editor
2. Execute o SQL acima

---

## 🔍 Troubleshooting

### Erro: "Unknown column mustChangePassword"
**Solução:** A migration não foi aplicada. Execute:
```bash
npx prisma migrate deploy
```

### Erro: "Cannot find module 'xlsx'"
**Solução:** As dependências não foram instaladas. Verifique se o `package.json` tem:
```json
"dependencies": {
  "xlsx": "^0.18.5",
  "multer": "^1.4.5-lts.1"
}
```

### Erro: "Route /api/import/items not found"
**Solução:** O backend não foi atualizado. Force um redeploy.

---

## ✅ Checklist Final

- [ ] Backend deployado com sucesso
- [ ] Frontend deployado com sucesso
- [ ] Migration aplicada no banco
- [ ] Teste de login funcionando
- [ ] Teste de criação de usuário
- [ ] Teste de troca de senha obrigatória
- [ ] Teste de importação de itens (admin)
- [ ] Logo adicionado (opcional)

---

## 🎉 Pronto!

Após seguir todos os passos, seu sistema estará atualizado em produção com:
- ✅ Importação de itens via Excel
- ✅ Troca de senha obrigatória no primeiro login
- ✅ Tela de login personalizada

**Tempo estimado:** 10-15 minutos

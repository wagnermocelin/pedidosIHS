# 🚀 Deploy Gratuito - Guia Completo

Este guia mostra como fazer deploy do sistema usando serviços gratuitos.

## 🎯 Plataformas Escolhidas

- **Backend**: Railway (500h/mês grátis)
- **Frontend**: Vercel (ilimitado para projetos pessoais)
- **Banco de Dados**: Supabase (já configurado)

## 📋 Pré-requisitos

- ✅ Código no GitHub
- ✅ Conta no Supabase (banco de dados)
- ✅ Conta no Railway (criar)
- ✅ Conta no Vercel (criar)

---

## 1️⃣ Deploy do Backend (Railway)

### Passo 1: Criar Conta no Railway

1. Acesse: https://railway.app
2. Clique em **"Start a New Project"**
3. Faça login com GitHub

### Passo 2: Criar Novo Projeto

1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório: `wagnermocelin/pedidosIHS`
4. Railway detectará automaticamente que é Node.js

### Passo 3: Configurar Variáveis de Ambiente

1. No projeto Railway, vá em **"Variables"**
2. Adicione as seguintes variáveis:

```env
DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-1-us-east-1.compute-1.amazonaws.com:5432/postgres
JWT_SECRET=sua-chave-secreta-forte-aqui
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-app.vercel.app
```

**Importante**: 
- Copie DATABASE_URL e DIRECT_URL do Supabase
- Gere JWT_SECRET forte: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- FRONTEND_URL será atualizado depois do deploy do frontend

### Passo 4: Configurar Build

Railway detecta automaticamente, mas se precisar:

1. **Build Command**: `npm install && npx prisma generate`
2. **Start Command**: `npm start`
3. **Root Directory**: `/` (raiz do projeto)

### Passo 5: Deploy

1. Railway fará deploy automaticamente
2. Aguarde o build completar (2-3 minutos)
3. Copie a URL gerada (ex: `https://pedidosihs-production.up.railway.app`)

### Passo 6: Testar Backend

Acesse: `https://sua-url.railway.app/health`

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": "production"
}
```

---

## 2️⃣ Deploy do Frontend (Vercel)

### Passo 1: Criar Conta no Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Faça login com GitHub

### Passo 2: Importar Projeto

1. No dashboard, clique em **"Add New..."** → **"Project"**
2. Selecione o repositório: `wagnermocelin/pedidosIHS`
3. Clique em **"Import"**

### Passo 3: Configurar Projeto

**Framework Preset**: Vite
**Root Directory**: `frontend`
**Build Command**: `npm run build`
**Output Directory**: `dist`

### Passo 4: Configurar Variáveis de Ambiente

Em **"Environment Variables"**, adicione:

```env
VITE_API_URL=https://sua-url.railway.app
```

**Importante**: Use a URL do Railway do Passo 1

### Passo 5: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (1-2 minutos)
3. Vercel gerará uma URL (ex: `https://pedidos-ihs.vercel.app`)

### Passo 6: Atualizar CORS no Backend

1. Volte no Railway
2. Atualize a variável `FRONTEND_URL` com a URL do Vercel
3. Railway fará redeploy automaticamente

---

## 3️⃣ Configuração Final

### Atualizar Variáveis

**No Railway (Backend)**:
```env
FRONTEND_URL=https://pedidos-ihs.vercel.app
```

**No Vercel (Frontend)**:
```env
VITE_API_URL=https://pedidosihs-production.up.railway.app
```

### Testar Sistema Completo

1. Acesse a URL do Vercel
2. Faça login com: `admin@ihopso.com` / `admin123`
3. **ALTERE A SENHA IMEDIATAMENTE**
4. Teste criar um pedido

---

## 🎨 Customizar Domínio (Opcional)

### Vercel (Frontend)

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### Railway (Backend)

1. Vá em **Settings** → **Domains**
2. Adicione domínio customizado
3. Configure DNS

---

## 📊 Limites dos Planos Gratuitos

### Railway
- ✅ 500 horas/mês
- ✅ 512 MB RAM
- ✅ 1 GB disco
- ⚠️ Dorme após inatividade (wake up automático)

### Vercel
- ✅ Deploy ilimitado
- ✅ 100 GB bandwidth/mês
- ✅ Domínio personalizado
- ✅ SSL automático

### Supabase
- ✅ 500 MB database
- ✅ 2 GB bandwidth/mês
- ✅ Backups automáticos

---

## 🔄 Atualizações Automáticas

Ambas plataformas fazem deploy automático quando você faz push no GitHub:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push
```

- Railway redeploy automático do backend
- Vercel redeploy automático do frontend

---

## 🆘 Troubleshooting

### Backend não inicia
- Verifique logs no Railway
- Confirme variáveis de ambiente
- Teste conexão com Supabase

### Frontend não conecta
- Verifique VITE_API_URL
- Confirme CORS no backend
- Teste URL do backend diretamente

### Erro 500 no login
- Verifique JWT_SECRET está configurado
- Confirme que o seed foi executado
- Verifique logs do Railway

---

## 📝 Checklist de Deploy

### Antes do Deploy
- [ ] Código commitado no GitHub
- [ ] Banco de dados limpo (seed:prod executado)
- [ ] .env.example atualizado
- [ ] README.md atualizado

### Deploy Backend (Railway)
- [ ] Projeto criado
- [ ] Variáveis de ambiente configuradas
- [ ] Build concluído com sucesso
- [ ] Health check funcionando

### Deploy Frontend (Vercel)
- [ ] Projeto importado
- [ ] Root directory configurado (frontend)
- [ ] VITE_API_URL configurado
- [ ] Build concluído com sucesso

### Pós-Deploy
- [ ] Login funcionando
- [ ] Senha admin alterada
- [ ] CORS configurado corretamente
- [ ] Criar usuários reais
- [ ] Cadastrar fornecedores e itens
- [ ] Testar fluxo completo de pedidos

---

## 🎯 URLs Finais

Após o deploy, você terá:

- **Frontend**: https://pedidos-ihs.vercel.app
- **Backend**: https://pedidosihs-production.up.railway.app
- **Banco**: Supabase (já configurado)

---

## 💡 Dicas

1. **Monitoramento**: Use os dashboards do Railway e Vercel
2. **Logs**: Acesse logs em tempo real nas plataformas
3. **Rollback**: Ambas plataformas permitem voltar para versões anteriores
4. **Domínio**: Considere comprar domínio personalizado
5. **Backup**: Supabase faz backup automático

---

**Tempo estimado de deploy**: 15-20 minutos  
**Custo**: R$ 0,00 (100% gratuito)

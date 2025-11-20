# 🚀 Configuração do Supabase

## Passo 1: Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub, Google ou email

## Passo 2: Criar um Novo Projeto

1. No dashboard do Supabase, clique em **"New Project"**
2. Preencha os dados:
   - **Name**: `pedidos-ihs` (ou o nome que preferir)
   - **Database Password**: Crie uma senha forte e **ANOTE**
   - **Region**: Escolha a mais próxima (ex: South America - São Paulo)
   - **Pricing Plan**: Free (suficiente para desenvolvimento)
3. Clique em **"Create new project"**
4. Aguarde 2-3 minutos enquanto o projeto é criado

## Passo 3: Obter a Connection String

1. No menu lateral, clique em **"Project Settings"** (ícone de engrenagem)
2. Clique em **"Database"**
3. Role até a seção **"Connection string"**
4. Selecione a aba **"URI"**
5. Copie a connection string que aparece (algo como):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. **IMPORTANTE**: Substitua `[YOUR-PASSWORD]` pela senha que você criou no Passo 2

## Passo 4: Configurar o Projeto

### 4.1 Atualizar o arquivo .env

Abra o arquivo `.env` na raiz do projeto e atualize a linha `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@db.xxxxxxxxxxxxx.supabase.co:5432/postgres"
```

**Exemplo completo do .env:**
```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:minhasenha123@db.abcdefghijklmno.supabase.co:5432/postgres"

# JWT
JWT_SECRET="seu-secret-super-seguro-aqui-mude-em-producao"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173

# OpenAI API (opcional)
OPENAI_API_KEY=
```

### 4.2 Executar as Migrations

No terminal, execute:

```bash
# Resetar migrations antigas (se existirem)
npx prisma migrate reset --force

# Criar nova migration para o Supabase
npx prisma migrate dev --name init_supabase

# Popular o banco com dados iniciais
npm run seed
```

### 4.3 Reiniciar o Backend

Se o servidor estiver rodando, pare (Ctrl+C) e inicie novamente:

```bash
npm run dev
```

## ✅ Verificar se Funcionou

1. O backend deve iniciar sem erros
2. Você pode fazer login na aplicação
3. No Supabase Dashboard:
   - Vá em **"Table Editor"** no menu lateral
   - Você deve ver as tabelas criadas: `User`, `Item`, `Supplier`, `PurchaseRequest`, etc.

## 🎯 Vantagens do Supabase

- ✅ Banco de dados PostgreSQL gratuito (até 500MB)
- ✅ Backup automático
- ✅ Interface visual para gerenciar dados
- ✅ Acessível de qualquer lugar
- ✅ Suporte a Row Level Security (RLS)
- ✅ API REST automática
- ✅ Realtime subscriptions

## 🔧 Comandos Úteis

### Ver dados no Supabase Studio
Acesse o **Table Editor** no dashboard do Supabase para visualizar e editar dados diretamente.

### Abrir Prisma Studio localmente
```bash
npm run studio
```

### Resetar banco de dados
```bash
npx prisma migrate reset
npm run seed
```

### Criar nova migration
```bash
npx prisma migrate dev --name nome_da_migration
```

## 🐛 Troubleshooting

### Erro de conexão
- Verifique se a senha está correta na `DATABASE_URL`
- Confirme que não há espaços extras na connection string
- Verifique se o projeto Supabase está ativo (não pausado)

### Erro "relation does not exist"
Execute as migrations:
```bash
npx prisma migrate deploy
```

### Banco vazio após migration
Execute o seed:
```bash
npm run seed
```

## 📊 Monitoramento

No Supabase Dashboard você pode:
- Ver logs em **"Logs"**
- Monitorar uso em **"Reports"**
- Gerenciar usuários em **"Authentication"** (se usar Supabase Auth)
- Executar queries SQL em **"SQL Editor"**

## 🔐 Segurança

⚠️ **NUNCA** commite o arquivo `.env` com suas credenciais!

O `.gitignore` já está configurado para ignorar o `.env`, mas sempre verifique antes de fazer commit.

## 🚀 Deploy em Produção

Quando for fazer deploy (Vercel, Render, Railway, etc.):

1. Configure a variável de ambiente `DATABASE_URL` com a connection string do Supabase
2. Execute as migrations no deploy:
   ```bash
   npx prisma migrate deploy
   ```
3. Execute o seed (apenas uma vez):
   ```bash
   npm run seed
   ```

---

**Pronto!** Seu sistema agora está usando um banco de dados PostgreSQL profissional na nuvem! 🎉

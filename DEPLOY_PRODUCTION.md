# 🚀 Guia de Deploy para Produção

## 📋 Pré-requisitos

- Banco de dados PostgreSQL (Supabase) configurado
- Node.js 18+ instalado
- Variáveis de ambiente configuradas

## 🗄️ Passo 1: Preparar o Banco de Dados

### 1.1 Limpar Dados de Teste

Execute o script `CLEAN_DATABASE.sql` no SQL Editor do Supabase:

```sql
-- Este script remove todos os dados de teste e reseta os IDs
```

### 1.2 Verificar Schema

Certifique-se de que o schema está atualizado executando `INIT_DATABASE.sql` (se ainda não foi executado).

## 👤 Passo 2: Criar Usuário Administrador

Execute o seed de produção:

```bash
npm run seed:prod
```

Isso criará apenas o usuário administrador:
- **Email**: admin@ihopso.com
- **Senha**: admin123

⚠️ **IMPORTANTE**: Altere esta senha imediatamente após o primeiro login!

## 🔐 Passo 3: Configurar Variáveis de Ambiente

### Backend (.env)

```env
# Banco de Dados
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui"

# Servidor
PORT=3001
NODE_ENV=production

# Frontend (para CORS)
FRONTEND_URL="https://seu-dominio.com"
```

### Frontend (.env)

```env
VITE_API_URL=https://api.seu-dominio.com
```

## 🏗️ Passo 4: Build do Frontend

```bash
cd frontend
npm run build
```

Isso criará a pasta `dist` com os arquivos estáticos otimizados.

## 🚀 Passo 5: Deploy

### Opção A: Servidor Próprio (VPS)

#### Backend:
```bash
# Instalar dependências
npm install --production

# Gerar Prisma Client
npx prisma generate

# Iniciar servidor (use PM2 ou similar)
pm2 start src/server.js --name pedidos-ihs-api
```

#### Frontend:
- Faça upload da pasta `frontend/dist` para seu servidor web (Nginx, Apache)
- Configure o servidor para servir os arquivos estáticos

### Opção B: Plataformas Cloud

#### Backend (Railway, Render, Heroku):
1. Conecte seu repositório Git
2. Configure as variáveis de ambiente
3. O build será automático

#### Frontend (Vercel, Netlify):
1. Conecte o repositório
2. Configure:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Root directory: `frontend`

## ✅ Passo 6: Verificações Pós-Deploy

### 6.1 Testar API
```bash
curl https://api.seu-dominio.com/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": "production"
}
```

### 6.2 Primeiro Acesso

1. Acesse o sistema
2. Faça login com admin@ihopso.com / admin123
3. **ALTERE A SENHA IMEDIATAMENTE**
4. Vá em "Usuários" e crie os demais usuários:
   - Colaboradores
   - Compradores
   - Estoquistas

### 6.3 Configurar Dados Iniciais

1. **Fornecedores**: Cadastre os fornecedores da empresa
2. **Itens**: Cadastre os itens/produtos que serão pedidos
3. **Teste o Fluxo**: Crie um pedido de teste para validar

## 🔒 Segurança em Produção

### Checklist de Segurança:

- [ ] Senha do admin alterada
- [ ] JWT_SECRET forte e único
- [ ] HTTPS configurado (SSL/TLS)
- [ ] CORS configurado apenas para domínios permitidos
- [ ] Variáveis de ambiente seguras (não commitadas)
- [ ] Banco de dados com senha forte
- [ ] Backups automáticos configurados
- [ ] Rate limiting configurado (opcional)

## 📊 Monitoramento

### Logs do Backend:
```bash
pm2 logs pedidos-ihs-api
```

### Métricas:
```bash
pm2 monit
```

## 🔄 Atualizações Futuras

Para atualizar o sistema:

```bash
# Backend
git pull
npm install
npx prisma generate
pm2 restart pedidos-ihs-api

# Frontend
cd frontend
git pull
npm install
npm run build
# Upload da nova pasta dist
```

## 🆘 Troubleshooting

### Erro de Conexão com Banco
- Verifique DATABASE_URL e DIRECT_URL
- Confirme que o IP do servidor está na whitelist do Supabase

### CORS Error
- Verifique FRONTEND_URL no .env do backend
- Confirme que o domínio está correto

### Erro 500 no Login
- Verifique JWT_SECRET está configurado
- Confirme que o usuário admin foi criado

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs do servidor
2. Consulte a documentação do Supabase
3. Revise as configurações de ambiente

---

**Versão**: 1.0.0  
**Última Atualização**: Novembro 2025

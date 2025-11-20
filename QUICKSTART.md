# 🚀 Guia de Início Rápido - Pedidos IHS

## Instalação e Configuração

### 1. Instalar Dependências

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
copy .env.example .env

# Editar .env e configurar:
# - DATABASE_URL (PostgreSQL)
# - JWT_SECRET (chave secreta forte)
```

### 3. Configurar Banco de Dados

#### Opção A: Com Docker (Recomendado)

```bash
# Iniciar PostgreSQL com Docker
docker-compose up -d postgres

# Aguardar alguns segundos para o banco iniciar
```

#### Opção B: PostgreSQL Local

Certifique-se de ter PostgreSQL instalado e rodando, então ajuste a `DATABASE_URL` no `.env`.

### 4. Executar Migrations e Seed

```bash
# Criar as tabelas no banco
npm run migrate

# Popular com dados iniciais
npm run seed
```

### 5. Iniciar a Aplicação

#### Desenvolvimento

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 👤 Usuários de Teste

Após executar o seed, você pode fazer login com:

| Role | Email | Senha |
|------|-------|-------|
| Admin | admin@ihopso.com | admin123 |
| Colaboradora | cozinha@ihopso.com | cozinha123 |
| Comprador | comprador@ihopso.com | comprador123 |
| Estoquista | estoque@ihopso.com | estoque123 |

## 🔄 Fluxo de Trabalho

1. **Colaboradora** acessa `/pedidos` e cria um novo pedido
2. **Comprador** visualiza pedidos pendentes e marca como "Pedido"
3. **Comprador** após efetuar a compra, marca como "Comprado"
4. **Estoquista** ao receber a mercadoria, marca como "Recebido"
5. Todas as ações ficam registradas no **Histórico**

## 🎤 Funcionalidade de Voz

Na página de Pedidos, clique no botão "Voz" e diga comandos como:

- "Adicionar 10 quilos de tomate"
- "Pedir 5 litros de leite"
- "Gerar lista de vegetais"

O sistema tentará interpretar e sugerir pedidos automaticamente.

## 🐳 Deploy com Docker

```bash
# Construir e iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## 📊 Prisma Studio

Para visualizar e editar dados diretamente:

```bash
npm run studio
```

Abre uma interface web em http://localhost:5555

## 🔧 Comandos Úteis

```bash
# Resetar banco de dados (CUIDADO!)
npx prisma migrate reset

# Gerar Prisma Client após mudanças no schema
npx prisma generate

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Build do frontend para produção
cd frontend && npm run build
```

## 🐛 Troubleshooting

### Erro de conexão com banco

- Verifique se o PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env`
- Se usando Docker: `docker-compose ps` para ver status

### Erro de CORS no frontend

- Verifique se `FRONTEND_URL` no `.env` está correto
- Confirme que backend está rodando na porta 3001

### Erro "Prisma Client not generated"

```bash
npx prisma generate
```

### Porta já em uso

Altere a porta no `.env` (backend) ou `vite.config.js` (frontend)

## 📝 Próximos Passos

1. Personalize os dados de seed em `scripts/seed.js`
2. Adicione mais itens e fornecedores
3. Configure integração com OpenAI para IA avançada
4. Implemente notificações por email/WhatsApp
5. Adicione relatórios e dashboards personalizados

## 🆘 Suporte

Para problemas ou dúvidas, verifique:
- README.md principal
- Logs do servidor: `docker-compose logs backend`
- Console do navegador (F12)

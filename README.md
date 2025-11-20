# 🛒 Sistema de Pedidos de Compras - I Hop So

Sistema completo de gestão de pedidos de compras com controle de fluxo, múltiplos usuários e funcionalidades de IA.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Funcionalidades

- **Gestão de Pedidos**: Fluxo completo PENDING → ORDERED → PURCHASED → RECEIVED
- **Controle de Acesso**: Roles (Admin, Colaborador, Comprador, Estoquista)
- **Fornecedores e Itens**: Cadastro completo com fornecedor preferencial
- **Histórico Completo**: Auditoria de todas as ações
- **Interface Moderna**: React + Tailwind CSS, mobile-first
- **PWA**: Instalável em dispositivos móveis
- **Entrada por Voz**: Web Speech API integrada
- **IA**: Geração de listas por comandos de voz

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 15+ (ou Docker)
- npm ou yarn

## 🛠️ Instalação

### Opção 1: Com Docker (Recomendado)

```bash
# Clone o repositório
git clone <seu-repo>
cd PedidosIHS

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Inicie os containers
npm run docker:up

# Rode as migrations
npm run migrate:deploy

# Popule o banco com dados iniciais
npm run seed
```

### Opção 2: Instalação Manual

```bash
# Instale as dependências do backend
npm install

# Configure o .env
cp .env.example .env

# Inicie o PostgreSQL localmente
# Ajuste DATABASE_URL no .env

# Rode as migrations
npm run migrate

# Popule o banco
npm run seed

# Inicie o servidor
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📁 Estrutura do Projeto

```
PedidosIHS/
├── prisma/
│   └── schema.prisma          # Modelos do banco de dados
├── src/
│   ├── server.js              # Servidor Express
│   ├── config/
│   │   └── database.js        # Configuração Prisma
│   ├── middleware/
│   │   ├── auth.js            # Autenticação JWT
│   │   └── rbac.js            # Controle de acesso por role
│   ├── routes/
│   │   ├── auth.js            # Rotas de autenticação
│   │   ├── items.js           # Rotas de itens
│   │   ├── suppliers.js       # Rotas de fornecedores
│   │   ├── purchases.js       # Rotas de pedidos
│   │   └── ai.js              # Rotas de IA
│   └── utils/
│       └── helpers.js         # Funções auxiliares
├── scripts/
│   └── seed.js                # Script de seed
├── frontend/                  # Aplicação React
└── docker-compose.yml         # Configuração Docker

## 🔑 Usuários Padrão (após seed)

- **Admin**: admin@ihopso.com / admin123
- **Colaboradora**: cozinha@ihopso.com / cozinha123
- **Comprador**: comprador@ihopso.com / comprador123
- **Estoquista**: estoque@ihopso.com / estoque123

## 🌐 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado

### Itens
- `GET /api/items` - Listar itens
- `POST /api/items` - Criar item (Admin)
- `PUT /api/items/:id` - Atualizar item (Admin)
- `DELETE /api/items/:id` - Deletar item (Admin)

### Fornecedores
- `GET /api/suppliers` - Listar fornecedores
- `POST /api/suppliers` - Criar fornecedor
- `PUT /api/suppliers/:id` - Atualizar fornecedor
- `DELETE /api/suppliers/:id` - Deletar fornecedor

### Pedidos de Compra
- `GET /api/purchase-requests` - Listar pedidos
- `POST /api/purchase-requests` - Criar pedido (Colaborador)
- `POST /api/purchase-requests/:id/order` - Marcar como pedido (Comprador)
- `POST /api/purchase-requests/:id/purchase` - Marcar como comprado (Comprador)
- `POST /api/purchase-requests/:id/receive` - Marcar como recebido (Estoquista)
- `POST /api/purchase-requests/:id/cancel` - Cancelar pedido

### Histórico
- `GET /api/history` - Histórico completo
- `GET /api/history/purchase-request/:id` - Histórico de um pedido

### IA
- `POST /api/ai/parse-voice` - Processar comando de voz

## 🎯 Fluxo de Trabalho

1. **Colaborador** cria pedidos de compra (PurchaseRequest) com status PENDING
2. **Comprador** visualiza pedidos pendentes e marca como ORDERED
3. **Comprador** efetua a compra e marca como PURCHASED
4. **Estoquista** recebe a mercadoria e marca como RECEIVED
5. Todas as ações são registradas no histórico com timestamp e usuário

## 🎤 Funcionalidade de Voz

O sistema suporta comandos de voz como:
- "Adicionar 10 quilos de tomate"
- "Gerar lista semanal de vegetais"
- "Pedir 5 quilos de queijo muçarela"

## 📱 PWA

A aplicação pode ser instalada em dispositivos móveis e funciona offline (cache de dados básicos).

## 🔒 Segurança

- Autenticação JWT
- Senhas com hash bcrypt
- RBAC (Role-Based Access Control)
- CORS configurado
- Validação de inputs
- Auditoria completa de ações

## 📊 Relatórios

- Custo por período
- Frequência de compra por item
- Fornecedores mais utilizados
- Tempo médio de processamento de pedidos

## 🚀 Deploy

### Produção com Docker

```bash
docker-compose up -d
```

### Variáveis de Ambiente de Produção

Certifique-se de configurar:
- `JWT_SECRET` com valor seguro
- `DATABASE_URL` com credenciais de produção
- `NODE_ENV=production`
- `OPENAI_API_KEY` se usar funcionalidade de IA

## 📝 Licença

MIT

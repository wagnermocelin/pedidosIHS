# 👥 Guia de Gerenciamento de Usuários

## 🎯 Funcionalidade Implementada

Foi criada uma tela completa de administração para gerenciar usuários e suas permissões de acesso ao sistema.

## 🔐 Acesso

**Apenas usuários com perfil ADMIN** podem acessar esta funcionalidade.

### Como Acessar:

1. Faça login como administrador (admin@ihopso.com / admin123)
2. No menu superior, clique em **"Usuários"**
3. Você verá a tela de gerenciamento de usuários

## ✨ Funcionalidades

### 📊 Dashboard de Usuários

- **Estatísticas por Permissão**: Visualize quantos usuários existem em cada role
  - Administradores
  - Colaboradores
  - Compradores
  - Estoquistas

### 👤 Listar Usuários

A tabela mostra todos os usuários cadastrados com:
- **Nome** e avatar com inicial
- **Email**
- **Permissão** (badge colorido)
- **Data de criação**
- **Ações** (editar/deletar)

### ➕ Criar Novo Usuário

1. Clique no botão **"Novo Usuário"**
2. Preencha o formulário:
   - **Nome Completo**: Nome do usuário
   - **Email**: Email único (será usado para login)
   - **Senha**: Mínimo 6 caracteres
   - **Permissão de Acesso**: Selecione o role apropriado

3. Clique em **"Criar Usuário"**

### ✏️ Editar Usuário

1. Clique no ícone de **lápis** ao lado do usuário
2. Modifique os dados desejados:
   - Nome
   - Email
   - Senha (deixe em branco para não alterar)
   - Permissão

3. Clique em **"Salvar Alterações"**

### 🗑️ Deletar Usuário

1. Clique no ícone de **lixeira** ao lado do usuário
2. Confirme a exclusão
3. **Nota**: Você não pode deletar seu próprio usuário

## 🎭 Tipos de Permissões

### 🔴 Administrador (ADMIN)
- **Acesso total** ao sistema
- Pode gerenciar usuários
- Pode gerenciar itens
- Pode executar todas as ações

### 🔵 Colaborador (COLABORADOR)
- Criar pedidos de compra
- Visualizar pedidos
- Visualizar fornecedores
- Visualizar histórico

### 🟢 Comprador (COMPRADOR)
- Processar pedidos pendentes
- Marcar como pedido
- Marcar como comprado
- Gerenciar fornecedores
- Visualizar histórico

### 🟣 Estoquista (ESTOQUISTA)
- Confirmar recebimento de mercadorias
- Visualizar pedidos
- Visualizar histórico

## 🔒 Segurança

### Validações Implementadas:

- ✅ Email único (não pode duplicar)
- ✅ Senha mínima de 6 caracteres
- ✅ Senha criptografada com bcrypt
- ✅ Apenas ADMIN pode acessar
- ✅ Não pode deletar próprio usuário
- ✅ Validação de email válido

### Proteção de Dados:

- Senhas são **hasheadas** antes de salvar no banco
- Senhas **nunca** são retornadas pela API
- Token JWT para autenticação
- Middleware de autorização por role

## 📡 Endpoints da API

### GET /api/users
Lista todos os usuários (apenas ADMIN)

### POST /api/users
Cria novo usuário (apenas ADMIN)

**Body:**
```json
{
  "name": "Nome Completo",
  "email": "email@exemplo.com",
  "password": "senha123",
  "role": "COLABORADOR"
}
```

### PUT /api/users/:id
Atualiza usuário (apenas ADMIN)

**Body:**
```json
{
  "name": "Novo Nome",
  "email": "novoemail@exemplo.com",
  "password": "novasenha",
  "role": "COMPRADOR"
}
```

**Nota**: Senha é opcional na atualização

### DELETE /api/users/:id
Deleta usuário (apenas ADMIN)

## 🎨 Interface

### Características:

- ✅ Design moderno e responsivo
- ✅ Mobile-first
- ✅ Badges coloridos por permissão
- ✅ Modal para criar/editar
- ✅ Botão para mostrar/ocultar senha
- ✅ Validação em tempo real
- ✅ Feedback visual de ações
- ✅ Confirmação antes de deletar

### Cores por Permissão:

- 🔴 **Vermelho**: Administrador
- 🔵 **Azul**: Colaborador
- 🟢 **Verde**: Comprador
- 🟣 **Roxo**: Estoquista

## 💡 Dicas de Uso

### Primeiro Acesso:

1. Use o usuário admin padrão:
   - Email: admin@ihopso.com
   - Senha: admin123

2. Crie usuários para sua equipe

3. **IMPORTANTE**: Altere a senha do admin após primeiro acesso!

### Boas Práticas:

- ✅ Use emails corporativos
- ✅ Defina senhas fortes
- ✅ Atribua a permissão correta para cada usuário
- ✅ Revise periodicamente os usuários ativos
- ✅ Remova usuários que não fazem mais parte da equipe

### Gerenciamento de Equipe:

1. **Cozinha**: Crie usuários com perfil COLABORADOR
2. **Compras**: Crie usuários com perfil COMPRADOR
3. **Estoque**: Crie usuários com perfil ESTOQUISTA
4. **Gerência**: Mantenha poucos usuários ADMIN

## 🐛 Troubleshooting

### Erro: "Email já está em uso"
- Cada email deve ser único no sistema
- Verifique se o email já foi cadastrado

### Erro: "Senha deve ter no mínimo 6 caracteres"
- Use senhas mais fortes
- Recomendado: 8+ caracteres com números e símbolos

### Não consigo deletar usuário
- Verifique se não está tentando deletar seu próprio usuário
- Verifique se você tem permissão de ADMIN

### Não vejo o menu "Usuários"
- Esta opção só aparece para usuários ADMIN
- Faça login com uma conta de administrador

## 🚀 Próximas Melhorias Sugeridas

- [ ] Reset de senha por email
- [ ] Histórico de ações do usuário
- [ ] Desativar usuário (soft delete)
- [ ] Autenticação de dois fatores (2FA)
- [ ] Logs de auditoria
- [ ] Exportar lista de usuários
- [ ] Importar usuários em lote
- [ ] Grupos e equipes

---

**Pronto!** Agora você tem controle total sobre os usuários do sistema! 🎉

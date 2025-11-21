# 🔧 Corrigir Deploy do Vercel

## ❌ Problema
Erro 404: NOT_FOUND - O Vercel não está encontrando a aplicação porque o projeto frontend está na pasta `frontend/` e não na raiz.

## ✅ Solução

### Opção 1: Reconfigurar via Dashboard (Recomendado)

1. **Acesse o Vercel Dashboard:**
   - https://vercel.com/dashboard

2. **Vá no seu projeto PedidosIHS**

3. **Settings → General:**
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Salvar e Redeploy:**
   - Vá em "Deployments"
   - Clique nos 3 pontos do último deploy
   - Clique em "Redeploy"

---

### Opção 2: Deletar e Reimportar Projeto

Se a Opção 1 não funcionar:

1. **Deletar projeto atual:**
   - Settings → General → Delete Project

2. **Importar novamente:**
   - Dashboard → "Add New..." → "Project"
   - Selecione o repositório `pedidosIHS`
   - **Configure:**
     - Root Directory: `frontend`
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Environment Variables:**
   ```
   VITE_API_URL=https://seu-backend.onrender.com/api
   ```

4. **Deploy**

---

### Opção 3: Via CLI (Avançado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy da pasta frontend
cd frontend
vercel --prod
```

---

## 🔍 Verificar se Funcionou

Após o redeploy, acesse:
- https://seu-app.vercel.app

Você deve ver a tela de login personalizada.

---

## ⚠️ Importante

**Variável de Ambiente:**
Certifique-se de que `VITE_API_URL` está configurada no Vercel:
```
VITE_API_URL=https://seu-backend.onrender.com/api
```

Ou a URL do seu backend no Railway.

---

## 🎯 Checklist

- [ ] Root Directory configurado para `frontend`
- [ ] Framework configurado para `Vite`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Variável `VITE_API_URL` configurada
- [ ] Redeploy realizado
- [ ] Site acessível sem erro 404

---

## 💡 Dica

Se você não quer usar a pasta `frontend/`, pode mover todos os arquivos para a raiz:

```bash
# Mover arquivos do frontend para raiz
mv frontend/* .
mv frontend/.* . 2>/dev/null
rm -rf frontend
```

Mas isso não é recomendado se você quer manter backend e frontend separados.

# 🚀 Configurar Vercel - Passo a Passo

## 📋 Problema Resolvido
O `vercel.json` foi movido para a pasta `frontend/` e simplificado.
Agora você precisa configurar o **Root Directory** via Dashboard do Vercel.

---

## 🎯 Passo a Passo Completo

### 1️⃣ Acessar o Vercel Dashboard

1. Acesse: **https://vercel.com/dashboard**
2. Faça login com sua conta
3. Localize o projeto **pedidosIHS** (ou o nome que você deu)

---

### 2️⃣ Configurar Root Directory

1. **Clique no projeto** pedidosIHS
2. **Vá em "Settings"** (no menu superior)
3. **Clique em "General"** (menu lateral esquerdo)
4. **Role até "Build & Development Settings"**

5. **Configure os seguintes campos:**

   **Root Directory:**
   ```
   frontend
   ```
   ✅ Marque o checkbox "Include source files outside of the Root Directory in the Build Step"

   **Framework Preset:**
   ```
   Vite
   ```

   **Build Command:**
   ```
   npm run build
   ```

   **Output Directory:**
   ```
   dist
   ```

   **Install Command:**
   ```
   npm install
   ```

6. **Clique em "Save"** no final da página

---

### 3️⃣ Configurar Variáveis de Ambiente

1. Ainda em **Settings**, vá em **"Environment Variables"**

2. **Adicione a variável:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://seu-backend.onrender.com/api`
     (Substitua pela URL real do seu backend)
   - **Environment:** Marque todas (Production, Preview, Development)

3. **Clique em "Save"**

---

### 4️⃣ Fazer Redeploy

1. **Vá em "Deployments"** (menu superior)

2. **Localize o último deployment** (o mais recente)

3. **Clique nos 3 pontos** (...) ao lado direito

4. **Clique em "Redeploy"**

5. **Aguarde 2-3 minutos** até o build completar

---

### 5️⃣ Verificar se Funcionou

1. **Após o deploy concluir**, clique em "Visit"

2. **Você deve ver:**
   - ✅ Tela de login personalizada
   - ✅ Logo do bar (se você adicionou)
   - ✅ Créditos: "Desenvolvido por Wagner Henrique Mocelin"
   - ❌ SEM exemplos de usuários

3. **Teste o login:**
   - Email: `admin@ihopso.com`
   - Senha: `admin123`

---

## 🔍 Troubleshooting

### ❌ Ainda dá erro 404?

**Verifique:**
1. Root Directory está configurado como `frontend`? ✓
2. Framework está como `Vite`? ✓
3. Output Directory está como `dist`? ✓
4. Você clicou em "Save"? ✓
5. Você fez o Redeploy? ✓

**Se sim para todos, tente:**
- Deletar o projeto no Vercel
- Reimportar do GitHub
- Configurar tudo novamente

---

### ❌ Build falha?

**Verifique os logs do build:**
1. Vá em "Deployments"
2. Clique no deployment que falhou
3. Veja os logs de erro

**Erros comuns:**
- Falta de variável `VITE_API_URL`
- Dependências não instaladas
- Erro de sintaxe no código

---

### ❌ App carrega mas não conecta com backend?

**Verifique:**
1. Variável `VITE_API_URL` está configurada?
2. URL do backend está correta?
3. Backend está rodando?
4. CORS está configurado no backend?

**Teste o backend:**
```bash
curl https://seu-backend.onrender.com/api/auth/me
```

Deve retornar erro 401 (sem token), mas não 404.

---

## ✅ Checklist Final

- [ ] Root Directory: `frontend`
- [ ] Framework: `Vite`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Variável `VITE_API_URL` configurada
- [ ] Redeploy realizado
- [ ] Site acessível (sem 404)
- [ ] Login funcionando
- [ ] Conecta com backend

---

## 🎉 Pronto!

Após seguir todos os passos, seu frontend estará deployado corretamente no Vercel!

**Tempo estimado:** 5-10 minutos

---

## 💡 URLs Importantes

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Vercel:** https://vercel.com/docs
- **Seu App:** https://seu-app.vercel.app (será mostrado no dashboard)

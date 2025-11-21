# 🎨 Como Adicionar o Logo do Bar

## 📋 Passo a Passo

### 1️⃣ Preparar a Imagem

1. **Tenha o logo em formato:**
   - PNG (com fundo transparente - recomendado)
   - JPG
   - SVG

2. **Tamanho recomendado:**
   - Quadrado (ex: 512x512px)
   - Ou proporção similar

### 2️⃣ Adicionar ao Projeto

**Opção A: Pasta Public (Recomendado)**

1. Copie o arquivo do logo
2. Cole em: `frontend/public/`
3. Renomeie para: `logo.png`

**Caminho completo:**
```
frontend/
  └── public/
      └── logo.png  ← Coloque aqui
```

**Opção B: Pasta Assets**

1. Copie o arquivo do logo
2. Cole em: `frontend/src/assets/`
3. Atualize o código para importar:

```jsx
import logo from '../assets/logo.png'

// Depois use:
<img src={logo} alt="Logo IHS" />
```

### 3️⃣ Verificar

1. Recarregue a página de login
2. O logo deve aparecer acima do título "Pedidos IHS"

---

## 🎨 Personalizar Tamanho

Se quiser ajustar o tamanho do logo, edite em `Login.jsx`:

```jsx
// Linha 40 - Altere w-24 h-24 para o tamanho desejado
className="w-24 h-24 object-contain"

// Exemplos:
// w-16 h-16 = pequeno
// w-24 h-24 = médio (atual)
// w-32 h-32 = grande
```

---

## ✅ Resultado

A tela de login agora tem:
- ✅ Logo do bar no topo
- ✅ Título "Pedidos IHS"
- ✅ Formulário de login limpo
- ✅ Créditos: "Desenvolvido por Wagner Henrique Mocelin"
- ❌ Removidos os exemplos de usuários de teste

---

## 🚀 Próximos Passos

Depois de adicionar o logo:
1. Teste localmente
2. Faça commit das alterações
3. Deploy para produção

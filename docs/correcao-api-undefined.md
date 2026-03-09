# 🚨 Correção Rápida: "API_BASE is not defined"

## Problema

Após fazer deploy na Cloudflare Pages, o site mostra erro:
```
Não foi possível logar: API_BASE is not defined
```

## Causa

O frontend está tentando conectar com `http://localhost:8080/api` (que não existe quando hospedado), mas você não configurou a URL do seu backend Ngrok.

## ✅ Solução (3 minutos)

### Passo 1: Obter URL do Backend

1. **Inicie o backend local:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Em outro terminal, inicie o Ngrok:**
   ```bash
   ngrok http 8080
   ```

3. **Copie a URL gerada** (exemplo):
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:8080
   ```
   
   **Sua URL da API:** `https://abc123.ngrok.io/api`

### Passo 2: Configurar a URL no Frontend

Você tem **2 opções**:

---

#### 🟢 Opção A: Editar Diretamente no HTML (RECOMENDADO)

Adicione este script em **TODAS** as páginas HTML (index.html, login.html, portal-aluno.html, etc.)

**ANTES de `<script src="scripts.js"></script>`:**

```html
  <!-- Notyf CDN -->
  <script src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"></script>
  
  <!-- ⭐ ADICIONE ESTA LINHA AQUI ⭐ -->
  <script>window.API_BASE_URL = 'https://abc123.ngrok.io/api';</script>
  
  <!-- Scripts principal -->
  <script src="scripts.js"></script>
</body>
</html>
```

**⚠️ IMPORTANTE:** Substitua `https://abc123.ngrok.io` pela **SUA** URL do Ngrok!

**Páginas que precisam da configuração:**
- ✅ index.html
- ✅ login.html
- ✅ portal-aluno.html
- ✅ portal-secretaria.html
- ✅ status.html
- ✅ inscricao.html
- ✅ matricula.html

---

#### 🟡 Opção B: Criar Arquivo config.js

**1. Crie o arquivo `config.js` em `frontend-web/static/`:**

```javascript
// Configuração da URL da API do backend
window.API_BASE_URL = 'https://abc123.ngrok.io/api';
```

**2. Adicione em TODAS as páginas HTML:**

```html
  <script src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"></script>
  <script src="config.js"></script>  <!-- ⭐ ADICIONE ESTA LINHA -->
  <script src="scripts.js"></script>
</body>
</html>
```

**3. Commit e push:**

```bash
git add config.js
git add index.html login.html portal-aluno.html  # todas as páginas editadas
git commit -m "config: adicionar URL da API do backend"
git push origin main
```

**4. Aguarde o Cloudflare Pages fazer redeploy automático (~2 minutos)**

---

### Passo 3: Testar

1. Acesse seu site Cloudflare: `https://seja-senai.pages.dev`
2. Clique em **"Login"**
3. Tente fazer login com:
   - **Email:** `admin@senai.com`
   - **Senha:** `Admin@123`

✅ **Deve funcionar agora!**

---

## ⚠️ Lembrete Importante

**Toda vez que o Ngrok reiniciar**, a URL muda!

Exemplo:
- 1ª execução: `https://abc123.ngrok.io`
- 2ª execução: `https://xyz789.ngrok.io` ← **URL DIFERENTE!**

Você precisa:
1. Copiar a nova URL
2. Atualizar `window.API_BASE_URL` no HTML ou config.js
3. Fazer commit e push
4. Aguardar redeploy

### Solução Permanente (Plano Pago Ngrok):

Com Ngrok Pro ($8/mês), você tem URL fixa:
```bash
ngrok http 8080 --domain=seja-senai.ngrok.app
```

**URL permanente:** `https://seja-senai.ngrok.app/api` (nunca muda!)

---

## 🧪 Testar Localmente Antes do Deploy

Antes de fazer push, teste localmente:

**1. Inicie backend + Ngrok:**
```bash
.\iniciar-backend-ngrok.bat
```

**2. Edite `scripts.js` temporariamente:**
```javascript
const API_BASE = 'https://abc123.ngrok.io/api';  // sua URL Ngrok
```

**3. Inicie frontend:**
```bash
cd frontend-web\static
python -m http.server 5500
```

**4. Teste em:** http://localhost:5500

Se funcionar localmente, faça o deploy!

---

## 📊 Verificar Requisições (Debug)

**1. Abra o Console do Navegador:**
- Pressione `F12`
- Vá na aba **Console**

**2. Execute:**
```javascript
console.log('API URL:', window.API_BASE_URL);
```

**Deve mostrar:**
```
API URL: https://abc123.ngrok.io/api
```

Se mostrar `undefined`, a configuração não foi aplicada!

---

## ✅ Checklist Final

- [ ] Backend Spring Boot está rodando (localhost:8080)
- [ ] Ngrok está expondo o backend (https://abc123.ngrok.io)
- [ ] URL do Ngrok copiada (incluindo `/api` no final)
- [ ] `window.API_BASE_URL` configurado em TODAS as páginas HTML
- [ ] Commit e push feitos
- [ ] Cloudflare Pages fez redeploy (aguardar ~2 min)
- [ ] Testado login no site hospedado

---

**Precisa de ajuda?** Verifique o [dashboard do Ngrok](http://127.0.0.1:4040) para ver se as requisições estão chegando!

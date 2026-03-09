# ⚙️ Guia: Configurar API no Cloudflare Pages

## 🎯 Problema Resolvido

Quando você acessa o site pelo **Cloudflare Pages** (`seja-senai.pages.dev`), o frontend não consegue conectar ao backend que está rodando **localmente** na sua máquina.

**Sistema criado:** Configuração inteligente de API com modal automático.

---

## 🚀 Como Usar

### **Passo 1: Iniciar Backend + Cloudflare Tunnel**

```powershell
# Na raiz do projeto
.\iniciar-backend-cloudflare-tunnel.bat
```

**Aguarde até aparecer:**
```
┌──────────────────────────────────────────────────┐
│ Your quick Tunnel has been created! Visit it at │
│ https://random-words-abc123.trycloudflare.com    │
└──────────────────────────────────────────────────┘
```

**📋 COPIE essa URL!** Exemplo: `https://random-words-abc123.trycloudflare.com`

---

### **Passo 2: Acessar o Site no Pages.dev**

Abra no navegador (ou celular):
```
https://seja-senai.pages.dev/
```

---

### **Passo 3: Configurar API (Automático)**

Ao acessar o Pages, você verá automaticamente um **modal de configuração**:

![Modal de Configuração](https://via.placeholder.com/600x400/667eea/FFFFFF?text=Modal+Configuração+API)

**O que fazer:**
1. ✅ **Cole a URL** do Cloudflare Tunnel no campo
2. ✅ Clique em **"💾 Salvar e Testar"**
3. ✅ Aguarde validação (aparecerá ✅ verde se sucesso)

**Exemplo de URL:**
```
https://random-words-abc123.trycloudflare.com
```

⚠️ **NÃO adicione** `/api` no final (o sistema adiciona automaticamente)

---

## 🔄 Reconfigurar API

Se precisar mudar a URL (tunnel reiniciou, mudou de máquina, etc):

### **Método 1: Click no Indicador**
- No canto superior direito, há um badge **"API"**
- Clique nele → abre modal de configuração

### **Método 2: Console do Navegador**
```javascript
// Abra DevTools (F12) e digite:
showApiConfigModal();
```

### **Método 3: Limpar e Recarregar**
```javascript
localStorage.removeItem('API_BASE_URL');
location.reload();
```

---

## 🎨 Indicador de Status

No canto superior direito, você verá um **badge de status**:

| Cor | Status | Significado |
|-----|--------|-------------|
| 🟢 Verde | **API Online** | Conectado ao backend com sucesso |
| 🔴 Vermelho | **API Offline** | Backend não está acessível |
| 🟡 Amarelo | **Testando...** | Verificando conexão |

**Click no badge** = Abre configuração

---

## 🧪 Testar Conexão

Após configurar, para testar manualmente:

```javascript
// No console do navegador (F12):
testApiConnection();
```

Você verá logs:
- ✅ `API Online` = Funcionando
- ❌ `API Offline` = Problema de conexão

---

## 🔧 Troubleshooting

### **1. Modal não aparece automaticamente**

**Solução manual:**
```javascript
// Console (F12)
showApiConfigModal();
```

---

### **2. "❌ Falha ao conectar"**

**Checklist:**

✅ Backend está rodando?
```powershell
# Verificar processos Java
Get-Process | Where-Object { $_.ProcessName -like "*java*" }
```

✅ Cloudflare Tunnel está ativo?
```powershell
# Verificar processos cloudflared
Get-Process | Where-Object { $_.ProcessName -like "*cloudflared*" }
```

✅ URL está correta?
- ✅ Começa com `https://`
- ✅ Domínio `.trycloudflare.com`
- ❌ NÃO tem `/api` no final

✅ CORS configurado no backend?
```properties
# backend/src/main/resources/application.properties
# Deve ter configuração de CORS permitindo origins
```

---

### **3. URL do Tunnel muda sempre**

**Normal!** URL do Cloudflare Tunnel **é temporária** e muda a cada execução.

**Solução:**
1. **Cada vez** que reiniciar o tunnel, copie a **nova URL**
2. Reconfigurar no modal (click no badge **API**)

**Alternativa permanente:**
- Deploy do backend em servidor real (Railway, Render, AWS, etc)
- URL fixa e permanente

---

### **4. Funciona no PC mas não no celular**

**Causa:** Configuração salva no `localStorage` é **por dispositivo**.

**Solução:**
1. Abra `seja-senai.pages.dev` **no celular**
2. Click no badge **API** (canto superior direito)
3. Configure a URL do tunnel
4. Salve e teste

⚠️ **Lembre-se:** A URL deve ser acessível externamente (Cloudflare Tunnel público)

---

## 📱 Uso no Celular

### **Passo a Passo:**

1. **PC:** Inicie backend + tunnel
   ```powershell
   .\iniciar-backend-cloudflare-tunnel.bat
   ```

2. **PC:** Copie URL gerada (ex: `https://abc-xyz.trycloudflare.com`)

3. **Celular:** Abra navegador e acesse:
   ```
   https://seja-senai.pages.dev/
   ```

4. **Celular:** Modal aparece automaticamente

5. **Celular:** Cole URL do tunnel e salve

6. **Celular:** ✅ Pronto! Login funcionando

---

## 🎯 Ambientes Suportados

| Ambiente | Detecção Automática | Configuração |
|----------|---------------------|--------------|
| **Localhost** | ✅ Sim | Usa `localhost:8080` automaticamente |
| **Pages.dev** | ✅ Sim | Pede configuração via modal |
| **Workers.dev** | ✅ Sim | Pede configuração via modal |
| **Domínio Customizado** | ⚠️ Não | Usar variável `window.API_BASE_URL` |

---

## 🔐 Persistência

A URL configurada é salva no **localStorage** do navegador:

```javascript
// Ver configuração atual:
console.log(localStorage.getItem('API_BASE_URL'));

// Limpar configuração:
localStorage.removeItem('API_BASE_URL');
```

**⚠️ Importante:** Se limpar cache/dados do navegador, precisará reconfigurar.

---

## 🚀 Deploy Futuro (Produção Real)

Para **não depender** do Cloudflare Tunnel temporário:

### **Opção 1: Railway (Recomendado - Gratuito)**
```bash
# Deploy automático via GitHub
# URL fixa: https://sejasenai.up.railway.app
```

### **Opção 2: Render**
```bash
# Deploy gratuito
# URL fixa: https://sejasenai.onrender.com
```

### **Opção 3: AWS/Azure/GCP**
```bash
# Hospedagem profissional
# URL customizada
```

**Depois do deploy:**
1. Configurar URL permanente no Cloudflare Pages (variável de ambiente)
2. Não precisará mais do modal de configuração

---

## 📊 Logs de Debug

Para ver logs detalhados no console:

```javascript
// Ver URL atual da API:
console.log('API_BASE:', API_BASE);

// Ver de onde veio a configuração:
console.log('localStorage:', localStorage.getItem('API_BASE_URL'));
console.log('Window ENV:', window.ENV?.API_BASE_URL);

// Testar endpoint específico:
fetch(`${API_BASE}/usuarios/count`).then(r => console.log('Status:', r.status));
```

---

## ✅ Resumo Rápido

```
1. Inicie: .\iniciar-backend-cloudflare-tunnel.bat
2. Copie: https://abc-xyz.trycloudflare.com
3. Acesse: https://seja-senai.pages.dev/
4. Configure: Cole URL no modal
5. ✅ Pronto!
```

**Cada dispositivo/navegador** precisa configurar **uma vez**.

---

## 🆘 Suporte

**Não está funcionando?**

1. Verifique **backend rodando**: `Get-Process | Where-Object { $_.Name -like "*java*" }`
2. Verifique **tunnel ativo**: Terminal deve mostrar URL do Cloudflare
3. Teste **URL manualmente**: Abra `https://sua-url.trycloudflare.com/api/usuarios/count`
4. Verifique **CORS**: Backend deve permitir origin do Pages.dev

**Logs do console (F12)** sempre mostram o que está acontecendo.

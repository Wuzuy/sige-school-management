# 🚀 Guia Rápido: Cloudflare Tunnel

## ⚡ Instalação Rápida (3 minutos)

### Opção 1: Download Direto (MAIS FÁCIL)

1. **Baixe o executável:**
   - Acesse: https://github.com/cloudflare/cloudflared/releases/latest
   - Baixe: `cloudflared-windows-amd64.exe`
   - Renomeie para: `cloudflared.exe`

2. **Coloque na pasta do projeto:**
   ```powershell
   # Mova o arquivo para a raiz do projeto
   Move-Item "$env:USERPROFILE\Downloads\cloudflared.exe" "C:\Users\lucas\Documents\Github\seja-senai\"
   ```

3. **Teste:**
   ```powershell
   cd C:\Users\lucas\Documents\Github\seja-senai
   .\cloudflared.exe version
   ```

---

### Opção 2: Chocolatey (se tiver instalado)

```powershell
choco install cloudflared -y
```

---

### Opção 3: Adicionar ao PATH (Permanente)

Depois de baixar, adicione ao PATH do Windows:

```powershell
# Criar pasta para executáveis
New-Item -Path "C:\cloudflare" -ItemType Directory -Force

# Mover executável
Move-Item "$env:USERPROFILE\Downloads\cloudflared.exe" "C:\cloudflare\"

# Adicionar ao PATH (permanente)
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\cloudflare", "User")

# Reabrir PowerShell e testar
cloudflared version
```

---

## 🔥 Uso Rápido

### 1. Iniciar Backend + Tunnel (Tudo Junto)

```powershell
# Usar o script pronto
.\iniciar-backend-cloudflare-tunnel.bat
```

**Copie a URL gerada** (ex: `https://random-words.trycloudflare.com`)

---

### 2. Apenas o Tunnel (Backend já rodando)

```powershell
# Se cloudflared está no PATH:
cloudflared tunnel --url http://localhost:8080

# OU se está na pasta do projeto:
.\cloudflared.exe tunnel --url http://localhost:8080
```

---

## 📝 Configurar no Frontend

Depois de obter a URL do Cloudflare Tunnel:

### No seu fork do GitHub:

Edite cada página HTML (index.html, login.html, etc.) e adicione **ANTES** de `<script src="scripts.js"></script>`:

```html
<script>
  window.API_BASE_URL = 'https://random-words.trycloudflare.com/api';
</script>
<script src="scripts.js"></script>
```

**⚠️ IMPORTANTE:**
- Substitua `random-words.trycloudflare.com` pela SUA URL real
- Não esqueça `/api` no final!
- Coloque em TODAS as páginas HTML

---

## 🌟 Vantagens sobre Ngrok

| Recurso | Cloudflare Tunnel | Ngrok (Free) |
|---------|-------------------|--------------|
| **Bloqueio por operadora** | ✅ Raro | ❌ Comum |
| **Performance** | ✅ Excelente | 🟡 Boa |
| **Limite de conexões** | ✅ Ilimitado | ⚠️ 40/min |
| **URL fixa** | ❌ Muda (free) | ❌ Muda |
| **Cadastro necessário** | ❌ Não | ✅ Sim |
| **Dashboard** | ❌ Não tem | ✅ http://127.0.0.1:4040 |
| **Integração Cloudflare** | ✅ Nativa | ❌ Não |

---

## 🧪 Testar Se Funciona

### 1. Backend está respondendo?

```powershell
# No PC
curl http://localhost:8080/api/editais
```

**Deve retornar:** JSON com lista de editais

---

### 2. Tunnel está funcionando?

```powershell
# No PC (substitua a URL)
curl https://random-words.trycloudflare.com/api/editais
```

**Deve retornar:** Mesmo JSON

---

### 3. Funciona no celular 4G?

**No navegador do celular:**
```
https://random-words.trycloudflare.com/api/editais
```

**Deve mostrar:** JSON com editais

**Se funcionar:** ✅ Operadora não está bloqueando!

---

## 📋 Checklist Completo

- [ ] Cloudflared baixado e funcionando (`cloudflared version`)
- [ ] Backend Spring Boot rodando (`localhost:8080`)
- [ ] Tunnel iniciado (`cloudflared tunnel --url http://localhost:8080`)
- [ ] URL copiada (ex: `https://words.trycloudflare.com`)
- [ ] No fork GitHub: `window.API_BASE_URL` configurado em **TODAS** as páginas HTML
- [ ] Commit e push feito
- [ ] Cloudflare Pages fez redeploy (~2 min)
- [ ] Testado no celular 4G ✅

---

## 🆘 Troubleshooting

### Erro: "Your tunnel credential has expired"

**Solução:** Reinicie o tunnel (ele cria nova URL)

---

### Erro: "failed to connect to cloudflared"

**Solução:** Backend não está rodando! Inicie o Spring Boot primeiro.

---

### Funciona no WiFi mas não no 4G

**Possível causa:** Operadora ainda está bloqueando

**Soluções:**
1. Tente reiniciar o tunnel (nova URL)
2. Use VPN no celular
3. Teste com outra operadora (SIM de outra pessoa)

---

### URL muda toda hora

**Explicação:** No plano gratuito, a URL muda cada vez que reinicia

**Solução:**
- **Temporária:** Atualize URL no frontend e faça push
- **Permanente:** Deploy backend em produção (Railway, Render)

---

## 🚀 Deploy Permanente (Recomendado)

Se você está testando muito, considere fazer deploy real:

### Railway (Gratuito - 500h/mês)

1. Acesse: https://railway.app
2. Conecte GitHub
3. Deploy `backend/` (Spring Boot)
4. Copie URL permanente: `https://seu-app.railway.app`
5. Configure no frontend **uma única vez**

**Vantagens:**
- ✅ URL permanente (nunca muda!)
- ✅ Zero bloqueios
- ✅ Funciona em qualquer rede
- ✅ Não precisa deixar PC ligado

---

## 📚 Links Úteis

- **Cloudflared Releases:** https://github.com/cloudflare/cloudflared/releases
- **Documentação Oficial:** https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **Railway:** https://railway.app
- **Render:** https://render.com

---

## 💡 Dica Pro

**Crie um alias no PowerShell:**

```powershell
# Adicione ao seu perfil do PowerShell
function Start-Tunnel {
    .\cloudflared.exe tunnel --url http://localhost:8080
}

# Usar:
Start-Tunnel
```

Agora só digitar `Start-Tunnel` no terminal! 🚀

# 📱 Troubleshooting: "Loaded Failed" no Celular 4G

## Problema Reportado

Ao acessar o site hospedado na Vercel pelo **celular no 4G**, aparece erro:
```
Loaded Failed
```

O mesmo site funciona normalmente no WiFi ou no PC.

---

## 🔍 Causas e Soluções

### Causa #1: Backend Ngrok não está rodando ❌

**Sintoma:** Funciona no PC/WiFi mas falha no 4G

**Diagnóstico:**
1. No celular, abra o navegador
2. Acesse diretamente: `https://SEU-NGROK.ngrok.io/api/editais`
3. Se der **erro 404 ou timeout**: Backend não está acessível

**Solução:**
```bash
# Terminal 1: Inicie o backend
cd backend
npm run dev

# Terminal 2: Inicie o Ngrok
ngrok http 8080

# Copie a nova URL e atualize no frontend!
```

**⚠️ LEMBRE-SE:** Toda vez que reiniciar Ngrok, a URL muda!

---

### Causa #2: Operadora bloqueando Ngrok 🚫

**Sintoma:** 
- ✅ Funciona no WiFi
- ❌ Falha no 4G (Claro, Vivo, Tim, Oi)

**Por que?** Operadoras bloqueiam domínios `.ngrok.io` por segurança.

**Teste Rápido:**
```
# No celular 4G, acesse:
https://seu-ngrok.ngrok.io/api/editais

Se der erro de "Site não pode ser acessado" ou "ERR_NAME_NOT_RESOLVED"
→ Operadora está bloqueando!
```

**Soluções:**

#### Solução 2A: Usar Cloudflare Tunnel (RECOMENDADO) ⭐

```bash
# Instalar (apenas uma vez)
choco install cloudflared

# Usar (em vez do Ngrok)
cloudflared tunnel --url http://localhost:8080
```

**URL gerada:** `https://random-words.trycloudflare.com`

**Vantagens:**
- ✅ Menos bloqueios por operadoras
- ✅ Domínio diferente de .ngrok.io
- ✅ Melhor performance

**Use o script:** `.\iniciar-backend-cloudflare-tunnel.bat`

---

#### Solução 2B: Usar VPN no Celular

Se a operadora está bloqueando:

1. **Instale uma VPN no celular** (ProtonVPN, Windscribe - gratuitos)
2. **Conecte à VPN**
3. **Teste o site novamente**

**Se funcionar com VPN:** Confirmado que é bloqueio da operadora!

---

#### Solução 2C: Ngrok Pro ($8/mês)

Domínio fixo que sofre menos bloqueios:

```bash
ngrok http 8080 --domain=seja-senai.ngrok.app
```

**URL permanente:** `https://seja-senai.ngrok.app` (nunca muda!)

---

### Causa #3: CORS ou Mixed Content 🔒

**Sintoma:** Console do navegador mostra erros CORS

**Verificar CORS no Backend:**

1. Abra: `backend/src/main/java/.../config/SecurityConfig.java`
2. Certifique-se de que permite HTTPS do Cloudflare

**Adicione configuração CORS global:**

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList("*"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    configuration.setExposedHeaders(Arrays.asList("Authorization"));
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", configuration);
    return source;
}
```

E adicione ao `filterChain`:

```java
http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
```

---

### Causa #4: URL da API mal configurada 🔧

**Sintoma:** Console mostra `undefined` ou `localhost` nas requisições

**Verificar Configuração:**

No fork do GitHub, abra `index.html` e veja se tem:

```html
<script>window.API_BASE_URL = 'https://SEU-NGROK.ngrok.io/api';</script>
<script src="scripts.js"></script>
```

**⚠️ IMPORTANTE:** 
- Não esqueça `/api` no final
- Use HTTPS (não HTTP)
- URL deve ser a atual do Ngrok/Cloudflare Tunnel

---

## 🧪 Testes de Diagnóstico

### Teste 1: API Acessível no Celular

```
# No navegador do celular, acesse:
https://SEU-NGROK.ngrok.io/api/editais

✅ Deve mostrar: JSON com lista de editais
❌ Se der erro: Backend não está acessível
```

---

### Teste 2: Inspecionar Console (Android)

**Requisitos:** PC Windows + celular Android + cabo USB

1. **No celular:**
   - Chrome > Menu (⋮) > Configurações
   - Sistema > Sobre o telefone
   - Toque 7x em "Número da versão" (ativa modo desenvolvedor)
   - Volte > Opções do desenvolvedor > Ative "Depuração USB"

2. **Conecte celular ao PC via USB**

3. **No PC, abra Chrome:**
   ```
   chrome://inspect
   ```

4. **No celular, abra o site**

5. **No PC, clique em "Inspect" abaixo do site**

6. **Veja erros no Console**

**Erros Comuns:**
```
❌ ERR_NAME_NOT_RESOLVED → Operadora bloqueando
❌ CORS policy error → Problema de CORS no backend
❌ Failed to fetch → Backend não está respondendo
❌ net::ERR_CONNECTION_REFUSED → Backend offline
```

---

### Teste 3: WiFi vs 4G

1. **Teste no WiFi** → Se funcionar, continua
2. **Teste no 4G** → Se falhar, é problema de rede

**Se falhar apenas no 4G:**
- Operadora bloqueando Ngrok
- Firewall corporativo (se usar chip empresa)

---

### Teste 4: Hotspot Reverso

**Objetivo:** Descobrir se é problema da rede 4G

1. **No celular:**
   - Configurações > Rede > Hotspot Pessoal
   - Ative o hotspot

2. **No PC:**
   - Conecte ao WiFi do celular

3. **Reinicie Ngrok** (vai usar IP do celular)

4. **Teste no celular** com 4G

**Se funcionar:** Problema não é a operadora
**Se falhar:** Operadora está bloqueando mesmo no hotspot

---

## 🚀 Solução Definitiva: Deploy em Produção

### Opção A: Railway (Free Tier) ⭐

**Backend em Railway:**
1. Acesse: https://railway.app
2. Conecte repositório GitHub
3. Deploy Node.js (automático)
4. Copie URL pública: `https://seu-app.railway.app`

**Vantagens:**
- ✅ URL permanente
- ✅ Zero bloqueios
- ✅ 500h grátis/mês
- ✅ Suporte a PostgreSQL

---

### Opção B: Render (Free Tier)

**Backend em Render:**
1. Acesse: https://render.com
2. New > Web Service
3. Conecte GitHub
4. Deploy (automático)

**Vantagens:**
- ✅ URL permanente
- ✅ SSL gratuito
- ✅ Deploy automático

---

### Opção C: Ngrok Pro ($8/mês)

**Domínio fixo:**
```bash
ngrok http 8080 --domain=seja-senai.ngrok.app
```

**URL:** `https://seja-senai.ngrok.app` (nunca muda)

---

## 📋 Checklist de Diagnóstico

Execute na ordem:

1. [ ] **Backend está rodando?**
   ```bash
   curl http://localhost:8080/api/editais
   ```
   Se falhar: Inicie o backend

2. [ ] **Ngrok está rodando?**
   ```bash
   curl https://SEU-NGROK.ngrok.io/api/editais
   ```
   Se falhar: Inicie o Ngrok

3. [ ] **API acessível no celular?**
   - Abra navegador do celular
   - Acesse: `https://SEU-NGROK.ngrok.io/api/editais`
   - Se falhar: Operadora bloqueando ou URL errada

4. [ ] **URL configurada no frontend?**
   - Veja `view-source:` do site
   - Procure por `window.API_BASE_URL`
   - Deve ser a URL do Ngrok/Cloudflare Tunnel

5. [ ] **CORS configurado?**
   - Inspecione console do navegador
   - Se tiver erro `CORS policy`: Configure CORS no backend

6. [ ] **HTTPS funcionando?**
   - Ngrok sempre usa HTTPS ✅
   - Vercel sempre usa HTTPS ✅
   - Não deve ter problema de Mixed Content

---

## 🆘 Solução Emergencial: Localtunnel

Se **tudo falhar**, use Localtunnel (sem cadastro):

```bash
# Instalar
npm install -g localtunnel

# Usar
lt --port 8080 --subdomain seja-senai
```

**URL:** `https://seja-senai.loca.lt`

**Aviso:** Menos estável que Ngrok/Cloudflare Tunnel

---

## 💡 Recomendação Final

**Para desenvolvimento/testes:**
- ✅ Use **Cloudflare Tunnel** (menos bloqueios)
- ✅ Script pronto: `iniciar-backend-cloudflare-tunnel.bat`

**Para produção:**
- ✅ Deploy no **Railway** ou **Render** (grátis)
- ✅ URL permanente, zero bloqueios

**Se precisar Ngrok:**
- ✅ Considere plano Pro ($8/mês) para domínio fixo
- ✅ Menos problemas com operadoras

---

## 📞 Suporte

Se nenhuma solução funcionar:

1. Compartilhe o erro exato do Console do navegador
2. Informe qual operadora (Claro, Vivo, Tim, Oi)
3. Teste com VPN e informe se funciona
4. Informe se funciona no WiFi

**Dashboard Ngrok:** http://127.0.0.1:4040 (veja se chegam requisições)

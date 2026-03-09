# 🌐 Expor Backend com Ngrok

## O que é o Ngrok?

Ngrok cria um túnel seguro que expõe seu servidor local (Spring Boot) para a internet, permitindo testes remotos e integração com frontend hospedado.

## Passo 1: Instalar Ngrok

### Windows (via Chocolatey - RECOMENDADO)
```powershell
choco install ngrok
```

### Windows (Download Manual)
1. Acesse: https://ngrok.com/download
2. Baixe o executável para Windows
3. Extraia para `C:\ngrok\`
4. Adicione ao PATH:
   ```powershell
   $env:Path += ";C:\ngrok"
   ```

### Verificar instalação:
```bash
ngrok version
```

## Passo 2: Criar Conta e Autenticar

1. Crie conta gratuita: https://dashboard.ngrok.com/signup
2. Copie seu Authtoken: https://dashboard.ngrok.com/get-started/your-authtoken
3. Configure o token:
```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
```

## Passo 3: Iniciar o Backend

```bash
cd backend
./mvnw spring-boot:run
```

Aguarde o backend iniciar na porta **8080**.

## Passo 4: Expor o Backend com Ngrok

Em outro terminal:

```bash
ngrok http 8080
```

### Você verá algo assim:
```
ngrok                                                                    

Session Status                online
Account                       seu-email@email.com (Plan: Free)
Version                       3.5.0
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:8080

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

🎉 **Sua URL pública**: `https://abc123.ngrok.io`

## Passo 5: Configurar CORS no Backend

Atualize `SecurityConfig.java` para aceitar requests do Ngrok:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:5500",
        "https://*.ngrok.io",  // ← Aceita qualquer subdomínio ngrok
        "https://seja-senai.pages.dev"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

**⚠️ IMPORTANTE:** Reinicie o backend após alterar CORS!

## Passo 6: Testar a Conexão

### Testar endpoint de health check:
```bash
curl https://abc123.ngrok.io/api/usuarios
```

### Testar do frontend (no console do navegador):
```javascript
fetch('https://abc123.ngrok.io/api/editais')
  .then(r => r.json())
  .then(console.log);
```

## Passo 7: Atualizar Frontend

### Opção A: Variável de Ambiente (Cloudflare)
No Cloudflare Pages:
1. **Settings** > **Environment Variables**
2. Adicionar: `API_BASE_URL = https://abc123.ngrok.io`

### Opção B: Atualizar scripts.js diretamente
```javascript
// Em scripts.js, linha ~1
const BASE_URL = 'https://abc123.ngrok.io/api';
```

## Ngrok Web Interface (Dashboard Local)

Acesse: http://127.0.0.1:4040

Você verá:
- ✅ Todas as requisições HTTP em tempo real
- ✅ Headers das requisições
- ✅ Payloads JSON
- ✅ Respostas do backend
- ✅ Status codes

Útil para debug!

## Comandos Avançados

### Usar domínio customizado (plano pago):
```bash
ngrok http 8080 --domain=seu-dominio.ngrok.app
```

### Usar subdomain fixo (plano pago):
```bash
ngrok http 8080 --subdomain=seja-senai
# URL fixa: https://seja-senai.ngrok.io
```

### Usar autenticação básica:
```bash
ngrok http 8080 --auth="admin:Admin@123"
```

### Expor em região específica:
```bash
ngrok http 8080 --region=sa  # South America
```

## Criar Script de Inicialização (RECOMENDADO)

Crie `iniciar-backend-ngrok.bat` na raiz:

```batch
@echo off
title SEJA SENAI - Backend + Ngrok
echo ==================================
echo SEJA SENAI - Iniciando Backend
echo ==================================

cd backend
start "Backend Spring Boot" cmd /k "mvnw spring-boot:run"

echo Aguardando backend iniciar (20 segundos)...
timeout /t 20 /nobreak

echo.
echo ==================================
echo Iniciando Ngrok
echo ==================================
ngrok http 8080
```

**Uso:**
```bash
.\iniciar-backend-ngrok.bat
```

## Limites do Plano Gratuito

✅ **40 conexões/minuto**
✅ **1 túnel simultâneo**
⚠️ **URL muda a cada restart** (ex: `abc123.ngrok.io` → `xyz789.ngrok.io`)
❌ **Sem domínio fixo**
❌ **Sem IP whitelist**

### Plano Pago ($8/mês):
- ✅ **Domínio fixo** (ex: `seja-senai.ngrok.app`)
- ✅ **3 túneis simultâneos**
- ✅ **120 conexões/minuto**
- ✅ **IP Whitelisting**

## Troubleshooting

### Erro: "failed to start tunnel"
**Causa:** Backend não está rodando na porta 8080
**Solução:** Inicie o backend primeiro

### Erro: "account limit reached"
**Causa:** Já existe um túnel ativo
**Solução:** Feche o túnel anterior ou crie uma nova conta

### Erro 502 Bad Gateway
**Causa:** Backend caiu ou travou
**Solução:** Reinicie o Spring Boot

### CORS Error no navegador
**Causa:** Backend não aceita origin do Ngrok
**Solução:** Configure CORS (Passo 5)

## Alternativas ao Ngrok

### 1. Localtunnel (gratuito, sem cadastro)
```bash
npm install -g localtunnel
lt --port 8080
```

### 2. Cloudflare Tunnel (gratuito, mais estável)
```bash
cloudflared tunnel --url http://localhost:8080
```

### 3. Serveo (SSH-based, sem instalação)
```bash
ssh -R 80:localhost:8080 serveo.net
```

---

**Próximo passo**: Teste o sistema completo com frontend (Cloudflare) + backend (Ngrok)!

## Fluxo Completo de Teste

1. ✅ Backend Spring Boot rodando (localhost:8080)
2. ✅ Ngrok expondo backend (https://abc123.ngrok.io)
3. ✅ Frontend na Cloudflare (https://seja-senai.pages.dev)
4. ✅ Frontend configurado para acessar Ngrok
5. ✅ Testar login, inscrições, portal secretaria

**🎉 Sistema acessível de qualquer lugar!**

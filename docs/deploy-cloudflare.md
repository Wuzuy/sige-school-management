# 🚀 Deploy Frontend na Cloudflare Pages

## Pré-requisitos

- Conta gratuita na Cloudflare: https://dash.cloudflare.com/sign-up
- Git configurado
- Repositório no GitHub

## Passo 1: Preparar o Frontend

1. **Criar arquivo de configuração `_redirects`** (para SPA routing):

```bash
# Em frontend-web/static/_redirects
/* /index.html 200
```

2. **Verificar estrutura:**
```
frontend-web/static/
├── index.html
├── login.html
├── portal-aluno.html
├── portal-secretaria.html
├── credits.html
├── app.css
├── scripts.js
├── _redirects  ← Novo arquivo
└── imagens/
```

## Passo 2: Deploy via Cloudflare Dashboard

### Opção A: Conectar Repositório GitHub (RECOMENDADO)

1. Acesse: https://dash.cloudflare.com
2. No menu lateral, clique em **Pages**
3. Clique em **Create a project**
4. Conecte sua conta GitHub
5. Selecione o repositório `seja-senai`

6. **Configure o build:**
   - **Project name**: `seja-senai`
   - **Production branch**: `main` (ou `wuzuy`)
   - **Build command**: (deixe vazio)
   - **Build output directory**: `frontend-web/static`

7. Clique em **Save and Deploy**

### Opção B: Deploy Direto via CLI

1. **Instalar Wrangler (CLI da Cloudflare):**
```bash
npm install -g wrangler
```

2. **Login:**
```bash
wrangler login
```

3. **Deploy:**
```bash
cd frontend-web/static
wrangler pages deploy . --project-name=seja-senai
```

## Passo 3: Configurar URL da API do Backend

Existem **3 formas** de configurar a URL da API:

### ⭐ Opção A: Script Inline (MAIS FÁCIL)

Adicione este script **ANTES** do `<script src="scripts.js"></script>` em cada página HTML:

**Exemplo em `index.html`, `login.html`, etc:**
```html
<!-- Configure a URL do backend aqui -->
<script>
  window.API_BASE_URL = 'https://abc123.ngrok.io/api';
</script>

<!-- Depois carregue o scripts.js -->
<script src="scripts.js"></script>
```

**⚠️ IMPORTANTE:** Substitua `https://abc123.ngrok.io` pela URL real do seu backend Ngrok!

### Opção B: Arquivo config.js

1. **Crie `frontend-web/static/config.js`:**
```javascript
// Configuração da API
window.API_BASE_URL = 'https://abc123.ngrok.io/api';
```

2. **Adicione em TODAS as páginas HTML ANTES do scripts.js:**
```html
<script src="config.js"></script>
<script src="scripts.js"></script>
```

### Opção C: Variáveis de Ambiente (Cloudflare Pages)

1. No Cloudflare Dashboard, vá em **Pages** > **seu-projeto** > **Settings** > **Environment Variables**
2. Adicione:
   - **Variable name:** `API_BASE_URL`
   - **Value:** `https://seu-backend.ngrok.io/api`
3. Salve e faça redeploy

**⚠️ Nota:** Esta opção requer configuração adicional no build e não é recomendada para iniciantes.
```

## Passo 4: Configurar Domínio Customizado (Opcional)

1. Em **Custom domains**, clique em **Set up a custom domain**
2. Digite seu domínio (ex: `seja-senai.com`)
3. Siga as instruções para configurar DNS

## Passo 5: Configurar CORS no Backend

Com o frontend hospedado, atualize o backend para aceitar requests:

```java
// Em SecurityConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:5500",
        "https://seja-senai.pages.dev",
        "https://seu-dominio-customizado.com"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

## URLs Geradas

Após o deploy, você terá:
- **URL de produção**: `https://seja-senai.pages.dev`
- **URL de preview**: `https://[commit-hash].seja-senai.pages.dev`

## Deploy Automático

✅ **Cada push para a branch principal** cria um novo deploy automaticamente
✅ **Pull Requests** geram deploys de preview
✅ **Rollback instantâneo** para versões anteriores

## Troubleshooting

### Erro 404 em rotas
- Verifique se o arquivo `_redirects` existe
- Conteúdo deve ser: `/* /index.html 200`

### API não conecta
- Verifique CORS no backend
- Confirme que `API_BASE_URL` está configurada
- Teste o backend com Ngrok (veja `deploy-ngrok.md`)

### Build falha
- Certifique-se de que `Build output directory` é `frontend-web/static`
- **Não** configure build command (frontend é estático)

## Comandos Úteis

```bash
# Ver logs de deployment
wrangler pages deployment list --project-name=seja-senai

# Fazer rollback
wrangler pages deployment rollback

# Limpar cache
wrangler pages cache purge
```

## Limites do Plano Gratuito

✅ **Builds ilimitados**
✅ **Banda ilimitada**
✅ **500 builds/mês**
✅ **1 build concorrente**

---

**Próximo passo**: Configure o backend com Ngrok (veja [deploy-ngrok.md](deploy-ngrok.md))

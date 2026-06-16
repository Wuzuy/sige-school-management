# Deploy: Frontend na Vercel + Backend no Render

## Sumario

1. [Pre-requisitos](#1-pre-requisitos)
2. [Backend no Render](#2-backend-no-render)
3. [Frontend na Vercel](#3-frontend-na-vercel)
4. [Conectar Frontend com Backend](#4-conectar-frontend-com-backend)
5. [Variaveis de Ambiente](#5-variaveis-de-ambiente)

---

## 1. Pre-requisitos

- Conta no [Render](https://render.com) (planta gratuita)
- Conta na [Vercel](https://vercel.com) (planta gratuita)
- Conta no [Supabase](https://supabase.com) (ja configurada no projeto)
- Git configurado e repositorio no GitHub

---

## 2. Backend no Render

### 2.1. Criar o servico

1. Acesse [https://dashboard.render.com](https://dashboard.render.com)
2. Clique em **New +** > **Web Service**
3. Conecte seu repositorio do GitHub ou faça upload manual
4. Configure:

| Campo | Valor |
|-------|-------|
| **Name** | `sige-backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | `Free` |

### 2.2. Variaveis de Ambiente

Na seção **Environment Variables**, adicione:

| Key | Value | Descricao |
|-----|-------|-----------|
| `SUPABASE_URL` | `https://seu-projeto.supabase.co` | URL do Supabase |
| `SUPABASE_KEY` | `SUA_CHAVE_ANON` | Chave do Supabase |
| `JWT_SECRET` | `secreta_sige_123` | Segredo JWT (troque em producao) |
| `PORT` | `10000` | Porta que o Render usa |

> **Importante:** Troque o `JWT_SECRET` por um valor forte em producao!
> Para gerar: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 2.3. Fazer deploy

- Clique em **Create Web Service**
- O Render vai fazer o build e deploy automaticamente
- Acompanhe os logs para ver se tudo subiu

### 2.4. URL gerada

Apos o deploy, o Render gera uma URL tipo:

```
https://sige-backend.onrender.com
```

**Anote essa URL**, voce vai precisar para o frontend.

---

## 3. Frontend na Vercel

### 3.1. Estrutura do projeto

O frontend tem tres portais em diretorios separados:

```
frontend-web/
  portal-escolar/       # index.html, login, portal-aluno, etc.
  portal-secretaria/    # portal-secretaria.html
  portal-inscricao/     # index.html, inscricao.html, status.html, etc.
```

### 3.2. Criar arquivo vercel.json

Crie o arquivo `vercel.json` na raiz do projeto (`sige/`):

```json
{
  "version": 2,
  "buildCommand": null,
  "outputDirectory": "frontend-web",
  "routes": [
    { "src": "/portal-escolar/(.*)", "dest": "/portal-escolar/$1" },
    { "src": "/portal-secretaria/(.*)", "dest": "/portal-secretaria/$1" },
    { "src": "/portal-inscricao/(.*)", "dest": "/portal-inscricao/$1" },
    { "src": "/(.*)", "dest": "/portal-escolar/$1" }
  ],
  "rewrites": [
    { "source": "/", "destination": "/portal-escolar/index.html" },
    { "source": "/login", "destination": "/portal-escolar/login.html" },
    { "source": "/secretaria", "destination": "/portal-secretaria/portal-secretaria.html" },
    { "source": "/inscricao", "destination": "/portal-inscricao/index.html" }
  ]
}
```

### 3.3. Fazer deploy

**Opcao A - Via GitHub (recomendado):**

1. Acesse [https://vercel.com/new](https://vercel.com/new)
2. Importe o repositorio do GitHub
3. Configure:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | `Other` |
| **Root Directory** | `./` (raiz do projeto) |
| **Build Command** | (deixar vazio) |
| **Output Directory** | `frontend-web` |

4. **Variavel de Ambiente** (opcional, veja secao 4):

| Key | Value |
|-----|-------|
| `API_BASE_URL` | `https://sige-backend.onrender.com/api` |

5. Clique em **Deploy**

**Opcao B - Via Vercel CLI:**

```bash
npm i -g vercel
vercel --prod
```

### 3.4. Rotas de acesso

Apos o deploy ficam assim:

| URL | Destino |
|-----|---------|
| `https://sige.vercel.app/` | Portal Escolar (index) |
| `https://sige.vercel.app/portal-escolar/login` | Login |
| `https://sige.vercel.app/portal-secretaria/portal-secretaria` | Secretaria |
| `https://sige.vercel.app/portal-inscricao/` | Inscricao |
| `https://sige.vercel.app/portal-aluno` | Portal do Aluno |

---

## 4. Conectar Frontend com Backend

### 4.1. Metodo 1: Variavel Global (recomendado)

Na Vercel, va em **Settings > Environment Variables** e adicione:

```
API_BASE_URL = https://sige-backend.onrender.com/api
```

Depois crie um arquivo `.env.vercel` na raiz:

```javascript
// No arquivo frontend-web/portal-escolar/assets/js/api-config.js
(function() {
  // Detecta ambiente de producao
  if (window.location.hostname !== 'localhost') {
    window.API_BASE_URL = 'https://sige-backend.onrender.com/api';
  }
  console.log('API Config:', window.API_BASE_URL || 'auto-detect');
})();
```

### 4.2. Metodo 2: Configuracao via Interface

O proprio sistema ja tem um modal de configuracao. Apos o login:

1. Clique no indicador **API** no canto superior direito
2. Digite a URL do backend: `https://sige-backend.onrender.com`
3. Clique em **Salvar e Testar**

A URL fica salva no `localStorage` do navegador.

### 4.3. Verificar conexao

Acesse a URL do frontend e veja se o indicador de API fica verde.
Teste fazendo login com:

| Email | Senha |
|-------|-------|
| `admin@senai.com` | `admin123` |

---

## 5. Variaveis de Ambiente

### 5.1. Resumo de todas as variaveis

**Backend (Render):**

| Variavel | Exemplo | Obrigatoria |
|----------|---------|-------------|
| `SUPABASE_URL` | `https://...supabase.co` | Sim |
| `SUPABASE_KEY` | `sb_publishable_...` | Sim |
| `JWT_SECRET` | `secreta_sige_123` | Sim |
| `PORT` | `10000` | Sim (Render define) |

**Frontend (Vercel):**

| Variavel | Exemplo | Obrigatoria |
|----------|---------|-------------|
| `API_BASE_URL` | `https://sige-backend.onrender.com/api` | Nao (configuravel via UI) |

### 5.2. Trocando o JWT_SECRET em producao

```bash
# Gere um segredo forte
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Exemplo de saida: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1
```

Atualize no Render: **Dashboard > sige-backend > Environment > JWT_SECRET**

### 5.3. SQL do Supabase

Nao esqueca de rodar o script SQL no Supabase:

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione o projeto
3. Va em **SQL Editor**
4. Cole o conteudo de `database/supabase-aluno-tables.sql`
5. Execute

---

## Troubleshooting

### "Failed to fetch" no frontend

- Verifique se o backend esta rodando: `https://sige-backend.onrender.com/api/usuarios/count`
- Confirme a URL no modal de configuracao da API
- Verifique CORS: o backend usa `cors()` sem restricao, entao deve funcionar

### Backend nao inicia no Render

- Veja os logs em **Dashboard > sige-backend > Logs**
- Confirme as variaveis de ambiente
- Verifique se o `npm install` rodou sem erros

### Erro 404 nas rotas

- O `vercel.json` pode precisar de ajustes
- Confira se os caminhos no `routes` estao corretos
- Teste localmente com `vercel dev` antes de fazer deploy

---

## Links Uteis

- [Documentacao Vercel](https://vercel.com/docs)
- [Documentacao Render](https://render.com/docs)
- [Documentacao Supabase](https://supabase.com/docs)

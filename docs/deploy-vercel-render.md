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
3. Conecte seu repositorio do GitHub
4. Configure:

| Campo | Valor |
|-------|-------|
| **Name** | `sige-backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | `Free` |

> O Render vai detectar automaticamente a pasta `backend/` se configurar o root directory como `backend`.

### 2.2. Variaveis de Ambiente

Na secao **Environment Variables**, adicione:

| Key | Valor | Descricao |
|-----|-------|-----------|
| `SUPABASE_URL` | `https://seu-projeto.supabase.co` | URL do Supabase |
| `SUPABASE_KEY` | `SUA_CHAVE_ANON` | Chave do Supabase |
| `JWT_SECRET` | `secreta_sige_123` | Segredo JWT (troque em producao) |
| `PORT` | `10000` | Porta que o Render usa |

> Troque o `JWT_SECRET` por um valor forte em producao:
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 2.3. Fazer deploy

- Clique em **Create Web Service**
- O Render vai fazer o build e deploy automaticamente
- Acompanhe os logs para ver se tudo subiu

### 2.4. URL gerada

Apos o deploy, o Render gera uma URL tipo:
```
https://sige-backend.onrender.com
```

---

## 3. Frontend na Vercel

### 3.1. Estrutura do projeto

O frontend tem tres portais em diretorios separados dentro de `frontend-web/`:
```
frontend-web/
  portal-escolar/       # index.html, portal-aluno, historico, documentos, etc.
  portal-secretaria/    # portal-secretaria.html (dentro de portal-escolar)
  portal-inscricao/     # login, inscricao, status, matricula
```

### 3.2. Arquivo vercel.json

O arquivo `vercel.json` na raiz do projeto ja esta configurado:

```json
{
  "version": 2,
  "outputDirectory": "frontend-web",
  "redirects": [
    { "source": "/", "destination": "/portal-escolar/index.html" }
  ]
}
```

### 3.3. Fazer deploy

**Via GitHub (recomendado):**

1. Acesse [https://vercel.com/new](https://vercel.com/new)
2. Importe o repositorio do GitHub
3. Configure no dashboard:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | `Other` |
| **Root Directory** | `./` (raiz do projeto) |
| **Build Command** | (deixar vazio) |
| **Output Directory** | (deixar vazio - o `vercel.json` define) |

4. Clique em **Deploy**

**Via Vercel CLI:**
```bash
npm i -g vercel
vercel --prod
```

### 3.4. Rotas de acesso

| URL | Destino |
|-----|---------|
| `https://sige-iota.vercel.app/` | Portal Escolar (dashboard) |
| `https://sige-iota.vercel.app/portal-escolar/login` | Login do aluno |
| `https://sige-iota.vercel.app/portal-escolar/portal-aluno` | Perfil do aluno |
| `https://sige-iota.vercel.app/portal-escolar/portal-secretaria` | Secretaria |
| `https://sige-iota.vercel.app/portal-inscricao/` | Inscricao em cursos |
| `https://sige-iota.vercel.app/portal-inscricao/status` | Status das inscricoes |

---

## 4. Conectar Frontend com Backend

### 4.1. Metodo 1: Configuracao via Interface

O sistema tem um modal de configuracao. Apos o login:
1. Clique no indicador **API** no canto superior direito
2. Digite a URL do backend: `https://sige-backend.onrender.com`
3. Clique em **Salvar e Testar**

A URL fica salva no `localStorage` do navegador.

### 4.2. Metodo 2: Variavel Global

No arquivo `frontend-web/portal-escolar/assets/js/api-config.js`, adicione:
```javascript
window.API_BASE_URL = 'https://sige-backend.onrender.com/api';
```

### 4.3. Verificar conexao

Acesse a URL do frontend e veja se o indicador de API fica verde.
Teste com as credenciais:

| Email | Senha |
|-------|-------|
| `admin@senai.com` | `admin123` |

---

## 5. Variaveis de Ambiente

### Backend (Render)

| Variavel | Exemplo | Obrigatoria |
|----------|---------|-------------|
| `SUPABASE_URL` | `https://...supabase.co` | Sim |
| `SUPABASE_KEY` | `sb_publishable_...` | Sim |
| `JWT_SECRET` | `secreta_sige_123` | Sim |
| `PORT` | `10000` | Sim (Render define) |

### Frontend (Vercel)

| Variavel | Exemplo | Obrigatoria |
|----------|---------|-------------|
| `API_BASE_URL` | `https://sige-backend.onrender.com/api` | Nao (configuravel via UI) |

### SQL do Supabase

Execute o script SQL no Supabase:
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

### Backend nao inicia no Render
- Veja os logs em **Dashboard > sige-backend > Logs**
- Confirme as variaveis de ambiente

### Erro 404 nas rotas
- O `vercel.json` usa `redirects`, nao `routes`
- Verifique se os caminhos dos arquivos estao corretos

---

## Links Uteis

- [Documentacao Vercel](https://vercel.com/docs)
- [Documentacao Render](https://render.com/docs)
- [Documentacao Supabase](https://supabase.com/docs)

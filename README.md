# SIGE

**Sistema de Gerenciamento de Inscrições e Processo Seletivo Online**

[![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-gray?logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-black?logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-Backend-blue?logo=render)](https://render.com/)

---

## Sobre o Projeto

O **SIGE** é uma plataforma completa para gerenciamento de inscrições e processo seletivo online do SENAI. O sistema permite que alunos se inscrevam em cursos de forma totalmente digital, enquanto a equipe administrativa gerencia todo o processo desde a análise de documentos até a emissão de carteirinhas virtuais.

### Problema Resolvido
- Superlotacao nas unidades para inscricoes presenciais
- Processos manuais demorados para a secretaria
- Falta de transparencia no acompanhamento de status

### Solucao
- Inscricoes 100% online, disponiveis 24/7
- Acompanhamento em tempo real do status
- Portal administrativo completo para a secretaria
- Relatorios e estatisticas automaticas

---

## Funcionalidades Principais

### Alunos
- Cadastro e Login seguro com JWT
- Visualizacao de cursos disponiveis
- Inscricao online com formulario completo
- Acompanhamento de status com timeline visual
- Portal do Aluno com dados pessoais, historico, documentos e frequencia
- Edicao de perfil

### Secretaria (Administradores)
- Portal administrativo completo
- CRUD de Unidades, Cursos, Usuarios e Editais
- Gerenciamento completo de inscricoes (analise, aprovacao, prova, matricula)
- Relatorios e estatisticas
- Filtros avancados

---

## Tecnologias Utilizadas

### Backend
| Tecnologia | Descricao |
|------------|-----------|
| **Node.js** 22 | Runtime |
| **Express** 5.x | Framework HTTP |
| **Supabase** | Banco de dados PostgreSQL + API |
| **JWT** (jsonwebtoken) | Autenticacao |
| **bcryptjs** | Criptografia de senhas |
| **cors** | Controle de acesso CORS |

### Frontend
| Tecnologia | Descricao |
|------------|-----------|
| **HTML5** | Estrutura das paginas |
| **CSS3** | Estilizacao responsiva |
| **JavaScript (Vanilla)** ES6+ | Logica da aplicacao |
| **Notyf** 3.x | Notificacoes toast |
| **Fetch API** | Comunicacao com backend |

### Infraestrutura
| Servico | Uso |
|---------|-----|
| **Vercel** | Hospedagem do frontend |
| **Render** | Hospedagem do backend |
| **Supabase** | Banco de dados PostgreSQL |

---

## Estrutura do Projeto

```
sige/
├── backend/                          # API REST (Node.js + Express)
│   ├── routes/                       # Rotas da API
│   ├── middleware/                   # Middleware de autenticacao
│   ├── server.js                     # Ponto de entrada
│   └── package.json
│
├── frontend-web/                     # Interface Web
│   ├── portal-escolar/               # Portal do Aluno e Secretaria
│   │   ├── index.html                # Dashboard
│   │   ├── portal-aluno.html         # Perfil do aluno
│   │   ├── portal-secretaria.html    # Portal administrativo
│   │   ├── historico-escolar.html    # Historico academico
│   │   ├── meus-documentos.html      # Documentos
│   │   ├── consulta-freq.html        # Frequencia
│   │   ├── agenda-escolar.html       # Agenda
│   │   ├── calendario-escolar.html   # Calendario
│   │   ├── assets/js/scripts.js      # Logica JS
│   │   └── assets/css/app.css        # Estilos
│   │
│   ├── portal-inscricao/             # Portal de Inscricao
│   │   ├── login.html                # Login e cadastro
│   │   ├── index.html                # Cursos disponiveis
│   │   ├── inscricao.html            # Formulario de inscricao
│   │   ├── status.html               # Acompanhamento de status
│   │   ├── matricula.html            # Finalizacao de matricula
│   │   └── assets/js/scripts.js
│   │
│   └── portal-secretaria/            # (direciona para portal-escolar)
│
├── mobile-app/                       # App React Native (em desenvolvimento)
│
├── mock-server/                      # Servidor mock para testes
│
├── scripts/                          # Scripts utilitarios (.bat/.ps1)
│
├── database/                         # Scripts SQL (Supabase)
│   └── supabase-aluno-tables.sql
│
├── docs/                             # Documentacao
│
├── vercel.json                       # Configuracao Vercel
└── README.md
```

---

## Instalacao e Execucao

### Pre-requisitos
- Node.js 22+
- NPM
- Navegador moderno

### 1. Clonar o repositorio
```bash
git clone https://github.com/Wuzuy/sige.git
cd sige
```

### 2. Configurar o Backend
```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/`:
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=SUA_CHAVE_ANON
JWT_SECRET=secreta_sige_123
PORT=8080
```

### 3. Executar o Backend
```bash
cd backend
npm run dev
```
O servidor inicia em `http://localhost:8080`.

### 4. Executar o Frontend

**Opcao A: Live Server (VS Code)**
1. Instale a extensao "Live Server"
2. Clique com direito em `frontend-web/portal-escolar/index.html`
3. Selecione "Open with Live Server"

**Opcao B: Python**
```bash
cd frontend-web
python -m http.server 5500
```

**Opcao C: Node.js**
```bash
cd frontend-web
npx http-server -p 5500
```

### 5. Dados de Teste
O Supabase ja possui dados iniciais. Se precisar recriar, execute o script SQL em `database/supabase-aluno-tables.sql` no SQL Editor do Supabase.

### Credenciais de Teste

| Email | Senha | Role |
|-------|-------|------|
| `admin@senai.com` | `admin123` | ADMIN |
| `joao@email.com` | `123456` | USER |

---

## Endpoints da API

**Base URL:** `http://localhost:8080/api`

| Metodo | Endpoint | Descricao | Auth |
|--------|----------|-----------|------|
| POST | `/usuarios/login` | Login | - |
| POST | `/usuarios` | Cadastro | - |
| POST | `/usuarios/admin` | Criar admin | ADMIN |
| GET | `/usuarios/me` | Dados do usuario | token |
| PUT | `/usuarios/me` | Atualizar perfil | token |
| GET | `/usuarios` | Listar usuarios | ADMIN |
| GET | `/usuarios/{id}` | Buscar usuario | token |
| PUT | `/usuarios/{id}` | Atualizar usuario | ADMIN |
| DELETE | `/usuarios/{id}` | Excluir usuario | ADMIN |
| GET | `/usuarios/count` | Contagem | - |
| GET | `/unidades` | Listar unidades | token |
| POST | `/unidades` | Criar unidade | ADMIN |
| PUT | `/unidades/{id}` | Atualizar unidade | ADMIN |
| DELETE | `/unidades/{id}` | Excluir unidade | ADMIN |
| GET | `/cursos` | Listar cursos | token |
| GET | `/cursos/ativos` | Cursos ativos | - |
| POST | `/cursos` | Criar curso | ADMIN |
| PUT | `/cursos/{id}` | Atualizar curso | ADMIN |
| DELETE | `/cursos/{id}` | Excluir curso | ADMIN |
| GET | `/editais` | Listar editais | - |
| POST | `/editais` | Criar edital | ADMIN |
| PUT | `/editais/{id}` | Atualizar edital | ADMIN |
| DELETE | `/editais/{id}` | Excluir edital | ADMIN |
| GET | `/inscricoes` | Listar inscricoes | ADMIN |
| POST | `/inscricoes` | Criar inscricao | token |
| PUT | `/inscricoes/{id}` | Atualizar inscricao | ADMIN |
| GET | `/aluno/matriculas` | Matriculas do aluno | token |
| GET | `/aluno/historico` | Historico academico | token |
| GET | `/aluno/documentos` | Documentos | token |
| GET | `/aluno/frequencia` | Frequencia | token |
| GET | `/aluno/agenda` | Agenda | token |
| GET | `/aluno/calendario` | Calendario | token |
| GET | `/aluno/horarios` | Quadro de horarios | token |

**Roles:** `ADMIN` = acesso total, `USER` = acesso ao portal do aluno

---

## Documentacao

A documentacao completa esta disponivel em `docs/`:

| Documento | Descricao |
|-----------|-----------|
| `guia-aluno.md` | Manual completo para alunos |
| `guia-secretaria.md` | Manual para administradores |
| `backend-api-reference.md` | Referencia completa da API |
| `deploy-vercel-render.md` | Guia de deploy |
| `frontend-documentacao-tecnica.md` | Documentacao tecnica do frontend |

---

## Seguranca

- Autenticacao via JWT com token de 24h
- Senhas hasheadas com bcryptjs
- Controle de acesso por role (ADMIN/USER)
- Sanitizacao de inputs no frontend
- CORS configurado no backend

---

## Deploy

### Frontend (Vercel)
O frontend esta em `https://sige-iota.vercel.app`. O deploy e automatico via GitHub.

### Backend (Render)
O backend Node.js/Express e hospedado no Render com as variaveis de ambiente:
- `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`, `PORT`

Veja `docs/deploy-vercel-render.md` para instrucoes detalhadas.

---

## Equipe

Projeto desenvolvido para o curso Tecnico de Desenvolvimento de Sistemas na Firjan SENAI Duque de Caxias.

- Turma: TEC00412025.1046
- Orientadora: Ana Carla
- Desenvolvedores:
  - Artur de Paula Santos
  - Joao Felipe da Costa Moreira
  - Joao Miguel Goncalves Coelho
  - Lucas Matheus Lima Sandin
  - Yago Mamud Amorim

---

## Licenca

Projeto academico desenvolvido para o SENAI.

---

**Versao:** 1.0.0
**Status:** Producao
**Ultima Atualizacao:** Junho 2026

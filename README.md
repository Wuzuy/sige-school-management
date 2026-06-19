# SIGE

**Sistema de Inscrição e Gestão Escolar** — Plataforma completa de gestão educacional com portais web, app mobile e backend REST.

[![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-gray?logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)
[![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_54-blue?logo=react)](https://expo.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-black?logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-Backend-blue?logo=render)](https://render.com/)

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Web (Vercel)                    │
│  ┌─────────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Portal Inscrição │  │ Portal Escolar│  │Portal Secretaria│ │
│  │  (8 páginas)     │  │ (14 páginas)  │  │ (SPA, 15 mod.) │ │
│  └────────┬────────┘  └──────┬───────┘  └───────┬─────────┘ │
└───────────┼──────────────────┼──────────────────┼────────────┘
            │                  │                  │
            └──────────────────┼──────────────────┘
                               │ HTTPS
                    ┌──────────▼──────────┐
                    │  Backend (Render)    │
                    │  Express + JWT + RBAC │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Supabase (Postgres) │
                    │  20+ tabelas         │
                    └─────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                Mobile App (Expo / React Native)              │
│                    (alunos — 12 telas)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Portais

### Portal de Inscrição (`/portal-inscricao/`)
Público — candidatos visualizam cursos, inscrevem-se e acompanham status.

| Login | Cursos |
|-------|--------|
| ![Login](docs/printscreens/portal-inscricao-login.png) | ![Cursos](docs/printscreens/portal-inscricao-cursos.png) |
| **Inscrição** | **Matrícula** |
| ![Inscrição](docs/printscreens/portal-inscricao-inscricao.png) | ![Matrícula](docs/printscreens/portal-inscricao-matricula.png) |
| **Status** | **Créditos** |
| ![Status](docs/printscreens/portal-inscricao-status.png) | ![Créditos](docs/printscreens/portal-inscricao-credits.png) |

### Portal Escolar (`/portal-escolar/`)
Alunos matriculados — notas, frequência, horários, documentos, reclamações.

| Dashboard | Perfil |
|-----------|--------|
| ![Dashboard](docs/printscreens/portal-escolar-dashboard.png) | ![Perfil](docs/printscreens/portal-escolar-perfil.png) |
| **Histórico** | **Estrutura Curricular** |
| ![Histórico](docs/printscreens/portal-escolar-historico.png) | ![Estrutura](docs/printscreens/portal-escolar-estrutura-curricular.png) |
| **Frequência** | **Calendário** |
| ![Frequência](docs/printscreens/portal-escolar-frequencia.png) | ![Calendário](docs/printscreens/portal-escolar-calendario.png) |
| **Horários** | **Agenda** |
| ![Horários](docs/printscreens/portal-escolar-horarios.png) | ![Agenda](docs/printscreens/portal-escolar-agenda.png) |
| **Atendimento** | **Documentos** |
| ![Atendimento](docs/printscreens/portal-escolar-atendimento.png) | ![Documentos](docs/printscreens/portal-escolar-documentos.png) |
| **Reclamações** | **Ouvidoria** |
| ![Reclamações](docs/printscreens/portal-escolar-reclamacoes.png) | ![Ouvidoria](docs/printscreens/portal-escolar-ouvidoria.png) |

### Portal da Secretaria (`/portal-secretaria/`)
SPA administrativa com modos **Inscrições** e **Alunos**.

#### Modo Inscrições

| Dashboard | Inscrições |
|-----------|------------|
| ![Dashboard](docs/printscreens/portal-secretaria-dashboard-inscricoes.png) | ![Inscrições](docs/printscreens/portal-secretaria-inscricoes.png) |
| **Cursos** | **Unidades** |
| ![Cursos](docs/printscreens/portal-secretaria-cursos.png) | ![Unidades](docs/printscreens/portal-secretaria-unidades.png) |
| **Editais** | **Turmas** |
| ![Editais](docs/printscreens/portal-secretaria-editais.png) | ![Turmas](docs/printscreens/portal-secretaria-turmas.png) |
| **Cargos/Permissões** | **Relatórios** |
| ![Cargos](docs/printscreens/portal-secretaria-cargos.png) | ![Relatórios](docs/printscreens/portal-secretaria-relatorios-inscricoes.png) |

#### Modo Alunos

| Dashboard | Alunos |
|-----------|--------|
| ![Dashboard](docs/printscreens/portal-secretaria-dashboard-alunos.png) | ![Alunos](docs/printscreens/portal-secretaria-alunos.png) |
| **Usuários** | **Reclamações** |
| ![Usuários](docs/printscreens/portal-secretaria-usuarios.png) | ![Reclamações](docs/printscreens/portal-secretaria-reclamacoes.png) |
| **Relatórios** | |
| ![Relatórios](docs/printscreens/portal-secretaria-relatorios-alunos.png) | |

#### Sistema

| Auditoria | Configurações |
|-----------|---------------|
| ![Auditoria](docs/printscreens/portal-secretaria-auditoria.png) | ![Configurações](docs/printscreens/portal-secretaria-configuracoes.png) |

---

## Mobile App (`/mobile-app/`)

React Native (Expo SDK 54) com Expo Router v6 — 12 telas para alunos.

| Tela | Descrição |
|------|-----------|
| Login | Autenticação JWT com AsyncStorage |
| Home | Dados do aluno, curso, unidade + QR Code |
| QR Code | Geração dinâmica + câmera para validação de acesso |
| Notas | Notas por disciplina com modal de detalhes |
| Frequência | Presença por disciplina com percentual |
| Horários | Grade semanal |
| Documentos | Lista de documentos com status |
| Reclamações | Lista + formulário de nova reclamação |
| Calendário | Eventos filtrados por tipo (FERIADO, PROVA, EVENTO) |
| Agenda | Agendamento com tipo, data e horário |
| Histórico | Disciplinas concluídas |
| Suporte | FAQ expansível + contato |
| Conta | Perfil + logout |

---

## Tecnologias

### Backend
| Tecnologia | Descrição |
|------------|-----------|
| **Node.js** 22 | Runtime |
| **Express** 5.x | Framework HTTP |
| **Supabase** | PostgreSQL + API |
| **JWT** (jsonwebtoken) | Autenticação |
| **bcryptjs** | Criptografia de senhas |
| **cors** | Controle de acesso CORS |

### Frontend Web
| Tecnologia | Descrição |
|------------|-----------|
| **HTML5** | Estrutura das páginas |
| **CSS3** | Estilização responsiva |
| **JavaScript (Vanilla)** ES6+ | Lógica da aplicação |
| **Notyf** 3.x | Notificações toast |
| **Chart.js** 4.4.7 | Gráficos (Secretaria) |
| **Fetch API** | Comunicação com backend |

### Mobile
| Tecnologia | Descrição |
|------------|-----------|
| **React Native** (Expo SDK 54) | Framework mobile |
| **Expo Router** v6 | Roteamento file-based |
| **TypeScript** | Tipagem |
| **AsyncStorage** | Armazenamento local |

---

## Estrutura do Projeto

```
sige/
├── backend/                              # API REST (Node.js + Express)
│   ├── routes/                           # 10 arquivos de rota
│   │   ├── usuarios.js                   # Login, CRUD de usuários
│   │   ├── cursos.js                     # CRUD de cursos
│   │   ├── unidades.js                   # CRUD de unidades
│   │   ├── editais.js                    # CRUD de editais
│   │   ├── turmas.js                     # CRUD de turmas
│   │   ├── inscricoes.js                # Inscrições + matrícula
│   │   ├── alunos.js                     # Admin: visão de alunos
│   │   ├── aluno.js                      # Student self-service
│   │   ├── cargos.js                     # RBAC (cargos + permissões)
│   │   └── auth-codigo.js               # Validação QR code
│   ├── middleware/auth.js                # requireAuth, requireRole, requirePermissao
│   ├── config/supabase.js                # Cliente Supabase
│   ├── server.js                         # Entry point
│   └── package.json
│
├── mobile-app/                           # React Native (Expo)
│   ├── app/                              # Telas (file-based routing)
│   │   ├── (tabs)/                       # Abas principais
│   │   ├── (stack)/                      # Telas modais/detalhes
│   │   ├── api.ts                        # Wrapper da API
│   │   └── auth.tsx                      # AuthContext
│   ├── app.json
│   ├── eas.json
│   └── package.json
│
├── frontend-web/                         # Interface Web
│   ├── portal-inscricao/                 # 8 páginas (público)
│   │   ├── login.html, index.html, inscricao.html
│   │   ├── matricula.html, status.html
│   │   ├── forgot-password.html, reset-password.html
│   │   ├── credits.html
│   │   └── assets/js/scripts.js          # Lógica compartilhada
│   │
│   ├── portal-escolar/                   # 14 páginas (alunos)
│   │   ├── index.html                    # Dashboard
│   │   ├── conta.html                    # Perfil
│   │   ├── historico-escolar.html        # Histórico
│   │   ├── estrutura-curricular.html     # Grade curricular
│   │   ├── consulta-freq.html            # Frequência
│   │   ├── calendario-escolar.html       # Calendário
│   │   ├── quadro-horarios.html          # Horários
│   │   ├── agenda-escolar.html           # Agenda
│   │   ├── atendimento-agendado.html     # Atendimentos
│   │   ├── meus-documentos.html          # Documentos
│   │   ├── reclamacoes.html              # Reclamações
│   │   ├── ouvidoria.html                # Nova reclamação
│   │   ├── detalhes-reclamacao.html      # Detalhe reclamação
│   │   ├── forgot-password.html
│   │   ├── credits.html
│   │   ├── teste-api.html
│   │   └── assets/
│   │       ├── js/scripts.js             # Lógica compartilhada (2.6k linhas)
│   │       ├── js/sidebar-nav.js          # Navegação sidebar
│   │       ├── js/api-config.js           # Configuração de API
│   │       ├── css/app.css               # Estilos globais
│   │       └── css/sidebar.css           # Estilos sidebar
│   │
│   ├── portal-secretaria/                # SPA administrativa
│   │   ├── portal-secretaria.html        # 1 arquivo, todos os módulos
│   │   └── arquivos/
│   │       ├── portal-secretaria.js      # Lógica (~27K linhas)
│   │       └── portal-secretaria.css     # Estilos (~1.5K linhas)
│   │
│   └── assets/ (compartilhado)
│
├── database/                             # Scripts SQL
│   ├── schema-completo.sql               # DROP + CREATE + SEED (20 tabelas)
│   └── supabase-cargos-permissoes.sql    # Migração RBAC
│
├── docs/                                 # Documentação
│   ├── readme.md                         # Documentação completa
│   ├── printscreens/                     # Screenshots (34 telas)
│   ├── diagrama-classes.excalidraw       # Diagrama ER
│   └── postman/                          # Coleção Postman
│
└── README.md
```

---

## Credenciais de Teste

| Email | Senha | Role |
|-------|-------|------|
| `admin@sige.edu.br` | `Sige123@` | Admin Master |
| `amanda.azevedo.aluno115@sige.edu.br` | `Sige123@` | Aluno |

---

## Endpoints da API

**Base URL:** `https://sige-1gqx.onrender.com/api`

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/usuarios/login` | Login (email + senha) |
| POST | `/usuarios` | Cadastro |
| POST | `/usuarios/recuperar-senha` | Recuperação de senha |
| POST | `/usuarios/redefinir-senha` | Redefinição de senha |

### Usuários (Admin)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/usuarios` | Listar todos |
| GET | `/usuarios/:id` | Buscar por ID |
| POST | `/usuarios/admin` | Criar admin |
| PUT | `/usuarios/:id` | Atualizar |
| DELETE | `/usuarios/:id` | Excluir |

### Cursos / Unidades / Editais / Turmas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/cursos` | Listar cursos |
| GET | `/cursos/ativos` | Cursos ativos (público) |
| POST/PUT/DELETE | `/cursos/:id` | CRUD curso |
| GET/POST/PUT/DELETE | `/unidades/:id` | CRUD unidade |
| GET/POST/PUT/DELETE | `/editais/:id` | CRUD edital |
| GET/POST/PUT/DELETE | `/turmas/:id` | CRUD turma |

### Inscrições
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/inscricoes` | Listar (admin) |
| POST | `/inscricoes` | Criar inscrição |
| PUT | `/inscricoes/:id` | Atualizar |
| PUT | `/inscricoes/:id/aprovar` | Aprovar/reprovar |
| POST | `/inscricoes/:id/matricula` | Aceitar matrícula |
| GET | `/inscricoes/minhas` | Minhas inscrições |

### Aluno (self-service)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/aluno/notas` | Notas |
| GET | `/aluno/frequencias` | Frequência |
| GET | `/aluno/horarios` | Horários |
| GET | `/aluno/documentos` | Documentos |
| GET | `/aluno/reclamacoes` | Reclamações |
| POST | `/aluno/reclamacoes` | Nova reclamação |
| GET | `/aluno/agenda` | Agenda |
| GET | `/aluno/historico` | Histórico escolar |
| GET | `/aluno/atendimentos` | Atendimentos |
| GET | `/aluno/matriculas` | Matrículas |

### Admin (Alunos)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/alunos` | Listar alunos |
| GET | `/alunos/:id` | Detalhes do aluno |
| PUT | `/alunos/:id` | Editar aluno |

### RBAC (Cargos/Permissões)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET/POST | `/cargos` | Listar/criar cargos |
| GET/PUT/DELETE | `/cargos/:id` | CRUD cargo |
| GET | `/cargos/permissoes/all` | Catálogo de permissões |
| POST | `/cargos/permissoes` | Vincular permissão |
| GET | `/cargos/:id/permissoes` | Permissões do cargo |
| DELETE | `/cargos/permissoes/:id` | Remover permissão |

### QR Code / Acesso
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/codigo` | Validar QR code (gate) |

---

## Instalação Local

```bash
# Backend
cd backend
npm install
# Configure .env com SUPABASE_URL, SUPABASE_KEY, PORT=8080
npm start

# Frontend
cd frontend-web
npx http-server -p 3000
# Acesse http://localhost:3000

# Mobile
cd mobile-app
npm install
npx expo start
```

Para usar o backend de produção localmente:
```js
localStorage.setItem('API_BASE_URL', 'https://sige-1gqx.onrender.com/api');
```

---

## Deploy

- **Frontend:** Vercel (deploy automático via GitHub)
- **Backend:** Render (Express, porta 8080)
- **Mobile:** Expo (EAS Build)
- **Database:** Supabase

---

## Equipe

Projeto desenvolvido para o curso Técnico de Desenvolvimento de Sistemas na Firjan SENAI Duque de Caxias.

- **Turma:** TEC00412025.1046
- **Orientadora:** Ana Carla
- **Desenvolvedores:**
  - Artur de Paula Santos
  - João Felipe da Costa Moreira
  - João Miguel Gonçalves Coelho
  - Lucas Matheus Lima Sandin
  - Yago Mamud Amorim

---

**Versão:** 2.0.0 · **Status:** Produção · **Última Atualização:** Junho 2026

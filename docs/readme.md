# SIGE — Sistema de Inscrição e Gestão Escolar

Plataforma completa de gestão educacional com três portais web (Inscrição, Escolar, Secretaria), aplicativo mobile (React Native) e backend REST (Express + Supabase).

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

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend Web | HTML5, CSS3, Vanilla JavaScript |
| Mobile | React Native (Expo SDK 54), TypeScript, Expo Router v6 |
| Backend | Node.js 22, Express 5, JWT (bcryptjs) |
| Database | PostgreSQL (Supabase) |
| Deploy | Frontend: Vercel · Backend: Render · DB: Supabase |
| Bibliotecas | Chart.js 4.4.7, Notyf 3, QRCode.js |

### Papéis (RBAC)

| Role | Acesso |
|------|--------|
| `ROLE_ADMIN` (Admin Master) | Total — todos os módulos da Secretaria |
| `ROLE_STUDENT` | Portal Escolar + Mobile |
| `ROLE_USER` | Portal Inscrição (cursos, inscrição) |
| Admin / Secretaria / Professor | Permissões granulares via Cargos |

---

## Portais Web

### 1. Portal de Inscrição (`/portal-inscricao/`)

Público — candidatos visualizam cursos, inscrevem-se, acompanham status.

| Tela | Descrição |
|------|-----------|
| Login | Autenticação unificada (Login/Cadastro), editais publicados, "Entrar como Visitante" |
| Cursos | Lista de cursos disponíveis com filtros por unidade, turno, status |
| Inscrição | Formulário de inscrição em curso específico (dados pessoais + escolaridade) |
| Matrícula | Aceite de contrato/termos após aprovação da inscrição |
| Status | Acompanhamento de todas as inscrições do usuário com timeline |
| Recuperar Senha | Formulário de e-mail para redefinição de senha |
| Creditos | Informações da stack tecnológica e créditos |

### 2. Portal Escolar (`/portal-escolar/`)

Alunos matriculados — acompanhamento acadêmico completo.

| Tela | Descrição |
|------|-----------|
| Dashboard | Home com cards de acesso rápido (Agenda, Calendário, Perfil, Histórico) |
| Meu Perfil | Foto, dados pessoais, informações acadêmicas, edição de senha |
| Notas | Boletim por disciplina com média, frequência e status |
| Frequência | Percentual de presença por disciplina |
| Horários | Grade semanal com disciplinas, horários e professores |
| Documentos | Documentos disponíveis para download com status |
| Reclamações | Lista de reclamações com protocolo, status e detalhes |
| Ouvidoria | Formulário de nova reclamação (categoria, assunto, mensagem) |
| Calendário | Eventos escolares (feriados, provas, eventos) |
| Agenda | Compromissos agendados |
| Histórico | Disciplinas concluídas com notas finais |
| Atendimento | Agendamento e acompanhamento de atendimentos |
| Estrutura Curricular | Grade curricular por semestre com progresso |

### 3. Portal da Secretaria (`/portal-secretaria/`)

SPA administrativa — dois modos: **Inscrições** e **Alunos**.

#### Modo Inscrições

| Módulo | Descrição |
|--------|-----------|
| Dashboard | KPIs (total, taxa aprovação, pendências), gráficos (evolução, status, por curso, funil), filtros |
| Inscrições | Lista de candidatos com detalhes, aprovação/reprovação, gestão de matrícula |
| Cursos | CRUD de cursos (nome, unidade, tipo, turno, vagas) |
| Unidades | CRUD de unidades escolares (nome, CNPJ, endereço) |
| Editais | CRUD de editais publicados (título, URL, ativo/inativo) |
| Turmas | CRUD de turmas (nome, curso, turno, vagas, ano) |
| Relatórios | Relatório exportável (CSV/PDF) com filtros e sumários |
| Cargos/Permissões | RBAC: criação de cargos, permissões granulares por módulo |

#### Modo Alunos

| Módulo | Descrição |
|--------|-----------|
| Dashboard | KPIs (total alunos, ativos, trancados, concluídos), gráficos |
| Alunos | Lista de alunos com detalhes (documentos, reclamações, atendimentos, histórico) |
| Usuários | CRUD de usuários do sistema (nome, email, perfil) |
| Reclamações | Gestão de reclamações com resposta e alteração de status |
| Relatórios | Relatório exportável de alunos |

#### Sistema

| Módulo | Descrição |
|--------|-----------|
| Auditoria | Log de ações (localStorage), filtros por tipo, exportação CSV |
| Configurações | Dark mode, tamanho da fonte |

---

## Mobile App (`/mobile-app/`)

React Native (Expo SDK 54) com Expo Router v6 (file-based routing).

| Tela | Descrição |
|------|-----------|
| Login | Autenticação JWT com AsyncStorage |
| Home | Dados do aluno, curso, unidade, matrícula + QR Code |
| QR Code | Geração dinâmica + câmera para validação de acesso (`/auth/codigo`) |
| Notas | Notas por disciplina com modal de detalhes |
| Frequência | Presença por disciplina com percentual |
| Horários | Grade semanal |
| Documentos | Lista de documentos com status e detalhes |
| Reclamações | Lista + formulário de nova reclamação |
| Calendário | Eventos filtrados por tipo |
| Agenda | Agendamento com tipo, data e horário |
| Histórico | Disciplinas concluídas |
| Suporte | FAQ expansível + contato |
| Conta | Perfil + logout |

---

## Backend (`/backend/`)

Express + Supabase + JWT. 10 arquivos de rota.

| Rota | Descrição |
|------|-----------|
| `POST /api/usuarios/login` | Login (retorna JWT) |
| `GET/POST /api/usuarios` | Listar / criar usuários |
| `GET/PUT/DELETE /api/usuarios/:id` | CRUD de usuário |
| `GET/POST/PUT/DELETE /api/cursos/:id` | CRUD de cursos |
| `GET/POST/PUT/DELETE /api/unidades/:id` | CRUD de unidades |
| `GET/POST/PUT/DELETE /api/editais/:id` | CRUD de editais |
| `GET/POST/PUT/DELETE /api/turmas/:id` | CRUD de turmas |
| `POST /api/inscricoes` | Criar inscrição |
| `GET /api/inscricoes` | Listar inscrições (admin) |
| `PUT /api/inscricoes/:id/aprovar` | Aprovar/reprovar inscrição |
| `POST /api/inscricoes/:id/matricula` | Aceitar matrícula |
| `GET /api/inscricoes/minhas` | Inscrições do usuário logado |
| `GET /api/alunos` | Listar alunos (admin) |
| `GET /api/alunos/:id` | Detalhes do aluno |
| `PUT /api/alunos/:id` | Editar aluno |
| `GET /api/aluno/notas` | Notas do aluno logado |
| `GET /api/aluno/frequencias` | Frequência do aluno logado |
| `GET /api/aluno/horarios` | Horários do aluno logado |
| `GET /api/aluno/documentos` | Documentos do aluno logado |
| `GET/POST /api/aluno/reclamacoes` | CRUD de reclamações |
| `GET /api/aluno/agenda` | Agenda do aluno |
| `GET /api/aluno/historico` | Histórico escolar |
| `GET /api/aluno/atendimentos` | Atendimentos agendados |
| `GET /api/aluno/matriculas` | Matrículas do aluno |
| `POST /api/auth/codigo` | Validar QR code (gate) |
| `GET/POST/PUT/DELETE /api/cargos` | CRUD de cargos |
| `GET /api/cargos/permissoes/all` | Catálogo de permissões |
| `POST /api/cargos/permissoes` | Vincular permissão a cargo |

### Middleware

- `requireAuth` — verifica JWT
- `requireRole(role)` — verifica role específica
- `requireAdminMaster` — apenas Admin Master (id_cargo === 1)
- `requirePermissao(codigo)` — verifica permissão específica via RBAC

---

## Screenshots

### Portal de Inscrição

| Login | Cursos |
|-------|--------|
| ![Login](printscreens/portal-inscricao-login.png) | ![Cursos](printscreens/portal-inscricao-cursos.png) |
| **Inscrição** | **Matrícula** |
| ![Inscrição](printscreens/portal-inscricao-inscricao.png) | ![Matrícula](printscreens/portal-inscricao-matricula.png) |
| **Status** | **Recuperar Senha** |
| ![Status](printscreens/portal-inscricao-status.png) | ![Forgot Password](printscreens/portal-inscricao-forgot-password.png) |
| **Créditos** | |
| ![Créditos](printscreens/portal-inscricao-credits.png) | |

### Portal Escolar

| Dashboard | Perfil |
|-----------|--------|
| ![Dashboard](printscreens/portal-escolar-dashboard.png) | ![Perfil](printscreens/portal-escolar-perfil.png) |
| **Histórico** | **Estrutura Curricular** |
| ![Histórico](printscreens/portal-escolar-historico.png) | ![Estrutura](printscreens/portal-escolar-estrutura-curricular.png) |
| **Frequência** | **Calendário** |
| ![Frequência](printscreens/portal-escolar-frequencia.png) | ![Calendário](printscreens/portal-escolar-calendario.png) |
| **Horários** | **Agenda** |
| ![Horários](printscreens/portal-escolar-horarios.png) | ![Agenda](printscreens/portal-escolar-agenda.png) |
| **Atendimento** | **Documentos** |
| ![Atendimento](printscreens/portal-escolar-atendimento.png) | ![Documentos](printscreens/portal-escolar-documentos.png) |
| **Reclamações** | **Ouvidoria** |
| ![Reclamações](printscreens/portal-escolar-reclamacoes.png) | ![Ouvidoria](printscreens/portal-escolar-ouvidoria.png) |

### Portal da Secretaria

#### Modo Inscrições

| Dashboard | Inscrições |
|-----------|------------|
| ![Dashboard](printscreens/portal-secretaria-dashboard-inscricoes.png) | ![Inscrições](printscreens/portal-secretaria-inscricoes.png) |
| **Cursos** | **Unidades** |
| ![Cursos](printscreens/portal-secretaria-cursos.png) | ![Unidades](printscreens/portal-secretaria-unidades.png) |
| **Editais** | **Turmas** |
| ![Editais](printscreens/portal-secretaria-editais.png) | ![Turmas](printscreens/portal-secretaria-turmas.png) |
| **Cargos/Permissões** | **Relatórios** |
| ![Cargos](printscreens/portal-secretaria-cargos.png) | ![Relatórios](printscreens/portal-secretaria-relatorios-inscricoes.png) |

#### Modo Alunos

| Dashboard | Alunos |
|-----------|--------|
| ![Dashboard](printscreens/portal-secretaria-dashboard-alunos.png) | ![Alunos](printscreens/portal-secretaria-alunos.png) |
| **Usuários** | **Reclamações** |
| ![Usuários](printscreens/portal-secretaria-usuarios.png) | ![Reclamações](printscreens/portal-secretaria-reclamacoes.png) |
| **Relatórios** | |
| ![Relatórios](printscreens/portal-secretaria-relatorios-alunos.png) | |

#### Sistema

| Auditoria | Configurações |
|-----------|---------------|
| ![Auditoria](printscreens/portal-secretaria-auditoria.png) | ![Configurações](printscreens/portal-secretaria-configuracoes.png) |

---

## Database

20 tabelas no PostgreSQL (Supabase). Schema completo em `database/schema-completo.sql`.

**Tabelas principais:** usuarios, alunos, unidades, cursos, turmas, disciplinas, inscricoes, matriculas, documentos, reclamacoes, cargos, permissoes, cargos_permissoes, editais, eventos, atendimentos, etc.

**Seed:** Admin Master (`admin@sige.edu.br` / `Sige123@`), 5 unidades, 10 cursos, 20 turmas, 30 staff, 200 alunos, 200 inscrições, 80 matrículas.

---

## Deploy

- **Frontend:** Vercel (3 portais)
- **Backend:** Render (Express na porta 8080)
- **Mobile:** Expo (EAS Build)
- **Database:** Supabase

### Variáveis de Ambiente (Backend)

```
PORT=8080
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon
```

---

## Desenvolvimento Local

```bash
# Backend
cd backend
npm install
cp .env.example .env  # configurar SUPABASE_URL e SUPABASE_KEY
npm start

# Mobile
cd mobile-app
npm install
npx expo start

# Frontend (servidor HTTP simples)
cd frontend-web
npx http-server -p 3000
```

Para testar localmente com o backend Render, configure no navegador:
```js
localStorage.setItem('API_BASE_URL', 'https://sige-1gqx.onrender.com/api');
```

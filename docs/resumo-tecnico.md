# Resumo Técnico — SIGE

Sistema de Inscrição e Gestão Escolar

---

## 1. Arquitetura Geral

```
┌─────────────────────────────────────────────────────┐
│                    Clientes                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ Web      │  │ Web      │  │ Mobile App       │   │
│  │ (Vanilla │  │ (Vanilla │  │ (React Native    │   │
│  │  JS)     │  │  JS)     │  │  Expo SDK 54)    │   │
│  └────┬─────┘  └────┬─────┘  └───────┬──────────┘   │
│       │             │                │              │
│       └─────────────┴────────────────┘              │
│                         │ HTTP REST                 │
│                         ▼                           │
│              ┌─────────────────────┐                │
│              │  Express 5 API      │                │
│              │  (Node.js 22)       │                │
│              │  Porta 8080         │                │
│              └─────────┬───────────┘                │
│                        │ Supabase JS Client          │
│                        ▼                            │
│              ┌─────────────────────┐                │
│              │  Supabase           │                │
│              │  (PostgreSQL 15+)   │                │
│              └─────────────────────┘                │
└─────────────────────────────────────────────────────┘
```

**Estilo arquitetural:** REST API monolítica (backend) + múltiplos frontends estáticos (web) + app nativo (mobile). Sem microsserviços. Sem filas de mensageria. Cache via JWT stateless.

---

## 2. Stack Detalhado

### Backend (`backend/`)
| Componente | Especificação |
|------------|--------------|
| Runtime | Node.js 22 LTS |
| Framework | Express 5.x (`^5.2.1`) |
| Autenticação | JWT (`jsonwebtoken` + `bcryptjs`) |
| Banco | Supabase (PostgreSQL via `@supabase/supabase-js`) |
| Porta | 8080 (configurável via `PORT`) |

### Frontend Web (`frontend-web/`)
| Componente | Especificação |
|------------|--------------|
| HTML | HTML5 semântico |
| CSS | CSS3 responsivo (Flexbox/Grid), sem framework |
| JS | Vanilla ES6+, sem biblioteca de UI |
| Charts | Chart.js 4.4.7 (secretaria) |
| Notificações | Notyf 3 |
| Ícones | Font Awesome 6.5.1 |
| Servidor dev | Python http.server ou npx http-server |

### Mobile App (`mobile-app/`)
| Componente | Especificação |
|------------|--------------|
| Framework | React Native 0.81.5 |
| SDK | Expo 54 |
| Roteamento | Expo Router v6 (file-based) |
| Navegação | @react-navigation/bottom-tabs v7 |
| QR Code | react-native-qrcode-svg |
| Câmera | expo-camera 17 |
| Armazenamento | In-memory (AsyncStorage não usado) |

### Database
| Componente | Especificação |
|------------|--------------|
| Tipo | PostgreSQL 15+ |
| Hospedagem | Supabase (cloud) |
| Tabelas | 24 |
| Migrações | SQL manual via Supabase SQL Editor |
| RBAC | Custom (tabelas cargos + permissoes + cargos_permissoes) |

---

## 3. API REST — Endpoints

### Públicos (sem auth)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/usuarios/login` | Login (email + senha → JWT) |
| POST | `/api/usuarios` | Registrar novo usuário |
| GET | `/api/cursos` | Listar cursos ativos |
| GET | `/api/cursos/:id` | Detalhes do curso |
| GET | `/api/unidades` | Listar unidades |
| GET | `/api/editais` | Listar editais ativos |

### Autenticados (JWT obrigatório)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/usuarios/me` | Dados do usuário logado |
| PUT | `/api/usuarios/me` | Atualizar próprio perfil |
| GET | `/api/aluno/matriculas` | Matrículas do aluno |
| GET | `/api/aluno/historico` | Histórico escolar |
| GET | `/api/aluno/notas` | Notas por disciplina |
| GET | `/api/aluno/frequencia` | Frequência |
| GET | `/api/aluno/horarios` | Quadro de horários |
| GET | `/api/aluno/documentos` | Documentos |
| GET | `/api/aluno/financeiro` | Financeiro |
| GET | `/api/aluno/agenda` | Agenda/eventos |
| GET | `/api/aluno/curriculo` | Estrutura curricular |
| GET | `/api/aluno/calendario` | Calendário acadêmico |
| POST | `/api/aluno/reclamacoes` | Abrir reclamação |
| GET | `/api/aluno/atendimentos` | Agendamentos |
| POST | `/api/professor/notas` | Lançar notas |
| POST | `/api/professor/frequencia` | Lançar frequência |
| GET | `/api/professor/turmas` | Turmas do professor |

### Administrativos (permissão específica)
| Método | Rota | Descrição |
|--------|------|-----------|
| CRUD | `/api/alunos` | Gerenciar alunos |
| PUT | `/api/inscricoes/:id` | Aprovar/reprovar inscrição |
| CRUD | `/api/turmas` | Gerenciar turmas |
| CRUD | `/api/disciplinas` | Gerenciar disciplinas |
| CRUD | `/api/cargos` | Gerenciar cargos + permissões |
| CRUD | `/api/portais` | Feature flags |
| GET | `/api/auditoria` | Log de auditoria |

---

## 4. Modelo de Dados — Relacionamentos Principais

```
usuarios (1) ────── (N) inscricoes (N) ────── (1) cursos
    │                                            │
    │                                            │
    └── (N) matriculas (N) ──────────────── (1) ─┘
              │
              ├── (N) historico_escolar (N) ── (1) disciplinas
              │                                  │
              ├── (N) frequencia ────────── (N) ──┘
              │
              └── (N) financeiro

cursos (1) ── (N) disciplinas
cursos (1) ── (N) turmas
turmas (1) ── (N) horarios ── (N) disciplinas
                            └── (N) usuarios (professores)
```

---

## 5. Segurança

| Aspecto | Implementação |
|---------|--------------|
| Senhas | bcryptjs, 10 salt rounds |
| Sessão | JWT com expiração de 24h |
| Autorização | RBAC granular (58+ permissões em 6 cargos) |
| Feature flags | Tabela `portais` permite desativar portal inteiro |
| CORS | Liberado (cors()) — projeto didático |
| SQL Injection | Prevenido pelo Supabase JS Client (parameterized queries) |
| XSS | Sem proteção específica (projeto didático — recomenda-se sanitização em produção) |
| HTTPS | Via infraestrutura (Vercel/Render) |

---

## 6. Performance e Limitações

| Aspecto | Detalhe |
|---------|---------|
| Cache | Nenhum (cada requisição vai ao banco) |
| Paginação | Implementada em listas (inscrições, alunos, etc.) — via `.range()` do Supabase |
| Limitação Supabase | Plano gratuito: 500 MB banco, 5 GB bandwidth, 2 dias backup |
| File upload | URLs textuais — arquivos não são servidos pelo backend |
| Concorrência | Sem locks — risco de race condition em escrita simultânea (didático) |

---

## 7. Estrutura de Diretórios (completa)

```
sige/
├── backend/
│   ├── routes/              # 16 arquivos de rota
│   │   ├── aluno.js         # Auto-serviço do aluno
│   │   ├── alunos.js        # Admin: gerenciar alunos
│   │   ├── inscricoes.js    # Matrículas/candidaturas
│   │   ├── professor.js     # Notas, frequência
│   │   ├── cursos.js        # CRUD cursos
│   │   ├── turmas.js        # CRUD turmas
│   │   ├── disciplinas.js   # CRUD disciplinas
│   │   ├── cargos.js        # RBAC
│   │   ├── usuarios.js      # Login, registro, perfil
│   │   └── ...              # + 7 arquivos
│   ├── middleware/
│   │   └── auth.js          # requireAuth, requirePermissao, requirePortalAtivo
│   ├── config/
│   │   └── supabase.js      # Cliente Supabase
│   └── server.js            # Entry point
│
├── frontend-web/
│   ├── portal-inscricao/    # 8 páginas
│   ├── portal-escolar/      # 19 páginas
│   ├── portal-professor/    # 1 SPA
│   ├── portal-secretaria/   # 1 SPA
│   └── assets/              # CSS, imagens, JS
│
├── mobile-app/
│   ├── app/                 # Telas (file-based routing)
│   │   ├── (tabs)/          # Abas inferiores
│   │   ├── _layout.tsx      # Layout root
│   │   ├── index.tsx        # Login
│   │   └── *.tsx            # 12+ telas
│   ├── services/
│   │   └── api.ts           # Cliente HTTP + auth
│   ├── contexts/
│   │   └── AuthContext.tsx   # Estado de autenticação
│   └── app.json             # Config Expo
│
├── database/
│   ├── schema.sql           # DDL completo (24 tabelas)
│   ├── seed-institucional.sql # Dados realistas (~4000 linhas)
│   └── *.sql                # Migrações individuais
│
└── docs/                    # Documentação e screenshots
```

---

## 8. Fluxo de Dados — Exemplo Completo

### Aluno vê o histórico escolar

```
1. Aluno abre /portal-escolar/historico-escolar.html
2. Página carrega → initHistoricoPage() em scripts.js
3. Fetch GET /api/aluno/historico
   Header: Authorization: Bearer <JWT>
4. Backend:
   a. requireAuth → extrai JWT → { id: 54 }
   b. requirePermissao('portal.escolar') → ok
   c. Route handler:
      supabase.from('matriculas')
        .select('id')
        .eq('id_usuario', 54)
      → [ { id: 31 } ]
      supabase.from('historico_escolar')
        .select('*, id_disciplina(*)')
        .eq('id_matricula', 31)
      → [ { nota: 8.5, disciplina: 'Programacao Web' }, ... ]
5. Frontend renderiza tabela com notas por disciplina
```

---

## 9. Conceitos-Chave para Entrevista

| Conceito | Explicação |
|----------|-----------|
| **JWT** | JSON Web Token. Token stateless com payload `{ id, role, cargo, permissoes }`. Assinado com HMAC-SHA256. Não exposto ao cliente além do necessário. |
| **bcrypt** | Algoritmo de hash de senha com salt embutido. 10 rounds = ~10ms por hash. Resiste a ataques de rainbow table e brute-force. |
| **RBAC** | Role-Based Access Control. Permissões agrupadas em cargos. Cargos atribuídos a usuários. Admin Master bypassa todas as verificações. |
| **Expo Router** | File-based routing para React Native. Similar a Next.js. Cada `app/*.tsx` vira uma rota automaticamente. |
| **Supabase** | BaaS open-source. Fornece PostgreSQL gerenciado + API REST + Auth + Storage. Usado apenas como cliente de banco neste projeto. |
| **Express 5** | Suporte nativo a async/await em middlewares. `app.use(async (req, res, next) => { ... })` sem try-catch manual. |
| **CORS** | Cross-Origin Resource Sharing. Middleware `cors()` permite requisições de qualquer origem (didático). |
| **REST** | Representational State Transfer. API stateless baseada em recursos. Verbos HTTP: GET (ler), POST (criar), PUT (atualizar), DELETE (remover). |

---

## 10. Contato / Servidores

| Recurso | URL |
|---------|-----|
| Backend (produção) | `https://sige-1gqx.onrender.com` |
| Backend (proxy) | `https://seu-backend.exemplo.com` |
| Supabase Dashboard | `https://supabase.com/dashboard/project/seu-projeto` |
| Frontend (Vercel) | Auto-deploy do GitHub |
| Repositório | GitHub (branch principal) |

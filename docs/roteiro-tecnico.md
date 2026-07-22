# Roteiro Técnico — SIGE

Guia universal para responder perguntas técnicas sobre o projeto. Cada aluno deve saber explicar os pontos abaixo com suas próprias palavras.

---

## 1. Visão Geral do Projeto

**O que é o SIGE?**
Sistema de Inscrição e Gestão Escolar — três portais em um: inscrição (candidato), escolar (aluno), secretaria (admin) + portal professor + app mobile.

**Qual o problema que resolve?**
Elimina papelada, fila presencial e horário comercial. Tudo online: inscrição, matrícula, notas, frequência, financeiro, carteirinha digital.

**Quantos usuários simultâneos suporta?**
Escalável horizontalmente via Supabase (PostgreSQL gerenciado) + backend stateless Express. Sem limite fixo — depende do plano Supabase.

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Backend | Node.js + Express | 22 / ^5.2 |
| Banco | PostgreSQL (Supabase) | 15+ |
| ORM | Supabase JS Client | ^2.108 |
| Auth | JWT + bcryptjs | custom |
| Web | HTML5 + CSS3 + Vanilla JS | — |
| Mobile | React Native (Expo SDK 54) | 0.81.5 |
| Mobile Routing | Expo Router v6 | file-based |
| Mobile Auth | React Context + in-memory | — |
| Icons | Font Awesome 6 (web) / Ionicons (mobile) | — |
| Charts | Chart.js 4.4 | admin dashboard |
| Notifications | Notyf 3 | web toasts |

**Por que Vanilla JS no frontend web?**
Projeto didático — alunos aprendem JS puro sem abstração de frameworks. Decisão intencional de arquitetura.

**Por que Expo e não React Native CLI?**
Expo simplifica build, atualização OTA, acesso a APIs nativas sem configurar Xcode/Android Studio manualmente.

**Por que Supabase e não Firebase?**
PostgreSQL relacional é mais adequado para dados acadêmicos (notas, histórico, matrículas). Gratuito, sem vendor lock-in.

---

## 3. Backend — Arquitetura

**Framework:** Express 5.x (rota -> middleware -> controller -> Supabase query -> response)

**Fluxo de uma requisição:**

```
Cliente → HTTP → Express → cors() → json() → auth middleware → route handler → Supabase → JSON response
```

**Autenticação (JWT):**

```
POST /api/usuarios/login { email, senha }
  → bcrypt.compare(senha, hash)
  → jwt.sign({ id, role, id_cargo, permissoes }, JWT_SECRET, { expiresIn: '1d' })
  → Response: { token, usuario, permissoes }
```

**Middleware chain (4 tipos):**

| Middleware | Função |
|-----------|--------|
| `requireAuth` | Extrai e valida JWT do header `Authorization: Bearer <token>` |
| `requireRole(...roles)` | Checa `role` do usuário (legado) |
| `requirePermissao(codigo)` | Checa permissão granular via tabela `cargos_permissoes` |
| `requirePortalAtivo(codigo)` | Checa se o portal está ativo na tabela `portais` |

**16 arquivos de rota:**

| Arquivo | Endpoints principais |
|---------|---------------------|
| `routes/usuarios.js` | POST login, POST register, GET /me, CRUD |
| `routes/aluno.js` | GET matrículas, histórico, notas, frequência, horários, documentos, financeiro, agenda, currículo |
| `routes/alunos.js` | GET alunos (admin), GET detalhes, PUT matrícula |
| `routes/inscricoes.js` | POST (criar), GET (listar), PUT (aprovar/reprovar), PUT matrícula |
| `routes/professor.js` | GET turmas, POST notas, POST frequência, planos |
| `routes/cursos.js` | CRUD cursos |
| `routes/turmas.js` | CRUD turmas |
| `routes/cargos.js` | CRUD cargos + gerenciamento de permissões |
| `routes/auth-codigo.js` | Gerar/validar código de 6 dígitos (catraca) |
| `routes/portais.js` | Feature flags dos portais |
| `routes/documentos.js` | Upload/consulta de documentos |
| `routes/financeiro.js` | Consulta de financeiro |
| `routes/auditoria.js` | Log de auditoria |
| `routes/reclamacoes.js` | CRUD reclamações |
| `routes/disciplinas.js` | CRUD disciplinas |
| `routes/planos-aula.js` | Planos de ensino + aula |

**Tratamento de erros:**
```javascript
if (error) return res.status(400).json({ error: error.message });
```
Respostas sempre em JSON. Códigos: 200 (ok), 201 (created), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error).

---

## 4. Banco de Dados

**24 tabelas** no total. Principais:

| Tabela | Função | PK | FKs |
|--------|--------|----|-----|
| `usuarios` | Usuários (aluno, prof, admin) | id | id_cargo → cargos |
| `cargos` | Perfis RBAC | id | — |
| `permissoes` | Catálogo de permissões | id | — |
| `cargos_permissoes` | M:N cargos ↔ permissoes | (id_cargo, id_permissao) | ambas |
| `cursos` | Cursos | id | id_unidade → unidades |
| `turmas` | Turmas | id | id_curso → cursos |
| `disciplinas` | Disciplinas | id | id_curso → cursos |
| `inscricoes` | Candidaturas | id | id_usuario, id_curso |
| `matriculas` | Matrículas ativas | id | id_usuario, id_turma, id_curso |
| `historico_escolar` | Notas/histórico | id | id_matricula, id_disciplina, id_professor |
| `frequencia` | Chamada | id | id_matricula, id_disciplina |
| `horarios` | Grade horária | id | id_turma, id_disciplina, id_professor |
| `documentos` | Documentos do aluno | id | id_usuario |
| `financeiro` | Mensalidades/boletos | id | id_usuario, id_matricula |
| `agenda_eventos` | Calendário acadêmico | id | — (public) |
| `codigos_acesso` | Códigos catraca (6 dígitos) | id | id_usuario |

**RBAC — 6 cargos padrão:**

| Cargo | is_admin_master | Acesso |
|-------|----------------|--------|
| Admin Master (id=1) | ✅ | Tudo, inclusive gerenciar cargos |
| Administrador (id=2) | ❌ | Tudo exceto cargos |
| Secretaria (id=3) | ❌ | Alunos, turmas, inscrições, docs |
| Professor (id=4) | ❌ | Notas, frequência, planos |
| Aluno (id=5) | ❌ | Próprios dados (notas, frequência, etc.) |
| Candidato (id=6) | ❌ | Apenas portal de inscrição |

---

## 5. Frontend Web

**Arquitetura:** Múltiplas páginas HTML estáticas + JS vanilla. Sem SPA — cada página é um HTML completo.

**Três portais + app mobile:**

```
frontend-web/
├── portal-inscricao/     # 8 páginas (candidato)
├── portal-escolar/       # 19 páginas (aluno)
├── portal-professor/     # 1 SPA (professor)
├── portal-secretaria/    # 1 SPA (admin)
└── assets/               # CSS, imagens, js compartilhados
```

**Como funciona a autenticação no frontend?**

```javascript
// Login
fetch(`${API_BASE}/usuarios/login`, {
  method: 'POST',
  body: JSON.stringify({ email, senha })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem('auth', JSON.stringify(data));
  localStorage.setItem('API_BASE_URL', 'http://localhost:8080/api');
  window.location.href = '/portal-escolar/index.html';
});
```

**API_BASE_URL resolution:**
```javascript
function getApiBaseUrl() {
  return localStorage.getItem('API_BASE_URL')
    || window.ENV?.API_BASE_URL
    || window.API_BASE_URL
    || 'http://localhost:8080/api';
}
```

**Por que páginas separadas e não SPA?**
Simplicidade — cada página carrega só o que precisa. Alunos podem abrir links diretos (ex: `/portal-escolar/financeiro.html`). Não precisa de React pra isso.

---

## 6. Mobile App

**Framework:** Expo SDK 54 + React Native 0.81.5 + Expo Router v6

**Navegação:** File-based routing (similar Next.js). Cada arquivo em `app/` vira uma rota.

```
app/
├── _layout.tsx           # Root layout (Stack, headerShown: false)
├── index.tsx             # Login
├── (tabs)/
│   ├── _layout.tsx       # Tab navigator (Inicio, Carteirinha, Acesso, Catraca*)
│   ├── secretaria.tsx    # Dashboard
│   ├── carteirinha.tsx   # ID digital
│   ├── autenticacao.tsx  # Código 6 dígitos + QR
│   └── explore.tsx       # Scanner catraca (*condicional)
├── notas.tsx             # Notas
├── faltas.tsx            # Frequência
├── agenda.tsx            # Agenda
├── financeiro.tsx        # Financeiro
├── documentos.tsx        # Documentos
└── ...
```

**Autenticação:** In-memory (via `services/api.ts` + `contexts/AuthContext.tsx`). Sem persistência — fecha app, desloga.

**API Service:**
```typescript
// services/api.ts
let _auth: { token: string; usuario: any } | null = null;

export async function request(path: string, options?: RequestInit) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (_auth?.token) headers['Authorization'] = `Bearer ${_auth.token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) { /* logout */ }
  return res.json();
}
```

**Como o QR code da catraca funciona?**
1. App gera código de 6 dígitos + QR code (via `react-native-qrcode-svg`)
2. Código expira em 30 segundos (regeneração automática)
3. Catraca lê QR/código e valida via `POST /api/auth/validar-codigo`
4. Server verifica se código existe e não expirou

---

## 7. Fluxos Principais

### Fluxo de Inscrição (Candidato → Aluno)

```
Candidato acessa portal-inscricao
  → Escolhe curso (index.html)
  → Preenche formulário + aceita LGPD (inscricao.html)
  → POST /api/inscricoes → status: EM_ANALISE
  → Admin aprova: PUT /api/inscricoes/:id { status_aprovacao: 'APROVADO' }
  → Aluno recebe notificação, aceita matrícula
  → Sistema cria matrícula, atualiza role para ROLE_STUDENT
  → Aluno acessa portal-escolar
```

### Fluxo de Lançamento de Notas (Professor)

```
Professor acessa portal-professor
  → Clica "Lançar Notas"
  → Seleciona turma → disciplina → "Carregar Alunos"
  → Tabela de alunos aparece com inputs de nota
  → Professor digita notas e clica "Salvar"
  → POST /api/professor/notas { turmaId, disciplinaId, notas: [...] }
  → Dados salvos em historico_escolar
```

### Fluxo de Autenticação na Catraca

```
Aluno abre app → aba "Acesso"
  → App gera código de 6 dígitos + QR code
  → Código enviado ao backend: POST /api/auth/gerar-codigo
  → Server salva em codigos_acesso com expiração de 30s
  → Aluno presenta QR/código na catraca
  → Catraca valida: POST /api/auth/validar-codigo { codigo }
  → Server verifica: existe + não expirou + não usado
  → Retorna { valido: true, usuario: {...} }
  → Catraca libera acesso
```

---

## 8. Perguntas Frequentes (Técnicas)

**"Por que Express 5 e não 4?"**
Express 5 traz suporte nativo a async/await nos middlewares, removendo necessidade de try-catch wrappers. Mais moderno.

**"Como o JWT é validado?"**
Middleware `requireAuth` extrai token do header, verifica com `jwt.verify(token, JWT_SECRET)`. Se inválido/expirado → 401.

**"Onde fica o JWT_SECRET?"**
Hardcoded como fallback `'secreta_sige_123'` no middleware. Pode ser sobrescrito via `.env` → `JWT_SECRET`.

**"Como as permissões são verificadas?"**
Função `getUserPermissoes(userId)` faz JOIN: `cargos_permissoes → permissoes WHERE id_cargo = user.id_cargo`. Resultado cacheado em memória durante a requisição.

**"O app mobile funciona offline?"**
Não. Todas as telas dependem de API online. Não há cache offline implementado.

**"Qual a diferença entre ROLE e CARGO?"**
`role` é campo legado (VARCHAR: `ROLE_USER`, `ROLE_STUDENT`, etc.). `cargo` é o sistema novo RBAC (FK → `cargos.id`). O novo sistema substitui o antigo, mas o campo `role` ainda existe como fallback.

**"Como as senhas são armazenadas?"**
bcryptjs com 10 rounds de salt. `hash.senha = bcrypt.hashSync(senha, 10)`. NUNCA em texto plano.

**"Como funciona o deploy?"**
- Frontend web: Vercel (auto-deploy do GitHub)
- Backend: Render (Node.js, porta 8080)
- Banco: Supabase (PostgreSQL gerenciado)
- Mobile: EAS Build (Expo)

**"O projeto tem testes?"**
Não há testes automatizados (unitários/integração). O projeto é focado em funcionalidade e demonstração.

---

## 9. Comandos Úteis

```bash
# Iniciar backend
cd backend && npm run dev

# Iniciar frontend (Python)
python -m http.server 8000 -d frontend-web

# Build mobile APK
cd mobile-app && npx eas build --platform android --profile preview

# Rodar seed SQL
# Copiar conteudo de database/seed-institucional.sql para SQL Editor do Supabase
```

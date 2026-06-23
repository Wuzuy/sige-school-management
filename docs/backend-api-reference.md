# Backend API Reference

**Base URL:** `https://sige-1gqx.onrender.com/api`  
**Porta local:** `http://localhost:8080/api`

---

## Autenticação

### `POST /usuarios/login`

Body:
```json
{ "email": "admin@sige.edu.br", "senha": "Sige123@" }
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "nomeCompleto": "Ana Beatriz Oliveira",
    "email": "admin@sige.edu.br",
    "cpf": "00416865349",
    "telefone": "(11) 90001-0001",
    "dataNascimento": "1971-01-15",
    "role": "ROLE_ADMIN",
    "id_cargo": 1
  }
}
```

### `POST /usuarios`

Cadastro de novo usuário.

```json
{ "nomeCompleto": "Nome", "email": "email@provedor.com", "senha": "Sige123@" }
```

### `POST /usuarios/recuperar-senha`

```json
{ "email": "email@provedor.com" }
```

### `POST /usuarios/redefinir-senha`

```json
{ "token": "...", "senha": "NovaSenha@123" }
```

---

## Middleware

| Middleware | Descrição |
|------------|-----------|
| `requireAuth` | Verifica JWT no header `Authorization: Bearer <token>` |
| `requireRole(role)` | Verifica se usuário tem role específica (ex: `ROLE_ADMIN`) |
| `requireAdminMaster` | Apenas Admin Master (id_cargo === 1) |
| `requirePermissao(codigo)` | Verifica permissão granular via RBAC |

---

## RBAC (Cargos e Permissões)

### `GET /cargos`
Lista todos os cargos.

### `POST /cargos`
Criar cargo.
```json
{ "nome": "Secretaria", "descricao": "Acesso administrativo" }
```

### `GET /cargos/:id`
Detalhes do cargo.

### `PUT /cargos/:id`
Atualizar cargo.

### `DELETE /cargos/:id`
Excluir cargo (exceto Admin Master).

### `GET /cargos/permissoes/all`
Catálogo completo de permissões disponíveis.

### `POST /cargos/permissoes`
Vincular permissão a cargo.
```json
{ "id_cargo": 2, "codigo_permissao": "cursos.criar" }
```

### `GET /cargos/:id/permissoes`
Lista permissões de um cargo.

### `DELETE /cargos/permissoes/:id`
Remove vínculo permissão-cargo.

---

## Cursos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/cursos` | Listar todos |
| GET | `/cursos/ativos` | Apenas ativos (público) |
| GET | `/cursos/:id` | Buscar por ID |
| POST | `/cursos` | Criar |
| PUT | `/cursos/:id` | Atualizar |
| DELETE | `/cursos/:id` | Excluir |

---

## Unidades

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/unidades` | Listar |
| GET | `/unidades/:id` | Buscar |
| POST | `/unidades` | Criar |
| PUT | `/unidades/:id` | Atualizar |
| DELETE | `/unidades/:id` | Excluir |

---

## Editais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/editais` | Listar |
| GET | `/editais/:id` | Buscar |
| POST | `/editais` | Criar |
| PUT | `/editais/:id` | Atualizar |
| DELETE | `/editais/:id` | Excluir |

---

## Turmas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/turmas` | Listar |
| GET | `/turmas/:id` | Buscar |
| POST | `/turmas` | Criar |
| PUT | `/turmas/:id` | Atualizar |
| DELETE | `/turmas/:id` | Excluir |

---

## Disciplinas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/disciplinas` | Listar (com ?id_turma= para filtrar) |
| GET | `/disciplinas/:id` | Buscar por ID |
| POST | `/disciplinas` | Criar |
| PUT | `/disciplinas/:id` | Atualizar |
| DELETE | `/disciplinas/:id` | Excluir |
| POST | `/disciplinas/:id/atribuir` | Atribuir disciplina a turma + professor (cria entrada em `horarios`) |
| DELETE | `/disciplinas/:id/atribuir/:horarioId` | Remover atribuição |

---

## Horários (Atribuições)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/horarios` | Listar atribuições (com ?id_turma=, ?id_professor= para filtrar) |

---

## Inscrições

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/inscricoes` | Listar (admin) |
| GET | `/inscricoes/:id` | Buscar |
| POST | `/inscricoes` | Criar inscrição |
| PUT | `/inscricoes/:id` | Atualizar |
| PUT | `/inscricoes/:id/aprovar` | Aprovar/reprovar |
| POST | `/inscricoes/:id/matricula` | Aceitar matrícula |
| GET | `/inscricoes/minhas` | Inscrições do usuário logado |

---

## Aluno (Self-Service)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/aluno/notas` | Notas por disciplina |
| GET | `/aluno/frequencias` | Frequência por disciplina |
| GET | `/aluno/horarios` | Grade horária |
| GET | `/aluno/documentos` | Documentos do aluno |
| GET | `/aluno/reclamacoes` | Reclamações do aluno |
| POST | `/aluno/reclamacoes` | Criar reclamação |
| GET | `/aluno/agenda` | Agenda escolar |
| GET | `/aluno/historico` | Histórico escolar |
| GET | `/aluno/atendimentos` | Atendimentos agendados |
| GET | `/aluno/matriculas` | Matrículas ativas |
| GET | `/aluno/curriculo` | Estrutura curricular |

---

## Professor

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/professor/dashboard` | KPIs do dashboard (aulas dadas, total alunos, taxa presença, disciplinas) |
| GET | `/professor/dashboard/stats` | Estatísticas de desempenho dos alunos (aprovados/reprovados/recuperação/cursando) |
| GET | `/professor/turmas` | Turmas vinculadas ao professor |
| GET | `/professor/turmas/:id/alunos` | Alunos de uma turma |
| GET | `/professor/disciplinas` | Disciplinas do professor (com ?id_turma= para filtrar) |
| PUT | `/professor/disciplina/concluir` | Marcar/desmarcar disciplina como concluída. Body: `{ "id_turma": N, "id_disciplina": N, "concluida": true/false }` |
| GET | `/professor/notas` | Notas por turma + disciplina. Query: `?id_turma=X&id_disciplina=Y` |
| PUT | `/professor/notas` | Salvar nota de um aluno. Body: `{ "id_matricula": N, "nota": 8.5 }` |
| GET | `/professor/frequencia` | Frequência por turma + disciplina + data. Query: `?id_turma=X&id_disciplina=Y&data=2025-03-10` |
| PUT | `/professor/frequencia` | Salvar frequência de um aluno. Body: `{ "id_matricula": N, "data": "2025-03-10", "presente": true }` |
| GET | `/professor/frequencia/historico/:matriculaId` | Histórico de frequência de um aluno (últimos 30 registros) |

---

## Admin (Alunos)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/alunos` | Listar alunos |
| GET | `/alunos/:id` | Detalhes do aluno (inclui docs, reclamações) |
| PUT | `/alunos/:id` | Editar dados do aluno |
| POST | `/alunos/:id/reset-password` | Resetar senha |

---

## Usuários (Admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/usuarios` | Listar |
| GET | `/usuarios/:id` | Buscar |
| POST | `/usuarios/admin` | Criar admin |
| PUT | `/usuarios/:id` | Atualizar |
| DELETE | `/usuarios/:id` | Excluir |

---

## QR Code / Acesso (Mobile)

### `POST /auth/codigo`

Body:
```json
{ "codigo": "uuid-do-aluno" }
```

Response:
```json
{
  "valido": true,
  "aluno": { "id": 145, "nome": "Amanda Azevedo Monteiro" }
}
```

---

## Estrutura de Pastas

```
backend/
├── routes/
│   ├── usuarios.js            # GET/POST/PUT/DELETE /api/usuarios/*
│   ├── cursos.js              # GET/POST/PUT/DELETE /api/cursos/*
│   ├── unidades.js            # GET/POST/PUT/DELETE /api/unidades/*
│   ├── editais.js             # GET/POST/PUT/DELETE /api/editais/*
│   ├── turmas.js              # GET/POST/PUT/DELETE /api/turmas/*
│   ├── disciplinas.js         # GET/POST/PUT/DELETE /api/disciplinas/* + atribuições
│   ├── horarios.js            # GET /api/horarios (atribuições)
│   ├── inscricoes.js         # Inscrições + matrícula
│   ├── alunos.js              # Admin: visão de alunos
│   ├── aluno.js               # Self-service do aluno
│   ├── professor.js           # Professor: dashboard, notas, frequência, disciplinas
│   ├── cargos.js              # RBAC
│   └── auth-codigo.js        # Validação QR code
├── middleware/
│   └── auth.js                # requireAuth, requireRole, requirePermissao
├── config/
│   └── supabase.js            # Cliente Supabase
├── data/
│   └── conclusoes.json        # Estado de conclusão de disciplinas (file-based storage)
├── server.js                  # Entry point
├── package.json
└── .env                       # SUPABASE_URL, SUPABASE_KEY, PORT
```

---

## Configuração

Variáveis de ambiente:
```
PORT=8080
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon
```

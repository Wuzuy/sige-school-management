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
│   ├── inscricoes.js         # Inscrições + matrícula
│   ├── alunos.js              # Admin: visão de alunos
│   ├── aluno.js               # Self-service do aluno
│   ├── cargos.js              # RBAC
│   └── auth-codigo.js        # Validação QR code
├── middleware/
│   └── auth.js                # requireAuth, requireRole, requirePermissao
├── config/
│   └── supabase.js            # Cliente Supabase
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

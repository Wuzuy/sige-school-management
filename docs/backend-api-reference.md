# Backend API Reference - SIGE

**Documentacao dos Endpoints REST - Node.js + Express + Supabase**

---

## Informacoes Gerais

### Base URL
```
http://localhost:8080/api
```

### Formato de Dados
- Request: `application/json`
- Response: `application/json`

### Autenticacao
A maioria dos endpoints requer autenticacao via JWT.

**Header:**
```
Authorization: Bearer {token}
```

### Status HTTP
| Codigo | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized - Token ausente ou invalido |
| 403 | Forbidden - Sem permissao |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Autenticacao

### Login
**Endpoint:** `POST /usuarios/login`
**Autenticacao:** Nao requerida

**Request:**
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 2,
    "email": "joao@email.com",
    "nomeCompleto": "Joao Silva",
    "role": "ROLE_USER",
    "cpf": "12345678901",
    "telefone": "11999999999",
    "dataNascimento": "1995-05-15"
  }
}
```

### Cadastro
**Endpoint:** `POST /usuarios`
**Autenticacao:** Nao requerida

**Request:**
```json
{
  "nomeCompleto": "Joao Silva",
  "email": "joao@email.com",
  "senha": "Senha@123",
  "cpf": "12345678901",
  "telefone": "11999999999",
  "dataNascimento": "1995-05-15"
}
```

**Response 201:** Usuario criado

### Dados do Usuario Logado
**Endpoint:** `GET /usuarios/me`
**Autenticacao:** Requer token

**Response 200:**
```json
{
  "id": 2,
  "email": "joao@email.com",
  "nomeCompleto": "Joao Silva",
  "role": "ROLE_USER",
  "cpf": "12345678901",
  "telefone": "11999999999",
  "dataNascimento": "1995-05-15"
}
```

### Atualizar Perfil
**Endpoint:** `PUT /usuarios/me`
**Autenticacao:** Requer token

**Request:**
```json
{
  "nomeCompleto": "Joao Silva Atualizado",
  "telefone": "11988888888",
  "dataNascimento": "1995-05-15"
}
```

**Response 200:** Usuario atualizado

### Contagem de Usuarios
**Endpoint:** `GET /usuarios/count`
**Autenticacao:** Nao requerida

**Response:**
```json
{
  "count": 5
}
```

---

## Unidades

### Listar Todas
**Endpoint:** `GET /unidades`
**Autenticacao:** Requer token

**Response:**
```json
[
  {
    "id": 1,
    "nome": "SENAI Duque de Caxias",
    "cnpj": "12345678000199",
    "cidade": "Duque de Caxias",
    "estado": "RJ"
  }
]
```

### Criar Unidade
**Endpoint:** `POST /unidades`
**Autenticacao:** ADMIN

**Request:**
```json
{
  "nome": "SENAI Nova Unidade",
  "cnpj": "98765432000188",
  "cidade": "Rio de Janeiro",
  "estado": "RJ"
}
```

### Atualizar / Excluir
- `PUT /unidades/{id}` - ADMIN
- `DELETE /unidades/{id}` - ADMIN

---

## Cursos

### Listar Cursos
**Endpoint:** `GET /cursos`
**Autenticacao:** Requer token

Parametros opcionais: `?todos=true` (inclui inativos)

### Listar Cursos Ativos (publico)
**Endpoint:** `GET /cursos/ativos`
**Autenticacao:** Nao requerida

### Criar / Atualizar / Excluir
- `POST /cursos` - ADMIN
- `PUT /cursos/{id}` - ADMIN
- `DELETE /cursos/{id}` - ADMIN

**Request (POST/PUT):**
```json
{
  "nome_curso": "Tecnico em Mecanica",
  "tipo": "Tecnico",
  "turno": "Manha",
  "id_unidade": { "id": 1 },
  "data_inicio": "2026-02-01",
  "duracao_meses": 18,
  "status": "ATIVO"
}
```

---

## Editais

### Listar Editais
**Endpoint:** `GET /editais`
**Autenticacao:** Nao requerida

### Criar / Atualizar / Excluir
- `POST /editais` - ADMIN
- `PUT /editais/{id}` - ADMIN
- `DELETE /editais/{id}` - ADMIN

**Request:**
```json
{
  "titulo": "Edital 01/2026",
  "url": "https://senai.br/editais/01-2026.pdf",
  "ativo": true
}
```

---

## Inscricoes

### Listar Todas
**Endpoint:** `GET /inscricoes`
**Autenticacao:** ADMIN

### Criar Inscricao
**Endpoint:** `POST /inscricoes`
**Autenticacao:** Requer token

**Request:**
```json
{
  "id_usuario": { "id": 2 },
  "id_curso": { "id": 1 },
  "id_unidade": "",
  "data_inscricao": "2026-06-15",
  "status_aprovacao": "EM_ANALISE",
  "escolaridade_declarada": "Ensino Medio Completo",
  "nome_completo_inscricao": "Joao Silva",
  "cpf_inscricao": "12345678901",
  "telefone_inscricao": "11999999999",
  "email_inscricao": "joao@email.com",
  "data_nascimento_inscricao": "1995-05-15"
}
```

### Atualizar Inscricao
**Endpoint:** `PUT /inscricoes/{id}`
**Autenticacao:** ADMIN

Atualiza status_aprovacao, realiza_prova, data_prova, situacao_aprovacao_prova, lista_espera, status_matricula, observacoes.

### Gerenciar Matricula
**Endpoint:** `PUT /inscricoes/{id}/matricula`
**Autenticacao:** ADMIN

**Request:**
```json
{
  "status_matricula": "ACEITA",
  "data_aceite_matricula": "2026-06-15"
}
```

---

## Aluno (Portal do Aluno)

### Matriculas
**Endpoint:** `GET /aluno/matriculas`
**Autenticacao:** Requer token

### Historico
**Endpoint:** `GET /aluno/historico`
**Autenticacao:** Requer token

### Documentos
**Endpoint:** `GET /aluno/documentos`
**Autenticacao:** Requer token

### Frequencia
**Endpoint:** `GET /aluno/frequencia`
**Autenticacao:** Requer token

### Agenda
**Endpoint:** `GET /aluno/agenda`
**Autenticacao:** Requer token

### Calendario
**Endpoint:** `GET /aluno/calendario`
**Autenticacao:** Requer token

### Quadro de Horarios
**Endpoint:** `GET /aluno/horarios`
**Autenticacao:** Requer token

---

## Tratamento de Erros

### Estrutura Padrao de Erro
```json
{
  "error": "Mensagem de erro",
  "status": 400
}
```

### Erros Comuns

**400 - Bad Request:** Dados invalidos, email duplicado, CPF invalido
**401 - Unauthorized:** Token JWT ausente ou invalido
**403 - Forbidden:** Sem permissao de ADMIN
**404 - Not Found:** Recurso nao encontrado
**500 - Internal Server Error:** Erro no servidor

---

## Exemplos de Uso

### Login e obter token
```bash
curl -X POST http://localhost:8080/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@senai.com", "senha": "admin123"}'
```

### Listar cursos (autenticado)
```bash
curl -X GET http://localhost:8080/api/cursos \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Criar inscricao
```bash
curl -X POST http://localhost:8080/api/inscricoes \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id_usuario": {"id": 2}, "id_curso": {"id": 1}, "status_aprovacao": "EM_ANALISE"}'
```

---

**Versao da API:** 1.0
**Ultima Atualizacao:** Junho 2026
**Sistema:** SIGE v1.0.0

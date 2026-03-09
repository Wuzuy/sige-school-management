# 🔌 Backend API Reference - SEJA SENAI

**Documentação Completa de Endpoints REST**

---

## 📋 Índice

1. [Informações Gerais](#informações-gerais)
2. [Autenticação](#autenticação)
3. [Unidades](#unidades)
4. [Cursos](#cursos)
5. [Usuários](#usuários)
6. [Editais](#editais)
7. [Inscrições](#inscrições)
8. [Tratamento de Erros](#tratamento-de-erros)
9. [Exemplos de Uso](#exemplos-de-uso)

---

## 1. Informações Gerais

### Base URL

```
http://localhost:8080/api
```

### Formato de Dados

- **Request:** `application/json`
- **Response:** `application/json`
- **Encoding:** UTF-8

### Autenticação

A maioria dos endpoints requer autenticação via **JWT (JSON Web Token)**.

**Header:**
```
Authorization: Bearer {token}
```

### Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token ausente ou inválido |
| 403 | Forbidden - Sem permissão para acessar |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## 2. Autenticação

### 2.1. Registro de Usuário

**Endpoint:** `POST /auth/register`  
**Autenticação:** ❌ Não requerida

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf": "123.456.789-00",
  "rg": "MG-12.345.678",
  "telefone": "(31) 99999-9999",
  "dataNascimento": "1995-05-15",
  "endereco": "Rua Exemplo, 123, Bairro, Cidade - MG",
  "senha": "senha_segura_123"
}
```

**Response 200:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf": "123.456.789-00",
  "role": "USER",
  "createdAt": "2024-01-15T10:30:00"
}
```

**Validações:**
- Email deve ser único
- CPF deve ser único e válido
- Senha mínima de 6 caracteres
- Todos os campos obrigatórios devem estar preenchidos

**Exemplo cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "cpf": "123.456.789-00",
    "telefone": "(31) 99999-9999",
    "dataNascimento": "1995-05-15",
    "senha": "senha123"
  }'
```

---

### 2.2. Login

**Endpoint:** `POST /auth/login`  
**Autenticação:** ❌ Não requerida

**Request Body:**
```json
{
  "email": "joao@email.com",
  "senha": "senha_segura_123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "role": "USER",
  "expiresIn": 86400
}
```

**Campos do Response:**
- `token`: JWT token para autenticação
- `type`: Tipo de token (sempre "Bearer")
- `expiresIn`: Tempo de expiração em segundos (24h = 86400s)

**Exemplo cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'
```

---

### 2.3. Esqueci Minha Senha

**Endpoint:** `POST /auth/forgot-password`  
**Autenticação:** ❌ Não requerida

**Request Body:**
```json
{
  "email": "joao@email.com"
}
```

**Response 200:**
```json
{
  "message": "Email de recuperação enviado com sucesso"
}
```

**Comportamento:**
- Gera token único de recuperação
- Token válido por 15 minutos
- Email enviado com link de reset
- Se email não existir, retorna sucesso (segurança)

**Exemplo cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com"}'
```

---

### 2.4. Redefinir Senha

**Endpoint:** `POST /auth/reset-password`  
**Autenticação:** ❌ Não requerida (usa token do email)

**Request Body:**
```json
{
  "token": "abc123def456",
  "novaSenha": "nova_senha_segura"
}
```

**Response 200:**
```json
{
  "message": "Senha redefinida com sucesso"
}
```

**Response 400:**
```json
{
  "error": "Token inválido ou expirado"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456",
    "novaSenha": "novaSenha123"
  }'
```

---

## 3. Unidades

### 3.1. Listar Todas as Unidades

**Endpoint:** `GET /unidades`  
**Autenticação:** ✅ Requerida

**Response 200:**
```json
[
  {
    "id": 1,
    "nomeUnidade": "SENAI João Monlevade",
    "endereco": "Av. Wilson Alvarenga, 1000",
    "telefone": "(31) 3851-9600",
    "email": "joaomonlevade@senai.br",
    "createdAt": "2024-01-10T08:00:00"
  },
  {
    "id": 2,
    "nomeUnidade": "SENAI Belo Horizonte",
    "endereco": "Av. do Contorno, 842",
    "telefone": "(31) 3263-5400",
    "email": "belohorizonte@senai.br",
    "createdAt": "2024-01-10T08:05:00"
  }
]
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:8080/api/unidades \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 3.2. Buscar Unidade por ID

**Endpoint:** `GET /unidades/{id}`  
**Autenticação:** ✅ Requerida

**Response 200:**
```json
{
  "id": 1,
  "nomeUnidade": "SENAI João Monlevade",
  "endereco": "Av. Wilson Alvarenga, 1000",
  "telefone": "(31) 3851-9600",
  "email": "joaomonlevade@senai.br",
  "createdAt": "2024-01-10T08:00:00"
}
```

**Response 404:**
```json
{
  "error": "Unidade não encontrada"
}
```

---

### 3.3. Criar Nova Unidade

**Endpoint:** `POST /unidades`  
**Autenticação:** ✅ Requerida (ADMIN)

**Request Body:**
```json
{
  "nomeUnidade": "SENAI Contagem",
  "endereco": "Rua Exemplo, 500",
  "telefone": "(31) 3333-3333",
  "email": "contagem@senai.br"
}
```

**Response 201:**
```json
{
  "id": 3,
  "nomeUnidade": "SENAI Contagem",
  "endereco": "Rua Exemplo, 500",
  "telefone": "(31) 3333-3333",
  "email": "contagem@senai.br",
  "createdAt": "2024-01-15T14:30:00"
}
```

---

### 3.4. Atualizar Unidade

**Endpoint:** `PUT /unidades/{id}`  
**Autenticação:** ✅ Requerida (ADMIN)

**Request Body:**
```json
{
  "nomeUnidade": "SENAI João Monlevade - Atualizado",
  "endereco": "Av. Wilson Alvarenga, 1000 - Centro",
  "telefone": "(31) 3851-9600",
  "email": "joaomonlevade@senai.br"
}
```

**Response 200:**
```json
{
  "id": 1,
  "nomeUnidade": "SENAI João Monlevade - Atualizado",
  "endereco": "Av. Wilson Alvarenga, 1000 - Centro",
  "telefone": "(31) 3851-9600",
  "email": "joaomonlevade@senai.br",
  "updatedAt": "2024-01-15T15:00:00"
}
```

---

### 3.5. Excluir Unidade

**Endpoint:** `DELETE /unidades/{id}`  
**Autenticação:** ✅ Requerida (ADMIN)

**Response 200:**
```json
{
  "message": "Unidade excluída com sucesso"
}
```

**Response 400:**
```json
{
  "error": "Não é possível excluir unidade com cursos vinculados"
}
```

---

## 4. Cursos

### 4.1. Listar Todos os Cursos

**Endpoint:** `GET /cursos`  
**Autenticação:** ✅ Requerida

**Response 200:**
```json
[
  {
    "id": 1,
    "nomeCurso": "Técnico em Mecânica Industrial",
    "tipo": "Técnico",
    "descricao": "Curso técnico voltado para formação em mecânica",
    "idUnidade": {
      "id": 1,
      "nomeUnidade": "SENAI João Monlevade"
    },
    "turno": "Manhã",
    "duracaoMeses": 18,
    "dataInicio": "2024-02-01",
    "dataTermino": "2025-08-01",
    "status": "ATIVO",
    "createdAt": "2024-01-10T09:00:00"
  }
]
```

---

### 4.2. Listar Apenas Cursos Ativos

**Endpoint:** `GET /cursos/ativos`  
**Autenticação:** ❌ Não requerida (acesso público)

**Response 200:**
```json
[
  {
    "id": 1,
    "nomeCurso": "Técnico em Mecânica Industrial",
    "tipo": "Técnico",
    "descricao": "Curso técnico voltado para formação em mecânica",
    "idUnidade": {
      "id": 1,
      "nomeUnidade": "SENAI João Monlevade",
      "endereco": "Av. Wilson Alvarenga, 1000"
    },
    "turno": "Manhã",
    "duracaoMeses": 18,
    "dataInicio": "2024-02-01",
    "dataTermino": "2025-08-01",
    "status": "ATIVO"
  }
]
```

**Uso:** Este endpoint é usado pela página inicial para exibir cursos disponíveis para inscrição.

---

### 4.3. Criar Novo Curso

**Endpoint:** `POST /cursos`  
**Autenticação:** ✅ Requerida (ADMIN)

**Request Body:**
```json
{
  "nomeCurso": "Técnico em Automação Industrial",
  "tipo": "Técnico",
  "descricao": "Curso voltado para automação de processos industriais",
  "idUnidade": 1,
  "turno": "Noite",
  "duracaoMeses": 24,
  "dataInicio": "2024-03-01",
  "dataTermino": "2026-03-01",
  "status": "ATIVO"
}
```

**Response 201:**
```json
{
  "id": 2,
  "nomeCurso": "Técnico em Automação Industrial",
  "tipo": "Técnico",
  "descricao": "Curso voltado para automação de processos industriais",
  "idUnidade": {
    "id": 1,
    "nomeUnidade": "SENAI João Monlevade"
  },
  "turno": "Noite",
  "duracaoMeses": 24,
  "dataInicio": "2024-03-01",
  "dataTermino": "2026-03-01",
  "status": "ATIVO",
  "createdAt": "2024-01-15T16:00:00"
}
```

**Validações:**
- `dataTermino` deve ser posterior a `dataInicio`
- `idUnidade` deve existir
- Status deve ser ATIVO ou INATIVO

---

### 4.4. Atualizar Curso

**Endpoint:** `PUT /cursos/{id}`  
**Autenticação:** ✅ Requerida (ADMIN)

**Request Body:** (mesma estrutura do POST)

**Response 200:** Curso atualizado

---

### 4.5. Excluir Curso

**Endpoint:** `DELETE /cursos/{id}`  
**Autenticação:** ✅ Requerida (ADMIN)

**Response 200:**
```json
{
  "message": "Curso excluído com sucesso"
}
```

**Response 400:**
```json
{
  "error": "Não é possível excluir curso com inscrições vinculadas"
}
```

---

## 5. Usuários

### 5.1. Listar Todos os Usuários

**Endpoint:** `GET /usuarios`  
**Autenticação:** ✅ Requerida (ADMIN)

**Response 200:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "cpf": "123.456.789-00",
    "rg": "MG-12.345.678",
    "telefone": "(31) 99999-9999",
    "dataNascimento": "1995-05-15",
    "endereco": "Rua Exemplo, 123",
    "role": "USER",
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

**Nota:** Senha nunca é retornada nas requisições.

---

### 5.2. Buscar Usuário por ID

**Endpoint:** `GET /usuarios/{id}`  
**Autenticação:** ✅ Requerida (próprio usuário ou ADMIN)

**Response 200:** Mesmo formato do listar

---

### 5.3. Criar Novo Usuário

**Endpoint:** `POST /usuarios`  
**Autenticação:** ✅ Requerida (ADMIN)

**Request Body:**
```json
{
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "cpf": "987.654.321-00",
  "telefone": "(31) 88888-8888",
  "dataNascimento": "1998-10-20",
  "senha": "senha123",
  "role": "USER"
}
```

**Roles disponíveis:**
- `USER`: Aluno (acesso ao Portal do Aluno)
- `ADMIN`: Administrador (acesso ao Portal da Secretaria)

**Response 201:** Usuário criado

---

### 5.4. Atualizar Usuário

**Endpoint:** `PUT /usuarios/{id}`  
**Autenticação:** ✅ Requerida (próprio usuário ou ADMIN)

**Request Body:**
```json
{
  "nome": "João Silva Atualizado",
  "telefone": "(31) 98888-8888",
  "endereco": "Rua Nova, 456"
}
```

**Campos Editáveis:**
- nome, telefone, endereco, dataNascimento
- Email (ADMIN apenas)
- Role (ADMIN apenas)

**Campos Imutáveis:**
- CPF, RG

---

### 5.5. Alterar Senha

**Endpoint:** `PUT /usuarios/{id}/senha`  
**Autenticação:** ✅ Requerida (próprio usuário)

**Request Body:**
```json
{
  "senhaAtual": "senha_antiga",
  "novaSenha": "senha_nova_123"
}
```

**Response 200:**
```json
{
  "message": "Senha alterada com sucesso"
}
```

**Response 400:**
```json
{
  "error": "Senha atual incorreta"
}
```

---

## 6. Editais

### 6.1. Listar Todos os Editais

**Endpoint:** `GET /editais`  
**Autenticação:** ✅ Requerida (ADMIN)

**Response 200:**
```json
[
  {
    "id": 1,
    "tituloEdital": "Edital 01/2024 - Processo Seletivo 1º Semestre",
    "urlEdital": "https://www.senai.br/editais/01-2024.pdf",
    "status": "ATIVO",
    "createdAt": "2024-01-05T10:00:00"
  }
]
```

---

### 6.2. Listar Apenas Editais Ativos

**Endpoint:** `GET /editais/ativos`  
**Autenticação:** ❌ Não requerida (acesso público)

**Response 200:** Mesma estrutura, apenas editais com status ATIVO

---

### 6.3. Criar, Atualizar e Excluir Edital

**Endpoints:**
- POST `/editais` - Criar
- PUT `/editais/{id}` - Atualizar
- DELETE `/editais/{id}` - Excluir

**Autenticação:** ✅ Requerida (ADMIN)

**Request Body (POST/PUT):**
```json
{
  "tituloEdital": "Edital 02/2024",
  "urlEdital": "https://www.senai.br/editais/02-2024.pdf",
  "status": "ATIVO"
}
```

---

## 7. Inscrições

### 7.1. Listar Todas as Inscrições

**Endpoint:** `GET /inscricoes`  
**Autenticação:** ✅ Requerida (ADMIN)

**Response 200:**
```json
[
  {
    "id": 1,
    "idUsuario": {
      "id": 2,
      "nome": "João Silva",
      "cpf": "123.456.789-00",
      "email": "joao@email.com"
    },
    "idCurso": {
      "id": 1,
      "nomeCurso": "Técnico em Mecânica Industrial",
      "idUnidade": {
        "id": 1,
        "nomeUnidade": "SENAI João Monlevade"
      },
      "turno": "Manhã"
    },
    "dataInscricao": "2024-01-15",
    "escolaridade": "Ensino Médio Completo",
    "statusAprovacao": "EM_ANALISE",
    "statusMatricula": "PENDENTE",
    "dataProva": null,
    "localProva": null,
    "notaProva": null,
    "resultadoProva": null,
    "posicaoListaEspera": null,
    "observacoes": null
  }
]
```

**Status de Aprovação:**
- `EM_ANALISE`: Aguardando análise da secretaria
- `APROVADA`: Inscrição aprovada
- `REPROVADA`: Inscrição reprovada

**Status de Matrícula:**
- `PENDENTE`: Aguardando matrícula
- `EM_ANDAMENTO`: Matrícula em processo
- `CONCLUIDA`: Matrícula concluída (gera carteirinha)

---

### 7.2. Listar Inscrições de um Aluno

**Endpoint:** `GET /inscricoes/aluno/{id}`  
**Autenticação:** ✅ Requerida (próprio aluno ou ADMIN)

**Response 200:** Array de inscrições do aluno específico

---

### 7.3. Criar Nova Inscrição

**Endpoint:** `POST /inscricoes`  
**Autenticação:** ✅ Requerida (USER)

**Request Body:**
```json
{
  "idUsuario": 2,
  "idCurso": 1,
  "escolaridade": "Ensino Médio Completo",
  "instituicaoEnsino": "Escola Estadual XYZ"
}
```

**Response 201:**
```json
{
  "id": 1,
  "idUsuario": { ... },
  "idCurso": { ... },
  "dataInscricao": "2024-01-15",
  "escolaridade": "Ensino Médio Completo",
  "statusAprovacao": "EM_ANALISE",
  "statusMatricula": "PENDENTE",
  "createdAt": "2024-01-15T10:30:00"
}
```

**Validações:**
- Usuário não pode ter inscrição duplicada no mesmo curso
- Curso deve estar ATIVO

---

### 7.4. Aprovar Inscrição

**Endpoint:** `PUT /inscricoes/{id}/aprovar`  
**Autenticação:** ✅ Requerida (ADMIN)

**Request Body:** (vazio ou com observação)
```json
{
  "observacoes": "Documentação completa e válida"
}
```

**Response 200:**
```json
{
  "id": 1,
  "statusAprovacao": "APROVADA",
  "observacoes": "Documentação completa e válida",
  "updatedAt": "2024-01-16T09:00:00"
}
```

**Comportamento:**
- Status muda para APROVADA
- Email automático enviado ao aluno
- Próximo passo: configurar prova (se aplicável)

---

### 7.5. Reprovar Inscrição

**Endpoint:** `PUT /inscricoes/{id}/reprovar`  
**Autenticação:** ✅ Requerida (ADMIN)

**Request Body:**
```json
{
  "motivo": "Documentação incompleta"
}
```

**Response 200:**
```json
{
  "id": 1,
  "statusAprovacao": "REPROVADA",
  "observacoes": "Documentação incompleta",
  "updatedAt": "2024-01-16T09:05:00"
}
```

**Comportamento:**
- Status muda para REPROVADA
- Email enviado ao aluno com motivo

---

### 7.6. Configurar Prova

**Endpoint:** `PUT /inscricoes/{id}/prova`  
**Autenticação:** ✅ Requerida (ADMIN)

**Request Body:**
```json
{
  "dataProva": "2024-02-01",
  "localProva": "SENAI João Monlevade - Sala 301"
}
```

**Response 200:**
```json
{
  "id": 1,
  "dataProva": "2024-02-01",
  "localProva": "SENAI João Monlevade - Sala 301",
  "updatedAt": "2024-01-16T10:00:00"
}
```

**Comportamento:**
- Email automático enviado com convocação
- Aluno recebe data, horário e local

---

### 7.7. Registrar Resultado da Prova

**Endpoint:** `PUT /inscricoes/{id}/resultado`  
**Autenticação:** ✅ Requerida (ADMIN)

**Request Body:**
```json
{
  "notaProva": 8.5,
  "resultadoProva": "APROVADO"
}
```

**Valores de `resultadoProva`:**
- `APROVADO`: Libera matrícula
- `REPROVADO`: Reprova inscrição
- `FALTA`: Aluno faltou

**Response 200:**
```json
{
  "id": 1,
  "notaProva": 8.5,
  "resultadoProva": "APROVADO",
  "statusMatricula": "PENDENTE",
  "updatedAt": "2024-02-02T14:00:00"
}
```

**Comportamento:**
- Se APROVADO: status_matricula = PENDENTE, email de aprovação
- Se REPROVADO: status_aprovacao = REPROVADA, email de reprovação
- Se FALTA: secretaria decide ação

---

### 7.8. Processar Matrícula

**Endpoint:** `PUT /inscricoes/{id}/matricula`  
**Autenticação:** ✅ Requerida (ADMIN)

**Request Body:**
```json
{
  "statusMatricula": "EM_ANDAMENTO"
}
```

**ou**

```json
{
  "statusMatricula": "CONCLUIDA"
}
```

**Response 200:**
```json
{
  "id": 1,
  "statusMatricula": "CONCLUIDA",
  "updatedAt": "2024-02-05T15:00:00"
}
```

**Comportamento ao marcar como CONCLUIDA:**
- ✅ Gera carteirinha virtual automaticamente
- ✅ Email enviado com PDF da carteirinha
- ✅ Número de matrícula único atribuído
- ✅ Carteirinha disponível no Portal do Aluno

---

### 7.9. Adicionar à Lista de Espera

**Endpoint:** `PUT /inscricoes/{id}/lista-espera`  
**Autenticação:** ✅ Requerida (ADMIN)

**Request Body:**
```json
{
  "posicaoListaEspera": 1,
  "observacoes": "Aluno qualificado, aguardando vaga"
}
```

**Response 200:**
```json
{
  "id": 1,
  "posicaoListaEspera": 1,
  "observacoes": "Aluno qualificado, aguardando vaga",
  "updatedAt": "2024-02-03T11:00:00"
}
```

---

### 7.10. Excluir Inscrição

**Endpoint:** `DELETE /inscricoes/{id}`  
**Autenticação:** ✅ Requerida (ADMIN)

**Response 200:**
```json
{
  "message": "Inscrição excluída com sucesso"
}
```

**Response 400:**
```json
{
  "error": "Não é possível excluir inscrição com matrícula concluída"
}
```

---

## 8. Tratamento de Erros

### 8.1. Estrutura de Erro Padrão

Todos os erros seguem o formato:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "CPF já cadastrado no sistema",
  "path": "/api/auth/register"
}
```

---

### 8.2. Erros Comuns

#### 400 - Bad Request

**Causas:**
- Dados inválidos
- Violação de validação (email duplicado, CPF inválido)
- Campos obrigatórios faltando

**Exemplo:**
```json
{
  "error": "Bad Request",
  "message": "Email já está em uso"
}
```

---

#### 401 - Unauthorized

**Causas:**
- Token JWT ausente ou inválido
- Token expirado

**Exemplo:**
```json
{
  "error": "Unauthorized",
  "message": "Token JWT inválido ou expirado"
}
```

**Solução:** Fazer login novamente para obter novo token

---

#### 403 - Forbidden

**Causas:**
- Usuário autenticado mas sem permissão (role incorreta)
- USER tentando acessar endpoint de ADMIN

**Exemplo:**
```json
{
  "error": "Forbidden",
  "message": "Acesso negado. Permissão de ADMIN requerida"
}
```

---

#### 404 - Not Found

**Causas:**
- Recurso não encontrado (ID não existe)

**Exemplo:**
```json
{
  "error": "Not Found",
  "message": "Curso com ID 999 não encontrado"
}
```

---

#### 500 - Internal Server Error

**Causas:**
- Erro no servidor
- Falha na conexão com banco de dados
- Erro ao enviar email

**Exemplo:**
```json
{
  "error": "Internal Server Error",
  "message": "Erro ao processar requisição. Tente novamente"
}
```

---

## 9. Exemplos de Uso

### 9.1. Fluxo Completo de Inscrição

**1. Aluno se registra:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "cpf": "123.456.789-00",
    "telefone": "(31) 99999-9999",
    "dataNascimento": "1995-05-15",
    "senha": "senha123"
  }'
```

**2. Aluno faz login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'
# Retorna: { "token": "eyJ...", ... }
```

**3. Aluno lista cursos ativos:**
```bash
curl -X GET http://localhost:8080/api/cursos/ativos
# Não precisa de token
```

**4. Aluno se inscreve em um curso:**
```bash
curl -X POST http://localhost:8080/api/inscricoes \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "idUsuario": 2,
    "idCurso": 1,
    "escolaridade": "Ensino Médio Completo"
  }'
```

**5. Aluno acompanha status:**
```bash
curl -X GET http://localhost:8080/api/inscricoes/aluno/2 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 9.2. Fluxo de Administração (Secretaria)

**1. Admin faz login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@senai.com",
    "senha": "Admin@123"
  }'
```

**2. Admin lista inscrições:**
```bash
curl -X GET http://localhost:8080/api/inscricoes \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**3. Admin aprova inscrição:**
```bash
curl -X PUT http://localhost:8080/api/inscricoes/1/aprovar \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "observacoes": "Documentação completa"
  }'
```

**4. Admin configura prova:**
```bash
curl -X PUT http://localhost:8080/api/inscricoes/1/prova \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dataProva": "2024-02-01",
    "localProva": "SENAI - Sala 301"
  }'
```

**5. Admin registra resultado:**
```bash
curl -X PUT http://localhost:8080/api/inscricoes/1/resultado \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notaProva": 8.5,
    "resultadoProva": "APROVADO"
  }'
```

**6. Admin conclui matrícula:**
```bash
curl -X PUT http://localhost:8080/api/inscricoes/1/matricula \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "statusMatricula": "CONCLUIDA"
  }'
# Sistema gera e envia carteirinha automaticamente!
```

---

## 📝 Notas Finais

### Boas Práticas

1. **Sempre validar tokens JWT** antes de acessar endpoints protegidos
2. **Renovar token** quando estiver próximo da expiração
3. **Tratar erros** adequadamente no frontend
4. **Usar HTTPS** em produção
5. **Não expor tokens** em logs ou URLs

### Rate Limiting

O sistema possui proteção contra brute force:
- Máximo 100 requisições por minuto por IP
- Bloqueio temporário após múltiplas tentativas de login incorretas

### CORS

Backend configurado para aceitar requisições de:
- `http://localhost:5500` (desenvolvimento)
- Configurar domínio de produção ao fazer deploy

---

**Versão da API:** 1.0  
**Última Atualização:** Março de 2024  
**Sistema:** SEJA SENAI v1.0

# 🏢 Guia da Secretaria - SEJA SENAI

**Manual Completo para Equipe Administrativa**

---

## 🎯 Visão Geral

Este guia foi criado para auxiliar a equipe da secretaria no gerenciamento completo do sistema SEJA SENAI, incluindo administração de unidades, cursos, usuários, editais, inscrições e relatórios.

---

## 📋 Índice

1. [Acesso ao Sistema](#acesso-ao-sistema)
2. [Portal da Secretaria - Visão Geral](#portal-da-secretaria---visão-geral)
3. [Gerenciar Unidades](#gerenciar-unidades)
4. [Gerenciar Cursos](#gerenciar-cursos)
5. [Gerenciar Usuários](#gerenciar-usuários)
6. [Gerenciar Editais](#gerenciar-editais)
7. [Gerenciar Inscrições](#gerenciar-inscrições)
8. [Relatórios e Estatísticas](#relatórios-e-estatísticas)
9. [Fluxo Completo de Processo Seletivo](#fluxo-completo-de-processo-seletivo)
10. [Casos de Uso Comuns](#casos-de-uso-comuns)
11. [Troubleshooting](#troubleshooting)

---

## 1. Acesso ao Sistema

### 1.1. Credenciais de Administrador

**Login Padrão:**
```
Email: admin@senai.com
Senha: Admin@123
```

**⚠️ IMPORTANTE:**
- Altere a senha padrão no primeiro acesso
- Nunca compartilhe credenciais de administrador
- Use credenciais individuais para cada membro da equipe

**URL de Acesso:**
```
Homepage: http://localhost:5500/index.html
Login: http://localhost:5500/login.html
Portal Secretaria: http://localhost:5500/portal-secretaria.html
```

---

### 1.2. Níveis de Acesso

O sistema possui dois tipos de usuário:

| Tipo | Role | Permissões |
|------|------|------------|
| **Administrador** | `ADMIN` | Acesso total ao Portal da Secretaria |
| **Aluno** | `USER` | Acesso apenas ao Portal do Aluno |

---

## 2. Portal da Secretaria - Visão Geral

### 2.1. Estrutura do Portal

**URL:** `/portal-secretaria.html`

```
🏢 Portal da Secretaria
├── 📊 Dashboard
│   ├── Total de Inscrições
│   ├── Inscrições Pendentes
│   ├── Cursos Ativos
│   └── Total de Alunos
│
├── 🏛️ Gerenciar Unidades
│   ├── Listar todas as unidades
│   ├── Cadastrar nova unidade
│   ├── Editar unidade existente
│   └── Excluir unidade
│
├── 📚 Gerenciar Cursos
│   ├── Listar todos os cursos
│   ├── Filtros (unidade, status, pesquisa)
│   ├── Cadastrar novo curso
│   ├── Editar curso existente
│   ├── Ativar/Desativar curso
│   └── Excluir curso
│
├── 👥 Gerenciar Usuários
│   ├── Listar todos os usuários
│   ├── Criar novo usuário (Admin ou Aluno)
│   ├── Editar usuário existente
│   ├── Visualizar perfil completo
│   └── Excluir usuário
│
├── 📄 Gerenciar Editais
│   ├── Listar todos os editais
│   ├── Cadastrar novo edital
│   ├── Editar edital existente
│   ├── Ativar/Desativar edital
│   └── Excluir edital
│
├── 📋 Gerenciar Inscrições (PRINCIPAL)
│   ├── Listar todas as inscrições
│   ├── Filtros avançados (curso, status, pesquisa)
│   ├── Visualizar detalhes completos
│   ├── Aprovar/Reprovar inscrição
│   ├── Configurar prova
│   ├── Registrar resultado da prova
│   ├── Gerenciar lista de espera
│   ├── Processar matrícula
│   └── Adicionar observações
│
└── 📊 Relatórios
    ├── Estatísticas gerais
    ├── Relatório por curso
    └── Inscrições recentes
```

---

### 2.2. Navegação

**Menu Superior:**
- **Logo SEJA SENAI:** Volta para a página inicial
- **Portal da Secretaria:** Recarrega o portal
- **👤 [Nome do Admin]:** Menu com opção "Sair"

**Abas do Portal:**
Clique nas abas para alternar entre módulos:
- Unidades
- Cursos  
- Usuários
- Editais
- Inscrições
- Relatórios

---

## 3. Gerenciar Unidades

### 3.1. Listar Unidades

**Visualização:**

Todas as unidades são exibidas em cards com:
```
🏛️ Card de Unidade:
├── Nome da Unidade
├── Endereço
├── Telefone
├── Email
├── Botão "Editar"
└── Botão "Excluir"
```

---

### 3.2. Cadastrar Nova Unidade

**Passo a Passo:**

1. Clique no botão **"Cadastrar Nova Unidade"**
2. Preencha o formulário:

```
📝 Dados da Unidade:
├── Nome da Unidade (obrigatório)
│   Exemplo: "SENAI João Monlevade"
├── Endereço Completo (obrigatório)
│   Exemplo: "Av. Wilson Alvarenga, 1000"
├── Telefone (obrigatório)
│   Formato: (31) 99999-9999
└── Email (obrigatório)
    Exemplo: joaomonlevade@senai.br
```

3. Clique em **"Salvar Unidade"**
4. Confirmação aparecerá e a lista será atualizada

**Validações:**
- Todos os campos são obrigatórios
- Telefone deve seguir o formato: (XX) XXXXX-XXXX
- Email deve ser válido

---

### 3.3. Editar Unidade

**Passo a Passo:**

1. Na lista de unidades, clique em **"Editar"** na unidade desejada
2. O formulário será preenchido com os dados atuais
3. Modifique os campos necessários
4. Clique em **"Salvar Alterações"**
5. Confirmação aparecerá

---

### 3.4. Excluir Unidade

**⚠️ ATENÇÃO: Esta ação é irreversível!**

**Passo a Passo:**

1. Clique em **"Excluir"** na unidade desejada
2. Confirme a exclusão no alerta
3. A unidade será removida permanentemente

**Regras:**
- Não é possível excluir unidades que possuem cursos vinculados
- Primeiro remova ou reatribua os cursos

---

## 4. Gerenciar Cursos

### 4.1. Listar Cursos

**Visualização:**

Cursos exibidos em cards com informações completas:

```
📚 Card de Curso:
├── Nome do Curso
├── Unidade SENAI
├── Tipo (Técnico, Qualificação, etc.)
├── Turno (Manhã, Tarde, Noite)
├── Duração (em meses)
├── Data de Início
├── Status (ATIVO/INATIVO)
├── Badge de Status colorido
├── Botão "Editar"
└── Botão "Excluir"
```

---

### 4.2. Filtros Avançados

**Disponíveis:**

1. **Pesquisa por Texto:**
   - Digite no campo: "Nome, tipo ou turno"
   - Busca em: nome do curso, tipo, turno

2. **Filtro por Unidade:**
   - Dropdown com todas as unidades cadastradas
   - Opção "TODAS" para exibir todos

3. **Filtro por Status:**
   - "TODOS" (padrão)
   - "ATIVO" - apenas cursos ativos
   - "INATIVO" - apenas cursos inativos

**💡 Dica:** Combine filtros para buscar mais específico!

---

### 4.3. Cadastrar Novo Curso

**Passo a Passo:**

1. Clique em **"Cadastrar Novo Curso"**
2. Preencha o formulário completo:

```
📋 Dados do Curso:

🏷️ Identificação
├── Nome do Curso (obrigatório)
│   Exemplo: "Técnico em Mecânica Industrial"
├── Tipo (obrigatório)
│   Exemplo: "Técnico", "Qualificação Profissional"
└── Descrição (opcional)
    Exemplo: "Curso técnico voltado para..."

🏛️ Localização
└── Unidade SENAI (obrigatório)
    Selecione no dropdown

⏰ Horários
├── Turno (obrigatório)
│   Opções: Manhã, Tarde, Noite
└── Duração em meses (obrigatório)
    Exemplo: 12, 18, 24

📅 Datas
├── Data de Início (obrigatório)
│   Formato: YYYY-MM-DD
└── Data de Término (obrigatório)
    Formato: YYYY-MM-DD

📊 Status
└── Status (obrigatório)
    Opções: ATIVO, INATIVO
```

3. Clique em **"Salvar Curso"**
4. Curso aparecerá na lista imediatamente

**Regras de Negócio:**
- Data de término deve ser posterior à data de início
- Cursos criados como INATIVO não aparecem para alunos
- Apenas cursos ATIVOS recebem inscrições

---

### 4.4. Editar Curso

**Passo a Passo:**

1. Clique em **"Editar"** no curso desejado
2. Formulário será preenchido com dados atuais
3. Modifique os campos necessários
4. Clique em **"Salvar Alterações"**

**⚠️ Atenção ao Editar:**
- Alterar o status para INATIVO remove o curso da visualização de alunos
- Mudanças em datas não afetam inscrições já realizadas
- Alunos já inscritos não são notificados de alterações

---

### 4.5. Excluir Curso

**⚠️ CUIDADO: Ação irreversível!**

**Regras:**
- Não é possível excluir cursos que possuem inscrições vinculadas
- Primeiro cancele/transfira as inscrições
- Considere marcar como INATIVO ao invés de excluir

---

## 5. Gerenciar Usuários

### 5.1. Listar Usuários

**Visualização:**

Tabela com todos os usuários cadastrados:

```
👥 Informações Exibidas:
├── Nome Completo
├── Email
├── CPF
├── Role (ADMIN ou USER)
├── Badge colorido de role
├── Data de Cadastro
├── Botão "Editar"
└── Botão "Excluir"
```

---

### 5.2. Criar Novo Usuário

**Casos de Uso:**
- Cadastrar novos membros da equipe administrativa (ADMIN)
- Cadastrar alunos manualmente (USER)

**Passo a Passo:**

1. Clique em **"Criar Novo Usuário"**
2. Preencha o formulário:

```
📝 Dados do Usuário:

👤 Dados Pessoais
├── Nome Completo (obrigatório)
├── Email (obrigatório - será o login)
├── CPF (obrigatório - única por usuário)
├── RG (opcional)
├── Telefone (obrigatório)
└── Data de Nascimento (obrigatório)

🏠 Endereço (opcional)
└── Endereço Completo

🔐 Credenciais
├── Senha (obrigatório - mínimo 6 caracteres)
└── Role (obrigatório)
    ├── ADMIN - Acesso ao Portal da Secretaria
    └── USER - Acesso ao Portal do Aluno
```

3. Clique em **"Salvar Usuário"**
4. Usuário criado receberá email de boas-vindas

**Validações:**
- Email deve ser único
- CPF deve ser único e válido
- Senha mínima de 6 caracteres

---

### 5.3. Editar Usuário

**Passo a Passo:**

1. Clique em **"Editar"** no usuário desejado
2. Modifique os dados necessários
3. Clique em **"Salvar Alterações"**

**Campos Editáveis:**
- Nome, telefone, endereço, data de nascimento
- Email (⚠️ alterar email altera o login do usuário)
- Role (⚠️ alterar role muda permissões de acesso)

**Campos NÃO Editáveis:**
- CPF (imutável por questões legais)

---

### 5.4. Excluir Usuário

**⚠️ ATENÇÃO:**

**Regras:**
- Não é possível excluir usuários com inscrições ativas
- Considere desativar ao invés de excluir (marque role como inativo)
- Exclusão remove permanentemente todos os dados

---

## 6. Gerenciar Editais

### 6.1. Listar Editais

**Visualização:**

```
📄 Card de Edital:
├── Título do Edital
├── URL do Edital (link clicável)
├── Status (ATIVO/INATIVO)
├── Badge colorido de status
├── Botão "Editar"
└── Botão "Excluir"
```

---

### 6.2. Cadastrar Novo Edital

**Passo a Passo:**

1. Clique em **"Cadastrar Novo Edital"**
2. Preencha:

```
📋 Dados do Edital:
├── Título do Edital (obrigatório)
│   Exemplo: "Edital 01/2024 - Processo Seletivo 1º Semestre"
├── URL do Edital (obrigatório)
│   Exemplo: "https://www.senai.br/editais/01-2024.pdf"
└── Status (obrigatório)
    ├── ATIVO - Visível para alunos
    └── INATIVO - Oculto
```

3. Clique em **"Salvar Edital"**

**📌 Uso:**
- Editais ativos são exibidos na página inicial para alunos
- Use para divulgar processos seletivos, regras, cronogramas

---

### 6.3. Editar/Excluir Edital

Processo similar aos módulos anteriores:
- **Editar:** Atualizar título, URL ou status
- **Excluir:** Remoção permanente (sem restrições)

---

## 7. Gerenciar Inscrições

**🔥 MÓDULO MAIS IMPORTANTE DO SISTEMA**

Este é o coração do portal da secretaria. Aqui você gerencia todo o ciclo de vida das inscrições.

---

### 7.1. Listar Inscrições

**Visualização:**

Tabela completa com todas as inscrições:

```
📋 Colunas da Tabela:
├── Nome do Aluno
├── CPF do Aluno
├── Curso Inscrito
├── Data de Inscrição
├── Status de Aprovação
│   ├── 🔵 EM_ANALISE
│   ├── 🟢 APROVADA
│   └── 🔴 REPROVADA
├── Status de Matrícula
│   ├── ⏳ PENDENTE
│   ├── 🔄 EM_ANDAMENTO
│   └── ✅ CONCLUIDA
├── Botão "Ver Detalhes"
├── Botão "Editar"
└── Botão "Excluir"
```

---

### 7.2. Filtros Avançados de Inscrições

**3 Filtros Disponíveis:**

1. **Pesquisa por Texto:**
   - Campo: "Nome do aluno ou CPF"
   - Busca em tempo real

2. **Filtro por Curso:**
   - Dropdown com todos os cursos
   - Opção "TODOS" (padrão)

3. **Filtro por Status:**
   - "TODOS" (padrão)
   - "EM_ANALISE"
   - "APROVADA"
   - "REPROVADA"

**💡 Exemplo de Uso:**
```
Cenário: Ver inscrições aprovadas do curso "Técnico em Mecânica"
Ação:
1. Filtro por Curso: "Técnico em Mecânica Industrial"
2. Filtro por Status: "APROVADA"
3. Resultado: Apenas inscrições aprovadas desse curso
```

---

### 7.3. Visualizar Detalhes da Inscrição

**Passo a Passo:**

1. Clique em **"Ver Detalhes"** na inscrição desejada
2. Modal com informações completas será exibido:

```
📊 Modal de Detalhes da Inscrição:

👤 DADOS DO ALUNO
├── Nome Completo
├── Email
├── CPF
├── RG
├── Data de Nascimento
├── Telefone
└── Endereço

📚 DADOS DA INSCRIÇÃO
├── Curso Selecionado
├── Unidade
├── Turno
├── Data da Inscrição
└── Escolaridade do Aluno

📊 STATUS ATUAL
├── Status de Aprovação
│   └── Badge colorido com status
├── Status de Matrícula
│   └── Badge colorido com status
└── Observações (se houver)

📝 INFORMAÇÕES DO PROCESSO SELETIVO
├── Data da Prova
├── Local da Prova
├── Nota da Prova
├── Resultado da Prova
├── Posição na Lista de Espera
└── Observações Adicionais

🔧 AÇÕES DISPONÍVEIS
├── Botão "Aprovar Inscrição"
├── Botão "Reprovar Inscrição"
├── Botão "Configurar Prova"
├── Botão "Registrar Resultado"
├── Botão "Processar Matrícula"
├── Botão "Adicionar à Lista de Espera"
├── Botão "Adicionar Observação"
└── Botão "Fechar"
```

---

### 7.4. Workflow Completo de Inscrição

**📝 FLUXO PADRÃO:**

```
1️⃣ INSCRIÇÃO ENVIADA
   ↓
   Status inicial: EM_ANALISE
   Ação: Aluno preenche formulário e envia
   
2️⃣ ANÁLISE DOCUMENTAL
   ↓
   Status: EM_ANALISE
   Ação Secretaria: Verificar documentos, escolaridade, requisitos
   Decisão:
   ├─→ APROVAR (vai para etapa 3)
   └─→ REPROVAR (fim do processo)

3️⃣ PROCESSO SELETIVO
   ↓
   Status: APROVADA
   Ação Secretaria:
   ├── Configurar prova (data, local)
   ├── Enviar convocação por email
   ├── Realizar prova
   └── Registrar resultado
   
4️⃣ RESULTADO DA PROVA
   ↓
   Decisão:
   ├─→ APROVADO: Liberar matrícula
   ├─→ REPROVADO: Adicionar à lista de espera (ou reprovar)
   └─→ FALTA: Reprovar ou remarcar

5️⃣ MATRÍCULA
   ↓
   Status Matrícula: PENDENTE → EM_ANDAMENTO → CONCLUIDA
   Ação Secretaria:
   ├── Processar matrícula
   ├── Marcar como CONCLUIDA
   └── Sistema gera carteirinha automaticamente
   
6️⃣ CARTEIRINHA VIRTUAL
   ↓
   Ação Automática:
   ├── Sistema gera PDF da carteirinha
   ├── Envia por email para o aluno
   └── Disponibiliza no Portal do Aluno
```

---

### 7.5. Ações Específicas

#### 7.5.1. Aprovar Inscrição

**Quando Usar:**
- Após análise documental positiva
- Aluno atende todos os requisitos

**Passo a Passo:**
1. Abra os detalhes da inscrição
2. Clique em **"Aprovar Inscrição"**
3. Confirme a ação
4. Status muda para **APROVADA**
5. Aluno recebe email de aprovação automática

**O que acontece:**
- Status_aprovacao = APROVADA
- Aluno é notificado por email
- Próximo passo: configurar prova (se aplicável)

---

#### 7.5.2. Reprovar Inscrição

**Quando Usar:**
- Documentação incompleta/inválida
- Não atende requisitos mínimos
- Resultado negativo na prova

**Passo a Passo:**
1. Abra os detalhes da inscrição
2. Clique em **"Reprovar Inscrição"**
3. Digite o motivo (será enviado ao aluno)
4. Confirme a ação
5. Status muda para **REPROVADA**

**O que acontece:**
- Status_aprovacao = REPROVADA
- Aluno recebe email com justificativa
- Processo encerrado

---

#### 7.5.3. Configurar Prova

**Quando Usar:**
- Após aprovar a inscrição
- Curso exige processo seletivo

**Passo a Passo:**
1. Abra os detalhes da inscrição (status APROVADA)
2. Clique em **"Configurar Prova"**
3. Preencha o formulário:

```
📝 Dados da Prova:
├── Data da Prova (obrigatório)
│   Formato: YYYY-MM-DD
├── Horário (obrigatório)
│   Formato: HH:MM
└── Local (obrigatório)
    Exemplo: "SENAI - Sala 301"
```

4. Clique em **"Salvar Configuração"**

**O que acontece:**
- Dados da prova são salvos na inscrição
- Email automático é enviado ao aluno com:
  - Data e horário
  - Local
  - Instruções

---

#### 7.5.4. Registrar Resultado da Prova

**Quando Usar:**
- Após realização da prova
- Para registrar nota e resultado

**Passo a Passo:**
1. Abra os detalhes da inscrição
2. Clique em **"Registrar Resultado"**
3. Preencha:

```
📊 Resultado da Prova:
├── Nota (obrigatório)
│   Exemplo: 7.5, 8.0, 9.2
└── Resultado (obrigatório)
    ├── APROVADO - Libera matrícula
    ├── REPROVADO - Reprova inscrição
    └── FALTA - Aluno faltou (decidir ação)
```

4. Clique em **"Salvar Resultado"**

**O que acontece:**
- Nota e resultado salvos
- Se APROVADO:
  - Status matrícula = PENDENTE
  - Email enviado com instruções de matrícula
- Se REPROVADO:
  - Status_aprovacao = REPROVADA
  - Email de reprovação enviado
- Se FALTA:
  - Secretaria decide: reprovar ou remarcar prova

---

#### 7.5.5. Gerenciar Lista de Espera

**Quando Usar:**
- Aluno reprovado mas com potencial
- Vagas preenchidas, mas aluno qualificado

**Passo a Passo:**
1. Abra os detalhes da inscrição
2. Clique em **"Adicionar à Lista de Espera"**
3. Defina a posição na lista
4. Adicione observação (opcional)

**O que acontece:**
- Campo "posicao_lista_espera" preenchido
- Aluno recebe email informando posição
- Se vaga abrir, secretaria contata aluno manualmente

**💡 Gerenciamento:**
- Visualize lista de espera no módulo de relatórios
- Quando desistência ocorrer, chame o próximo da lista
- Processo manual por flexibilidade

---

#### 7.5.6. Processar Matrícula

**Quando Usar:**
- Após aluno aprovado no processo seletivo
- Status_aprovacao = APROVADA
- Resultado_prova = APROVADO (se aplicável)

**Passo a Passo:**

1. Abra os detalhes da inscrição
2. Verifique que status_matricula = PENDENTE
3. Clique em **"Processar Matrícula"**
4. Informe dados adicionais (se solicitados)
5. Clique em **"Iniciar Matrícula"**
6. Status muda para **EM_ANDAMENTO**
7. Quando finalizado, clique em **"Concluir Matrícula"**
8. Status muda para **CONCLUIDA**

**O que acontece ao concluir:**
- Status_matricula = CONCLUIDA
- **Sistema gera carteirinha virtual automaticamente**
- Email enviado ao aluno com:
  - PDF da carteirinha
  - Link para download do app
  - Número de matrícula
  - Informações do curso
  - Boas-vindas

**📌 IMPORTANTE:**
A geração da carteirinha é AUTOMÁTICA ao marcar matrícula como CONCLUIDA.

---

#### 7.5.7. Adicionar Observação

**Quando Usar:**
- Registrar informações importantes
- Documentar decisões
- Comunicação interna da equipe

**Passo a Passo:**
1. Abra os detalhes da inscrição
2. Clique em **"Adicionar Observação"**
3. Digite a observação no campo de texto
4. Clique em **"Salvar Observação"**

**Visibilidade:**
- Observações são visíveis apenas para a secretaria
- Alunos NÃO veem observações internas

---

### 7.6. Editar Inscrição

**Quando Usar:**
- Corrigir dados preenchidos incorretamente pelo aluno
- Atualizar informações desatualizadas

**Campos Editáveis:**
- Dados pessoais (nome, telefone, endereço)
- Escolaridade
- Status de aprovação
- Status de matrícula
- Dados do processo seletivo

**⚠️ Atenção:**
- Alterações são registradas no log do sistema
- Não notifica o aluno automaticamente

---

### 7.7. Excluir Inscrição

**⚠️ CUIDADO: Ação irreversível!**

**Quando Usar:**
- Inscrições duplicadas
- Solicitação formal do aluno
- Dados completamente incorretos

**Regras:**
- Inscrições com matrícula CONCLUIDA não devem ser excluídas
- Prefira marcar como REPROVADA ao invés de excluir
- Exclusão remove permanentemente todos os dados

---

## 8. Relatórios e Estatísticas

### 8.1. Visão Geral dos Relatórios

**Acesso:** Aba "Relatórios" no Portal da Secretaria

O módulo de relatórios fornece insights sobre o sistema:

```
📊 Seções de Relatórios:
├── 1. Estatísticas Gerais
├── 2. Relatório por Curso
└── 3. Inscrições Recentes
```

---

### 8.2. Estatísticas Gerais

**Cards Informativos:**

```
📈 Métricas Exibidas:
├── Total de Inscrições
│   └── Número total de inscrições no sistema
├── Inscrições Aprovadas
│   └── Total com status APROVADA
├── Inscrições em Análise
│   └── Total com status EM_ANALISE
└── Inscrições Reprovadas
    └── Total com status REPROVADA
```

**Uso:**
- Visão rápida do volume de inscrições
- Identificar gargalos (muitas em análise)
- Monitorar taxa de aprovação

---

### 8.3. Relatório por Curso

**Visualização:**

Tabela ordenada com estatísticas de cada curso:

```
📊 Colunas da Tabela:
├── Nome do Curso
├── Total de Inscrições
├── Aprovadas
├── Em Análise
└── Reprovadas
```

**Ordenação:**
- Por padrão: ordenado por "Total" (decrescente)
- Cursos mais procurados aparecem primeiro

**Uso:**
- Identificar cursos mais populares
- Verificar taxa de aprovação por curso
- Planejar abertura de novas turmas
- Alocar recursos conforme demanda

---

### 8.4. Inscrições Recentes

**Visualização:**

Tabela com as últimas 10 inscrições:

```
📋 Colunas da Tabela:
├── Nome do Aluno
├── Curso
├── Data de Inscrição
└── Status
```

**Ordenação:**
- Mais recentes primeiro
- Limitado a 10 registros

**Uso:**
- Monitorar inscrições em tempo real
- Priorizar análise de novas inscrições
- Identificar picos de inscrição

---

### 8.5. Exportar Relatórios (Futuro)

**🚧 Funcionalidade Planejada:**

- Exportar para Excel (.xlsx)
- Exportar para PDF
- Gerar relatórios customizados
- Filtros avançados por período

---

## 9. Fluxo Completo de Processo Seletivo

### 9.1. Fluxo Padrão - Passo a Passo Detalhado

**Cenário:** Gerenciar processo seletivo do início ao fim

---

#### **ETAPA 1: Recebimento da Inscrição**

**Ação do Sistema:**
- Aluno preenche formulário e envia
- Inscrição criada com status EM_ANALISE
- Email de confirmação enviado ao aluno

**Ação da Secretaria:**
- Acessar Portal → Gerenciar Inscrições
- Aplicar filtro: Status = "EM_ANALISE"
- Visualizar últimas inscrições

---

#### **ETAPA 2: Análise Documental**

**Checklist de Análise:**
```
✅ Itens a Verificar:
├── [ ] Escolaridade atende requisito do curso
├── [ ] CPF válido e sem duplicações
├── [ ] Dados pessoais completos
├── [ ] Telefone e email válidos
└── [ ] Curso selecionado compatível com perfil
```

**Ação da Secretaria:**
1. Clicar em "Ver Detalhes" na inscrição
2. Revisar todos os dados do aluno
3. Verificar documentação (se enviada)
4. Decisão:
   - **Aprovado:** Clicar em "Aprovar Inscrição"
   - **Reprovado:** Clicar em "Reprovar Inscrição" + motivo

---

#### **ETAPA 3: Convocação para Prova**

**Ação da Secretaria:**
1. Inscrições aprovadas → Clicar "Configurar Prova"
2. Preencher:
   - Data: escolher data futura
   - Horário: definir horário
   - Local: informar sala/unidade
3. Salvar configuração
4. Sistema envia email automático ao aluno

**Email Automático Contém:**
- Data e horário da prova
- Local (endereço completo)
- Documentos necessários
- Instruções específicas

---

#### **ETAPA 4: Realização da Prova**

**Ação Presencial:**
- Aplicar prova conforme planejado
- Registrar presença/falta dos alunos
- Corrigir provas

**Ação no Sistema:**
1. Após correção, acessar cada inscrição
2. Clicar em "Registrar Resultado"
3. Preencher:
   - Nota: nota obtida pelo aluno
   - Resultado:
     - **APROVADO:** Se atingiu nota mínima
     - **REPROVADO:** Se não atingiu
     - **FALTA:** Se não compareceu
4. Salvar resultado
5. Sistema envia email automático

---

#### **ETAPA 5: Resultado e Lista de Espera**

**Cenário A: Aluno Aprovado na Prova**

Ação Automática:
- Status_matricula muda para PENDENTE
- Email enviado: "Parabéns! Você foi aprovado"
- Instruções para matrícula incluídas

**Cenário B: Aluno Reprovado na Prova**

Opções da Secretaria:
1. **Reprovar Definitivamente:**
   - Status_aprovacao = REPROVADA
   - Email de reprovação enviado

2. **Adicionar à Lista de Espera:**
   - Clicar "Adicionar à Lista de Espera"
   - Definir posição (ex: 1º, 2º, 3º)
   - Email informando posição enviado

**Cenário C: Aluno Faltou**

Opções da Secretaria:
1. Reprovar por falta
2. Oferecer segunda chance (remarcar prova)
3. Adicionar à lista de espera

---

#### **ETAPA 6: Processo de Matrícula**

**Ação da Secretaria:**

1. Filtrar inscrições: Status Matrícula = "PENDENTE"
2. Verificar documentação adicional (se necessário)
3. Clicar "Processar Matrícula"
4. Preencher dados complementares (se houver)
5. Status muda para **EM_ANDAMENTO**
6. Quando tudo estiver pronto, clicar **"Concluir Matrícula"**
7. Status muda para **CONCLUIDA**

**Ação Automática do Sistema:**
- Gera carteirinha virtual (PDF)
- Cria número de matrícula único
- Envia email com:
  - PDF da carteirinha anexado
  - Link para app mobile
  - Boas-vindas e informações do curso
  - Data de início das aulas
- Carteirinha disponível no Portal do Aluno

---

#### **ETAPA 7: Acompanhamento Pós-Matrícula**

**Monitoramento:**
- Visualizar relatórios para conferir matrículas concluídas
- Verificar se alunos receberam carteirinha (via email)
- Acompanhar início das aulas

---

### 9.2. Fluxos Alternativos

#### **Fluxo A: Inscrição Direta sem Prova**

Alguns cursos não exigem processo seletivo:

```
1. Aluno inscreve
2. Secretaria analisa documentação
3. Secretaria aprova inscrição
4. Secretaria processa matrícula diretamente
5. Carteirinha gerada
```

**Passo a Passo:**
1. Aprovar inscrição → Status = APROVADA
2. Status_matricula = PENDENTE automaticamente
3. Processar matrícula → Concluir matrícula
4. Carteirinha enviada

---

#### **Fluxo B: Inscrição com Entrevista**

Para cursos específicos:

```
1. Aluno inscreve
2. Secretaria aprova (análise documental)
3. Secretaria configura "prova" como "entrevista"
4. Realiza entrevista presencial
5. Registra resultado como APROVADO/REPROVADO
6. Continua processo normal
```

---

#### **Fluxo C: Gestão de Lista de Espera**

**Quando Usar:**
- Turma lotou
- Aluno qualificado mas não há vagas

**Processo:**
1. Adicionar aluno à lista de espera
2. Definir posição (1, 2, 3...)
3. Se desistência ocorrer:
   - Filtrar inscrições por curso
   - Verificar lista de espera (campo posicao_lista_espera)
   - Contatar próximo da lista manualmente (por email/telefone)
   - Processar matrícula do novo aluno

---

## 10. Casos de Uso Comuns

### 10.1. Aluno Solicita Correção de Dados

**Cenário:**
Aluno entra em contato informando erro no CPF/nome/telefone.

**Solução:**
1. Acessar: Gerenciar Inscrições
2. Buscar pelo nome ou CPF antigo
3. Clicar "Editar"
4. Corrigir os dados
5. Salvar alterações
6. Informar aluno que foi corrigido

---

### 10.2. Aluno Não Recebeu Email de Confirmação

**Cenário:**
Aluno inscreve mas não recebe email.

**Verificação:**
1. Perguntar ao aluno: verificou spam/lixo eletrônico?
2. Conferir email cadastrado no sistema
3. Se email estiver errado, editar inscrição

**Solução Temporária:**
- Reenviar email manualmente (copiar template)
- Confirmar verbalmente as informações

---

### 10.3. Curso Precisa Ser Cancelado

**Cenário:**
Turma não atingiu número mínimo de alunos.

**Processo:**
1. Marcar curso como INATIVO
2. Listar todas as inscrições do curso
3. Reprovar todas as inscrições (motivo: "Turma cancelada")
4. Sistema envia email automático de reprovação
5. Oferecer alternativa: inscrição em outro curso/turma

---

### 10.4. Aluno Desiste Após Aprovação

**Cenário:**
Aluno aprovado desiste antes da matrícula.

**Processo:**
1. Localizar inscrição do aluno
2. Marcar como REPROVADA (motivo: "Desistência do aluno")
3. Verificar lista de espera do curso
4. Chamar próximo aluno da lista
5. Processar matrícula do novo aluno

---

### 10.5. Dúvida sobre Status de Matrícula

**Cenário:**
Aluno pergunta "Quando vou receber minha carteirinha?"

**Verificação:**
1. Buscar inscrição do aluno
2. Ver detalhes → Conferir Status de Matrícula:
   - **PENDENTE:** Matrícula ainda não iniciada
   - **EM_ANDAMENTO:** Documentação pendente
   - **CONCLUIDA:** Carteirinha já foi gerada e enviada

**Resposta Padrão:**
- Se PENDENTE: "Estamos processando, em breve iniciaremos"
- Se EM_ANDAMENTO: "Aguardando [documentação X], envie para prosseguir"
- Se CONCLUIDA: "Já foi enviada! Verifique seu email (incluindo spam)"

---

## 11. Troubleshooting

### 11.1. Problemas Comuns

#### **Problema 1: Inscrição não aparece na lista**

**Possíveis Causas:**
- Filtros aplicados estão ocultando
- Inscrição de outro curso

**Solução:**
1. Limpar todos os filtros (selecionar "TODOS")
2. Pesquisar pelo CPF do aluno
3. Se ainda não aparecer, verificar se inscrição foi realmente enviada

---

#### **Problema 2: Não consigo aprovar inscrição**

**Possíveis Causas:**
- Inscrição já está aprovada
- Erro de permissão (verificar se é ADMIN)

**Solução:**
1. Verificar status atual da inscrição
2. Atualizar página (F5)
3. Se persistir, verificar console do navegador (F12)

---

#### **Problema 3: Email não está sendo enviado**

**Possíveis Causas:**
- Serviço de email não configurado
- Email do aluno inválido

**Solução:**
1. Verificar configuração em `application.properties`:
   ```properties
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=seu-email@gmail.com
   spring.mail.password=sua-senha-app
   ```
2. Verificar logs do backend para erros
3. Confirmar email do aluno está correto

---

#### **Problema 4: Curso não aparece para alunos**

**Possíveis Causas:**
- Status do curso está INATIVO
- Data de início já passou

**Solução:**
1. Acessar Gerenciar Cursos
2. Verificar status do curso → Marcar como ATIVO
3. Verificar datas do curso

---

#### **Problema 5: Relatórios não carregam**

**Possíveis Causas:**
- Muitos dados no sistema (lentidão)
- Erro na API

**Solução:**
1. Atualizar página (F5)
2. Limpar cache do navegador (Ctrl+Shift+Del)
3. Verificar console do navegador (F12)
4. Verificar se backend está rodando

---

### 11.2. Comandos Úteis

#### **Limpar Cache do Navegador:**
```
Chrome: Ctrl + Shift + Delete
Firefox: Ctrl + Shift + Delete
Edge: Ctrl + Shift + Delete
```

#### **Verificar Console do Navegador:**
```
F12 → Aba "Console"
(Erros em vermelho indicam problemas JavaScript)
```

#### **Verificar Requisições:**
```
F12 → Aba "Network"
(Ver se API está retornando 200 OK ou erros 400/500)
```

---

### 11.3. Contatos de Suporte

**Suporte Técnico (TI):**
- Email: suporte.ti@senai.br
- Telefone: (31) 0000-0000

**Documentação Completa:**
- Acesse: `/docs/index.html`
- API Reference: `/docs/backend.html`

---

## 📊 Resumo de Permissões

**O que ADMIN pode fazer:**

| Módulo | Criar | Editar | Excluir | Visualizar |
|--------|-------|--------|---------|------------|
| Unidades | ✅ | ✅ | ✅ | ✅ |
| Cursos | ✅ | ✅ | ✅ | ✅ |
| Usuários | ✅ | ✅ | ✅ | ✅ |
| Editais | ✅ | ✅ | ✅ | ✅ |
| Inscrições | ✅ | ✅ | ✅ | ✅ |
| Relatórios | ❌ | ❌ | ❌ | ✅ |

**O que USER (Aluno) pode fazer:**

| Módulo | Criar | Editar | Excluir | Visualizar |
|--------|-------|--------|---------|------------|
| Seu Perfil | ❌ | ✅ | ❌ | ✅ |
| Suas Inscrições | ✅ | ❌ | ❌ | ✅ |
| Cursos Disponíveis | ❌ | ❌ | ❌ | ✅ |

---

## 🎓 Boas Práticas

### Recomendações para a Equipe

1. **Análise de Inscrições:**
   - Priorizar inscrições mais antigas (análise dentro de 48h)
   - Sempre adicionar observação ao reprovar

2. **Processo Seletivo:**
   - Configurar prova com no mínimo 7 dias de antecedência
   - Enviar email de lembrete 1 dia antes

3. **Gestão de Matrículas:**
   - Processar matrículas em lote (mais eficiente)
   - Verificar se carteirinha foi enviada

4. **Relatórios:**
   - Consultar semanalmente para identificar tendências
   - Usar para planejar abertura de turmas

5. **Comunicação:**
   - Sempre responder emails de alunos em até 24h
   - Manter observações atualizadas no sistema

---

**Versão do Documento:** 1.0  
**Última Atualização:** Março de 2024  
**Sistema:** SEJA SENAI v1.0

---

**📞 Em caso de dúvidas, consulte a documentação técnica completa em `/docs/`**

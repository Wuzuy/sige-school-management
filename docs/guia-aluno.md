# 📱 Guia do Aluno - SIGE

**Sistema de Inscrição e Acompanhamento de Cursos do SENAI**

---

## 🎯 Visão Geral

Este guia apresenta todas as funcionalidades disponíveis para alunos no sistema SIGE, desde o cadastro inicial até o acompanhamento da matrícula e acesso à carteirinha virtual.

---

## 📋 Índice

1. [Primeiro Acesso](#primeiro-acesso)
2. [Navegação pelo Sistema](#navegação-pelo-sistema)
3. [Inscrição em Cursos](#inscrição-em-cursos)
4. [Acompanhamento de Status](#acompanhamento-de-status)
5. [Portal do Aluno](#portal-do-aluno)
6. [Carteirinha Virtual](#carteirinha-virtual)
7. [Esqueci Minha Senha](#esqueci-minha-senha)
8. [Perguntas Frequentes](#perguntas-frequentes)

---

## 1. Primeiro Acesso

### 1.1. Cadastro de Novo Aluno

**Passo a Passo:**

1. Acesse a página inicial: `http://localhost:5500/index.html`
2. Clique no botão **"Login"** no canto superior direito
3. Na página de login, clique em **"Criar nova conta"**
4. Preencha o formulário de cadastro:

```
📋 Dados do Formulário de Cadastro:
├── Nome Completo (obrigatório)
├── Email (obrigatório - será seu login)
├── CPF (obrigatório - formato: 000.000.000-00)
├── RG (opcional)
├── Telefone (obrigatório - formato: (00) 00000-0000)
├── Data de Nascimento (obrigatório)
├── Endereço (opcional)
├── Senha (obrigatório - mínimo 6 caracteres)
└── Confirmação de Senha (obrigatório - deve coincidir)
```

5. Clique em **"Cadastrar"**
6. Se o cadastro for bem-sucedido, você será redirecionado automaticamente para o login

**⚠️ Validações Importantes:**
- Email deve ser único (não pode haver dois cadastros com o mesmo email)
- CPF deve ser válido e único
- Senha deve ter no mínimo 6 caracteres
- Telefone deve estar no formato correto

---

### 1.2. Login no Sistema

**Passo a Passo:**

1. Na página de login (`/login.html`), insira:
   - **Email:** Seu email cadastrado
   - **Senha:** Sua senha
2. Clique em **"Entrar"**
3. Ao fazer login com sucesso, você será redirecionado para a página de cursos

**🔐 Segurança:**
- Suas credenciais são criptografadas
- O sistema usa tokens JWT para autenticação
- Sessões expiram após 24 horas de inatividade

---

## 2. Navegação pelo Sistema

### 2.1. Menu Principal (Topbar)

O menu superior está presente em todas as páginas:

```
🏠 Página Inicial
├── SIGE (logo) - Volta para a página de cursos
├── Cursos - Lista todos os cursos disponíveis
├── Status - Acompanha suas inscrições
├── Portal do Aluno - Acesso ao painel personalizado
└── 👤 Menu de Usuário
    ├── Nome do usuário
    └── Sair
```

### 2.2. Páginas Disponíveis

| Página | URL | Descrição |
|--------|-----|-----------|
| **Cursos** | `/index.html` | Lista todos os cursos ativos com botão de inscrição |
| **Status** | `/status.html` | Acompanha o status das suas inscrições |
| **Portal do Aluno** | `/portal-aluno.html` | Dashboard personalizado do aluno |
| **Inscrição** | `/inscricao.html` | Formulário de inscrição em curso (acessado via botão) |
| **Matrícula** | `/matricula.html` | Finalização da matrícula (quando aprovado) |

---

## 3. Inscrição em Cursos

### 3.1. Visualizando Cursos Disponíveis

**Página:** `/index.html`

1. Após fazer login, você verá cards com todos os cursos ativos
2. Cada card exibe:
   ```
   📚 Informações do Curso:
   ├── Nome do Curso
   ├── Unidade SENAI
   ├── Tipo (Ex: Técnico, Qualificação)
   ├── Turno (Manhã/Tarde/Noite)
   ├── Duração (em meses)
   ├── Data de Início
   └── Botão "Inscrever-se"
   ```

3. **Filtros Disponíveis:**
   - Pesquisar por nome do curso
   - Filtrar por turno (Manhã, Tarde, Noite)
   - Filtrar por unidade

---

### 3.2. Processo de Inscrição

**Passo a Passo:**

1. **Selecionar Curso:**
   - Clique no botão **"Inscrever-se"** no curso desejado
   - Você será redirecionado para `/inscricao.html`

2. **Preencher Formulário de Inscrição:**

```
📝 Dados da Inscrição:
├── 👤 Dados Pessoais (pré-preenchidos do cadastro)
│   ├── Nome Completo
│   ├── Email
│   ├── CPF
│   ├── RG
│   ├── Data de Nascimento
│   └── Telefone
│
├── 📚 Informações Acadêmicas
│   ├── Escolaridade (obrigatório)
│   │   ├── Ensino Fundamental Incompleto
│   │   ├── Ensino Fundamental Completo
│   │   ├── Ensino Médio Incompleto
│   │   ├── Ensino Médio Completo
│   │   └── Ensino Superior
│   └── Instituição de Ensino Anterior (opcional)
│
└── 🏠 Dados Complementares
    ├── Endereço Completo
    ├── CEP
    ├── Cidade
    └── Estado
```

3. **Revisar Dados:**
   - Confira todos os dados preenchidos
   - Verifique se o curso selecionado está correto (exibido no topo)

4. **Enviar Inscrição:**
   - Clique em **"Enviar Inscrição"**
   - Aguarde a confirmação

5. **Confirmação:**
   - ✅ Notificação de sucesso aparecerá
   - Você receberá um email de confirmação
   - A inscrição entrará em status **"EM_ANALISE"**

**⚠️ Importante:**
- Você pode se inscrever em múltiplos cursos
- Cada inscrição é analisada individualmente pela secretaria
- Não é possível editar a inscrição após envio (contate a secretaria se necessário)

---

## 4. Acompanhamento de Status

### 4.1. Página de Status

**Acesso:** `/status.html` ou menu "Status"

**Visualização:**

Nesta página, você verá todas as suas inscrições e seus respectivos status:

```
📊 Status da Inscrição:
├── 🔵 EM_ANALISE - Inscrição enviada, aguardando análise
├── 🟢 APROVADA - Inscrição aprovada, aguardando matrícula
└── 🔴 REPROVADA - Inscrição não aprovada
```

**Informações Exibidas:**

Para cada inscrição, você verá:
- Nome do curso
- Unidade
- Data da inscrição
- Status atual
- Botão "Ver Detalhes" (quando disponível)

---

### 4.2. Linha do Tempo da Inscrição

Quando você clica em "Ver Detalhes", aparece uma timeline com as etapas:

```
🗓️ Timeline da Inscrição:
┌─ 1️⃣ INSCRIÇÃO ENVIADA ✅
│   └── Data: [data da inscrição]
│
├─ 2️⃣ ANÁLISE DOCUMENTAL 🔄
│   └── Status: Em análise pela secretaria
│
├─ 3️⃣ PROCESSO SELETIVO (se aplicável) ⏳
│   ├── Prova: Aguardando data
│   └── Resultado: Pendente
│
├─ 4️⃣ APROVAÇÃO FINAL ⏳
│   └── Aguardando decisão
│
└─ 5️⃣ MATRÍCULA ⏳
    └── A ser realizada após aprovação
```

**Legendas:**
- ✅ = Concluído
- 🔄 = Em andamento  
- ⏳ = Pendente
- ❌ = Não aprovado

---

### 4.3. Notificações por Email

Você receberá emails automáticos em cada mudança de status:

| Evento | Email Enviado |
|--------|---------------|
| Inscrição realizada | ✅ Confirmação de recebimento |
| Aprovação concluída | ✅ Aprovação + próximos passos |
| Prova agendada | ✅ Data, horário e local |
| Resultado da prova | ✅ Aprovado/Reprovado |
| Lista de espera | ✅ Posição e previsão |
| Matrícula liberada | ✅ Link para matrícula online |

---

## 5. Portal do Aluno

### 5.1. Acesso ao Portal

**URL:** `/portal-aluno.html`

O Portal do Aluno é seu painel centralizado com todas as informações.

---

### 5.2. Seções do Portal

#### 📊 Dashboard

Visão geral com cards informativos:

```
📈 Cards do Dashboard:
├── Total de Inscrições
├── Inscrições Aprovadas
├── Inscrições em Análise
└── Curso Ativo (quando matriculado)
```

#### 👤 Perfil do Aluno

Visualize e edite seus dados pessoais:

**Dados Editáveis:**
- Nome completo
- Telefone
- Endereço
- Data de nascimento

**Dados NÃO Editáveis:**
- Email (usado como login)
- CPF
- RG

**Como Editar:**
1. Clique no botão **"Editar Perfil"**
2. Altere os campos desejados
3. Clique em **"Salvar Alterações"**
4. Confirmação aparecerá

#### 📚 Minhas Inscrições

Lista completa de todas as suas inscrições:

```
📋 Informações por Inscrição:
├── Nome do Curso
├── Unidade
├── Data de Inscrição
├── Status Atual
├── Botão "Ver Detalhes" - Abre timeline completa
└── Badge colorido de status
```

#### 🔐 Alterar Senha

Seção de segurança para trocar sua senha:

**Passo a Passo:**
1. Digite a senha atual
2. Digite a nova senha (mínimo 6 caracteres)
3. Confirme a nova senha
4. Clique em **"Salvar Nova Senha"**

**Validações:**
- Senha atual deve estar correta
- Nova senha deve ter no mínimo 6 caracteres
- Confirmação deve coincidir com nova senha

---

## 6. Carteirinha Virtual

### 6.1. O que é a Carteirinha Virtual?

Após a conclusão da matrícula, você receberá uma **carteirinha virtual de aluno** que comprova seu vínculo com o SENAI.

---

### 6.2. Como Receber a Carteirinha

**Processo Automático:**

1. **Matrícula Concluída:**
   - Quando a secretaria finalizar sua matrícula e marcar status como **"CONCLUIDA"**

2. **Geração Automática:**
   - O sistema gera automaticamente sua carteirinha virtual
   - Informações incluídas:
     ```
     🎫 Dados da Carteirinha:
     ├── Foto do Aluno (se fornecida)
     ├── Nome Completo
     ├── CPF
     ├── Matrícula (número único)
     ├── Curso
     ├── Unidade SENAI
     ├── Turno
     ├── Data de Validade
     └── QR Code (verificação)
     ```

3. **Envio por Email:**
   - Você receberá um email no endereço cadastrado
   - **Assunto:** "Sua Carteirinha Virtual - SIGE"
   - **Anexo:** Arquivo PDF com a carteirinha
   - **Link:** Link para download do aplicativo mobile

---

### 6.3. Aplicativo Mobile (Em Desenvolvimento)

**📱 Carteirinha APK - SIGE**

Um aplicativo Android será disponibilizado para facilitar o acesso à carteirinha:

**Funcionalidades do App:**
- 📲 Carteirinha sempre acessível offline
- 🔍 QR Code para validação presencial
- 🔔 Notificações de eventos e avisos
- 📅 Calendário acadêmico
- 📊 Acompanhamento de frequência (futuro)
- 📚 Consulta de notas (futuro)

**Como Baixar:**
1. Link será enviado por email junto com a carteirinha
2. Também disponível no Portal do Aluno
3. Instalação: Permitir instalação de apps desconhecidos (Android)

**Tecnologias:**
- Kotlin/Java (Android nativo)
- SQLite (armazenamento local)
- Retrofit (comunicação com API)
- ZXing (geração de QR Code)

---

### 6.4. Usando a Carteirinha

**Casos de Uso:**

1. **Identificação Presencial:**
   - Apresente a carteirinha (física ou digital) no SENAI
   - Validação via QR Code pela equipe

2. **Acesso a Laboratórios:**
   - Escaneamento do QR Code para registro de entrada

3. **Benefícios Estudantis:**
   - Descontos em transporte (quando aplicável)
   - Acesso à biblioteca
   - Uso de equipamentos

4. **Eventos e Palestras:**
   - Check-in em eventos do SENAI
   - Certificados de participação

---

## 7. Esqueci Minha Senha

### 7.1. Recuperação de Senha

**Passo a Passo:**

1. **Acesse a Página de Recuperação:**
   - Na página de login, clique em **"Esqueci minha senha"**
   - Ou acesse diretamente: `/forgot-password.html`

2. **Solicitar Link de Recuperação:**
   - Digite seu email cadastrado
   - Clique em **"Enviar Link de Recuperação"**

3. **Verifique seu Email:**
   - Você receberá um email com um link de recuperação
   - **Atenção:** Verifique a pasta de spam/lixo eletrônico
   - Link válido por **15 minutos**

4. **Redefinir Senha:**
   - Clique no link recebido no email
   - Digite sua nova senha (mínimo 6 caracteres)
   - Confirme a nova senha
   - Clique em **"Redefinir Senha"**

5. **Login com Nova Senha:**
   - Após redefinir, faça login com a nova senha

**⚠️ Importante:**
- O link de recuperação expira em 15 minutos
- Se não receber o email, verifique se o email está correto
- Em caso de problemas, contate a secretaria

---

## 8. Perguntas Frequentes

### 8.1. Cadastro e Login

**Q: Posso usar o mesmo CPF para mais de um cadastro?**  
R: Não. cada CPF só pode ter um cadastro no sistema.

**Q: Esqueci meu email de cadastro. O que faço?**  
R: Entre em contato com a secretaria da unidade SENAI com seu CPF para recuperar.

**Q: Minha senha precisa ter caracteres especiais?**  
R: Não obrigatoriamente, mas é recomendado para maior segurança.

---

### 8.2. Inscrições

**Q: Posso me inscrever em mais de um curso ao mesmo tempo?**  
R: Sim! Você pode se inscrever em quantos cursos desejar.

**Q: Como sei se minha inscrição foi recebida?**  
R: Você receberá um email de confirmação e pode ver no menu "Status".

**Q: Quanto tempo demora a análise da inscrição?**  
R: Varia por curso, mas geralmente de 3 a 7 dias úteis.

**Q: Posso cancelar minha inscrição?**  
R: Entre em contato com a secretaria para solicitar cancelamento.

---

### 8.3. Status e Acompanhamento

**Q: O que significa "EM_ANALISE"?**  
R: Sua inscrição foi recebida e está sendo analisada pela equipe.

**Q: Fui reprovado. Posso me inscrever novamente?**  
R: Sim! Verifique os requisitos e tente em outro edital.

**Q: Estou na lista de espera. E agora?**  
R: Aguarde. Você será notificado por email caso surja uma vaga.

---

### 8.4. Portal do Aluno

**Q: Posso alterar meu email?**  
R: Não diretamente. Contate a secretaria para solicitar alteração.

**Q: Como atualizo meu telefone?**  
R: No Portal do Aluno, seção "Perfil", clique em "Editar Perfil".

---

### 8.5. Matrícula e Carteirinha

**Q: Quando recebo minha carteirinha?**  
R: Após a matrícula ser concluída pela secretaria, em até 24 horas.

**Q: Perdi minha carteirinha. Como faço?**  
R: Acesse o Portal do Aluno ou verifique seu email. O PDF estará lá.

**Q: O aplicativo funciona sem internet?**  
R: Sim! A carteirinha fica salva localmente e funciona offline.

---

## 🆘 Suporte

### Contato

**Problemas Técnicos:**
- Email: suporte.ti@senai.br
- Telefone: (00) 0000-0000

**Dúvidas sobre Inscrições:**
- Contate a secretaria da unidade desejada
- Horário: Segunda a Sexta, 8h às 18h

**Documentação Técnica:**
- Acesse: `/docs/index.html`
- GitHub: [repositório do projeto]

---

## 📱 Próximas Atualizações

**Funcionalidades Futuras:**
- 📊 Consulta de notas e frequência
- 📅 Calendário de aulas e eventos
- 💬 Chat direto com a secretaria
- 📚 Material didático online
- 🎓 Certificados digitais

---

**Versão do Documento:** 1.0  
**Última Atualização:** Março de 2026  
**Sistema:** SIGE v1.0

---

**🎓 Desejamos um excelente curso a você!**

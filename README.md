# 🎓 SIGE

**Sistema de Gerenciamento de Inscrições e Processo Seletivo Online**

[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![H2](https://img.shields.io/badge/H2-Database-blue)](http://www.h2database.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📖 Sobre o Projeto

O **SIGE** é uma plataforma completa para gerenciamento de inscrições e processo seletivo online do SENAI. O sistema permite que alunos se inscrevam em cursos de forma totalmente digital, enquanto a equipe administrativa gerencia todo o processo desde a análise de documentos até a emissão de carteirinhas virtuais.

**Problema Resolvido:**
- ❌ Superlotação nas unidades presenciais para inscrições
- ❌ Dificuldade de acesso para pessoas com mobilidade reduzida
- ❌ Processos manuais demorados para a secretaria
- ❌ Falta de transparência no acompanhamento de status

**Solução:**
- ✅ Inscrições 100% online, disponíveis 24/7
- ✅ Acompanhamento em tempo real do status
- ✅ Portal administrativo completo para a secretaria
- ✅ Relatórios e estatísticas automáticas
- ✅ Sistema de notificações via email
- ✅ Carteirinha virtual gerada automaticamente

---

## ✨ Funcionalidades Principais

### 👤 Para Alunos

- **Cadastro e Login Seguro** - Autenticação com JWT
- **Recuperação de Senha** - Reset via email com token de 15 minutos
- **Navegação de Cursos** - Visualizar todos os cursos disponíveis
- **Inscrição Online** - Formulário completo com validações
- **Acompanhamento de Status** - Timeline visual do processo
- **Portal do Aluno** - Dashboard personalizado
- **Edição de Perfil** - Atualizar dados pessoais
- **Notificações Toast** - Feedback visual com Notyf library

### 🏢 Para Secretaria (Administradores)

- **Portal Administrativo Completo** - Interface dedicada
- **Gerenciar Unidades** - CRUD completo
- **Gerenciar Cursos** - Cadastro, edição, ativação/desativação
  - Filtros avançados: unidade, status, pesquisa
- **Gerenciar Usuários** - Criar admins e alunos
- **Gerenciar Editais** - Publicação de editais ativos
- **Gerenciar Inscrições** - Workflow completo:
  - Análise documental
  - Aprovação/Reprovação
  - Configuração de prova
  - Registro de resultados
  - Gestão de lista de espera
  - Processamento de matrícula
  - Observações internas
  - Filtros específicos: curso, status, pesquisa
- **Relatórios e Estatísticas**:
  - Dashboard com métricas gerais
  - Relatório por curso
  - Inscrições recentes
  - Exportação (planejado)

### 🎫 Carteirinha Virtual (Planejado)

- **Geração Automática** - Após conclusão da matrícula
- **Envio por Email** - PDF anexado automaticamente
- **QR Code** - Para validação presencial
- **Aplicativo Mobile** - APK Android (em desenvolvimento)

---

## 🛠️ Tecnologias Utilizadas

### Backend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Java** | 21 | Linguagem principal |
| **Spring Boot** | 3.2 | Framework backend |
| **Spring Security** | 6.x | Autenticação e autorização |
| **JWT** | 0.11.5 | Tokens de autenticação |
| **Hibernate/JPA** | 6.x | ORM para banco de dados |
| **H2 Database** | 2.x | Banco em memória (testes) |
| **MySQL** | 8.0 | Banco de dados (produção) |
| **Spring Mail** | 3.2 | Envio de emails |
| **Bean Validation** | 3.x | Validações de dados |
| **Maven** | 3.x | Gerenciador de dependências |

### Frontend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **HTML5** | - | Estrutura das páginas |
| **CSS3** | - | Estilização responsiva |
| **JavaScript (Vanilla)** | ES6+ | Lógica da aplicação |
| **Notyf** | 3.x | Notificações toast |
| **Fetch API** | - | Comunicação com backend |

---

## 📁 Estrutura do Projeto

```
sige/
├── backend/                          # Aplicação Spring Boot
│   ├── src/main/
│   │   ├── java/com/wuzuy/sige/
│   │   │   ├── sigeApplication.java
│   │   │   ├── config/               # Configurações (Security, JWT)
│   │   │   ├── controller/           # Endpoints REST
│   │   │   ├── dto/                  # Data Transfer Objects
│   │   │   ├── model/                # Entidades JPA
│   │   │   └── repository/           # Repositórios JPA
│   │   └── resources/
│   │       └── application.properties
│   ├── pom.xml
│   ├── mvnw, mvnw.cmd                # Maven wrapper
│   └── readme.md
│
├── frontend-web/                     # Interface Web
│   └── static/
│       ├── index.html                # Página de cursos
│       ├── login.html                # Login e cadastro
│       ├── inscricao.html            # Formulário de inscrição
│       ├── status.html               # Acompanhamento de status
│       ├── portal-aluno.html         # Portal do aluno
│       ├── portal-secretaria.html    # Portal administrativo
│       ├── matricula.html            # Finalização de matrícula
│       ├── forgot-password.html      # Recuperação de senha
│       ├── scripts.js                # Lógica JavaScript
│       └── app.css                   # Estilos globais
│
├── docs/                             # Documentação completa
│   ├── index.html                    # Página inicial da docs
│   ├── backend.html                  # Documentação backend
│   ├── frontend.html                 # Documentação frontend
│   ├── guia-aluno.md                 # Guia completo do aluno
│   ├── guia-secretaria.md            # Guia completo da secretaria
│   ├── carteirinha-sistema.md        # Sistema de carteirinha
│   └── postman/                      # Coleções Postman
│
├── database/                         # Scripts SQL
│   └── readme.md                     # Instruções de DB
│
├── mobile-app/                       # Aplicativo Android (futuro)
│   └── readme.md
│
├── .gitignore                        # Arquivos ignorados pelo Git
└── README.md                         # Este arquivo
```

---

## 🚀 Instalação e Execução

### Pré-requisitos

- **Java 21+** - [Download OpenJDK](https://openjdk.org/projects/jdk/21/)
- **Maven** (incluído via wrapper - não precisa instalar)
- **IDE** - IntelliJ IDEA, Eclipse ou VS Code (recomendado)
- **Navegador Moderno** - Chrome, Firefox, Edge
- **MySQL 8.0+** (opcional - para produção)

---

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/Wuzuy/sige.git
cd sige
```

---

### ⚡ Início Rápido (Windows)

Execute o arquivo BAT para iniciar tudo automaticamente:

```bash
INICIAR-PROJETO.bat
```

**O que esse script faz:**
- ✅ Inicia o backend na porta 8080 em uma janela separada
- ✅ Mostra instruções para abrir o frontend na porta 5500
- ✅ Verifica pré-requisitos automaticamente

**URLs após execução:**
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5500` (Live Server)

---

### 2️⃣ Configurar o Backend

#### Opção A: Banco H2 (Recomendado para Testes)

**Vantagens:** Não requer instalação, dados em memória, rápido.

1. Abrir arquivo `backend/src/main/resources/application.properties`
2. Verificar configuração H2:

```properties
# Banco de Dados H2 (Em Memória)
spring.datasource.url=jdbc:h2:mem:sige
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true

# Console H2 (http://localhost:8080/h2-console)
spring.h2.console.enabled=true
```

#### Opção B: MySQL (Para Produção)

1. Criar banco de dados no MySQL:

```sql
CREATE DATABASE sige CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Configurar em `application.properties`:

```properties
# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/sige?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=sua-senha
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

---

### 3️⃣ Configurar Email Service (Opcional)

Para funcionar recuperação de senha e notificações:

```properties
# Gmail SMTP
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seu-email@gmail.com
spring.mail.password=sua-senha-app
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**💡 Dica:** Use uma "Senha de App" do Gmail, não sua senha real.  
[Como gerar senha de app](https://support.google.com/accounts/answer/185833)

---

### 4️⃣ Executar o Backend

**Windows:**
```bash
cd backend
mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
cd backend
./mvnw spring-boot:run
```

**Ou via IDE:**
- Abrir projeto no IntelliJ/Eclipse/VS Code
- Executar `sigeApplication.java`

**Verificar:** Backend rodando em `http://localhost:8080`

---

### 5️⃣ Popular com Dados de Teste (Recomendado)

Execute o script PowerShell para criar dados iniciais:

```powershell
cd backend
powershell -ExecutionPolicy Bypass -File popular-dados-teste.ps1
```

**Dados Criados:**
- 1 Administrador
- 3 Usuários teste
- 4 Unidades SENAI
- 5 Cursos ativos
- 3 Editais

**Credenciais Criadas:**

| Email | Senha | Role |
|-------|-------|------|
| admin@senai.com | Admin@123 | ADMIN |
| joao@email.com | 123456 | USER |
| maria@email.com | 123456 | USER |
| carlos@email.com | 123456 | USER |

---

### 6️⃣ Executar o Frontend

**Opção A: Live Server (VS Code)**

1. Instalar extensão "Live Server"
2. Clicar com botão direito em `frontend-web/static/index.html`
3. Selecionar "Open with Live Server"
4. Acessar: `http://localhost:5500`

**Opção B: Python HTTP Server**

```bash
cd frontend-web/static
python -m http.server 5500
```

**Opção C: Node.js HTTP Server**

```bash
cd frontend-web/static
npx http-server -p 5500
```

**Opção D: Diretamente no Navegador**

- Abrir arquivo `frontend-web/static/index.html` no navegador
- **Atenção:** Algumas funcionalidades podem não funcionar por CORS

---

## 📊 Endpoints da API

**Base URL:** `http://localhost:8080/api`

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/register` | Cadastro de usuário | ❌ |
| POST | `/auth/login` | Login | ❌ |
| POST | `/auth/forgot-password` | Solicitar reset de senha | ❌ |
| POST | `/auth/reset-password` | Redefinir senha | ❌ |

### Unidades

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/unidades` | Listar todas as unidades | ✅ |
| GET | `/unidades/{id}` | Buscar unidade por ID | ✅ |
| POST | `/unidades` | Criar nova unidade | ✅ ADMIN |
| PUT | `/unidades/{id}` | Atualizar unidade | ✅ ADMIN |
| DELETE | `/unidades/{id}` | Excluir unidade | ✅ ADMIN |

### Cursos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/cursos` | Listar todos os cursos | ✅ |
| GET | `/cursos/ativos` | Listar apenas cursos ativos | ❌ |
| GET | `/cursos/{id}` | Buscar curso por ID | ✅ |
| POST | `/cursos` | Criar novo curso | ✅ ADMIN |
| PUT | `/cursos/{id}` | Atualizar curso | ✅ ADMIN |
| DELETE | `/cursos/{id}` | Excluir curso | ✅ ADMIN |

### Usuários

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/usuarios` | Listar todos os usuários | ✅ ADMIN |
| GET | `/usuarios/{id}` | Buscar usuário por ID | ✅ |
| POST | `/usuarios` | Criar novo usuário | ✅ ADMIN |
| PUT | `/usuarios/{id}` | Atualizar usuário | ✅ |
| DELETE | `/usuarios/{id}` | Excluir usuário | ✅ ADMIN |
| PUT | `/usuarios/{id}/senha` | Alterar senha | ✅ |

### Editais

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/editais` | Listar todos os editais | ✅ |
| GET | `/editais/ativos` | Listar apenas editais ativos | ❌ |
| POST | `/editais` | Criar novo edital | ✅ ADMIN |
| PUT | `/editais/{id}` | Atualizar edital | ✅ ADMIN |
| DELETE | `/editais/{id}` | Excluir edital | ✅ ADMIN |

### Inscrições

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/inscricoes` | Listar todas as inscrições | ✅ ADMIN |
| GET | `/inscricoes/aluno/{id}` | Listar inscrições do aluno | ✅ |
| GET | `/inscricoes/{id}` | Buscar inscrição por ID | ✅ |
| POST | `/inscricoes` | Criar nova inscrição | ✅ |
| PUT | `/inscricoes/{id}` | Atualizar inscrição | ✅ ADMIN |
| PUT | `/inscricoes/{id}/aprovar` | Aprovar inscrição | ✅ ADMIN |
| PUT | `/inscricoes/{id}/reprovar` | Reprovar inscrição | ✅ ADMIN |
| PUT | `/inscricoes/{id}/prova` | Configurar prova | ✅ ADMIN |
| PUT | `/inscricoes/{id}/resultado` | Registrar resultado | ✅ ADMIN |
| PUT | `/inscricoes/{id}/matricula` | Processar matrícula | ✅ ADMIN |
| DELETE | `/inscricoes/{id}` | Excluir inscrição | ✅ ADMIN |

**Legenda:**
- ❌ = Sem autenticação
- ✅ = Requer autenticação JWT
- ✅ ADMIN = Requer autenticação + role ADMIN

---

## 🧪 Testes com Postman

O projeto inclui coleções Postman completas em `docs/postman/`.

**Importar no Postman:**
1. Abrir Postman
2. Clicar em "Import"
3. Selecionar arquivos `.json` da pasta `docs/postman/collections/`

**Configurar Variáveis:**
- `baseUrl`: `http://localhost:8080/api`
- `token`: (será preenchido automaticamente após login)

---

## 📚 Documentação Completa

Toda a documentação está disponível em `docs/`:

- **[Guia do Aluno](docs/guia-aluno.md)** - Manual completo para alunos
- **[Guia da Secretaria](docs/guia-secretaria.md)** - Manual completo para administradores
- **[Sistema de Carteirinha](docs/carteirinha-sistema.md)** - Documentação técnica da carteirinha virtual
- **[Backend](docs/backend.html)** - Documentação técnica do backend
- **[Frontend](docs/frontend.html)** - Documentação técnica do frontend
- **[Quick Start](docs/quick-start.html)** - Guia de 3 minutos
- **[Troubleshooting](docs/troubleshooting.html)** - Solução de problemas comuns

**Acessar documentação HTML:**
```bash
# Abrir no navegador:
docs/index.html
```

---

## 🔐 Segurança

### Autenticação JWT

- **Token expira em:** 24 horas
- **Algoritmo:** HS256
- **Header:** `Authorization: Bearer {token}`

### Roles

- **ADMIN:** Acesso total ao Portal da Secretaria
- **USER:** Acesso ao Portal do Aluno

### Validações

- Bean Validation em todos os DTOs
- Tratamento global de exceções
- Mensagens de erro amigáveis

### Email Service

- Reset de senha com token único
- Token expira em 15 minutos
- Templates HTML personalizados

---

## 🐛 Troubleshooting

### Backend não inicia

**Erro:** `Port 8080 already in use`

**Solução:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

---

### Frontend não se conecta ao Backend

**Erro:** `CORS policy blocked`

**Solução:** Verificar se backend tem configuração CORS:

```java
// SecurityConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5500"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    return source;
}
```

---

### Email não está sendo enviado

**Erro:** `Authentication failed`

**Solução:**
1. Verificar credenciais em `application.properties`
2. Usar "Senha de App" do Gmail (não senha normal)
3. Habilitar "Acesso de apps menos seguros" (Gmail)

---

### Dados de teste não criados

**Erro:** Script PowerShell bloqueado

**Solução:**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## 📈 Roadmap

### ✅ Versão 1.0 (Atual)

- [x] Sistema de autenticação completo
- [x] CRUD de unidades, cursos, usuários, editais
- [x] Workflow de inscrições completo
- [x] Portal do aluno
- [x] Portal administrativo
- [x] Relatórios e estatísticas
- [x] Sistema de notificações (Notyf)
- [x] Filtros avançados

### 🔄 Versão 2.0 (Em Desenvolvimento)

- [ ] Sistema de carteirinha virtual
  - [ ] Backend: geração de PDF + QR Code
  - [ ] Email automático com carteirinha
  - [ ] Endpoints de validação
- [ ] Aplicativo Android
  - [ ] Visualização da carteirinha offline
  - [ ] QR Code dinâmico
  - [ ] Notificações push

### 📋 Versão 3.0 (Planejado)

- [ ] Exportação de relatórios (Excel, PDF)
- [ ] Dashboard avançado com gráficos
- [ ] Sistema de mensagens interno
- [ ] Calendário acadêmico
- [ ] Consulta de notas e frequência
- [ ] Certificados digitais
- [ ] App iOS

---

## 👥 Equipe

**Desenvolvedor:** Lucas  
**Email:** lucas@exemplo.com  
**GitHub:** [@wuzuy](https://github.com/wuzuy)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📞 Suporte

**Problemas Técnicos:**
- Email: suporte.ti@senai.br
- Issues: [GitHub Issues](https://github.com/seu-usuario/sige/issues)

**Documentação:**
- Acesse: `docs/index.html`
- Wiki: [GitHub Wiki](https://github.com/seu-usuario/sige/wiki)

---

## ⭐ Agradecimentos

- Spring Boot Community
- Notyf Library
- H2 Database Team
- SENAI - Serviço Nacional de Aprendizagem Industrial

---

**Versão:** 1.0  
**Última Atualização:** Março de 2024  
**Status:** ✅ Pronto para Produção

5. **Faça login**:
   - Admin: `admin@senai.com` / `Admin@123`
   - Usuário: `joao@teste.com` / `Senha@123`

### Acesso aos Serviços
- **Frontend:** `http://localhost:5500`
- **Backend API:** `http://localhost:8080/api`
- **H2 Console:** `http://localhost:8080/h2-console` (apenas com H2)

## ⚡ Scripts Executores (Recomendado)

Para facilitar o desenvolvimento, criamos scripts que automatizam todo o processo de inicialização:

### 🎯 Script Completo (Mais Fácil)
```batch
.\iniciar-tudo.bat
```
Este script faz TUDO automaticamente:
- ✅ Inicia o backend Spring Boot
- ✅ Aguarda inicialização completa
- ✅ Inicia o frontend com servidor HTTP
- ✅ Popula o banco com dados de teste

### 📋 Scripts Individuais

| Script | Descrição |
|--------|-----------|
| `iniciar-backend.bat` | Inicia apenas o backend |
| `iniciar-frontend.bat` | Inicia apenas o frontend (detecta Python/Node automaticamente) |
| `inserir-dados.bat` | Popula banco com dados de teste |
| `parar-sistema.bat` | Para todos os processos |
| `verificar-status.bat` | Verifica se backend e frontend estão rodando |

📖 **Guia Completo:** Consulte [GUIA-SCRIPTS.md](GUIA-SCRIPTS.md) para instruções detalhadas, troubleshooting e exemplos de uso.

## 📁 Estrutura do Repositório

```
sige/
├── backend/                    # API REST (Java + Spring Boot)
│   ├── src/main/java/         # Código fonte
│   ├── src/main/resources/    # Configurações
│   └── pom.xml                # Dependências Maven
│
├── frontend-web/              # Interface Web
│   └── static/                # HTML, CSS, JS
│       ├── index.html         # Página inicial
│       ├── login.html         # Login
│       ├── inscricao.html     # Inscrição
│       ├── matricula.html     # Matrícula online
│       ├── portal-aluno.html  # Portal do aluno
│       ├── portal-secretaria.html  # Portal admin
│       ├── scripts.js         # Lógica JavaScript
│       └── app.css            # Estilos
│
├── mobile-app/                # App Mobile (em desenvolvimento)
│
├── database/                  # Scripts SQL (MySQL)
│
├── docs/                      # Documentação Técnica
│   ├── index.html            # Página inicial da documentação
│   ├── developer-docs.html   # Documentação completa
│   ├── security.html         # Segurança
│   ├── backend.html          # APIs
│   ├── frontend.html         # Frontend
│   └── init.html             # Guia de inicialização
│
├── popular-dados-teste.ps1   # Script para popular banco de testes
├── iniciar-teste-completo.bat # Script completo (inicia + popula)
└── README.md                 # Este arquivo
```

## 🔐 Segurança

O sistema implementa múltiplas camadas de segurança:

- **Rate Limiting** - 100 requisições por minuto por IP (Bucket4j)
- **Senhas Fortes** - Mínimo 8 caracteres, maiúsculas, números e caracteres especiais
- **JWT Robusto** - Token com segredo de 256 bits e validação completa
- **Brute Force Protection** - Bloqueio após 5 tentativas falhas por 15 minutos
- **HTTP Security Headers** - CSP, XSS Protection, Frame Options, HSTS
- **Sanitização de Inputs** - Validação frontend e backend

📄 Documentação completa de segurança: [docs/security.html](docs/security.html)

## 🧪 Testes e Desenvolvimento

### Scripts de Teste
- **`popular-dados-teste.ps1`** - Popula banco com dados de teste
- **`iniciar-teste-completo.bat`** - Inicia backend e popula automaticamente
- **`limpar-banco.bat`** - Zera o banco de dados (H2 ou MySQL)

### Zerar Banco de Dados

**Script Automático (Recomendado):**
```bash
.\limpar-banco.bat
```
O script detecta automaticamente se você está usando H2 ou MySQL e executa o procedimento correto.

**H2 (Banco em Memória):**
- Zera automaticamente ao reiniciar backend
- Configuração: `spring.jpa.hibernate.ddl-auto=create-drop`
- Comando: `.\parar-sistema.bat` → `.\iniciar-backend.bat`

**MySQL (Banco Persistente):**
- Requer zerar manualmente (dados persistem)
- Via MySQL Workbench ou linha de comando:
  ```sql
  DROP DATABASE sige_db;
  CREATE DATABASE sige_db;
  ```
- Reinicie backend para recriar tabelas

📖 **Guia detalhado:** [docs/troubleshooting.html](docs/troubleshooting.html) (seção "Como Zerar o Banco de Dados")

### Perfis de Banco de Dados
- **MySQL (Produção)**: `spring.profiles.active=mysql`
- **H2 (Testes)**: `spring.profiles.active=h2`

### Console H2
Acesse `http://localhost:8080/h2-console`:
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (deixe em branco)

## � Configuração de Recuperação de Senha (Opcional)

O sistema inclui funcionalidade de recuperação de senha via email usando Gmail SMTP. Para ativar:

### 1. Configure uma Conta Gmail

1. Acesse [Google Account Security](https://myaccount.google.com/security)
2. Ative **Verificação em 2 etapas** (obrigatório)
3. Acesse **Senhas de app** 
4. Crie uma senha de app com nome "SIGE"
5. Copie a senha gerada (16 caracteres)

### 2. Configure application.properties

Edite `backend/src/main/resources/application.properties`:

```properties
# Email remetente (Gmail)
spring.mail.username=seu-email@gmail.com

# Senha de app gerada (NÃO é a senha da sua conta!)
spring.mail.password=abcd efgh ijkl mnop
```

### 3. Reinicie o Backend

```bash
.\parar-sistema.bat
.\iniciar-backend.bat
```

### 4. Teste a Recuperação

1. Acesse: `http://localhost:5500/static/forgot-password.html`
2. Digite o email cadastrado
3. Verifique o email recebido
4. Clique no link e defina nova senha

**Segurança:**
- Tokens expiram em 30 minutos
- Cada token é de uso único
- Senhas devem ter 8+ caracteres, maiúscula, minúscula, número e especial

📖 **Troubleshooting completo:** Consulte [docs/troubleshooting.html](docs/troubleshooting.html#configurar-recuperação-de-senha)

## �📚 Documentação

A documentação técnica completa está disponível em `/docs`:
- **Guia de Inicialização**: [docs/init.html](docs/init.html)
- **Documentação do Backend**: [docs/backend.html](docs/backend.html)
- **Documentação do Frontend**: [docs/frontend.html](docs/frontend.html)
- **Documentação de Segurança**: [docs/security.html](docs/security.html)
- **Documentação Completa**: [docs/developer-docs.html](docs/developer-docs.html)

A documentação é responsiva e pode ser acessada em qualquer dispositivo.

## 🔧 Tecnologias Utilizadas

### Backend
- Java 21
- Spring Boot 3.4.5
- Spring Security + JWT (jjwt 0.11.5)
- Spring Data JPA
- Spring Boot Mail (Gmail SMTP)
- MySQL 8.0+ / H2 Database
- Bucket4j 8.1.0 (rate limiting)
- BCrypt (criptografia de senhas)

### Frontend
- HTML5 + CSS3
- JavaScript (vanilla)
- LocalStorage (gestão de autenticação)
- Design Responsivo (Mobile-first)

### Mobile (em desenvolvimento)
- Kotlin
- Android Studio

## 👥 Sobre o Projeto

Projeto desenvolvido para o curso Técnico de Desenvolvimento de Sistemas na Firjan SENAI Duque de Caxias.

* **Turma:** TEC00412025.1046
* **Orientadora:** Ana Carla
* **Desenvolvedores:** 
  * Artur de Paula Santos
  * João Felipe da Costa Moreira
  * João Miguel Gonçalves Coelho
  * Lucas Matheus Lima Sandin
  * Yago Mamud Amorim

## 📝 Licença

Projeto acadêmico desenvolvido para o SENAI.

---

**Versão:** 1.0.0  
**Status:** ✅ Produção  
**Última Atualização:** Março 2026

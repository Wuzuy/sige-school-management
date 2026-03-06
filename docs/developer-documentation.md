# Documentação de Desenvolvedor - Sistema SEJA SENAI

## Índice
1. [Visão Geral](#visao-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Configuração do Ambiente](#configuracao-do-ambiente)
5. [Estrutura do Projeto](#estrutura-do-projeto)
6. [Backend - API REST](#backend-api-rest)
7. [Frontend - Interface Web](#frontend-interface-web)
8. [Fluxo de Dados](#fluxo-de-dados)
9. [Segurança e Autenticação](#seguranca-e-autenticacao)
10. [Deploy e Manutenção](#deploy-e-manutencao)
11. [Diagrama Entidade-Relacionamento](#diagrama-entidade-relacionamento)
12. [Fluxograma do Processo](#fluxograma-do-processo)

---

## Visão Geral

O Sistema SEJA SENAI é uma plataforma completa para gerenciamento de inscrições em cursos profissionalizantes do SENAI. O sistema permite que candidatos se inscrevam em cursos, acompanhem o status de suas inscrições através de múltiplas etapas (análise, prova, lista de espera, matrícula) e finalizem o processo de matrícula online.

### Funcionalidades Principais

- **Para Alunos:**
  - Visualização de cursos disponíveis
  - Inscrição em cursos com formulário completo
  - Acompanhamento do status da inscrição com timeline visual
  - Aceite ou recusa de matrícula online
  - Gestão de perfil pessoal

- **Para Secretaria:**
  - Gerenciamento completo de cursos, unidades e editais
  - Administração de usuários
  - Controle de todas as etapas do processo seletivo
  - Relatórios e dashboards com estatísticas
  - Gestão detalhada de cada inscrição

---

## Arquitetura do Sistema

O sistema segue uma arquitetura **cliente-servidor** com separação clara entre:

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Client)                       │
│                   HTML5 + CSS3 + Vanilla JS                  │
│                    SPA-like Navigation                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/REST
                       │ JSON
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (Server)                        │
│                  Spring Boot 3.x + Java 21                   │
│              JPA/Hibernate + Spring Security                 │
└──────────────────────┬──────────────────────────────────────┘
                       │ JDBC
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL/MySQL)                 │
│                    Relational Database                       │
└─────────────────────────────────────────────────────────────┘
```

### Padrões de Design Utilizados

- **MVC (Model-View-Controller):** Separação de responsabilidades no backend
- **Repository Pattern:** Abstração da camada de acesso a dados
- **DTO (Data Transfer Objects):** Para transferência segura de dados
- **JWT (JSON Web Tokens):** Para autenticação stateless
- **CORS:** Configuração para permitir comunicação cross-origin

---

## Tecnologias Utilizadas

### Backend
- **Java 21:** Linguagem principal
- **Spring Boot 3.4.5:** Framework principal
- **Spring Data JPA:** Persistência de dados
- **Spring Security:** Autenticação e autorização
- **JWT (io.jsonwebtoken:jjwt):** Tokens de autenticação
- **BCrypt:** Hash de senhas
- **Maven:** Gerenciador de dependências
- **H2/PostgreSQL/MySQL:** Opções de banco de dados

### Frontend
- **HTML5:** Estrutura das páginas
- **CSS3:** Estilização com Grid, Flexbox e Media Queries
- **JavaScript ES6+:** Lógica da aplicação
- **Fetch API:** Comunicação com backend
- **LocalStorage:** Armazenamento de tokens JWT

### DevOps & Tools
- **Git:** Controle de versão
- **Maven Wrapper (mvnw):** Build automatizado
- **PowerShell:** Scripts de automação (Windows)

---

## Configuração do Ambiente

### Pré-requisitos

1. **Java Development Kit (JDK) 21+**
   - Download: https://adoptium.net/
   - Verificar instalação: `java -version`

2. **Maven 3.8+** (ou usar o wrapper incluído)
   - Verificar: `mvn -version`

3. **Banco de Dados**
   - PostgreSQL 14+ (recomendado) ou MySQL 8+
   - Criar database: `CREATE DATABASE sejasenai;`

4. **IDE Recomendada**
   - IntelliJ IDEA / VS Code com extensões Java

### Configuração do Backend

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   cd seja-senai/backend
   ```

2. **Configure o banco de dados em `application.properties`:**
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:postgresql://localhost:5432/sejasenai
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   
   # JWT Configuration
   jwt.secret=sua_chave_secreta_muito_longa_e_segura
   jwt.expiration=86400000
   
   # Server Configuration
   server.port=8080
   ```

3. **Compile e execute:**
   ```bash
   # Usando Maven Wrapper (recomendado)
   ./mvnw clean package
   java -jar target/sejasenai-0.0.1-SNAPSHOT.jar
   
   # Ou modo dev com hot-reload
   ./mvnw spring-boot:run
   ```

4. **Verificar funcionamento:**
   - API estará disponível em: `http://localhost:8080/api`
   - Teste de health: `http://localhost:8080/actuator/health` (se configurado)

### Configuração do Frontend

1. **Navegue até a pasta frontend:**
   ```bash
   cd seja-senai/frontend-web/static
   ```

2. **Configure a URL da API em `scripts.js`:**
   ```javascript
   const API_BASE = 'http://localhost:8080/api';
   ```

3. **Sirva os arquivos estáticos:**
   
   **Opção 1 - HTTP Server (Node.js):**
   ```bash
   npx http-server . -p 3000 -c-1
   ```
   
   **Opção 2 - Python:**
   ```bash
   python -m http.server 3000
   ```
   
   **Opção 3 - VS Code:**
   - Instale extensão "Live Server"
   - Clique direito em `index.html` > "Open with Live Server"

4. **Acesse o sistema:**
   - Frontend: `http://localhost:3000` (ou porta configurada)
   - Login padrão será criado no primeiro boot (verificar console do backend)

---

## Estrutura do Projeto

```
seja-senai/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/wuzuy/sejasenai/
│   │   │   │   ├── config/              # Configurações (Security, JWT, CORS)
│   │   │   │   ├── controller/          # Endpoints REST
│   │   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── model/               # Entidades JPA
│   │   │   │   ├── repository/          # Repositórios Spring Data
│   │   │   │   └── SejaSenaiApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   ├── pom.xml                          # Dependências Maven
│   ├── mvnw / mvnw.cmd                  # Maven Wrapper
│   └── target/                          # Arquivos compilados
│
├── frontend-web/
│   └── static/
│       ├── app.css                      # Estilos globais
│       ├── scripts.js                   # Lógica JavaScript
│       ├── index.html                   # Página de cursos
│       ├── login.html                   # Página de login/registro
│       ├── inscricao.html               # Formulário de inscrição
│       ├── status.html                  # Acompanhamento de status
│       ├── matricula.html               # Aceite de matrícula
│       ├── portal-aluno.html            # Perfil do aluno
│       ├── portal-secretaria.html       # Admin da secretaria
│       └── imagens/                     # Assets estáticos
│
├── database/
│   └── readme.md                        # Instruções do banco
│
└── docs/
    ├── developer-documentation.md       # Este arquivo
    ├── backend.html                     # Documentação backend
    └── frontend.html                    # Documentação frontend
```

---

## Backend - API REST

### Entidades do Sistema

#### 1. **Usuario** (`/api/usuarios`)
Representa um usuário do sistema (aluno ou administrador).

**Campos:**
- `id`: Long (PK)
- `nomeCompleto`: String
- `email`: String (único)
- `senha`: String (hash BCrypt)
- `cpf`: String
- `telefone`: String
- `dataNascimento`: LocalDate
- `role`: Enum (ROLE_USER, ROLE_ADMIN)

**Endpoints:**
```
GET    /api/usuarios          # Listar todos (admin only)
GET    /api/usuarios/me       # Dados do usuário logado
GET    /api/usuarios/{id}     # Buscar por ID
POST   /api/usuarios/admin    # Criar usuário (admin only)
PUT    /api/usuarios/{id}     # Atualizar usuário
PUT    /api/usuarios/me       # Atualizar próprio perfil
DELETE /api/usuarios/{id}     # Deletar usuário
```

#### 2. **Unidade** (`/api/unidades`)
Unidades físicas do SENAI.

**Campos:**
- `id`: Long (PK)
- `nome_unidade`: String
- `endereco`: String
- `telefone_unidade`: String

**Endpoints:**
```
GET    /api/unidades          # Listar todas
GET    /api/unidades/{id}     # Buscar por ID
POST   /api/unidades          # Criar (admin only)
PUT    /api/unidades/{id}     # Atualizar (admin only)
DELETE /api/unidades/{id}     # Deletar (admin only)
```

#### 3. **Curso** (`/api/cursos`)
Cursos oferecidos pelo SENAI.

**Campos:**
- `id`: Long (PK)
- `id_unidade`: Unidade (FK)
- `nome_curso`: String
- `tipo`: String (Técnico, Qualificação, etc.)
- `turno`: String (Manhã, Tarde, Noite, Integral)
- `data_inicio`: LocalDate
- `duracao_meses`: Integer
- `status`: String (ATIVO, INATIVO)

**Endpoints:**
```
GET    /api/cursos            # Listar todos
GET    /api/cursos/{id}       # Buscar por ID
POST   /api/cursos            # Criar (admin only)
PUT    /api/cursos/{id}       # Atualizar (admin only)
DELETE /api/cursos/{id}       # Deletar (admin only)
```

#### 4. **Edital** (`/api/editais`)
Editais de processos seletivos.

**Campos:**
- `id`: Long (PK)
- `titulo`: String
- `url`: String
- `ativo`: Boolean

**Endpoints:**
```
GET    /api/editais           # Listar todos
GET    /api/editais/{id}      # Buscar por ID
POST   /api/editais           # Criar (admin only)
PUT    /api/editais/{id}      # Atualizar (admin only)
DELETE /api/editais/{id}      # Deletar (admin only)
```

#### 5. **Inscricao** (`/api/inscricoes`)
Inscrições de alunos em cursos - **Entidade Central do Sistema**.

**Campos Principais:**
- `id`: Long (PK)
- `id_usuario`: Usuario (FK)
- `id_curso`: Curso (FK)
- `data_inscricao`: LocalDate

**Campos Pessoais:**
- `nome_completo_inscricao`: String
- `rg_inscricao`: String
- `cpf_inscricao`: String
- `telefone_inscricao`: String
- `email_inscricao`: String
- `data_nascimento_inscricao`: LocalDate
- `escolaridade_declarada`: String

**Campos do Processo Seletivo:**
- `status_aprovacao`: String (EM_ANALISE, APROVADA, REPROVADA)
- `realiza_prova`: String (SIM, NAO)
- `data_prova`: LocalDate
- `situacao_aprovacao_prova`: String (APROVADO, REPROVADO, AGUARDANDO)
- `lista_espera`: String (SIM, NAO)
- `status_matricula`: String (AGUARDANDO_ACEITE, ACEITA, RECUSADA, CONCLUIDA)
- `data_aceite_matricula`: LocalDate
- `observacoes`: String (Text)

**Endpoints:**
```
GET    /api/inscricoes               # Listar todas
GET    /api/inscricoes/{id}          # Buscar por ID
POST   /api/inscricoes               # Criar inscrição
PUT    /api/inscricoes/{id}          # Atualizar completa
PUT    /api/inscricoes/{id}/etapas   # Atualizar etapas do processo
PUT    /api/inscricoes/{id}/matricula # Atualizar status de matrícula
DELETE /api/inscricoes/{id}          # Deletar inscrição
```

### Autenticação

#### Registro de Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "nomeCompleto": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "cpf": "12345678900",
  "telefone": "(11) 98765-4321",
  "dataNascimento": "2000-01-15"
}
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "nomeCompleto": "João Silva",
  "email": "joao@example.com",
  "role": "ROLE_USER"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tipo": "Bearer",
  "usuario": {
    "id": 1,
    "nomeCompleto": "João Silva",
    "email": "joao@example.com",
    "role": "ROLE_USER"
  }
}
```

#### Requisições Autenticadas
Todas as requisições protegidas devem incluir o header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Exemplo de Fluxo Completo - Criar Inscrição

**1. Login (obter token):**
```http
POST /api/auth/login
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**2. Listar cursos disponíveis:**
```http
GET /api/cursos
Authorization: Bearer <token>
```

**3. Criar inscrição:**
```http
POST /api/inscricoes
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_usuario": { "id": 1 },
  "id_curso": { "id": 5 },
  "data_inscricao": "2024-03-15",
  "status_aprovacao": "EM_ANALISE",
  "nome_completo_inscricao": "João Silva",
  "rg_inscricao": "12.345.678-9",
  "cpf_inscricao": "123.456.789-00",
  "telefone_inscricao": "(11) 98765-4321",
  "email_inscricao": "joao@example.com",
  "data_nascimento_inscricao": "2000-01-15",
  "escolaridade_declarada": "Ensino Médio Completo"
}
```

**4. Acompanhar status:**
```http
GET /api/inscricoes?id_usuario.id=1
Authorization: Bearer <token>
```

---

## Frontend - Interface Web

### Estrutura de Páginas

#### 1. **login.html** - Autenticação
- Formulário de login
- Formulário de registro
- Toggle entre modos
- Exibição de editais ativos

**Funções JavaScript:**
- `initLoginPage()`: Inicializa página
- `handleLogin()`: Processa login
- `handleRegister()`: Processa registro
- `renderEditais()`: Carrega editais

#### 2. **index.html** - Listagem de Cursos
- Cards de cursos disponíveis (status ATIVO)
- Filtro por unidade
- Botão "Inscrever-se" (verifica duplicatas)
- Detalhes expandidos do curso

**Funções JavaScript:**
- `initHomePage()`: Carrega cursos e verifica inscrições
- `renderCursos()`: Renderiza cards
- `verificaDuplicata()`: Previne inscrições duplicadas

#### 3. **inscricao.html** - Formulário de Inscrição
- Validação de cursoId pela URL
- Auto-preenchimento com dados do usuário
- Campos obrigatórios: nome, RG, CPF, telefone, email, data nascimento, escolaridade
- Redirecionamento para status após sucesso

**Funções JavaScript:**
- `initInscricaoPage()`: Valida acesso e carrega dados
- `autoFillUserData()`: Preenche formulário
- `submitInscricao()`: Envia inscrição

#### 4. **status.html** - Acompanhamento
- Tabela com todas as inscrições do usuário
- Botão "Ver detalhes" para cada inscrição
- Timeline visual das etapas
- Botão "Aceitar Matrícula" quando disponível

**Funções JavaScript:**
- `initStatusPage()`: Carrega inscrições
- `renderTimelineEtapas()`: Cria timeline visual
- `fillCourseDetailsPanel()`: Exibe detalhes do curso

#### 5. **matricula.html** - Aceite de Matrícula
- Exibição de dados da matrícula
- Contrato completo com termos
- Checkboxes de aceite
- Botões: Aceitar / Recusar / Voltar

**Funções JavaScript:**
- `initMatriculaPage()`: Valida acesso e carrega dados
- `aceitarMatricula()`: Atualiza status para ACEITA
- `recusarMatricula()`: Atualiza status para RECUSADA

#### 6. **portal-aluno.html** - Perfil do Aluno
- Exibição de dados pessoais
- Formulário de atualização de perfil
- Edição de telefone e data de nascimento

**Funções JavaScript:**
- `initPortalAlunoPage()`: Carrega dados do usuário
- `updateProfile()`: Atualiza informações

#### 7. **portal-secretaria.html** - Administração
- Gestão de unidades, cursos, usuários, editais
- Gerenciamento de inscrições por etapas
- Dashboard com estatísticas
- Relatórios por curso

**Funções JavaScript:**
- `initPortalSecretariaPage()`: Carrega todos os dados
- `setupSecretariaModuleTabs()`: Gerencia abas
- `renderInscricoes()`: Lista inscrições para gestão
- `updateInscricaoEtapas()`: Atualiza etapas do processo

### Sistema de Navegação SPA-like

O sistema utiliza o atributo `data-page` para identificação de páginas:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  
  const page = document.body.dataset.page;

  if (page === 'login') initLoginPage();
  if (page === 'home') initHomePage();
  if (page === 'inscricao') initInscricaoPage();
  if (page === 'status') initStatusPage();
  if (page === 'matricula') initMatriculaPage();
  if (page === 'portal-aluno') initPortalAlunoPage();
  if (page === 'portal-secretaria') initPortalSecretariaPage();
});
```

### Responsividade

O sistema é **mobile-first** com breakpoints:

```css
/* Mobile: até 640px */
@media (max-width: 640px) {
  .menu-toggle { display: block; }
  .nav { display: none; }
  .nav.open { display: flex; flex-direction: column; }
}

/* Tablet: 641px - 767px */
@media (min-width: 641px) and (max-width: 767px) {
  .two-col { grid-template-columns: 1fr; }
}

/* Tablet/Desktop: 768px - 919px */
@media (min-width: 768px) and (max-width: 919px) {
  .two-col { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: 920px+ */
@media (min-width: 920px) {
  .container { max-width: 1200px; }
}
```

**Recursos Responsivos:**
- Hamburger menu para mobile (<640px)
- Tables com scroll horizontal (`.table-wrapper`)
- Grid adaptativo para cards
- Overlay escuro quando menu aberto
- Touch-friendly buttons e inputs

---

## Fluxo de Dados

### Ciclo de Vida de uma Inscrição

```
┌─────────────────────────────────────────────────────────────┐
│  1. CADASTRO DO ALUNO                                       │
│     - Usuário acessa login.html                             │
│     - Cria conta com dados básicos                          │
│     - Recebe token JWT                                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  2. SELEÇÃO DE CURSO                                        │
│     - Acessa index.html (cursos disponíveis)                │
│     - Visualiza cursos com status ATIVO                     │
│     - Sistema verifica se já está inscrito (duplicata)      │
│     - Clica em "Inscrever-se"                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  3. PREENCHIMENTO DA INSCRIÇÃO                              │
│     - Redirecionado para inscricao.html?cursoId=X           │
│     - Formulário auto-preenchido com dados do cadastro      │
│     - Preenche campos adicionais (RG, escolaridade)         │
│     - Submete inscrição                                     │
│     - Status inicial: EM_ANALISE                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  4. ANÁLISE PELA SECRETARIA                                 │
│     - Secretaria acessa portal-secretaria.html              │
│     - Visualiza inscrições pendentes                        │
│     - Avalia documentação e requisitos                      │
│     - Define: realiza_prova (SIM/NAO)                       │
│     - Atualiza status: APROVADA / REPROVADA                 │
│     - Se REPROVADA → Fim do processo                        │
└──────────────────┬──────────────────────────────────────────┘
                   │ (se APROVADA)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  5. PROVA (SE APLICÁVEL)                                    │
│     - Secretaria define data_prova                          │
│     - Aluno visualiza data no status.html                   │
│     - Após prova, secretaria lança situacao_aprovacao_prova │
│       * APROVADO → Continua                                 │
│       * REPROVADO → Verifica lista_espera                   │
│         - SIM → Aguarda vaga                                │
│         - NAO → Fim do processo                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ (se APROVADO ou NAO realiza prova)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  6. MATRÍCULA                                               │
│     - Secretaria atualiza: status_matricula=AGUARDANDO_ACEITE│
│     - Aluno visualiza botão "Aceitar Matrícula" em status  │
│     - Clica e é redirecionado para matricula.html           │
│     - Lê contrato completo                                  │
│     - Marca checkboxes de aceite                            │
│     - Clica "Aceitar Matrícula"                             │
│     - Status atualizado: ACEITA                             │
│     - data_aceite_matricula registrada                      │
│     - Secretaria valida documentos → CONCLUIDA              │
└─────────────────────────────────────────────────────────────┘
                   │
                   ▼
              ┌─────────┐
              │ PROCESSO│
              │CONCLUÍDO│
              └─────────┘
```

### Estados Possíveis da Inscrição

| Campo | Valores Possíveis | Significado |
|-------|-------------------|-------------|
| `status_aprovacao` | EM_ANALISE | Inscrição enviada, aguardando análise |
|  | APROVADA | Documentação aprovada, prossegue no processo |
|  | REPROVADA | Não atende requisitos, processo encerrado |
| `realiza_prova` | SIM | Curso exige prova de seleção |
|  | NAO | Curso sem prova (entrada direta) |
| `situacao_aprovacao_prova` | AGUARDANDO | Ainda não realizou ou não foi corrigida |
|  | APROVADO | Aprovado na prova, prossegue |
|  | REPROVADO | Reprovado na prova, verifica lista espera |
| `lista_espera` | SIM | Está na lista de espera |
|  | NAO | Não está na lista ou não se aplica |
| `status_matricula` | AGUARDANDO_ACEITE | Pode aceitar matrícula online |
|  | ACEITA | Aluno aceitou os termos |
|  | RECUSADA | Aluno recusou a matrícula |
|  | CONCLUIDA | Secretaria finalizou matrícula |

---

## Segurança e Autenticação

### JWT (JSON Web Tokens)

O sistema utiliza JWT para autenticação stateless. O token é gerado no login e deve ser enviado em todas as requisições protegidas.

**Configuração (JwtService.java):**
```java
@Value("${jwt.secret}")
private String secret;

@Value("${jwt.expiration}")
private Long expiration; // 86400000 = 24h
```

**Geração de Token:**
```java
public String generateToken(String email, String role) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expiration);
    
    return Jwts.builder()
        .setSubject(email)
        .claim("role", role)
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(SignatureAlgorithm.HS512, secret)
        .compact();
}
```

**Validação:**
```java
public boolean validateToken(String token) {
    try {
        Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
        return true;
    } catch (JwtException | IllegalArgumentException e) {
        return false;
    }
}
```

### JwtFilter

Intercepta todas as requisições e valida o token:

```java
@Component
public class JwtFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain chain) {
        String token = extractToken(request);
        
        if (token != null && jwtService.validateToken(token)) {
            String email = jwtService.getEmailFromToken(token);
            // Autentica usuário no contexto Spring Security
        }
        
        chain.doFilter(request, response);
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

### SecurityConfig

Configuração de rotas protegidas:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/cursos/**").authenticated()
                .requestMatchers("/api/inscricoes/**").authenticated()
                .requestMatchers("/api/usuarios/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/unidades/**").hasRole("ADMIN")
                .requestMatchers("/api/editais/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
            
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### Proteção no Frontend

**Armazenamento do Token:**
```javascript
function setAuth(data) {
  localStorage.setItem('seja-senai-auth', JSON.stringify(data));
}

function getAuth() {
  const stored = localStorage.getItem('seja-senai-auth');
  return stored ? JSON.parse(stored) : null;
}
```

**Requisições Autenticadas:**
```javascript
function authHeaders(includeContentType = true) {
  const auth = getAuth();
  const headers = {};
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (auth?.token) {
    headers['Authorization'] = `Bearer ${auth.token}`;
  }
  
  return headers;
}
```

**Proteção de Rotas:**
```javascript
function requireAuth() {
  const auth = getAuth();
  if (!auth || !auth.token) {
    window.location.href = 'login.html';
    return null;
  }
  return auth;
}

function requireAdmin() {
  const auth = requireAuth();
  if (auth && auth.usuario?.role !== 'ROLE_ADMIN') {
    alert('Acesso negado. Apenas administradores.');
    window.location.href = 'index.html';
    return null;
  }
  return auth;
}
```

### Hash de Senhas

Senhas são criptografadas com BCrypt antes de serem armazenadas:

```java
@Autowired
private PasswordEncoder passwordEncoder;

public Usuario createUser(String email, String senha) {
    Usuario user = new Usuario();
    user.setEmail(email);
    user.setSenha(passwordEncoder.encode(senha)); // Hash BCrypt
    return repository.save(user);
}
```

---

## Deploy e Manutenção

### Opção 1: Deploy Manual

**Backend (Spring Boot):**

1. **Build do JAR:**
   ```bash
   cd backend
   ./mvnw clean package -DskipTests
   ```
   
   Gera: `target/sejasenai-0.0.1-SNAPSHOT.jar`

2. **Configurar Produção:**
   Criar `application-prod.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://seu-db.exemplo.com:5432/sejasenai
   spring.datasource.username=${DB_USER}
   spring.datasource.password=${DB_PASSWORD}
   jwt.secret=${JWT_SECRET}
   server.port=8080
   ```

3. **Executar:**
   ```bash
   java -jar target/sejasenai-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
   ```

**Frontend (Arquivos Estáticos):**

1. **Atualizar `scripts.js` com URL de produção:**
   ```javascript
   const API_BASE = 'https://api.sejasenai.exemplo.com/api';
   ```

2. **Upload para servidor web:**
   - **Nginx:** Copiar para `/var/www/html/sejasenai/`
   - **Apache:** Copiar para `/var/www/html/sejasenai/`
   - **AWS S3 + CloudFront:** Upload de bucket público

### Opção 2: Deploy com Docker

**backend/Dockerfile:**
```dockerfile
FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY target/sejasenai-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8080
```

**frontend/Dockerfile:**
```dockerfile
FROM nginx:alpine
COPY static/ /usr/share/nginx/html/
EXPOSE 80
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: sejasenai
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/sejasenai
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - db

  frontend:
    build: ./frontend-web
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Deploy:**
```bash
docker-compose up -d
```

### Opção 3: Cloud Providers

#### **AWS (Amazon Web Services)**

**Backend:**
- **Elastic Beanstalk:** Upload do JAR
- **EC2:** Instância t3.medium com Java 21
- **RDS:** PostgreSQL gerenciado

**Frontend:**
- **S3:** Bucket público para static files
- **CloudFront:** CDN para distribuição global

#### **Azure**

**Backend:**
- **Azure App Service:** Deploy de Spring Boot
- **Azure Database:** PostgreSQL gerenciado

**Frontend:**
- **Azure Static Web Apps**
- **Azure Blob Storage + CDN**

#### **Google Cloud Platform**

**Backend:**
- **Google App Engine**
- **Cloud Run:** Container Docker

**Frontend:**
- **Firebase Hosting**
- **Cloud Storage + Cloud CDN**

### Monitoramento

**Spring Boot Actuator:**
```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

**Endpoints:**
- `GET /actuator/health` - Status da aplicação
- `GET /actuator/info` - Informações da build
- `GET /actuator/metrics` - Métricas de performance

**Logs:**
```properties
logging.level.root=INFO
logging.level.com.wuzuy.sejasenai=DEBUG
logging.file.name=logs/sejasenai.log
logging.file.max-size=10MB
logging.file.max-history=30
```

### Backup de Banco de Dados

**PostgreSQL:**
```bash
# Backup
pg_dump -U admin -h localhost sejasenai > backup_$(date +%Y%m%d).sql

# Restore
psql -U admin -h localhost sejasenai < backup_20240315.sql

# Backup automatizado (cron)
0 2 * * * /usr/bin/pg_dump -U admin sejasenai > /backups/sejasenai_$(date +\%Y\%m\%d).sql
```

### Manutenção Preventiva

**Checklist Semanal:**
- [ ] Verificar logs de erros
- [ ] Monitorar uso de disco
- [ ] Verificar backups automáticos
- [ ] Revisar inscrições pendentes
- [ ] Testar endpoints críticos

**Checklist Mensal:**
- [ ] Atualizar dependências Maven
- [ ] Revisar políticas de senha
- [ ] Limpar dados obsoletos
- [ ] Otimizar queries lentas
- [ ] Auditoria de segurança

---

## Diagrama Entidade-Relacionamento

### DER Simplificado

```
┌─────────────────┐
│    USUARIO      │
├─────────────────┤
│ [PK] id         │
│      nomeCompleto│
│      email      │◄─┐
│      senha      │  │
│      cpf        │  │
│      telefone   │  │
│      dataNascimento│
│      role       │  │
└─────────────────┘  │
                     │
                ┌────┘
                │ 1:N
                │
┌───────────────▼─────┐         ┌──────────────┐
│    INSCRICAO        │   N:1   │    CURSO     │
├─────────────────────┤◄────────┤──────────────┤
│ [PK] id             │         │ [PK] id      │
│ [FK] id_usuario     │         │ [FK] id_unidade│
│ [FK] id_curso       │─────────┤      nome_curso│
│      data_inscricao │         │      tipo    │
│ -- Dados Pessoais --│         │      turno   │
│      nome_completo  │         │      data_inicio│
│      rg             │         │      duracao_meses│
│      cpf            │         │      status  │
│      telefone       │         └──────┬───────┘
│      email          │                │ N:1
│      data_nascimento│                │
│      escolaridade   │         ┌──────▼───────┐
│ -- Processo --------│         │   UNIDADE    │
│      status_aprovacao│         ├──────────────┤
│      realiza_prova  │         │ [PK] id      │
│      data_prova     │         │      nome_unidade│
│      situacao_prova │         │      endereco│
│      lista_espera   │         │      telefone│
│      status_matricula│         └──────────────┘
│      data_aceite    │
│      observacoes    │
└─────────────────────┘

┌─────────────────┐
│     EDITAL      │
├─────────────────┤
│ [PK] id         │
│      titulo     │
│      url        │
│      ativo      │
└─────────────────┘
```

### Relacionamentos Detalhados

| Entidade A | Cardinalidade | Entidade B | Descrição |
|-----------|---------------|-----------|-----------|
| USUARIO | 1:N | INSCRICAO | Um usuário pode ter múltiplas inscrições |
| CURSO | 1:N | INSCRICAO | Um curso pode ter múltiplas inscrições |
| UNIDADE | 1:N | CURSO | Uma unidade oferece múltiplos cursos |

### Índices Recomendados

```sql
CREATE INDEX idx_inscricao_usuario ON inscricao(id_usuario);
CREATE INDEX idx_inscricao_curso ON inscricao(id_curso);
CREATE INDEX idx_inscricao_status ON inscricao(status_aprovacao);
CREATE INDEX idx_curso_unidade ON curso(id_unidade);
CREATE INDEX idx_curso_status ON curso(status);
CREATE INDEX idx_usuario_email ON usuario(email);
```

---

## Fluxograma do Processo

### Fluxo Completo do Aluno

```
                      [INÍCIO]
                         │
                         ▼
            ┌────────────────────────┐
            │   Acessa o sistema     │
            │  (login/registro)      │
            └────────┬───────────────┘
                     │
                     ▼
            ┌────────────────────────┐
            │ Visualiza cursos       │
            │ disponíveis            │
            └────────┬───────────────┘
                     │
                     ▼
            ┌────────────────────────┐
            │ Já inscrito neste      │◄───────┐
            │ curso?                 │        │
            └────┬───────────────────┘        │
                 │ SIM                        │
                 │                            │
    ┌────────────▼─────┐                     │
    │ Mensagem: Já     │                     │
    │ inscrito         │                     │
    └──────────────────┘                     │
                                              │
            ┌─────────────┐                  │
            │ NÃO         │                  │
            └──────┬──────┘                  │
                   │                          │
                   ▼                          │
        ┌─────────────────────┐              │
        │ Preenche formulário │              │
        │ de inscrição        │              │
        └──────────┬──────────┘              │
                   │                          │
                   ▼                          │
        ┌─────────────────────┐              │
        │ Submete inscrição   │              │
        │ Status: EM_ANALISE  │              │
        └──────────┬──────────┘              │
                   │                          │
    ┌──────────────▼──────────────┐          │
    │ SECRETARIA ANALISA          │          │
    │ - Verifica documentação     │          │
    │ - Valida requisitos         │          │
    └──────────┬──────────────────┘          │
               │                              │
        ┌──────▼──────┐                      │
        │ APROVADA?   │                      │
        └─┬─────────┬─┘                      │
          │ NÃO     │ SIM                    │
          │         │                        │
    ┌─────▼──────┐ │                        │
    │ REPROVADA  │ │                        │
    │ [FIM]      │ │                        │
    └────────────┘ │                        │
                   │                        │
            ┌──────▼──────┐                │
            │ Realiza      │                │
            │ prova?       │                │
            └─┬─────────┬──┘                │
              │ NÃO     │ SIM               │
              │         │                   │
              │    ┌────▼────────────────┐ │
              │    │ Aguarda data prova  │ │
              │    │                     │ │
              │    └────┬────────────────┘ │
              │         │                   │
              │    ┌────▼────────────────┐ │
              │    │ Realiza prova       │ │
              │    │                     │ │
              │    └────┬────────────────┘ │
              │         │                   │
              │    ┌────▼────────────────┐ │
              │    │ APROVADO?           │ │
              │    └─┬────────────┬──────┘ │
              │      │ NÃO        │ SIM    │
              │      │            │        │
              │  ┌───▼──────┐    │        │
              │  │Lista     │    │        │
              │  │espera?   │    │        │
              │  └─┬────┬───┘    │        │
              │    │SIM │NÃO     │        │
              │    │    │        │        │
              │ ┌──▼──┐ └────────┘        │
              │ │Aguarda│ [FIM]           │
              │ │Vaga   │                 │
              │ └──┬────┘                 │
              │    └──────┐               │
              │           │               │
              └───────────┼───────────────┘
                          │
                   ┌──────▼──────────────┐
                   │ Status Matrícula:   │
                   │ AGUARDANDO_ACEITE   │
                   └──────┬──────────────┘
                          │
                   ┌──────▼──────────────┐
                   │ Acessa página       │
                   │ matricula.html      │
                   └──────┬──────────────┘
                          │
                   ┌──────▼──────────────┐
                   │ Lê contrato         │
                   │ Marca aceites       │
                   └──────┬──────────────┘
                          │
                   ┌──────▼──────────────┐
                   │ Aceita matrícula?   │
                   └─┬────────────────┬──┘
                     │ NÃO            │ SIM
                     │                │
              ┌──────▼──────┐   ┌─────▼────────┐
              │ RECUSADA     │   │ ACEITA       │
              │ [FIM]        │   └─────┬────────┘
              └──────────────┘         │
                                       │
                                ┌──────▼──────────┐
                                │ Secretaria      │
                                │ valida docs     │
                                └──────┬──────────┘
                                       │
                                ┌──────▼──────────┐
                                │ Status:         │
                                │ CONCLUIDA       │
                                └──────┬──────────┘
                                       │
                                    [FIM]
```

### Ferramentas para Criar Diagramas

**Para Fluxogramas:**
1. **Lucidchart** (https://www.lucidchart.com)
   - Templates prontos para fluxogramas
   - Colaboração em tempo real
   - Exportação PNG/PDF/SVG

2. **Draw.io / diagrams.net** (https://app.diagrams.net)
   - Gratuito e open-source
   - Integração com Google Drive
   - Formas padrão de fluxograma

3. **Microsoft Visio**
   - Professional flowchart tool
   - Integração com Office 365

4. **Mermaid.js** (código em Markdown)
   ```mermaid
   graph TD
       A[Início] --> B{Decisão}
       B -->|Sim| C[Ação 1]
       B -->|Não| D[Ação 2]
   ```

**Para DER (Diagrama Entidade-Relacionamento):**
1. **dbdiagram.io** (https://dbdiagram.io)
   - Sintaxe simples baseada em texto
   - Exportação para SQL
   - Visualização automática

2. **MySQL Workbench**
   - Ferramenta oficial MySQL
   - Engenharia reversa de banco
   - Geração de scripts SQL

3. **pgModeler** (para PostgreSQL)
   - Open-source
   - Interface gráfica intuitiva

4. **Draw.io com shapes de ER**
   - Template "Entity Relation"
   - Formas específicas (entidades, relacionamentos)

**Exemplo de código dbdiagram.io:**
```sql
Table usuario {
  id bigint [pk, increment]
  nome_completo varchar
  email varchar [unique]
  senha varchar
  cpf varchar
  role varchar
}

Table inscricao {
  id bigint [pk]
  id_usuario bigint [ref: > usuario.id]
  id_curso bigint [ref: > curso.id]
  status_aprovacao varchar
  status_matricula varchar
}

Table curso {
  id bigint [pk]
  id_unidade bigint [ref: > unidade.id]
  nome_curso varchar
  status varchar
}

Table unidade {
  id bigint [pk]
  nome_unidade varchar
  endereco varchar
}
```

---

## Análise de Custos e Precificação

### 1. Desenvolvimento do Sistema

**Horas estimadas por funcionalidade:**

| Módulo | Horas | Valor/hora (R$) | Total (R$) |
|--------|-------|-----------------|-----------|
| Backend API completo | 80h | 150 | 12.000 |
| Frontend responsivo | 60h | 120 | 7.200 |
| Sistema de autenticação | 15h | 150 | 2.250 |
| Gestão de inscrições | 25h | 150 | 3.750 |
| Portal administrativo | 30h | 150 | 4.500 |
| Sistema de matrícula | 20h | 120 | 2.400 |
| Testes e QA | 30h | 100 | 3.000 |
| Documentação | 15h | 100 | 1.500 |
| **TOTAL** | **275h** | - | **R$ 36.600** |

**Valor de venda sugerido (com margem):**
- **Desenvolvimento:** R$ 50.000 - R$ 60.000
- **Implementação + Treinamento:** R$ 5.000 - R$ 10.000
- **TOTAL:** **R$ 55.000 - R$ 70.000**

### 2. Custos Mensais de Manutenção

#### Opção 1: Infraestrutura Básica (Small Business)

**Hosting:**
- **VPS (DigitalOcean/AWS Lightsail):** $20/mês (~R$ 100)
  - 2 vCPU, 4GB RAM, 80GB SSD
- **Banco de Dados PostgreSQL:** $15/mês (~R$ 75)
  - RDS/Managed Database

**SSL/Segurança:**
- **Certificado SSL:** $0 (Let's Encrypt)
- **Firewall/Security:** Incluído

**Domínio:**
- **.com.br:** R$ 40/ano (~R$ 3,33/mês)

**Backup:**
- **Backup automatizado:** $5/mês (~R$ 25)

**Monitoramento:**
- **UptimeRobot/StatusCake:** $0 (free tier)

**TOTAL MENSAL:** ~**R$ 205/mês**

#### Opção 2: Infraestrutura Média (Mid-size School)

**Hosting:**
- **AWS EC2 t3.medium:** $30/mês (~R$ 150)
- **RDS PostgreSQL db.t3.medium:** $45/mês (~R$ 225)
- **S3 + CloudFront (static files):** $10/mês (~R$ 50)

**SSL/Segurança:**
- **AWS Certificate Manager:** $0
- **WAF (Web Application Firewall):** $10/mês (~R$ 50)

**Domínio:**
- **.com.br:** R$ 40/ano (~R$ 3,33/mês)

**Backup:**
- **Automated snapshots:** $15/mês (~R$ 75)

**Monitoring:**
- **CloudWatch:** $10/mês (~R$ 50)

**Email Transacional (notificações):**
- **SendGrid/Amazon SES:** $10/mês (~R$ 50)

**TOTAL MENSAL:** ~**R$ 655/mês**

#### Opção 3: Enterprise (Rede de Escolas)

**Hosting:**
- **AWS EC2 c5.large:** $70/mês (~R$ 350)
- **RDS Multi-AZ:** $150/mês (~R$ 750)
- **CloudFront CDN:** $25/mês (~R$ 125)
- **Load Balancer:** $20/mês (~R$ 100)

**Segurança Avançada:**
- **WAF + Shield:** $25/mês (~R$ 125)
- **GuardDuty (threat detection):** $10/mês (~R$ 50)

**Backup & Disaster Recovery:**
- **Cross-region backups:** $30/mês (~R$ 150)

**Monitoring & Logs:**
- **Datadog/New Relic:** $40/mês (~R$ 200)
- **CloudWatch detalhado:** $20/mês (~R$ 100)

**Email & SMS:**
- **Transactional email:** $30/mês (~R$ 150)
- **SMS notifications (Twilio):** $40/mês (~R$ 200)

**TOTAL MENSAL:** ~**R$ 2.300/mês**

### 3. Suporte e Manutenção

**Planos de Suporte:**

| Plano | Incluído | Valor Mensal |
|-------|----------|--------------|
| **Básico** | - Atualizações de segurança<br>- Backup monitorado<br>- Suporte por email (48h) | R$ 800 |
| **Padrão** | - Básico +<br>- Suporte prioritário (24h)<br>- Ajustes de layout<br>- Relatórios mensais | R$ 1.500 |
| **Premium** | - Padrão +<br>- Suporte 24/7<br>- Novas funcionalidades (até 8h/mês)<br>- Consultoria | R$ 3.000 |

### 4. Modelo de Precificação Sugerido

**Investimento Inicial:**
```
Licença do Sistema: R$ 55.000 - R$ 70.000
Implantação e Treinamento: R$ 5.000 - R$ 10.000
Customizações (se necessário): R$ 5.000 - R$ 15.000
---------------------------------------------------------
TOTAL INICIAL: R$ 65.000 - R$ 95.000
```

**Custos Recorrentes:**
```
Infraestrutura (hosting): R$ 205 - R$ 2.300/mês
Suporte e Manutenção: R$ 800 - R$ 3.000/mês
---------------------------------------------------------
TOTAL MENSAL: R$ 1.005 - R$ 5.300/mês
```

**ROI para Instituição:**
- **Redução de papelada:** ~30% economia em materiais de escritório
- **Eficiência de equipe:** Secretaria economiza ~20h/mês
- **Diminuição de erros:** Menos retrabalho e correções
- **Transparência:** Melhor experiência do aluno = maior retenção

---

## Conclusão

Este documento fornece uma visão completa do sistema SEJA SENAI, desde a arquitetura técnica até considerações de negócio. Para dúvidas ou necessidade de esclarecimentos adicionais, entre em contato com a equipe de desenvolvimento.

**Contatos:**
- **Desenvolvedor:** [Seu Nome]
- **Email:** [seu@email.com]
- **Repositório:** [URL do repositório Git]

**Última atualização:** Março 2024
**Versão do Sistema:** 1.0.0
**Status:** Documentação completa e sistema funcional

---

**Próximos Passos Recomendados:**
1. Implementar testes automatizados (JUnit + Mockito)
2. Adicionar sistema de notificações por email/SMS
3. Criar módulo de relatórios avançados (PDF/Excel)
4. Implementar dashboard analytics para gestão
5. Adicionar suporte a múltiplos idiomas (i18n)
6. Integração com sistemas de pagamento (para cursos pagos)
7. App mobile nativo (React Native / Flutter)

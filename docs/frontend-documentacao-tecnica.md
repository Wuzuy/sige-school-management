# Frontend - Documentacao Tecnica

**Sistema SIGE - Interface Web**

---

## Visao Geral

### Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| **HTML5** | Estrutura semantica das paginas |
| **CSS3** | Estilizacao responsiva |
| **JavaScript (Vanilla)** ES6+ | Logica da aplicacao |
| **Notyf** 3.x | Notificacoes toast |
| **Fetch API** | Comunicacao com backend REST |
| **localStorage** | Armazenamento de token JWT |

### Caracteristicas
- 3 portais independentes: Escolar, Secretaria e Inscricao
- 100% responsivo (desktop, tablet, mobile)
- Autenticacao JWT com controle de acesso por role
- Notificacoes toast com feedback visual
- Configuracao automatica da URL da API

---

## Estrutura de Arquivos

```
frontend-web/
├── portal-escolar/                 # Portal do Aluno e Secretaria
│   ├── assets/
│   │   ├── css/app.css             # Estilos principais
│   │   ├── js/
│   │   │   ├── api-config.js       # Configuracao da API
│   │   │   ├── scripts.js          # Logica compartilhada
│   │   │   └── sidebar-nav.js      # Navegacao sidebar
│   │   ├── images/                 # Imagens e icones
│   │   └── fonts/                  # Fontes customizadas
│   ├── index.html                  # Dashboard principal
│   ├── portal-aluno.html           # Perfil do aluno
│   ├── portal-secretaria.html      # Portal administrativo
│   ├── historico-escolar.html      # Historico academico
│   ├── meus-documentos.html        # Documentos
│   ├── consulta-freq.html          # Frequencia
│   ├── agenda-escolar.html         # Agenda
│   ├── calendario-escolar.html     # Calendario
│   └── login.html                  # Login do aluno
│
├── portal-inscricao/               # Portal de Inscricao
│   ├── assets/
│   │   ├── css/app.css
│   │   ├── js/
│   │   │   ├── api-config.js
│   │   │   └── scripts.js
│   │   ├── images/
│   │   └── fonts/
│   ├── index.html                  # Cursos disponiveis
│   ├── login.html                  # Login e cadastro
│   ├── inscricao.html              # Formulario de inscricao
│   ├── status.html                 # Acompanhamento de status
│   ├── matricula.html              # Finalizacao de matricula
│   ├── forgot-password.html        # Recuperacao de senha
│   ├── reset-password.html         # Redefinicao de senha
│   └── credits.html                # Creditos
│
└── portal-secretaria/
    └── portal-secretaria.html      # (redireciona para portal-escolar/)
```

---

## Paginas HTML

### portal-escolar/index.html - Dashboard Principal
**Proposito:** Pagina inicial do aluno apos login, com acesso rapido as funcionalidades.

**Funcionalidades:**
- Tabela de cursos ativos com opcao de inscricao
- Atalhos para historico, documentos, frequencia, agenda
- Indicador de status da API

### portal-escolar/login.html - Login do Aluno
**Proposito:** Autenticacao de usuarios.

**Estrutura:**
- Formulario de login (email + senha)
- Toggle para cadastro de novo usuario
- Lista de editais publicados
- Botao de acesso como visitante

### portal-escolar/portal-aluno.html - Perfil do Aluno
**Proposito:** Exibir e editar dados pessoais do aluno.

**Secoes:**
- Dados pessoais (nome, email, CPF, data de nascimento, telefone)
- Informacoes academicas (matricula, serie, turno, status)
- Formulario de edicao de dados (toggle)

### portal-escolar/portal-secretaria.html - Portal Administrativo
**Proposito:** Interface completa para gerenciamento pela secretaria.

**Modulos:**
- Unidades (CRUD)
- Cursos (CRUD + filtros)
- Usuarios (CRUD)
- Editais (CRUD)
- Inscricoes (gerenciamento completo + filtros)
- Relatorios (estatisticas)

### portal-escolar/historico-escolar.html - Historico
**Proposito:** Exibir disciplinas cursadas, notas e aprovacao.

### portal-escolar/meus-documentos.html - Documentos
**Proposito:** Listar documentos enviados e seus status.

### portal-escolar/consulta-freq.html - Frequencia
**Proposito:** Exibir frequencia por disciplina.

### portal-escolar/agenda-escolar.html - Agenda
**Proposito:** Eventos escolares e atividades programadas.

### portal-escolar/calendario-escolar.html - Calendario
**Proposito:** Datas do ano letivo e periodos de aula.

### portal-inscricao/login.html - Login Publico
**Proposito:** Cadastro e login para novos alunos.

### portal-inscricao/index.html - Cursos Disponiveis
**Proposito:** Exibir cursos ativos com opcao de inscricao.

### portal-inscricao/inscricao.html - Formulario de Inscricao
**Proposito:** Inscricao em curso com validacao de dados.

### portal-inscricao/status.html - Acompanhamento
**Proposito:** Visualizar status das inscricoes com timeline.

### portal-inscricao/matricula.html - Matricula
**Proposito:** Aceite de matricula com termos e confirmacao.

---

## JavaScript - scripts.js

### Estrutura

| Secao | Descricao |
|-------|-----------|
| Configuracao da API | Deteccao de ambiente, modal de configuracao |
| Notificacoes (Notyf) | Inicializacao, funcoes showSuccess/Error/Warning/Info |
| Seguranca | Sanitizacao de HTML, validacao de email/CPF/senha |
| Autenticacao | getAuth, setAuth, clearAuth, requireAuth |
| Requisicoes HTTP | Funcao `request()` centralizada com tratamento de erros |
| Navegacao | setupMobileMenu, setupTopNav |
| Paginas | initLoginPage, initHomePage, initInscricaoPage, initStatusPage |
| Portal Aluno | initPortalAlunoPage, initHistoricoPage, initDocumentosPage |
| Secretaria | initPortalSecretariaPage com modulos e filtros |
| Utilitarios | formatDate, normalizeText, renderEditais |

### Funcao request() - Central
```javascript
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    const raw = await response.text();
    throw new Error(raw || 'Falha na requisicao');
  }
  if (response.status === 204) return null;
  return response.json();
}
```

### Notificacoes (Notyf)
```javascript
// Tipos disponiveis
showSuccess('Mensagem');   // Verde
showError('Mensagem');     // Vermelho
showWarning('Mensagem');   // Amarelo
showInfo('Mensagem');      // Azul
```

### Autenticacao
```javascript
function getAuth() { /* retorna { token, usuario } do localStorage */ }
function requireAuth(requiredRole) { /* redireciona se nao autenticado */ }
function setupProtectedPage(auth) { /* configura navegacao e logout */ }
```

---

## Configuracao da API

A URL da API e detectada automaticamente na ordem:
1. **localStorage** - Configurado manualmente pelo usuario via modal
2. **window.API_BASE_URL** - Definido globalmente
3. **Fallback** - `http://localhost:8080/api`

O sistema tem um indicador de status da API no canto superior direito.

---

## Fluxos de Usuario

### Fluxo do Aluno (Inscricao)
```
Login/Cadastro → Ver Cursos → Selecionar Curso → Preencher Inscricao
                    ↓
            Acompanhar Status → Aceitar Matricula (se aprovado)
```

### Fluxo do Aluno (Portal)
```
Dashboard → Perfil → Historico/Documentos/Frequencia
                  ↓
          Agenda/Calendario
```

### Fluxo da Secretaria
```
Portal Admin → Unidades/Cursos/Usuarios/Editais/Inscricoes → Relatorios
```

---

## Seguranca

- Autenticacao JWT com token armazenado no localStorage
- Validacao de input no cliente (email, CPF, senha forte)
- Sanitizacao de HTML para prevenir XSS
- Controle de acesso por role (ADMIN/USER)
- Protecao de paginas com redirecionamento automatico

---

## Responsividade

- Desktop (1024px+) - Layout completo com sidebar fixa
- Tablet (768px - 1023px) - Interface adaptada
- Mobile (ate 767px) - Menu hamburger, sidebar colapsivel, layout vertical

---

**Versao da Documentacao:** 2.0
**Ultima Atualizacao:** Junho 2026
**Sistema:** SIGE v1.0.0

# 🎨 Frontend - Documentação Técnica Completa

**Sistema SEJA SENAI - Interface Web**

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Páginas HTML](#páginas-html)
4. [JavaScript - scripts.js](#javascript---scriptsjs)
5. [Sistema de Notificações (Notyf)](#sistema-de-notificações-notyf)
6. [Estilização - app.css](#estilização---appcss)
7. [Fluxos de Usuário](#fluxos-de-usuário)
8. [API Integration](#api-integration)
9. [Componentes Reutilizáveis](#componentes-reutilizáveis)
10. [Boas Práticas](#boas-práticas)

---

## 1. Visão Geral

### Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **HTML5** | - | Estrutura semântica das páginas |
| **CSS3** | - | Estilização responsiva |
| **JavaScript (Vanilla)** | ES6+ | Lógica da aplicação |
| **Notyf** | 3.x | Notificações toast profissionais |
| **Fetch API** | - | Comunicação com backend REST |
| **localStorage** | - | Armazenamento de token JWT |

### Características

- ✅ **SPA-like:** Navegação suave sem recarregamento
- ✅ **Responsivo:** Funciona em desktop, tablet e mobile
- ✅ **Acessível:** Semântica HTML5 adequada
- ✅ **Modular:** Código organizado em funções reutilizáveis
- ✅ **Seguro:** Token JWT, validações client-side
- ✅ **UX Moderna:** Notificações toast, feedback visual

---

## 2. Estrutura de Arquivos

```
frontend-web/static/
├── index.html                  # Página inicial (lista de cursos)
├── login.html                  # Login e cadastro
├── inscricao.html              # Formulário de inscrição
├── status.html                 # Acompanhamento de status
├── portal-aluno.html           # Dashboard do aluno
├── portal-secretaria.html      # Portal administrativo
├── matricula.html              # Finalização de matrícula
├── forgot-password.html        # Recuperação de senha
├── scripts.js                  # Lógica JavaScript (2000+ linhas)
├── app.css                     # Estilos globais (1500+ linhas)
└── imagens/                    # Assets (logos, ícones)
    └── logo-senai.png
```

---

## 3. Páginas HTML

### 3.1. index.html - Página Inicial

**Propósito:** Exibir todos os cursos ativos disponíveis para inscrição.

**Estrutura:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>SEJA SENAI - Cursos Disponíveis</title>
    <link rel="stylesheet" href="app.css">
    <!-- Notyf CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css">
</head>
<body>
    <!-- Topbar com logo e botões de navegação -->
    <div class="topbar">
        <div class="logo">SEJA SENAI</div>
        <nav>
            <a href="index.html">Cursos</a>
            <button onclick="handleLogin()">Login</button>
        </nav>
    </div>
    
    <!-- Container de cursos -->
    <div id="cursos-container" class="cursos-grid">
        <!-- Cards de cursos carregados via JavaScript -->
    </div>
    
    <!-- Notyf JS -->
    <script src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"></script>
    <script src="scripts.js"></script>
</body>
</html>
```

**Funcionalidades:**
- Carrega cursos ativos ao abrir
- Cards com informações do curso
- Botão "Inscrever-se" em cada card
- Redirecionamento para login se não autenticado

**JavaScript Relacionado:**
```javascript
// Carregar cursos ativos
async function loadCursosAtivos() {
    try {
        const response = await fetch(`${API_BASE}/cursos/ativos`);
        const cursos = await response.json();
        renderCursosCards(cursos);
    } catch (error) {
        showError('Erro ao carregar cursos');
    }
}

window.addEventListener('DOMContentLoaded', loadCursosAtivos);
```

---

### 3.2. login.html - Login e Cadastro

**Propósito:** Autenticação de usuários e cadastro de novos alunos.

**Seções:**
1. **Formulário de Login**
2. **Formulário de Cadastro** (toggle via JavaScript)

**Campos de Login:**
```html
<form id="login-form">
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="senha" placeholder="Senha" required>
    <button type="submit">Entrar</button>
    <a href="forgot-password.html">Esqueci minha senha</a>
</form>
```

**Campos de Cadastro:**
```html
<form id="register-form">
    <input type="text" name="nome" placeholder="Nome Completo" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="text" name="cpf" placeholder="CPF" required>
    <input type="tel" name="telefone" placeholder="Telefone" required>
    <input type="date" name="dataNascimento" required>
    <input type="password" name="senha" placeholder="Senha" required>
    <button type="submit">Cadastrar</button>
</form>
```

**JavaScript Relacionado:**
```javascript
// Login
async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await request('/auth/login', 'POST', data);
        
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            
            showSuccess('Login realizado com sucesso!');
            
            // Redirecionar baseado na role
            if (response.role === 'ADMIN') {
                window.location.href = 'portal-secretaria.html';
            } else {
                window.location.href = 'index.html';
            }
        }
    } catch (error) {
        showError(parseErrorMessage(error));
    }
}
```

---

### 3.3. inscricao.html - Formulário de Inscrição

**Propósito:** Aluno preenche dados para se inscrever em um curso.

**Estrutura:**
- Informações do curso selecionado (exibidas no topo)
- Formulário com validações
- Botões "Enviar" e "Cancelar"

**Campos:**
```html
<form id="inscricao-form">
    <!-- Dados Pessoais (pré-preenchidos) -->
    <input type="text" name="nome" value="[do localStorage]" readonly>
    <input type="email" name="email" value="[do localStorage]" readonly>
    <input type="text" name="cpf" value="[do localStorage]" readonly>
    
    <!-- Dados da Inscrição -->
    <select name="escolaridade" required>
        <option value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</option>
        <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
        <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
        <option value="Ensino Médio Completo">Ensino Médio Completo</option>
        <option value="Ensino Superior">Ensino Superior</option>
    </select>
    
    <input type="text" name="endereco" placeholder="Endereço Completo">
    
    <button type="submit">Enviar Inscrição</button>
    <button type="button" onclick="window.history.back()">Cancelar</button>
</form>
```

**JavaScript Relacionado:**
```javascript
async function handleInscricao(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Adicionar IDs
    data.idUsuario = getCurrentUser().id;
    data.idCurso = getCursoIdFromURL();
    
    try {
        const response = await request('/inscricoes', 'POST', data, true);
        showSuccess('Inscrição enviada com sucesso!');
        setTimeout(() => {
            window.location.href = 'status.html';
        }, 2000);
    } catch (error) {
        showError(parseErrorMessage(error));
    }
}
```

---

### 3.4. status.html - Acompanhamento de Status

**Propósito:** Aluno visualiza o status de suas inscrições.

**Estrutura:**
- Lista de inscrições do aluno
- Badge de status (EM_ANALISE, APROVADA, REPROVADA)
- Botão "Ver Detalhes" para cada inscrição
- Modal com timeline do processo

**JavaScript Relacionado:**
```javascript
async function loadUserInscricoes() {
    const user = getCurrentUser();
    try {
        const inscricoes = await request(`/inscricoes/aluno/${user.id}`, 'GET', null, true);
        renderInscricoesStatus(inscricoes);
    } catch (error) {
        showError('Erro ao carregar inscrições');
    }
}

function renderInscricoesStatus(inscricoes) {
    const container = document.getElementById('inscricoes-container');
    
    inscricoes.forEach(inscricao => {
        const statusClass = getStatusClass(inscricao.statusAprovacao);
        const html = `
            <div class="inscricao-card">
                <h3>${inscricao.idCurso.nomeCurso}</h3>
                <p>Unidade: ${inscricao.idCurso.idUnidade.nomeUnidade}</p>
                <p>Data: ${formatDate(inscricao.dataInscricao)}</p>
                <span class="badge ${statusClass}">${inscricao.statusAprovacao}</span>
                <button onclick="verDetalhes(${inscricao.id})">Ver Detalhes</button>
            </div>
        `;
        container.innerHTML += html;
    });
}
```

---

### 3.5. portal-aluno.html - Portal do Aluno

**Propósito:** Dashboard personalizado com informações do aluno.

**Seções:**
1. **Dashboard:** Cards com estatísticas
2. **Perfil:** Dados pessoais editáveis
3. **Minhas Inscrições:** Lista completa
4. **Alterar Senha:** Formulário de segurança

**Dashboard - Cards:**
```javascript
function renderDashboardAluno(inscricoes) {
    const totalInscricoes = inscricoes.length;
    const aprovadas = inscricoes.filter(i => i.statusAprovacao === 'APROVADA').length;
    const emAnalise = inscricoes.filter(i => i.statusAprovacao === 'EM_ANALISE').length;
    
    document.getElementById('total-inscricoes').textContent = totalInscricoes;
    document.getElementById('aprovadas').textContent = aprovadas;
    document.getElementById('em-analise').textContent = emAnalise;
}
```

---

### 3.6. portal-secretaria.html - Portal Administrativo ⭐

**Propósito:** Interface completa para gerenciamento pela secretaria.

**Abas (Tabs):**
1. **Unidades:** CRUD completo
2. **Cursos:** CRUD + filtros avançados
3. **Usuários:** CRUD
4. **Editais:** CRUD
5. **Inscrições:** Gerenciamento completo + filtros
6. **Relatórios:** Estatísticas e dados consolidados

**Estrutura:**
```html
<div class="portal-secretaria">
    <!-- Abas -->
    <div class="tabs">
        <button data-tab="unidades" class="active">Unidades</button>
        <button data-tab="cursos">Cursos</button>
        <button data-tab="usuarios">Usuários</button>
        <button data-tab="editais">Editais</button>
        <button data-tab="inscricoes">Inscrições</button>
        <button data-tab="relatorios">Relatórios</button>
    </div>
    
    <!-- Conteúdo de cada aba -->
    <div id="unidades-content" class="tab-content active">
        <!-- Lista de unidades + botão cadastrar -->
    </div>
    
    <div id="inscricoes-content" class="tab-content">
        <!-- Filtros avançados -->
        <div class="filtros">
            <input id="filtro-inscricao-texto" placeholder="Nome do aluno ou CPF">
            <select id="filtro-inscricao-curso">
                <option value="TODOS">Todos os cursos</option>
                <!-- Opções carregadas dinamicamente -->
            </select>
            <select id="filtro-inscricao-status">
                <option value="TODOS">Todos</option>
                <option value="EM_ANALISE">Em Análise</option>
                <option value="APROVADA">Aprovada</option>
                <option value="REPROVADA">Reprovada</option>
            </select>
        </div>
        
        <!-- Tabela de inscrições -->
        <table id="inscricoes-table">
            <!-- Renderizado via JavaScript -->
        </table>
    </div>
</div>
```

**Filtros Avançados:**
```javascript
// Aplicar filtros de inscrições
function aplicarFiltrosInscricoes() {
    const texto = document.getElementById('filtro-inscricao-texto').value.toLowerCase();
    const cursoId = document.getElementById('filtro-inscricao-curso').value;
    const status = document.getElementById('filtro-inscricao-status').value;
    
    let filtradas = state.inscricoes;
    
    // Filtro por texto (nome ou CPF)
    if (texto) {
        filtradas = filtradas.filter(i => 
            i.idUsuario.nome.toLowerCase().includes(texto) ||
            i.idUsuario.cpf.includes(texto)
        );
    }
    
    // Filtro por curso
    if (cursoId !== 'TODOS') {
        filtradas = filtradas.filter(i => i.idCurso.id == cursoId);
    }
    
    // Filtro por status
    if (status !== 'TODOS') {
        filtradas = filtradas.filter(i => i.statusAprovacao === status);
    }
    
    renderInscricoes(filtradas);
}

// Event listeners
document.getElementById('filtro-inscricao-texto').addEventListener('input', aplicarFiltrosInscricoes);
document.getElementById('filtro-inscricao-curso').addEventListener('change', aplicarFiltrosInscricoes);
document.getElementById('filtro-inscricao-status').addEventListener('change', aplicarFiltrosInscricoes);
```

---

### 3.7. matricula.html - Finalização de Matrícula

**Propósito:** Aluno visualiza e aceita contrato de matrícula.

**Estrutura:**
- Informações do curso
- Termos de contrato (texto longo)
- Checkbox "Li e aceito"
- Botão "Confirmar Matrícula"

---

### 3.8. forgot-password.html - Recuperação de Senha

**Propósito:** Solicitar link de reset de senha via email.

**Etapas:**
1. Usuário digita email
2. Sistema envia link por email
3. Usuário clica no link (abre página com token)
4. Define nova senha

**JavaScript:**
```javascript
async function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    
    try {
        await request('/auth/forgot-password', 'POST', { email });
        showSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
        showError('Erro ao enviar email de recuperação');
    }
}

async function handleResetPassword(event) {
    event.preventDefault();
    const token = getTokenFromURL();
    const novaSenha = document.getElementById('nova-senha').value;
    
    try {
        await request('/auth/reset-password', 'POST', { token, novaSenha });
        showSuccess('Senha redefinida com sucesso!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        showError('Token inválido ou expirado');
    }
}
```

---

## 4. JavaScript - scripts.js

### 4.1. Estrutura Geral

**Total de Linhas:** ~2000 linhas  
**Organização:** Funções modulares agrupadas por funcionalidade

```javascript
// ========== CONFIGURAÇÕES ==========
const API_BASE = 'http://localhost:8080/api';

// Estado global
const state = {
    user: null,
    cursos: [],
    inscricoes: [],
    unidades: []
};

// ========== AUTENTICAÇÃO ==========
function getCurrentUser() { ... }
function isAuthenticated() { ... }
function logout() { ... }

// ========== REQUISIÇÕES HTTP ==========
async function request(endpoint, method, data, requiresAuth) { ... }
function authHeaders() { ... }

// ========== NOTIFICAÇÕES ==========
let notyf;
function initNotyf() { ... }
function showSuccess(message) { ... }
function showError(message) { ... }

// ========== RENDERIZAÇÃO ==========
function renderCursos(cursos) { ... }
function renderInscricoes(inscricoes) { ... }
function renderRelatorios() { ... }

// ========== UTILS ==========
function formatDate(date) { ... }
function parseErrorMessage(error) { ... }
```

---

### 4.2. Função request() - Core

**Função central** para todas as chamadas à API:

```javascript
async function request(endpoint, method = 'GET', data = null, requiresAuth = false) {
    const url = `${API_BASE}${endpoint}`;
    
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // Adicionar token JWT se requerido
    if (requiresAuth) {
        const token = localStorage.getItem('token');
        if (!token) {
            showError('Você precisa estar logado');
            window.location.href = 'login.html';
            return;
        }
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Adicionar body se tiver dados
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        
        // Tratar erros HTTP
        if (!response.ok) {
            if (response.status === 401) {
                showError('Sessão expirada. Faça login novamente.');
                logout();
                return;
            }
            
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro na requisição');
        }
        
        // Retornar JSON ou null (para DELETE)
        return response.status !== 204 ? await response.json() : null;
        
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}
```

**Uso:**
```javascript
// GET sem autenticação
const cursos = await request('/cursos/ativos', 'GET');

// GET com autenticação
const inscricoes = await request('/inscricoes/aluno/1', 'GET', null, true);

// POST com autenticação
const novaInscricao = await request('/inscricoes', 'POST', {
    idUsuario: 2,
    idCurso: 1,
    escolaridade: 'Ensino Médio Completo'
}, true);

// PUT
await request('/inscricoes/1/aprovar', 'PUT', { observacoes: 'OK' }, true);

// DELETE
await request('/cursos/5', 'DELETE', null, true);
```

---

### 4.3. Autenticação e Autorização

```javascript
// Obter usuário atual do localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Verificar se está autenticado
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Verificar se é admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'ADMIN';
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showInfo('Logout realizado');
    window.location.href = 'login.html';
}

// Proteção de página (executar no início de páginas protegidas)
function checkAuth() {
    if (!isAuthenticated()) {
        showError('Acesso negado. Faça login.');
        window.location.href = 'login.html';
    }
}

function checkAdminAuth() {
    if (!isAuthenticated() || !isAdmin()) {
        showError('Acesso negado. Permissão de administrador requerida.');
        window.location.href = 'index.html';
    }
}

// Uso em portal-secretaria.html
window.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    loadData();
});
```

---

## 5. Sistema de Notificações (Notyf)

### 5.1. Integração do Notyf

**Biblioteca:** [Notyf](https://github.com/caroso1222/notyf) - 3KB minified  
**CDN:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css">
<script src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"></script>
```

---

### 5.2. Inicialização

```javascript
// Instância global do Notyf
let notyf;

// Inicializar ao carregar página
function initNotyf() {
    notyf = new Notyf({
        duration: 5000,
        position: {
            x: 'right',
            y: 'top'
        },
        dismissible: true,
        ripple: true,
        types: [
            {
                type: 'success',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                icon: false
            },
            {
                type: 'error',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                icon: false
            },
            {
                type: 'warning',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                icon: false
            },
            {
                type: 'info',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                icon: false
            }
        ]
    });
}

// Chamar no início de cada página
window.addEventListener('DOMContentLoaded', initNotyf);
```

---

### 5.3. Funções de Notificação

```javascript
// Notificação genérica
function showNotification(message, type = 'info', duration = 5000) {
    if (!notyf) initNotyf();
    
    notyf.open({
        type: type,
        message: message,
        duration: duration
    });
}

// Atalhos
function showSuccess(message, duration = 5000) {
    showNotification(message, 'success', duration);
}

function showError(message, duration = 7000) {
    showNotification(message, 'error', duration);
}

function showWarning(message, duration = 5000) {
    showNotification(message, 'warning', duration);
}

function showInfo(message, duration = 5000) {
    showNotification(message, 'info', duration);
}
```

---

### 5.4. Uso nos Fluxos

```javascript
// Sucesso ao login
try {
    const response = await request('/auth/login', 'POST', data);
    showSuccess('Login realizado com sucesso!');
    // ...
} catch (error) {
    showError('Email ou senha incorretos');
}

// Inscrição enviada
try {
    await request('/inscricoes', 'POST', data, true);
    showSuccess('✅ Inscrição enviada! Acompanhe pelo menu Status.');
} catch (error) {
    showError(parseErrorMessage(error));
}

// Aprovação de inscrição (admin)
try {
    await request(`/inscricoes/${id}/aprovar`, 'PUT', {}, true);
    showSuccess('Inscrição aprovada! Email enviado ao aluno.');
    reloadInscricoes();
} catch (error) {
    showError('Erro ao aprovar inscrição');
}
```

---

### 5.5. Parse de Erros

```javascript
function parseErrorMessage(error) {
    // Se é objeto Error do JavaScript
    if (error instanceof Error) {
        return error.message;
    }
    
    // Se é string
    if (typeof error === 'string') {
        return error;
    }
    
    // Se é objeto JSON do backend
    if (error && error.message) {
        return error.message;
    }
    
    // Fallback genérico
    return 'Ocorreu um erro. Tente novamente.';
}
```

---

## 6. Estilização - app.css

### 6.1. Estrutura

**Total de Linhas:** ~1500 linhas  
**Organização:**
```css
/* ========== RESET E BASE ========== */
*, *::before, *::after { box-sizing: border-box; }

/* ========== VARIÁVEIS CSS ========== */
:root {
    --primary-color: #003366;
    --secondary-color: #0077cc;
    --success-color: #10b981;
    --error-color: #ef4444;
    --warning-color: #f59e0b;
}

/* ========== TOPBAR ========== */
.topbar { ... }

/* ========== CARDS ========== */
.card { ... }

/* ========== FORMULÁRIOS ========== */
input, select, textarea { ... }

/* ========== TABELAS ========== */
table { ... }

/* ========== BADGES ========== */
.badge { ... }

/* ========== RESPONSIVIDADE ========== */
@media (max-width: 768px) { ... }
```

---

### 6.2. Componentes Principais

#### Badges de Status
```css
.badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.badge-em-analise {
    background-color: #dbeafe;
    color: #1e40af;
}

.badge-aprovada {
    background-color: #d1fae5;
    color: #065f46;
}

.badge-reprovada {
    background-color: #fee2e2;
    color: #991b1b;
}
```

#### Cards
```css
.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
```

#### Botões
```css
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: #002244;
}

.btn-success {
    background: var(--success-color);
    color: white;
}

.btn-danger {
    background: var(--error-color);
    color: white;
}
```

---

## 7. Fluxos de Usuário

### 7.1. Fluxo do Aluno

```
1. Acessa index.html
   └─→ Vê lista de cursos ativos (sem login)

2. Clica em "Inscrever-se"
   └─→ Redireciona para login.html (se não autenticado)

3. Faz login ou cadastro
   └─→ Token armazenado no localStorage
   └─→ Redireciona de volta para index.html

4. Clica novamente em "Inscrever-se"
   └─→ Vai para inscricao.html?cursoId=X
   └─→ Formulário pré-preenchido

5. Preenche e envia inscrição
   └─→ POST /api/inscricoes
   └─→ Notificação de sucesso
   └─→ Redireciona para status.html

6. Acompanha status
   └─→ GET /api/inscricoes/aluno/{id}
   └─→ Vê badge EM_ANALISE

7. Secretaria aprova
   └─→ Recebe email automático
   └─→ Status muda para APROVADA

8. Secretaria configura prova
   └─→ Recebe email com data/local/hora

9. Faz prova presencialmente

10. Secretaria registra resultado APROVADO
    └─→ Status matrícula = PENDENTE
    └─→ Recebe email

11. Secretaria conclui matrícula
    └─→ Status matrícula = CONCLUIDA
    └─→ Carteirinha gerada automaticamente
    └─→ Recebe email com PDF
```

---

### 7.2. Fluxo da Secretaria

```
1. Acessa portal-secretaria.html
   └─→ Faz login como ADMIN

2. Vai para aba "Inscrições"
   └─→ GET /api/inscricoes
   └─→ Lista todas as inscrições

3. Aplica filtro "EM_ANALISE"
   └─→ Vê apenas inscrições pendentes

4. Clica "Ver Detalhes" em uma inscrição
   └─→ Modal com informações completas

5. Analisa documentação
   └─→ Decisão: Aprovar ou Reprovar

6. Clica "Aprovar"
   └─→ PUT /api/inscricoes/{id}/aprovar
   └─→ Email automático enviado ao aluno

7. Clica "Configurar Prova"
   └─→ Preenche data, local
   └─→ PUT /api/inscricoes/{id}/prova
   └─→ Email de convocação enviado

8. Após prova, registra resultado
   └─→ PUT /api/inscricoes/{id}/resultado
   └─→ notaProva: 8.5, resultadoProva: APROVADO

9. Clica "Processar Matrícula"
   └─→ Status muda para EM_ANDAMENTO

10. Quando tudo OK, clica "Concluir Matrícula"
    └─→ PUT /api/inscricoes/{id}/matricula
    └─→ statusMatricula: CONCLUIDA
    └─→ Sistema gera carteirinha
    └─→ Email com PDF enviado
```

---

## 8. API Integration

### 8.1. Exemplos de Chamadas

```javascript
// ========== AUTENTICAÇÃO ==========

// Login
const loginResponse = await request('/auth/login', 'POST', {
    email: 'joao@email.com',
    senha: 'senha123'
});
// Retorna: { token, id, nome, email, role }

// Registro
await request('/auth/register', 'POST', {
    nome: 'João Silva',
    email: 'joao@email.com',
    cpf: '123.456.789-00',
    telefone: '(31) 99999-9999',
    dataNascimento: '1995-05-15',
    senha: 'senha123'
});

// ========== CURSOS ==========

// Listar cursos ativos (público)
const cursosAtivos = await request('/cursos/ativos', 'GET');

// Listar todos (admin)
const todosCursos = await request('/cursos', 'GET', null, true);

// Criar curso (admin)
await request('/cursos', 'POST', {
    nomeCurso: 'Técnico em Mecânica',
    tipo: 'Técnico',
    idUnidade: 1,
    turno: 'Manhã',
    duracaoMeses: 18,
    dataInicio: '2024-02-01',
    dataTermino: '2025-08-01',
    status: 'ATIVO'
}, true);

// ========== INSCRIÇÕES ==========

// Listar inscrições do aluno
const minhasInscricoes = await request(`/inscricoes/aluno/${userId}`, 'GET', null, true);

// Criar inscrição
await request('/inscricoes', 'POST', {
    idUsuario: 2,
    idCurso: 1,
    escolaridade: 'Ensino Médio Completo'
}, true);

// Aprovar (admin)
await request('/inscricoes/1/aprovar', 'PUT', {
    observacoes: 'Documentação OK'
}, true);

// Configurar prova (admin)
await request('/inscricoes/1/prova', 'PUT', {
    dataProva: '2024-02-01',
    localProva: 'SENAI - Sala 301'
}, true);

// Registrar resultado (admin)
await request('/inscricoes/1/resultado', 'PUT', {
    notaProva: 8.5,
    resultadoProva: 'APROVADO'
}, true);

// Concluir matrícula (admin)
await request('/inscricoes/1/matricula', 'PUT', {
    statusMatricula: 'CONCLUIDA'
}, true);
```

---

## 9. Componentes Reutilizáveis

### 9.1. Renderização de Tabelas

```javascript
function renderTable(data, columns, containerId) {
    const container = document.getElementById(containerId);
    
    let html = '<table><thead><tr>';
    
    // Headers
    columns.forEach(col => {
        html += `<th>${col.label}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Rows
    data.forEach(item => {
        html += '<tr>';
        columns.forEach(col => {
            const value = col.getValue(item);
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Uso
renderTable(inscricoes, [
    { label: 'Nome', getValue: i => i.idUsuario.nome },
    { label: 'Curso', getValue: i => i.idCurso.nomeCurso },
    { label: 'Status', getValue: i => `<span class="badge badge-${i.statusAprovacao.toLowerCase()}">${i.statusAprovacao}</span>` }
], 'inscricoes-table');
```

---

### 9.2. Modal Genérico

```javascript
function openModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
}
```

---

### 9.3. Formatadores

```javascript
// Formatar data: 2024-01-15 → 15/01/2024
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Formatar CPF: 12345678900 → 123.456.789-00
function formatCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formatar telefone: 31999999999 → (31) 99999-9999
function formatPhone(phone) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}
```

---

## 10. Boas Práticas

### 10.1. Segurança

✅ **Token JWT armazenado no localStorage**
✅ **Validação client-side + server-side**
✅ **Logout remove token**
✅ **Verificação de autenticação em páginas protegidas**
✅ **Não expor informações sensíveis no console**

### 10.2. Performance

✅ **Requisições assíncronas (async/await)**
✅ **Reuso de funções comuns**
✅ **Evitar múltiplas chamadas à API desnecessárias**
✅ **Cache de dados em `state` global**

### 10.3. UX

✅ **Feedback visual imediato (notificações)**
✅ **Loading states (spinners)**
✅ **Mensagens de erro claras**
✅ **Formulários com validação**
✅ **Confirmações antes de ações críticas**

---

**Versão da Documentação:** 1.0  
**Última Atualização:** Março de 2024  
**Sistema:** SEJA SENAI v1.0

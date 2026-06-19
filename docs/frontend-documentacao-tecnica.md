# Documentação Técnica — Frontend Web

## Visão Geral

Três portais web em **Vanilla JavaScript** (sem frameworks), servidos como HTML estático no Vercel. Compartilham uma base de código comum via `scripts.js` e `api-config.js`.

---

## Arquitetura

```
frontend-web/
├── assets/                        # Compartilhado entre portais
│   └── (imagens, etc.)
│
├── portal-inscricao/              # Público
│   ├── assets/js/scripts.js       # Cópia local da lógica
│   └── assets/js/api-config.js    # Configura API
│
├── portal-escolar/                # Alunos
│   ├── assets/js/
│   │   ├── scripts.js             # Lógica principal (~2600 linhas)
│   │   ├── sidebar-nav.js         # Navegação por sidebar
│   │   ├── api-config.js          # Configura URL da API
│   │   └── api-test.js           # Ferramenta de teste
│   └── assets/css/
│       ├── app.css                # Estilos globais
│       └── sidebar.css            # Estilos da sidebar
│
└── portal-secretaria/             # Admin (SPA)
    ├── portal-secretaria.html     # Todos os módulos em 1 HTML
    └── arquivos/
        ├── portal-secretaria.js   # Lógica (~27K linhas)
        └── portal-secretaria.css  # Estilos (~1.5K linhas)
```

---

## API Config (`api-config.js`)

Detecta ambiente automaticamente:
- Localhost → usa `http://localhost:8080/api`
- Vercel → usa `https://sige-1gqx.onrender.com/api`

Pode ser sobrescrito via:
```js
localStorage.setItem('API_BASE_URL', 'https://sige-1gqx.onrender.com/api');
```

---

## Autenticação

### Fluxo

1. Usuário faz login → backend retorna `{ token, usuario }`
2. Salvo em `localStorage['auth']` como JSON
3. Toda requisição via `request()` inclui `Authorization: Bearer <token>`
4. `getAuth()` recupera e valida o auth do localStorage
5. `requireAuth(role)` redireciona se não autenticado/role incorreta
6. 401 → limpa auth e redireciona para login

### Funções

| Função | Descrição |
|--------|-----------|
| `getAuth()` | Lê e valida auth do localStorage |
| `setAuth(auth)` | Salva auth no localStorage |
| `clearAuth()` | Remove auth |
| `requireAuth(role?)` | Protege página; redireciona se necessário |
| `request(path, options)` | Fetch com JWT automático e tratamento de 401 |
| `authHeaders(isJson)` | Retorna headers com Bearer token |
| `loginAsVisitor()` | Cria auth fake para navegação visitante |

### Tokens

Token JWT de 3 partes (header.payload.signature). `isValidToken()` valida se tem 3 partes separadas por ponto.

---

## Portal Inscrição

8 páginas HTML públicas. Navegação por navbar no topo.

| Página | Rota | Descrição |
|--------|------|-----------|
| Login | `login.html` | Login/Cadastro + editais |
| Cursos | `index.html` | Lista de cursos disponíveis |
| Inscrição | `inscricao.html?cursoId=N` | Formulário de inscrição |
| Matrícula | `matricula.html?inscricaoId=N` | Aceite de termos |
| Status | `status.html` | Acompanhamento de inscrições |
| Recuperar Senha | `forgot-password.html` | Email para reset |
| Redefinir Senha | `reset-password.html?token=X` | Nova senha |
| Créditos | `credits.html` | Informações do sistema |

---

## Portal Escolar

14 páginas com sidebar lateral.

### Sidebar (`sidebar-nav.js`)

Seções definidas com `data-section`:
- `navegacao` — sempre visível
- `academico` — role `student`
- `calendario-agenda` — role `student`
- `comunicacao` — sempre visível
- `documentacao` — role `student`
- `conta` — sempre visível

Ativa seção baseada no `role` do usuário logado.

### Páginas

| Página | Rota | Requer Auth |
|--------|------|-------------|
| Dashboard | `index.html` | Student |
| Perfil | `conta.html` | Student |
| Histórico | `historico-escolar.html` | Student |
| Estrutura Curricular | `estrutura-curricular.html` | Student |
| Frequência | `consulta-freq.html` | Student |
| Calendário | `calendario-escolar.html` | Student |
| Horários | `quadro-horarios.html` | Student |
| Agenda | `agenda-escolar.html` | Student |
| Atendimento | `atendimento-agendado.html` | Student |
| Documentos | `meus-documentos.html` | Student |
| Reclamações | `reclamacoes.html` | Student |
| Detalhes Reclamação | `detalhes-reclamacao.html?id=N` | Student |
| Ouvidoria | `ouvidoria.html` | Student |
| Teste API | `teste-api.html` | Developer |

---

## Portal Secretaria (SPA)

Single Page Application — todos os módulos em `portal-secretaria.html`.

### Modos

- **Inscrições**: Dashboard, Inscrições, Cursos, Unidades, Editais, Turmas, Relatórios, Cargos
- **Alunos**: Dashboard, Alunos, Usuários, Reclamações, Relatórios
- **Sistema**: Auditoria, Configurações

### Mecanismo

- Sidebar com `<a>` links com atributo `data-module-target`
- `data-sec-mode` para alternar entre Inscrições/Alunos
- Hash state persistido via `saveState()` / `restoreState()` na URL (`#mode=X&module=Y`)
- Módulos são `<section>` com classe `module-panel`
- Um módulo visível por vez (classe `active`)
- Polling a cada 30s no módulo visível

### Dashboard

- KPIs: cards com valores numéricos
- Gráficos: Chart.js (linha, doughnut, barra, funil)
- Filtros: período, status, curso, busca textual
- Export: CSV (com BOM para Excel) e PDF (print)

### CRUDs

Padrão unificado:
1. Formulário de criação no topo da página
2. Tabela com dados existentes abaixo
3. Botões Editar (abre modal) e Excluir (com confirmação)
4. Modal de edição genérico reutilizado entre módulos

### Auditoria

- Log de ações em `localStorage['audit_log']` (máx 500 entradas)
- Filtros por tipo e texto
- Exportação CSV

### Configurações

- Dark mode: toggle salvo em `localStorage['darkMode']`
- Tamanho da fonte: P/M/G salvo em `localStorage['fontSize']`

### Estado

- `saveState()` serializa modo + módulo atual para URL hash
- `restoreState()` lê hash e restaura estado
- Pula se `file://` protocol (CORS restrictions)

---

## Componentes Compartilhados

### Notificações (Notyf)

```js
let notyf; // declarado em scripts.js (escopo léxico, não window)
notyf.open({ type: 'success', message: '...' });
```

### Modais

```html
<div class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">...</div>
    <div class="modal-body">...</div>
    <div class="modal-footer">...</div>
  </div>
</div>
```

### Confirmação

`confirmAction(message, callback)` — modal customizado (não `confirm()` nativo).

### Data Helpers

- `formatDate(value)` → `dd/mm/aaaa`
- `normalizeText(value)` → lowercase sem acentos
- `sanitizeHTML(value)` → escapa HTML

---

## APIs Utilizadas

### CDN

```html
<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>

<!-- Notyf -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css">
<script src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"></script>
```

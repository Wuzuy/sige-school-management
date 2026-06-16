# Guia de Teste - SIGE

## Como Testar o Projeto SIGE

### Pre-requisitos
- Node.js 22+ instalado
- Git (opcional)
- Navegador moderno (Chrome, Firefox, Edge)

---

## Passo 1: Iniciar o Servidor Backend

1. Abra um terminal na pasta `backend/`
2. Instale as dependencias (primeira vez):
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm run dev
   ```

**Resultado esperado:**
```
Servidor rodando na porta 8080
```

---

## Passo 2: Acessar o Frontend

1. Abra outro terminal na pasta `frontend-web/`
2. Inicie um servidor HTTP:
   ```bash
   npx http-server -p 5500
   ```
3. Acesse no navegador: `http://localhost:5500/portal-escolar/`

Ou use o Live Server do VS Code:
1. Clique com direito em `frontend-web/portal-escolar/index.html`
2. Selecione "Open with Live Server"

---

## Passo 3: Testar as Paginas

### Pagina de Login
Acesse `http://localhost:5500/portal-escolar/login.html`

### Credenciais de Teste
| Email | Senha | Role |
|-------|-------|------|
| `admin@senai.com` | `admin123` | ADMIN |
| `joao@email.com` | `123456` | USER |

### Paginas do Portal Escolar
- **Dashboard:** `portal-escolar/index.html`
- **Perfil:** `portal-escolar/portal-aluno.html`
- **Secretaria:** `portal-escolar/portal-secretaria.html` (admin apenas)
- **Historico:** `portal-escolar/historico-escolar.html`
- **Frequencia:** `portal-escolar/consulta-freq.html`
- **Documentos:** `portal-escolar/meus-documentos.html`
- **Agenda:** `portal-escolar/agenda-escolar.html`

### Paginas do Portal de Inscricao
- **Cursos:** `portal-inscricao/index.html`
- **Login:** `portal-inscricao/login.html`
- **Inscricao:** `portal-inscricao/inscricao.html`
- **Status:** `portal-inscricao/status.html`

---

## Testes de Funcionalidade

### 1. Teste de Navegacao
- Sidebar abre e fecha corretamente
- Pagina ativa destacada na sidebar
- Links funcionam
- ESC fecha a sidebar

### 2. Teste de API
- API conecta em `http://localhost:8080/api`
- Login funciona e retorna token JWT
- Endpoints de cursos e inscricoes respondem
- Indicador de status da API fica verde

### 3. Teste de Responsividade
- Layout funcional em mobile (< 768px)
- Menu hamburger aparece em mobile
- Tabelas com scroll em mobile

---

## Troubleshooting

### "API Offline"
1. Verifique se o backend esta rodando em `http://localhost:8080`
2. Configure manualmente: clique no indicador API > digite a URL
3. Verifique se o Node.js esta instalado

### CORS Error
- O backend ja tem CORS habilitado
- Verifique se o servidor backend esta respondendo

### Paginas nao carregam
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Recarregue (Ctrl+F5)
3. Verifique erros no console (F12)

---

**Ultima Atualizacao:** Junho 2026

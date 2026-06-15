# 🧪 Guia de Teste - SIGE

## Como Testar o Projeto SIGE

### Pré-requisitos
- Node.js instalado
- Git (opcional)
- Um navegador moderno (Chrome, Firefox, Edge)

---

## 📋 Passo 1: Iniciar o Servidor Backend

### Opção A: Usando arquivo .bat (Recomendado para Windows)
1. Abra um **CMD externo** (não PowerShell do VS Code)
2. Navegue até a pasta backend:
   ```bash
   cd C:\Users\Java\Desktop\sige\backend
   ```
3. Execute o arquivo .bat:
   ```bash
   iniciar-backend-dev.bat
   ```

### Opção B: Manual
1. Abra um **CMD externo**
2. Navegue até a pasta backend:
   ```bash
   cd C:\Users\Java\Desktop\sige\backend
   ```
3. Se for a primeira vez, instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

**Resultado esperado:**
```
Servidor rodando na porta 8080
```

---

## 🌐 Passo 2: Acessar a Página de Teste da API

1. Abra seu navegador
2. Acesse: `file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\teste-api.html`
3. Você verá um painel de teste com todos os endpoints

### Funcionamento do Painel de Teste:

- **Status da API**: Mostra se o servidor está online (✅ ou ❌)
- **Botões de Teste**: Cada botão executa um teste específico
- **Saída dos Testes**: Mostra os resultados em tempo real
- **Fluxo Completo**: Executa uma sequência de testes automaticamente

### Testando Passo a Passo:

1. Clique em "🔄 Verificar Status" - Verifica se a API está respondendo
2. Clique em "Registrar Usuário" - Cria um novo usuário
3. Clique em "Login" - Autentica o usuário (salva o token)
4. Clique em "Obter Dados do Usuário" - Busca dados do usuário autenticado
5. Clique em "Listar Cursos" - Lista todos os cursos
6. Clique em "Listar Inscrições" - Lista inscrições (requer autenticação)

---

## 🎯 Passo 3: Testar as Páginas do Portal

### Acessar as Telas Principais

1. **Página de Reclamações:**
   ```
   file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\reclamacoes.html
   ```
   - Clique no botão hamburger (≡) para abrir a sidebar
   - Navegue entre as páginas
   - Clique em "Ver Detalhes" em uma reclamação

2. **Página de Detalhes de Reclamação:**
   ```
   file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\detalhes-reclamacao.html
   ```

3. **Página de Atendimento Agendado:**
   ```
   file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\atendimento-agendado.html
   ```

4. **Página de Estrutura Curricular:**
   ```
   file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\estrutura-curricular.html
   ```

5. **Página de Quadro de Horários:**
   ```
   file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\quadro-horarios.html
   ```

### Testando a Sidebar

- Clique no botão hamburger (≡) para abrir/fechar a sidebar
- Navegue entre as seções:
  - **Académico** - Frequência, Histórico, Currículo, Horários
  - **Calendário e Agenda** - Agenda Escolar
  - **Comunicação** - Reclamações, Ouvidoria, Atendimento
  - **Documentação** - Meus Documentos
  - **Conta** - Meu Perfil
- Pressione ESC para fechar a sidebar
- A página atual deve estar destacada na sidebar

---

## ✅ Testes de Funcionalidade

### 1. Teste de Navegação
- [ ] Sidebar abre e fecha corretamente
- [ ] Página ativa está destacada
- [ ] Todos os links funcionam
- [ ] ESC fecha a sidebar

### 2. Teste de Layout
- [ ] Cards de reclamações exibem corretamente
- [ ] Grid em 2 colunas funciona no atendimento-agendado
- [ ] Grid em 2 colunas funciona na estrutura-curricular
- [ ] Tabelas são responsivas

### 3. Teste de API
- [ ] Conecta a http://localhost:8080/api
- [ ] Endpoints de usuários respondembem
- [ ] Endpoints de cursos funcionam
- [ ] Autenticação JWT funciona

### 4. Teste de Responsividade
- [ ] Sidebar colapsível em mobile (< 768px)
- [ ] Layout mantém qualidade em diferentes tamanhos
- [ ] Tabelas roláveis em mobile

---

## 🐛 Troubleshooting

### Problema: "API Offline" no painel de testes

**Solução:**
1. Verifique se o servidor backend está rodando
2. Confira se está rodando em http://localhost:8080
3. Verifique se o Node.js e npm estão instalados corretamente

### Problema: CORS Error

**Solução:**
- O backend já tem CORS habilitado
- Verifique se o servidor backend está respondendo

### Problema: Componentes não aparecem

**Solução:**
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Recarregue a página (Ctrl+F5 ou Cmd+Shift+R)
3. Verifique se os arquivos CSS estão carregando (F12 > Console)

### Problema: Sidebar não funciona

**Solução:**
1. Abra o console do navegador (F12)
2. Verifique se há erros de JavaScript
3. Confirme se o arquivo `sidebar-nav.js` está carregando
4. Tente recarregar a página

---

## 📊 Checklist Final

- ✅ Servidor backend rodando em http://localhost:8080
- ✅ Página de teste da API acessível
- ✅ Todas as rotas da API respondem
- ✅ Sidebar funciona em todas as páginas
- ✅ Layout 2 colunas funciona em atendimento-agendado
- ✅ Layout 2 colunas funciona em estrutura-curricular
- ✅ Página de detalhes-reclamacao carrega corretamente
- ✅ Navegação entre páginas funciona sem erros
- ✅ Responsividade adequada em mobile

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique a seção Troubleshooting
2. Abra o console do navegador (F12) e procure por erros
3. Verifique os arquivos log do servidor backend
4. Consulte a documentação em `adaptacao.md`

---

**Última Atualização:** 15 de Junho de 2026

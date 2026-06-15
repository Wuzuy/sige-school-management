# Adaptação SIGE - Documentação Completa

## 📋 Resumo das Alterações

Este documento detalha todas as mudanças realizadas no sistema SIGE para melhorar a navegação, design e funcionalidades do portal do aluno.

---

## 🎨 1. Mudanças de Design e Layout

### 1.1 Consolidação de Headers
**Problema:** O sistema tinha dois headers ("topbar" principal e "miniTopbar") que causavam confusão visual e problemas de estética.

**Solução Implementada:**
- Remover o "miniTopbar" (display: none no CSS)
- Manter apenas o header principal com logo e botão de menu hamburger
- Simplificar a navegação para apenas o botão de menu mobile

**Arquivos Modificados:**
- `frontend-web/portal-escolar/assets/css/app.css` - Desabilitado miniTopbar

### 1.2 Nova Sidebar Moderna e Intuitiva
**Problema:** A sidebar anterior mostrava categorias de alimentos (salgados, doces, frutas) que não tinha relação com as funcionalidades do portal.

**Solução Implementada:**
- Criar nova sidebar estruturada com navegação real por páginas do sistema
- Organizar páginas em seções temáticas lógicas
- Adicionar ícones visuais para melhor identificação
- Implementar sistema de highlight da página atual
- Adicionar botão de logout no final da sidebar

**Estrutura da Sidebar:**
```
📚 Académico
  ├─ ✓ Consulta de Frequência
  ├─ 📊 Histórico Escolar
  ├─ 📖 Estrutura Curricular
  └─ 🕐 Quadro de Horários

📅 Calendário e Agenda
  └─ 📆 Agenda Escolar

💬 Comunicação
  ├─ ⚠️ Reclamações
  ├─ 🎤 Ouvidoria
  └─ 📞 Atendimento Agendado

📄 Documentação
  └─ 📑 Meus Documentos

👤 Conta
  └─ 🔧 Meu Perfil
```

**Arquivo Novo Criado:**
- `frontend-web/portal-escolar/assets/js/sidebar-nav.js` - Sistema de navegação inteligente da sidebar

---

## 📱 2. Atualização de Páginas

### 2.1 Páginas Atualizadas
As seguintes páginas foram reestruturadas com o novo design:

1. **reclamacoes.html**
   - Removido header antigo e miniTopbar
   - Adicionada nova sidebar com navegação
   - Mantidos os cards de status (Pendentes, Em Andamento, Resolvidas)
   - Tabela de reclamações melhorada

2. **atendimento-agendado.html**
   - Removido header antigo e miniTopbar
   - Adicionada nova sidebar
   - Layout em grid 2 colunas: seção esquerda (2fr) para detalhes, direita (1fr) para agenda

3. **estrutura-curricular.html**
   - Removido header antigo e miniTopbar
   - Adicionada nova sidebar
   - Layout em grid 2 colunas com resumo curricular

### 2.2 Nova Página Criada
- **quadro-horarios.html** - Página para visualização de horários de aula com tabela de grade horária

### 2.3 Página de Detalhes
- **detalhes-reclamacao.html** - Página dedicada para exibir detalhes completos de uma reclamação, incluindo:
  - Informações gerais (categoria, data, prioridade, status)
  - Descrição detalhada
  - Histórico de atividades (timeline)
  - Resposta da administração
  - Informações do protocolo na sidebar

---

## 🔗 3. Integração com Backend

### 3.1 Rotas Disponíveis no Backend

**Base URL:** `http://localhost:8080/api`

#### Usuários
- `POST /usuarios` - Registrar novo usuário
- `POST /usuarios/login` - Fazer login
- `GET /usuarios/me` - Obter dados do usuário autenticado (requer token)
- `PUT /usuarios/me` - Atualizar perfil (requer token)

#### Cursos
- `GET /cursos` - Listar todos os cursos ativos

#### Inscrições
- `POST /inscricoes` - Criar nova inscrição (requer autenticação)
- `GET /inscricoes` - Listar inscrições com dados do curso e usuário

#### Unidades
- Rotas ainda não especificadas (verificar backend/routes/unidades.js)

#### Editais
- Rotas ainda não especificadas (verificar backend/routes/editais.js)

### 3.2 Estrutura de Autenticação
- Sistema JWT (JSON Web Token)
- Token expiração: 1 dia
- JWT_SECRET: 'secreta_sige_123' (padrão, mudar em produção)

**Como Usar:**
```javascript
// Login
const response = await fetch('http://localhost:8080/api/usuarios/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', senha: 'password123' })
});

const { token, usuario } = await response.json();
localStorage.setItem('auth', JSON.stringify({ token, usuario }));

// Usar em requisições autenticadas
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

---

## 🎯 4. Funcionalidades Melhoradas

### 4.1 Sistema de Navegação
- **Sidebar dinâmica** que se constrói automaticamente com a navegação
- **Highlight de página atual** para orientação do usuário
- **Responsividade** - Sidebar colapsível em mobile
- **Fechamento automático** ao clicar em um link ou pressionar ESC

### 4.2 Estilo Visual
- **Cores consistentes** seguindo a paleta de cores do sistema
- **Transições suaves** em interações
- **Ícones visuais** para melhor identificação
- **Cards com efeitos hover** para feedback visual

### 4.3 Acessibilidade
- **Menu hamburger acessível** com atributos ARIA
- **Navegação por teclado** (ESC para fechar)
- **Estrutura semântica** de HTML

---

## 📂 5. Arquivos Criados/Modificados

### Criados:
- `frontend-web/portal-escolar/assets/js/sidebar-nav.js` ✨ Novo - Sistema de navegação inteligente
- `frontend-web/portal-escolar/assets/js/api-test.js` ✨ Novo - Funções para testar API
- `frontend-web/portal-escolar/quadro-horarios.html` ✨ Novo - Página de horários
- `frontend-web/portal-escolar/detalhes-reclamacao.html` ✨ Novo - Página de detalhes
- `frontend-web/portal-escolar/teste-api.html` ✨ Novo - Painel visual de teste
- `backend/iniciar-backend-dev.bat` ✨ Novo - Script para iniciar servidor
- `adaptacao.md` ✨ Novo - Documentação completa
- `GUIA-TESTE.md` ✨ Novo - Guia passo a passo de testes

### Modificados:
- `frontend-web/portal-escolar/assets/css/app.css` - Adicionadas seções CSS para nova sidebar
- `frontend-web/portal-escolar/reclamacoes.html` - Reestruturado com nova sidebar
- `frontend-web/portal-escolar/atendimento-agendado.html` - Reestruturado com nova sidebar
- `frontend-web/portal-escolar/estrutura-curricular.html` - Reestruturado com nova sidebar

---

## 🚀 6. Como Testar

### 6.1 Iniciar o Servidor Backend

1. Abra um **CMD externo** (não PowerShell do VS Code)
2. Navegue até a pasta backend:
   ```bash
   cd C:\Users\Java\Desktop\sige\backend
   ```
3. Execute um dos comandos:
   ```bash
   npm run dev
   ```
   Ou execute o arquivo .bat criado:
   ```bash
   iniciar-backend-dev.bat
   ```

### 6.2 Acessar Página de Teste da API (RECOMENDADO)

**Novo arquivo criado:** `teste-api.html`

1. Abra seu navegador
2. Acesse: `file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\teste-api.html`
3. Clique em "Verificar Status" para confirmar que a API está respondendo
4. Execute o "Fluxo Completo" para testar todos os endpoints

**Funcionalidades do Painel de Teste:**
- ✅ Verificação de status da API
- ✅ Teste de registro de usuário
- ✅ Teste de login (salva token automaticamente)
- ✅ Teste de dados do usuário
- ✅ Teste de listagem de cursos
- ✅ Teste de listagem e criação de inscrições
- ✅ Saída em tempo real dos testes
- ✅ Fluxo completo automatizado

### 6.3 Acessar as Páginas do Portal

1. **Reclamações:** `file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\reclamacoes.html`
2. **Atendimento Agendado:** `file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\atendimento-agendado.html`
3. **Estrutura Curricular:** `file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\estrutura-curricular.html`
4. **Quadro de Horários:** `file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\quadro-horarios.html`
5. **Detalhes de Reclamação:** `file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\detalhes-reclamacao.html`

### 6.4 Testar Rotas da API com curl

Use os exemplos abaixo em um CMD:

```bash
# Verificar status da API
curl -X GET http://localhost:8080/api/cursos

# Registrar novo usuário
curl -X POST http://localhost:8080/api/usuarios ^
  -H "Content-Type: application/json" ^
  -d "{\"nomeCompleto\": \"Teste User\", \"email\": \"teste@example.com\", \"senha\": \"Senha123@\"}"

# Fazer login
curl -X POST http://localhost:8080/api/usuarios/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"teste@example.com\", \"senha\": \"Senha123@\"}"
```

---

## ✅ 7. Checklist de Alterações

- ✅ Sidebar reestruturada com navegação por páginas
- ✅ Headers consolidados (removido miniTopbar)
- ✅ Design moderno e intuitivo implementado
- ✅ Página de detalhes de reclamação criada
- ✅ Página de quadro de horários criada
- ✅ Rotas de API identificadas e documentadas
- ✅ Sistema de autenticação JWT integrado
- ✅ Arquivo de teste para backend criado (iniciar-backend-dev.bat)
- ✅ Painel visual de teste de API criado (teste-api.html)
- ✅ Documentação completa em adaptacao.md
- ✅ Guia de testes passo a passo em GUIA-TESTE.md

---

## 📝 8. Arquivo de Referência Rápida

Para acesso rápido durante testes:

**Para Iniciar o Backend:**
```bash
cd C:\Users\Java\Desktop\sige\backend
npm run dev
# ou
iniciar-backend-dev.bat
```

**Para Testar a API (Recomendado):**
```
file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\teste-api.html
```

**URLs Diretas das Páginas:**
- Reclamações: `file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\reclamacoes.html`
- Atendimento: `file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\atendimento-agendado.html`
- Currículo: `file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\estrutura-curricular.html`
- Horários: `file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\quadro-horarios.html`
- Detalhes: `file:///C:\Users\Java\Desktop\sige\frontend-web\portal-escolar\detalhes-reclamacao.html`

---

## 📝 9. Próximas Melhorias (Sugestões)

1. **Integração com Backend Real**
   - Carregar dados de reclamações da API
   - Sincronizar agenda com banco de dados
   - Carregar cursos reais via API

2. **Autenticação Completa**
   - Implementar sistema de login
   - Armazenar token JWT
   - Proteção de rotas

3. **Responsividade Avançada**
   - Otimizar layout para tablets
   - Melhorar toque em mobile

4. **Funcionalidades Adicionais**
   - Modal para criar nova reclamação
   - Download de PDF de documentos
   - Notificações em tempo real

5. **Segurança**
   - HTTPS em produção
   - Rate limiting nas APIs
   - Validação de entrada mais robusta

6. **Outras Páginas Necessárias**
   - `ouvidoria.html` - Sistema de ouvidoria
   - `conta.html` - Gerenciamento de conta do usuário
   - `meus-documentos.html` - Gestão de documentos
   - `agenda-escolar.html` - Agenda de eventos escolares
   - `consulta-freq.html` - Consulta de frequência
   - `historico-escolar.html` - Histórico escolar do aluno

---

## 📞 Contato e Suporte

Para dúvidas sobre as implementações:
1. Consulte `GUIA-TESTE.md` para instruções de teste
2. Verifique `adaptacao.md` para detalhes técnicos
3. Abra o console do navegador (F12) para ver erros
4. Use o painel de teste em `teste-api.html` para verificar a API

---

**Última Atualização:** 15 de Junho de 2026
**Versão:** 1.0

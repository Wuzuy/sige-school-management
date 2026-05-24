# Portal Escolar - SIGE

Portal web para gerenciamento acadêmico de alunos, professores e secretaria.

## Descrição

Este é o portal escolar do Sistema de Inscrição e Gestão Escolar (SIGE). Oferece funcionalidades de gerenciamento acadêmico com interfaces diferenciadas para alunos, professores e pessoal da secretaria.

## Estrutura de Pastas

```
portal-escolar/
├── assets/
│   ├── css/
│   │   ├── app.css           # Estilos principais
│   │   └── styleMain.css     # Estilos adicionais
│   ├── js/
│   │   ├── api-config.js     # Configuração da API
│   │   └── scripts.js        # Scripts compartilhados
│   ├── images/               # Imagens e ícones
│   └── fonts/                # Fontes customizadas
├── index.html                # Dashboard principal
├── portal-aluno.html         # Perfil do aluno
├── portal-secretaria.html    # Portal administrativo
├── historico-escolar.html    # Histórico acadêmico
├── meus-documentos.html      # Documentos do aluno
├── consulta-freq.html        # Frequência do aluno
├── agenda-escolar.html       # Agenda de eventos
├── calendario-escolar.html   # Calendário do ano letivo
└── README.md
```

## Páginas

### Para Alunos

#### 1. **index.html** - Dashboard Principal
- Acesso rápido a funcionalidades
- Atalhos para seções principais
- Informações do usuário

#### 2. **portal-aluno.html** - Perfil do Aluno
- Dados pessoais (nome, email, CPF, etc.)
- Informações acadêmicas (matrícula, série, turno)
- Edição de dados básicos

#### 3. **historico-escolar.html** - Histórico Acadêmico
- Disciplinas cursadas
- Notas por disciplina
- Frequência
- Status de aprovação/reprovação

#### 4. **meus-documentos.html** - Documentos
- Histórico escolar (para download)
- Certidões
- Comprovantes de matrícula
- Diplomas

#### 5. **consulta-freq.html** - Frequência
- Frequência por disciplina
- Total de aulas
- Presenças e faltas
- Percentual de frequência

#### 6. **agenda-escolar.html** - Agenda
- Eventos escolares
- Atividades programadas
- Datas importantes

#### 7. **calendario-escolar.html** - Calendário
- Datas do ano letivo
- Períodos de aula
- Férias e recessos
- Datas de avaliações

### Para Secretaria

#### 1. **portal-secretaria.html** - Portal Administrativo
- Dashboard com estatísticas
- Inscrições pendentes
- Contagem de alunos
- Acesso rápido a ferramentas

### Multiperfil

#### 1. **portal-aluno.html** (Acesso Secretaria)
- Mesmo conteúdo do aluno, mas com vista administrativa
- Acesso a dados de qualquer aluno

## Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos responsivos com grid e flexbox
- **JavaScript Vanilla**: Interatividade sem dependências
- **API RESTful**: Comunicação com backend via fetch
- **Autenticação JWT**: Controle de acesso por role

## Como Usar

### Desenvolvimento Local

1. Navegue até a pasta `portal-escolar`
2. Abra `index.html` no navegador (ou use Live Server)
3. Faça login com suas credenciais
4. Certifique-se de que a API backend está rodando em `http://localhost:8080/api`

### Primeiro Acesso

1. Acesse o portal de inscrição (`../portal-inscricao/login.html`)
2. Crie uma conta ou faça login
3. Após inscrição e aprovação, acesse o portal escolar
4. Você será redirecionado para o seu dashboard

## Fluxo de Navegação - Aluno

```
Dashboard → Perfil → Histórico/Documentos/Frequência
                  ↓
          Agenda/Calendário
```

## Fluxo de Navegação - Secretaria

```
Portal Admin → Inscrições/Alunos/Matrículas → Relatórios
```

## Sistema de Autenticação

### Roles (Papéis)

- **ROLE_USER**: Aluno
- **ROLE_TEACHER**: Professor
- **ROLE_ADMIN**: Secretaria/Administrador

### Proteção de Páginas

- Páginas obrigam autenticação
- Acesso negado para roles não autorizados
- Redirecionamento automático para login

## Scripts Disponíveis

### api-config.js
- Detecção automática de ambiente
- Configuração da URL da API
- Modal para configuração manual
- Indicador de status da API

### scripts.js
- Funções de autenticação (requireAuth, setupTopNav)
- Validações de entrada
- Requisições à API
- Renderização de componentes
- Gerenciamento de notificações
- Formatação de datas
- Tratamento de erros

## Validações

- **Email**: Formato válido
- **Data**: Formato ISO (YYYY-MM-DD)
- **Telefone**: Formato brasileiro
- **Campos obrigatórios**: Todos preenchidos

## Notificações

Usa biblioteca **Notyf** para notificações toast com status:
- ✓ Sucesso (verde)
- ✕ Erro (vermelho)
- ⚠ Aviso (amarelo)
- ℹ Informação (azul)

## Responsividade

Totalmente responsivo para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

Menu mobile com hamburger icon, navegação colapsível e layout otimizado para touch.

## Temas de Cores

- **Primária**: Azul (#00aaff)
- **Secundária**: Azul escuro (#1643f5)
- **Sucesso**: Verde (#10b981)
- **Erro**: Vermelho (#ef4444)
- **Aviso**: Amarelo (#f59e0b)

## Troubleshooting

### Acesso Negado
Se receber "Acesso Negado", você não tem permissão para essa página. Verifique seu role de usuário.

### Dados não carregam
Certifique-se de:
1. API backend está rodando
2. Token JWT é válido
3. Conexão com internet está ativa

### Logout não funciona
Limpe o localStorage manualmente via console do navegador:
```javascript
localStorage.clear()
```

## Personalizações Possíveis

### Adicionar Nova Página
1. Crie novo arquivo `.html` na raiz
2. Copie estrutura de cabeçalho/navegação de página existente
3. Atualize links de navegação
4. Implemente carregamento de dados

### Modificar Cores
Edite as variáveis CSS em `assets/css/app.css`:
```css
:root {
  --primary: #00aaff;
  --primary-strong: #1643f5;
  /* ... */
}
```

### Adicionar Novo Formulário
Use estrutura de campo padrão:
```html
<div class="field">
  <label for="campo">Rótulo</label>
  <input id="campo" type="text" required />
</div>
```

## Links Úteis

- [Backend API](../../../docs/backend-api-reference.md)
- [Documentação Técnica](../../../docs/frontend-documentacao-tecnica.md)
- [FAQ](../../../docs/troubleshooting.md)
- [Portal de Inscrição](../portal-inscricao/README.md)

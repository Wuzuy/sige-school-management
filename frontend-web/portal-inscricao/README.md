# Portal de Inscrição - SIGE

Portal web para gerenciamento de inscrições em cursos.

## Descrição

Este é o portal de inscrição do Sistema de Inscrição e Gestão Escolar (SIGE). Permite que candidatos se cadastrem, façam login e gerenciem suas inscrições em cursos disponíveis.

## Estrutura de Pastas

```
portal-inscricao/
├── assets/
│   ├── css/
│   │   └── app.css           # Estilos principais
│   ├── js/
│   │   ├── api-config.js     # Configuração da API
│   │   └── scripts.js        # Scripts compartilhados
│   ├── images/               # Imagens e ícones
│   └── fonts/                # Fontes customizadas
├── index.html                # Página de cursos disponíveis
├── login.html                # Página de acesso/cadastro
├── inscricao.html            # Formulário de inscrição
├── status.html               # Status das inscrições
├── forgot-password.html       # Recuperação de senha
├── reset-password.html        # Redefinição de senha
├── credits.html              # Página de créditos
└── README.md
```

## Páginas

### 1. **login.html**
- Acesso ao sistema
- Criação de conta
- Links para recuperação de senha
- Lista de editais publicados

### 2. **index.html**
- Exibe cursos disponíveis em formato de tabela
- Filtro e busca de cursos
- Botão "Inscrever-se" para cada curso

### 3. **inscricao.html**
- Formulário de inscrição em um curso
- Pré-preenchimento de dados do usuário
- Validação de dados obrigatórios

### 4. **status.html**
- Acompanhamento de inscrições enviadas
- Status de cada inscrição (em análise, aprovado, rejeitado)
- Link para matrícula quando aprovado
- Detalhes do curso e timeline de etapas

### 5. **forgot-password.html**
- Solicitação de link de recuperação de senha
- Validação de email

### 6. **reset-password.html**
- Redefinição de senha com token
- Validação de requisitos de senha forte

## Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos responsivos com grid e flexbox
- **JavaScript Vanilla**: Interatividade sem dependências
- **API RESTful**: Comunicação com backend via fetch

## Como Usar

### Desenvolvimento Local

1. Navegue até a pasta `portal-inscricao`
2. Abra `login.html` no navegador (ou use Live Server)
3. Certifique-se de que a API backend está rodando em `http://localhost:8080/api`

### Configuração da API

A URL da API é detectada automaticamente:

1. **LocalStorage**: Se configurado manualmente no navegador
2. **Variáveis de ambiente**: Em produção (Cloudflare Pages)
3. **Localhost**: Para desenvolvimento (`http://localhost:8080/api`)

Se estiver usando Cloudflare Pages, configure a URL da API através do modal que aparecerá na primeira visita.

## Fluxo de Usuário

```
Login/Cadastro → Ver Cursos → Selecionar Curso → Preencher Inscrição
                    ↓
            Acompanhar Status → Aceitar Matrícula (se aprovado)
```

## Scripts Disponíveis

### api-config.js
- Detecção automática de ambiente
- Configuração da URL da API
- Modal para configuração manual
- Indicador de status da API

### scripts.js
- Funções de autenticação
- Validações (email, CPF, senha)
- Requisições à API
- Renderização de componentes
- Gerenciamento de notificações

## Validações

- **Email**: Formato válido
- **Senha**: Mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial
- **CPF**: 11 dígitos
- **Telefone**: Formato brasileiro

## Notificações

Usa biblioteca **Notyf** para notificações toast com status:
- ✓ Sucesso (verde)
- ✕ Erro (vermelho)
- ⚠ Aviso (amarelo)
- ℹ Informação (azul)

## Segurança

- **Autenticação JWT**: Token armazenado em localStorage
- **Sanitização**: HTML escapado para prevenir XSS
- **Validação**: Validação no cliente e servidor
- **CORS**: Controlado no backend

## Responsividade

Totalmente responsivo para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

Menu mobile com hamburger icon, navegação colapsível e layout otimizado para touch.

## Troubleshooting

### API Offline
Se a API estiver offline, um modal de configuração aparecerá. Configure a URL correta do backend.

### Senha não atende aos requisitos
Certifique-se de usar: MAIÚSCULA + minúscula + número + caractere especial (@#$%^&+=!)

### Formulário não envia
Verifique no console (F12) se há mensagens de erro. Certifique-se de preencher todos os campos obrigatórios.

## Links Úteis

- [Backend API](../../../docs/backend-api-reference.md)
- [Documentação Técnica](../../../docs/frontend-documentacao-tecnica.md)
- [FAQ](../../../docs/troubleshooting.md)

# Frontend Web - SIGE

Interface web do Sistema de Inscrição e Gestão Escolar (SIGE).

## 📋 Visão Geral

O frontend web foi reorganizado em **dois portais independentes**, cada um com sua própria estrutura, estilos e funcionalidades:

### 1. **Portal de Inscrição** (`portal-inscricao/`)
Para candidatos realizarem inscrições em cursos. Funcionalidades:
- Cadastro e login
- Consulta de cursos disponíveis
- Inscrição em cursos
- Acompanhamento de status
- Recuperação de senha

### 2. **Portal Escolar** (`portal-escolar/`)
Para gestão acadêmica de alunos, professores e secretaria. Funcionalidades:
- Perfil do aluno
- Histórico acadêmico
- Frequência
- Documentos escolares
- Agenda e calendário
- Portal administrativo (secretaria)

## Tecnologias

* **HTML5** - Estrutura semântica
* **CSS3** - Grid, Flexbox, Media Queries
* **JavaScript (Vanilla)** - Sem dependências
* **Notyf** - Notificações toast
* **JWT** - Autenticação

## Como Executar Localmente

### Portal de Inscrição

1. Navegue até `portal-inscricao/`
2. Abra `login.html` no navegador (ou use Live Server)
3. Certifique-se que a API backend está rodando em `http://localhost:8080/api`

### Portal Escolar

1. Navegue até `portal-escolar/`
2. Abra `index.html` no navegador após fazer login
3. A API backend precisa estar rodando

### Live Server (Recomendado)

```bash
# No VS Code, clique com botão direito em qualquer arquivo HTML
# → "Open with Live Server"
# Ou use o atalho: Alt + L, Alt + O
```

## 📁 Estrutura de Pastas

```
frontend-web/
├── portal-inscricao/
│   ├── assets/
│   │   ├── css/          # Estilos (app.css)
│   │   ├── js/           # Scripts (api-config.js, scripts.js)
│   │   ├── images/       # Imagens e ícones
│   │   └── fonts/        # Fontes customizadas
│   ├── index.html        # Cursos disponíveis
│   ├── login.html        # Acesso e cadastro
│   ├── inscricao.html    # Formulário de inscrição
│   ├── status.html       # Status de inscrições
│   ├── forgot-password.html
│   ├── reset-password.html
│   ├── credits.html
│   └── README.md
│
├── portal-escolar/
│   ├── assets/           # Mesma estrutura que portal-inscricao
│   ├── index.html        # Dashboard principal
│   ├── portal-aluno.html
│   ├── portal-secretaria.html
│   ├── historico-escolar.html
│   ├── meus-documentos.html
│   ├── consulta-freq.html
│   ├── agenda-escolar.html
│   ├── calendario-escolar.html
│   └── README.md
│
├── static/               # DEPRECIADO - Estrutura antiga
│   └── ...
│
├── README.md             # Este arquivo
└── ...
```

## 🔧 Configuração da API

A URL da API é detectada automaticamente em ordem de prioridade:

1. **LocalStorage** - Configurado manualmente pelo usuário
2. **Variáveis de Ambiente** - Em produção (Cloudflare Pages)
3. **Window Global** - Para testes
4. **Localhost** - Fallback para desenvolvimento (`http://localhost:8080/api`)

Para configurar manualmente:

```javascript
// No console do navegador:
localStorage.setItem('API_BASE_URL', 'http://seu-api:8080/api');
```

## 🎯 Próximas Etapas

Após a reorganização, considere:

1. **Deletar a pasta `static/`** - Contém arquivos antigos depreciados
2. **Atualizar links** - Se houver referências diretas aos arquivos antigos
3. **Testes** - Validar que todos os portais funcionam corretamente
4. **Deploy** - Fazer deploy dos novos portais em produção

## 📖 Documentação Detalhada

- **[Portal de Inscrição](./portal-inscricao/README.md)** - Guia completo do portal de inscrições
- **[Portal Escolar](./portal-escolar/README.md)** - Guia completo do portal de gestão escolar
- **[API Reference](../docs/backend-api-reference.md)** - Documentação da API backend
- **[Documentação Técnica](../docs/frontend-documentacao-tecnica.md)** - Detalhes técnicos

## 🚀 Quick Start

### Desenvolvimento

```bash
# 1. Inicie o backend
# → cd backend && npm run dev

# 2. Abra o portal de inscrição
# → Abra portal-inscricao/login.html no navegador (Use Live Server)

# 3. Crie uma conta e faça login

# 4. Acesse o portal escolar
# → Abra portal-escolar/index.html
```

### Production (Cloudflare Pages)

1. Deploy a pasta completa `frontend-web/`
2. Configure as variáveis de ambiente:
   ```
   API_BASE_URL=https://seu-api.com/api
   ```
3. O sistema detectará automaticamente e usará essa URL

## 🔒 Segurança

- Autenticação via JWT
- Validação de input no cliente
- HTML escapado (XSS prevention)
- Controle de acesso por role (Admin, Teacher, User)
- Tokens armazenados em localStorage

## 📱 Responsividade

Todos os portais são 100% responsivos:
- **Mobile** (até 480px) - Menu hamburger, layout otimizado
- **Tablet** (480-768px) - Interface adaptada
- **Desktop** (768px+) - Layout completo

## 🎨 Customização

### Cores
Edite as variáveis CSS em `assets/css/app.css`:

```css
:root {
  --primary: #00aaff;
  --primary-strong: #1643f5;
  --danger: #b91c1c;
  /* ... */
}
```

### Fontes
As fontes estão em `assets/fonts/`:
- ArchivoBlack-Regular.ttf (títulos)
- Gontserrat-Regular.ttf (corpo)
- Gontserrat-Bold.ttf (ênfase)

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| "API Offline" | Inicie o backend em `http://localhost:8080` |
| Estilos não carregam | Verifique se o caminho é `assets/css/...` |
| Acesso negado | Você não tem permissão. Verifique seu role |
| Senha não aceita | Use: MAIÚSCULA + minúscula + número + especial |

## 📝 Notas Importantes

- ✅ Dois portais totalmente independentes e organizados
- ✅ Assets (CSS, JS, fonts, images) em cada portal
- ✅ Sem dependências de build (HTML puro)
- ✅ 100% responsivo
- ✅ Autenticação JWT implementada
- ⚠️ Pasta `static/` depreciada - pode ser deletada

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os READMEs específicos de cada portal
2. Consulte a [Documentação Técnica](../docs/frontend-documentacao-tecnica.md)
3. Verifique o [Troubleshooting](../docs/troubleshooting.md)
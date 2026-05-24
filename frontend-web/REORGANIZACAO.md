# Reorganização do Frontend - SIGE

## ✅ O que foi feito

O frontend web foi reorganizado em **dois portais independentes e bem estruturados**:

### 1. **Portal de Inscrição** (`portal-inscricao/`)
- Destinado a candidatos
- Inscrição, login, recuperação de senha
- Acompanhamento de inscrições
- **Arquivo principal**: `login.html` ou `index.html`

### 2. **Portal Escolar** (`portal-escolar/`)
- Destinado a alunos, professores e secretaria
- Gerenciamento acadêmico completo
- Histórico, frequência, documentos, etc.
- **Arquivo principal**: `index.html` (após login)

## 📁 Estrutura de Cada Portal

```
portal-*/
├── assets/
│   ├── css/
│   │   └── app.css           # Estilos responsivos
│   ├── js/
│   │   ├── api-config.js     # Config automática da API
│   │   └── scripts.js        # Funções compartilhadas
│   ├── images/               # Imagens e ícones (localizado: assets/images/)
│   └── fonts/                # Fontes TTF (localizado: assets/fonts/)
├── [páginas HTML]
└── README.md
```

## 🔄 Caminhos Atualizados

Todos os caminhos foram refatorados para usar a nova estrutura:

### CSS
```html
<!-- Antes -->
<link rel="stylesheet" href="app.css" />

<!-- Depois -->
<link rel="stylesheet" href="assets/css/app.css" />
```

### JavaScript
```html
<!-- Antes -->
<script src="api-config.js"></script>
<script src="scripts.js"></script>

<!-- Depois -->
<script src="assets/js/api-config.js"></script>
<script src="assets/js/scripts.js"></script>
```

### Imagens
```html
<!-- Antes -->
<img src="imagens/sige.png" alt="SIGE" />
<img src="backgroundLogin.png" />

<!-- Depois -->
<img src="assets/images/sige.png" alt="SIGE" />
<!-- (fundo definido em CSS) -->
```

### Fontes
```css
/* Antes */
@font-face {
  font-family: 'titulo';
  src: url("ArchivoBlack-Regular.ttf");
}

/* Depois */
@font-face {
  font-family: 'titulo';
  src: url("../fonts/ArchivoBlack-Regular.ttf");
}
```

## 📄 Páginas de Cada Portal

### Portal de Inscrição
- **login.html** - Login e cadastro
- **index.html** - Cursos disponíveis
- **inscricao.html** - Formulário de inscrição
- **status.html** - Status de inscrições
- **forgot-password.html** - Recuperar senha
- **reset-password.html** - Redefinir senha
- **credits.html** - Créditos

### Portal Escolar
- **index.html** - Dashboard principal
- **portal-aluno.html** - Perfil do aluno
- **portal-secretaria.html** - Portal administrativo
- **historico-escolar.html** - Histórico acadêmico
- **meus-documentos.html** - Documentos do aluno
- **consulta-freq.html** - Frequência
- **agenda-escolar.html** - Agenda de eventos
- **calendario-escolar.html** - Calendário escolar

## 🔗 Navegação entre Portais

Os portais são independentes mas conectados:

```html
<!-- No portal-inscricao -->
<a href="../portal-escolar/portal-aluno.html">Portal do Aluno</a>

<!-- No portal-escolar -->
<a href="../portal-inscricao/index.html">Voltar Inscrições</a>
```

## 🚀 Como Usar

### Desenvolvimento

1. **Portal de Inscrição:**
   ```
   Abra: portal-inscricao/login.html
   ```

2. **Portal Escolar:**
   ```
   Abra: portal-escolar/index.html (após fazer login)
   ```

3. Use **Live Server** (extensão VS Code) para auto-reload

### Production (Cloudflare Pages)

1. Deploy toda a pasta `frontend-web/`
2. Configure a URL da API nas variáveis de ambiente
3. Sistema detecta automaticamente

## 📦 Assets Copiados

Cada portal tem sua própria cópia de:

- ✅ **Fontes** (.ttf)
  - ArchivoBlack-Regular.ttf
  - Gontserrat-Regular.ttf
  - Gontserrat-Bold.ttf

- ✅ **Imagens**
  - sige.png (logo)
  - backgroundLogin.png
  - Todos os arquivos de `imagens/`

- ✅ **CSS**
  - app.css (estilos principais)
  - styleMain.css (adicional para portal-escolar)

- ✅ **JavaScript**
  - api-config.js (configuração de API)
  - scripts.js (funções auxiliares)

## 🗑️ Arquivos Antigos (DEPRECIADOS)

A pasta `static/` contém a estrutura anterior. **Pode ser deletada** após validar que:

- ✅ Todos os HTMLs foram migrados
- ✅ Todos os assets foram copiados
- ✅ Os portais funcionam corretamente
- ✅ Os links entre páginas funcionam

## ✨ Melhorias Implementadas

### Organização
- ✅ Duas aplicações independentes e bem organizadas
- ✅ Assets separados e localizados
- ✅ Estrutura clara e fácil de manter

### Funcionalidade
- ✅ Todos os caminhos relativos refatorados
- ✅ Autenticação JWT funcionando
- ✅ Notificações com Notyf
- ✅ Menu mobile responsivo
- ✅ Controle de acesso por role

### Documentação
- ✅ README detalhado para cada portal
- ✅ README principal atualizado
- ✅ Comentários no código HTML
- ✅ Este documento de migração

## 🔍 Validação

Para validar que tudo está funcionando:

### Portal de Inscrição
```javascript
// No console, deve funcionar:
getAuth()              // Retorna token se logado
showNotification(...)  // Notificação deve aparecer
request('/editais')    // API deve responder
```

### Portal Escolar
```javascript
// No console, deve funcionar:
requireAuth()          // Redireciona se não autenticado
setupProtectedPage()   // Setup da página
formatDate('2024-05-24') // Formata data
```

## 📝 Notas Importantes

1. **Independência**: Os dois portais são completamente independentes
2. **Assets duplicados**: Cada portal tem sua própria cópia (segurança/performance)
3. **Autenticação compartilhada**: Token JWT funcionam em ambos
4. **Responsividade**: 100% em todos os dispositivos
5. **Sem build**: HTML puro, sem minificação necessária

## 🎯 Próximos Passos (Opcional)

- [ ] Deletar pasta `static/` após validação completa
- [ ] Adicionar mais páginas ao portal-escolar (relatórios, etc.)
- [ ] Implementar PWA (Progressive Web App)
- [ ] Melhorar acessibilidade (WCAG 2.1)
- [ ] Adicionar testes unitários
- [ ] Minificar assets para produção

## 📖 Documentação

Para detalhes específicos:
- **Portal de Inscrição**: [portal-inscricao/README.md](./portal-inscricao/README.md)
- **Portal Escolar**: [portal-escolar/README.md](./portal-escolar/README.md)
- **Frontend Geral**: [README.md](./README.md)
- **API Backend**: [docs/backend-api-reference.md](../docs/backend-api-reference.md)

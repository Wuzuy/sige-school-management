# 📚 Documentação Técnica - SEJA SENAI

<<<<<<< Updated upstream
Pasta reservada para artefatos de planejamento, design e pesquisas do projeto.

# Conteúdo

* **Relatórios:** Documentos e PDFs (como o relatório principal do projeto).

* **Protótipos:** Links, imagens e exportações do Figma.

* **Diagramas:** Modelagem do banco de dados (DER) e fluxogramas.
=======
Esta pasta contém toda a documentação técnica do sistema SEJA SENAI, incluindo guias de desenvolvimento, APIs, configuração, segurança e arquitetura.

## ✨ Nova Experiência de Documentação

A documentação foi **completamente** redesenhada com foco em UX/UI moderna:

- 🎨 Design moderno e responsivo com gradientes e sombras
- 📱 100% mobile-friendly com menu hamburger
- 🎯 Navegação intuitiva com ícones e categorias
- ⚡ Scripts executores documentados em detalhes
- 🔧 Página de troubleshooting com soluções rápidas
- 🚀 Guia de início rápido para começar em minutos

## 📄 Páginas Disponíveis

### 🏠 Essenciais
- **[index.html](index.html)** - Página inicial com visão geral completa e hero section
- **[quick-start.html](quick-start.html)** - Guia rápido para começar em 3 minutos ⭐
- **[scripts.html](scripts.html)** - Documentação completa dos 6 scripts executores ⚡

### 💻 Desenvolvimento
- **[backend.html](backend.html)** - Documentação da API REST, controllers e endpoints
- **[frontend.html](frontend.html)** - Páginas, componentes e fluxos de navegação
- **[snippets.html](snippets.html)** - Trechos de código úteis e exemplos

### 🔒 Segurança e Configuração
- **[security.html](security.html)** - JWT, rate limiting, validações e proteções
- **[init.html](init.html)** - Guia de configuração (H2, MySQL, variáveis)

### 🔧 Suporte
- **[troubleshooting.html](troubleshooting.html)** - Soluções para problemas comuns 🆕
- **[developer-docs.html](developer-docs.html)** - Documentação técnica completa

### 📝 Recursos Adicionais
- **[developer-documentation.md](developer-documentation.md)** - Documentação em formato Markdown
- **[postman/](postman/)** - Coleções Postman para testes de API

## 🚀 Como Acessar a Documentação

### Método 1: Abrir Diretamente
```bash
# Windows
start index.html

# Linux/Mac
open index

.html
```

### Método 2: Servidor Local (Recomendado)
```bash
# Python
cd docs
python -m http.server 8000
# Acesse: http://localhost:8000

# Node.js
cd docs
npx http-server -p 8000
```

## 🎯 Começando Rápido

Para desenvolvedores que querem iniciar agora:

1. **Leia primeiro:** [quick-start.html](quick-start.html) - Setup em 3 minutos
2. **Execute:** Veja [scripts.html](scripts.html) para scripts automáticos
3. **Troubleshoot:** Consulte [troubleshooting.html](troubleshooting.html) se houver problemas

## ⚡ Scripts Executores (NOVO!)

Documentação completa dos 6 scripts criados para facilitar o desenvolvimento:

| Script | Descrição |
|--------|-----------|
| `iniciar-tudo.bat` | ⭐ Inicia tudo automaticamente (backend + frontend + dados) |
| `iniciar-backend.bat` | Inicia apenas o backend Spring Boot |
| `iniciar-frontend.bat` | Inicia apenas o frontend (detecta Python/Node.js) |
| `inserir-dados.bat` | Popula banco com dados de teste |
| `parar-sistema.bat` | Para todos os processos |
| `verificar-status.bat` | Verifica se backend e frontend estão rodando |

📖 **Documentação detalhada:** [scripts.html](scripts.html)

## 🎨 Design System

A documentação utiliza um design system moderno com:

- **Cores:** Gradientes azul SENAI, badges coloridas, boxes de status
- **Componentes:** Cards, boxes informativos, tabelas responsivas, badges
- **Tipografia:** System fonts com hierarquia clara
- **Responsividade:** Breakpoints em 768px (mobile) e 1024px (tablet)
- **Acessibilidade:** ARIA labels, contraste adequado, navegação por teclado

### Arquivo CSS
- **[site.css](site.css)** - Design system completo com variáveis CSS e componentes reutilizáveis

## 📱 Responsividade

A documentação é totalmente adaptada para:

- **🖥️ Desktop** (> 1024px) - Layout em 2 colunas com menu lateral fixo
- **📱 Tablet** (768px - 1024px) - Layout otimizado com menu responsivo
- **📱 Mobile** (< 768px) - Menu hamburger, layout vertical e touch-friendly

## 🔧 Tecnologias Utilizadas

### Backend (Documentado)
- Java 21
- Spring Boot 3.4.5
- Spring Security + JWT
- Spring Data JPA
- MySQL 8.0+ / H2 Database
- Bucket4j 8.1.0 (rate limiting)
- BCrypt

### Frontend (Documentado)
- HTML5 + CSS3 moderno
- JavaScript ES6+ (vanilla)
- LocalStorage
- Design Responsivo (Mobile-first)

### Documentação
- HTML5 semântico
- CSS3 com variáveis customizadas
- JavaScript para menu hamburger
- Design mobile-first

## 📊 Estrutura de Arquivos

```
docs/
├── index.html                    # Página inicial (redesenhada)
├── quick-start.html              # Guia rápido (novo)
├── scripts.html                  # Scripts executores (novo)
├── troubleshooting.html          # Troubleshooting (novo)
├── backend.html                  # Docs backend
├── frontend.html                 # Docs frontend
├── security.html                 # Docs segurança
├── init.html                     # Guia configuração
├── snippets.html                 # Snippets de código
├── developer-docs.html           # Docs completa
├── developer-documentation.md    # Docs em Markdown
├── site.css                      # Design system moderno (novo)
├── menu.js                       # Script menu hamburger
├── readme.md                     # Este arquivo
└── postman/                      # Coleções Postman
    └── ...
```

## 🆕 O Que Mudou?

### Design e UX/UI
- ✅ CSS completamente reescrito com design system moderno
- ✅ Gradientes e sombras para profundidade visual
- ✅ Badges e tags coloridas para melhor hierarquia
- ✅ Cards hover com animações suaves
- ✅ Tipografia melhorada com system fonts
- ✅ Paleta de cores consistente

### Navegação
- ✅ Menu atualizado com ícones emoji para identificação rápida
- ✅ Breadcrumbs visuais com estados active
- ✅ Menu hamburger funcional em mobile
- ✅ Overlay escuro quando menu aberto

### Conteúdo
- ✅ Página de Quick Start para iniciantes
- ✅ Página de Scripts com documentação completa
- ✅ Página de Troubleshooting com soluções
- ✅ Hero section na página inicial
- ✅ Call-to-actions claros
- ✅ Exemplos de código melhorados

### Responsividade
- ✅ Breakpoints otimizados
- ✅ Tabelas com scroll horizontal
- ✅ Imagens e pré-code responsivos
- ✅ Touch targets adequados (44px min)

## 🎓 Para Desenvolvedores

### Adicionar Nova Página

1. Crie arquivo HTML usando template:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Título - SEJA SENAI</title>
  <link rel="stylesheet" href="site.css" />
</head>
<body>
  <header class="top">
    <button class="menu-toggle" aria-label="Menu" aria-expanded="false">☰</button>
    <h1>Título</h1>
    <p>Descrição</p>
  </header>

  <div class="menu-overlay"></div>

  <main class="layout">
    <nav class="menu">
      <!-- Copie menu de outra página e atualize active -->
    </nav>

    <section class="content">
      <!-- Seu conteúdo aqui -->
    </section>
  </main>

  <script src="menu.js"></script>
</body>
</html>
```

2. Use classes do design system:
```html
<!-- Boxes de destaque -->
<div class="info-box">Info</div>
<div class="success-box">Sucesso</div>
<div class="warning-box">Aviso</div>
<div class="danger-box">Erro</div>

<!-- Cards -->
<div class="card card-primary">Card</div>

<!-- Badges -->
<span class="badge badge-success">Badge</span>

<!-- Métodos HTTP -->
<span class="method method-get">GET</span>
```

### Modificar Estilos

Edite variáveis em `site.css`:
```css
:root {
  --senai-blue: #0ea5e9;
  --senai-purple: #8b5cf6;
  /* ... outras variáveis */
}
```

## 📞 Suporte

- **Problemas com setup:** [troubleshooting.html](troubleshooting.html)
- **Dúvidas sobre scripts:** [scripts.html](scripts.html)
- **Guia rápido:** [quick-start.html](quick-start.html)
- **Documentação completa:** [developer-docs.html](developer-docs.html)

## 👥 Sobre o Projeto

**Projeto Acadêmico - SENAI Duque de Caxias**
- **Curso:** Técnico de Desenvolvimento de Sistemas
- **Turma:** TEC00412025.1046
- **Orientadora:** Ana Carla
- **Desenvolvedores:** Artur de Paula Santos, João Felipe da Costa Moreira, João Miguel Gonçalves Coelho, Lucas Matheus Lima Sandin, Yago Mamud Amorim

---

**Versão da Documentação:** 2.0  
**Última Atualização:** Março 2026  
**Status:** ✅ Pronta para uso
- Java 21
- Spring Boot 3.4.5
- Spring Security + JWT (jjwt 0.11.5)
- Spring Data JPA
- MySQL 8.0+ / H2 Database
- Bucket4j 8.1.0 (rate limiting)

### Frontend
- HTML5 + CSS3
- JavaScript (vanilla)
- Responsive Design
- LocalStorage para autenticação

### Documentação
- HTML5 semântico
- CSS Grid + Flexbox
- JavaScript para interatividade
- Markdown para documentos técnicos

## 📖 Navegação

### Para Desenvolvedores Iniciantes
1. Comece por: [init.html](init.html) - Como configurar o ambiente
2. Leia: [backend.html](backend.html) - Entenda a estrutura da API
3. Explore: [frontend.html](frontend.html) - Conheça as páginas e fluxos
4. Pratique: [snippets.html](snippets.html) - Exemplos de código

### Para Desenvolvedores Experientes
1. Visão completa: [developer-docs.html](developer-docs.html)
2. Segurança: [security.html](security.html)
3. APIs: [postman/](postman/) - Importe as coleções

### Para Arquitetos/Gestores
1. Arquitetura completa: [developer-docs.html](developer-docs.html)
2. Análise de custos: Ver documentação completa
3. Diagramas: Ver documentação completa

## 🔐 Segurança

O sistema implementa múltiplas camadas de segurança:
- ✅ **Rate Limiting** - 100 requisições por minuto por IP (Bucket4j)
- ✅ **Senhas Fortes** - 8+ caracteres, maiúsculas, números, especiais
- ✅ **JWT Robusto** - Segredo configurável de 256 bits, validação completa
- ✅ **Brute Force Protection** - 5 tentativas, bloqueio de 15 minutos
- ✅ **HTTP Security Headers** - CSP, XSS Protection, Frame Options, HSTS
- ✅ **Sanitização de Inputs** - Frontend e backend

📄 Detalhes completos: [security.html](security.html)

## 🤝 Contribuindo

### Atualizando a Documentação
1. Edite os arquivos HTML em `docs/`
2. Mantenha consistência de estilo (use `site.css`)
3. Teste responsividade em diferentes dispositivos
4. Atualize este README se necessário

### Estrutura dos Arquivos
```
docs/
├── index.html              # Página inicial
├── developer-docs.html     # Documentação completa
├── security.html          # Segurança
├── backend.html           # API/Backend
├── frontend.html          # Frontend
├── resources.html         # Recursos
├── init.html             # Inicialização
├── snippets.html         # Snippets
├── site.css              # Estilos globais (responsivo)
├── menu.js               # Menu hamburger mobile
├── README.md             # Este arquivo
├── developer-documentation.md  # Versão Markdown
└── postman/              # Coleções de API
    ├── config.json
    ├── globals/
    └── postman/
        └── collections/
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação relevante
2. Verifique os logs do backend
3. Use o H2 Console para debug do banco
4. Teste endpoints com as coleções Postman

## 📝 Licença

Projeto acadêmico desenvolvido para o SENAI.

---

**Última atualização:** Março 2026  
**Versão do Sistema:** 1.0.0  
**Status:** ✅ Produção
>>>>>>> Stashed changes

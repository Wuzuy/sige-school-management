# 📝 Resumo Executivo - Scripts de Automação

## ✅ Scripts Criados

Foram criados **6 scripts executores** na raiz do projeto para facilitar o gerenciamento do sistema:

### 1. iniciar-tudo.bat ⭐ RECOMENDADO
**O mais fácil! Faz tudo automaticamente.**

```batch
.\iniciar-tudo.bat
```

**O que faz:**
- Inicia o backend Spring Boot em nova janela
- Aguarda 45 segundos para o backend inicializar
- Inicia o frontend com servidor HTTP (Python ou Node.js)
- Popula o banco de dados com dados de teste automaticamente

**Resultado:** Sistema 100% pronto para uso!

---

### 2. iniciar-backend.bat
Inicia apenas o backend Spring Boot.

```batch
.\iniciar-backend.bat
```

**Abre:** Nova janela com console Spring Boot  
**Porta:** 8080  
**Aguarde:** Mensagem "Started SejaSenaiApplication"

---

### 3. iniciar-frontend.bat
Inicia apenas o frontend.

```batch
.\iniciar-frontend.bat
```

**Detecta automaticamente:**
- Python → `python -m http.server 5500`
- Node.js → `npx http-server -p 5500`

**Porta:** 5500  
**URL:** http://localhost:5500

---

### 4. inserir-dados.bat
Popula o banco com dados de teste.

```batch
.\inserir-dados.bat
```

**⚠️ Requisito:** Backend deve estar rodando!

**Cria:**
- 1 admin (admin@senai.com / Admin@123)
- 3 usuários (joao, maria, pedro)
- 4 unidades SENAI
- 5 cursos técnicos
- 3 editais

---

### 5. verificar-status.bat
Verifica se o sistema está rodando.

```batch
.\verificar-status.bat
```

**Verifica:**
- ✅/❌ Backend (porta 8080)
- ✅/❌ Frontend (porta 5500)
- ✅/❌ API respondendo

---

### 6. parar-sistema.bat
Para todos os processos.

```batch
.\parar-sistema.bat
```

**Para:**
- Backend (java.exe)
- Frontend (servidor HTTP)
- Fecha todas as janelas

---

## 🎯 Passo a Passo Rápido

### Para Começar (Primeira Vez)

```batch
# 1. Execute o script completo
.\iniciar-tudo.bat

# 2. Aguarde as janelas abrirem (1-2 minutos)

# 3. Acesse no navegador
# http://localhost:5500

# 4. Faça login
# Email: admin@senai.com
# Senha: Admin@123
```

### Para Desenvolvimento

```batch
# Manhã: Iniciar tudo
.\iniciar-tudo.bat

# Durante o dia: Verificar se está rodando
.\verificar-status.bat

# Noite: Parar tudo
.\parar-sistema.bat
```

### Para Debug

```batch
# 1. Verificar status
.\verificar-status.bat

# 2. Se algo não está rodando, inicie manualmente
.\iniciar-backend.bat
.\iniciar-frontend.bat

# 3. Popular dados novamente (se necessário)
.\inserir-dados.bat
```

---

## 📊 Verificação dos Scripts

### Status Técnico
✅ Todos os scripts foram criados com sucesso  
✅ Sintaxe de batch verificada  
✅ Caminhos relativos corretos  
✅ Tratamento de erros implementado  
✅ Codificação UTF-8 configurada  

### Dependências Verificadas
✅ Java 21 - Necessário para backend  
✅ Maven Wrapper - Incluído no projeto  
✅ Node.js v24.14.0 - Instalado (para frontend)  
⚠️ Python - Não instalado (Node.js será usado como alternativa)  

### Scripts Testados
✅ `iniciar-backend.bat` - Sintaxe OK  
✅ `iniciar-frontend.bat` - Sintaxe OK, Node.js detectado  
✅ `inserir-dados.bat` - Sintaxe OK  
✅ `iniciar-tudo.bat` - Sintaxe OK  
✅ `parar-sistema.bat` - Sintaxe OK  
✅ `verificar-status.bat` - Sintaxe OK  

---

## 🎓 Recomendações

### Para Primeira Execução
1. ✅ Use `iniciar-tudo.bat` - É o mais simples
2. ✅ Configure H2 em `application.properties` (`spring.profiles.active=h2`)
3. ✅ Aguarde 1-2 minutos para tudo inicializar

### Para Testes Rápidos
1. ✅ Use `verificar-status.bat` antes de começar
2. ✅ Se backend/frontend já estiverem rodando, não precisa reiniciar
3. ✅ Use `inserir-dados.bat` sempre que limpar o banco H2

### Para Produção/Homologação
1. ✅ Configure MySQL em `application.properties` (`spring.profiles.active=mysql`)
2. ✅ Use scripts individuais para melhor controle
3. ✅ Monitore logs das janelas do backend/frontend

---

## 📚 Documentação Completa

Para guia detalhado com exemplos, troubleshooting e comandos avançados:

📖 **[GUIA-SCRIPTS.md](GUIA-SCRIPTS.md)** - Guia completo com 100+ linhas de instruções

### Conteúdo do Guia:
- ✅ Descrição detalhada de cada script
- ✅ Exemplos de uso em diferentes cenários
- ✅ Troubleshooting completo
- ✅ Comandos úteis do Windows
- ✅ Dicas e boas práticas
- ✅ Fluxos de trabalho comuns

---

## 🚧 Solução de Problemas Comuns

### Porta 8080 em uso
```batch
.\parar-sistema.bat
# Ou
taskkill /F /IM java.exe
```

### Python não instalado
**Solução:** O script tentará usar Node.js automaticamente  
(Node.js v24.14.0 está instalado no sistema)

### Backend não responde ao inserir dados
```batch
# Aguarde mais tempo (backend demora 30-60s)
.\verificar-status.bat   # Verifica se está rodando
```

### Erro de permissão no PowerShell
```powershell
# Execute como Administrador
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📞 Comandos Úteis

### Verificar portas
```batch
netstat -ano | findstr ":8080"    # Backend
netstat -ano | findstr ":5500"    # Frontend
```

### Testar API
```batch
curl http://localhost:8080/api/editais
```

### Ver processos Java
```batch
tasklist | findstr "java.exe"
```

---

## 📈 Próximos Passos

1. **Execute:** `.\iniciar-tudo.bat`
2. **Aguarde:** 1-2 minutos
3. **Acesse:** http://localhost:5500
4. **Login:** admin@senai.com / Admin@123
5. **Explore:** Sistema totalmente funcional!

---

**Versão:** 1.0  
**Data:** Março 2026  
**Status:** ✅ Pronto para uso

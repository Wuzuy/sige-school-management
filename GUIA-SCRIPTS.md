# 🚀 Guia de Uso dos Scripts Executores - SEJA SENAI

Este guia explica como usar os scripts executores para iniciar e gerenciar o sistema SEJA SENAI de forma fácil e rápida.

## 📋 Scripts Disponíveis

Na raiz do projeto, você encontrará os seguintes scripts:

| Script | Descrição |
|--------|-----------|
| `iniciar-backend.bat` | Inicia apenas o backend Spring Boot |
| `iniciar-frontend.bat` | Inicia apenas o frontend com servidor HTTP |
| `inserir-dados.bat` | Popula o banco com dados de teste |
| `iniciar-tudo.bat` | **RECOMENDADO** - Inicia tudo automaticamente |
| `parar-sistema.bat` | Para todos os processos do sistema |
| `verificar-status.bat` | Verifica se backend e frontend estão rodando |

---

## 🎯 Método Recomendado: Script Completo

### ✨ iniciar-tudo.bat

**O jeito mais fácil de começar!** Este script faz tudo automaticamente.

#### O que ele faz:
1. ✅ Inicia o backend Spring Boot
2. ⏳ Aguarda 45 segundos para o backend inicializar
3. ✅ Inicia o frontend em servidor HTTP
4. ✅ Popula o banco de dados com dados de teste

#### Como usar:
```batch
# Na raiz do projeto
.\iniciar-tudo.bat
```

ou simplesmente duplo-clique no arquivo `iniciar-tudo.bat`

#### O que acontece:
- Duas janelas serão abertas:
  - **SEJA SENAI Backend** - Console do Spring Boot
  - **SEJA SENAI Frontend** - Servidor HTTP Python
- Dados de teste serão criados automaticamente
- Sistema estará pronto para uso

#### Acessar:
- **Frontend:** http://localhost:5500
- **Backend API:** http://localhost:8080/api
- **H2 Console:** http://localhost:8080/h2-console

#### Login de Teste:
- **Admin:** admin@senai.com / Admin@123
- **Usuário:** joao@teste.com / Senha@123

---

## 🔧 Scripts Individuais

Use estes scripts se quiser controle granular sobre cada componente.

### 1️⃣ iniciar-backend.bat

Inicia apenas o backend Spring Boot.

#### Como usar:
```batch
.\iniciar-backend.bat
```

#### O que acontece:
- Uma nova janela será aberta com o console do Spring Boot
- Backend iniciará na porta 8080
- Aguarde a mensagem: `Started SejaSenaiApplication in X seconds`

#### Verificar:
- Acesse: http://localhost:8080/api/editais
- Deve retornar uma lista (vazia ou com editais)

#### H2 Console (se perfil H2 ativo):
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (deixe em branco)

---

### 2️⃣ iniciar-frontend.bat

Inicia apenas o frontend com servidor HTTP.

#### Requisitos:
- **Python 3.x** (recomendado) OU
- **Node.js** (alternativa)

#### Como usar:
```batch
.\iniciar-frontend.bat
```

#### O que acontece:
- Script detecta automaticamente Python ou Node.js
- Inicia servidor HTTP na porta 5500
- Frontend ficará acessível no navegador

#### Acessar:
- http://localhost:5500
- ou http://localhost:5500/index.html

#### Parar:
- Pressione `Ctrl+C` na janela do servidor
- Ou feche a janela

#### Se não tiver Python/Node:
- Abra `frontend-web/static/index.html` diretamente no navegador
- (Algumas funcionalidades podem ter problemas com CORS)

---

### 3️⃣ inserir-dados.bat

Popula o banco de dados com dados de teste.

#### Pré-requisito:
⚠️ **BACKEND DEVE ESTAR RODANDO!**

#### Como usar:
```batch
# 1. Certifique-se que o backend está rodando
.\iniciar-backend.bat

# 2. Aguarde o backend inicializar (30-60 segundos)

# 3. Execute o script de dados
.\inserir-dados.bat
```

#### O que será criado:
- ✅ 1 usuário administrador (admin@senai.com / Admin@123)
- ✅ 3 usuários comuns (joao, maria, pedro)
- ✅ 4 unidades SENAI (Brás, Vila Alpina, Ipiranga, Santo Amaro)
- ✅ 5 cursos técnicos (Informática, Mecânica, Eletroeletrônica, etc)
- ✅ 3 editais de processo seletivo

#### Verificar:
- H2 Console: http://localhost:8080/h2-console
- Execute: `SELECT * FROM USUARIO;`
- Deve mostrar 4 usuários

---

### 4️⃣ parar-sistema.bat

Para todos os processos do sistema.

#### Como usar:
```batch
.\parar-sistema.bat
```

#### O que faz:
- 🛑 Para o backend Spring Boot (Java)
- 🛑 Para o frontend (servidor HTTP)
- 🛑 Fecha todas as janelas relacionadas

#### Quando usar:
- Quando terminar de usar o sistema
- Antes de fazer mudanças no código
- Para liberar as portas 8080 e 5500

---

### 5️⃣ verificar-status.bat

Verifica se o sistema está rodando.

#### Como usar:
```batch
.\verificar-status.bat
```

#### O que mostra:
- ✅/❌ Status do backend (porta 8080)
- ✅/❌ Status do frontend (porta 5500)
- ✅/❌ Backend API respondendo
- 📋 URLs de acesso

#### Exemplo de saída:
```
==========================================
SEJA SENAI - Verificar Status do Sistema
==========================================

Verificando Backend (porta 8080)...
[OK] Backend esta rodando na porta 8080

Verificando Frontend (porta 5500)...
[OK] Frontend esta rodando na porta 5500

Testando conexao com Backend API...
[OK] Backend API respondendo

==========================================

URLs do Sistema:
  Frontend: http://localhost:5500
  Backend: http://localhost:8080/api
  H2 Console: http://localhost:8080/h2-console
```

---

## 📚 Fluxos de Trabalho Comuns

### 🎬 Primeiro Uso (Sistema Novo)

```batch
# 1. Execute o script completo
.\iniciar-tudo.bat

# 2. Aguarde as janelas abrirem e dados serem criados

# 3. Acesse o frontend
# Navegador: http://localhost:5500

# 4. Faça login
# Email: admin@senai.com
# Senha: Admin@123
```

### 🔄 Desenvolvimento (Já Configurado)

```batch
# 1. Inicie backend
.\iniciar-backend.bat

# 2. Inicie frontend (nova janela de terminal)
.\iniciar-frontend.bat

# 3. Desenvolva e teste

# 4. Quando terminar
.\parar-sistema.bat
```

### 🧪 Testar com Banco Limpo

```batch
# 1. Pare o sistema
.\parar-sistema.bat

# 2. Configure perfil H2 (application.properties)
# spring.profiles.active=h2

# 3. Inicie tudo novamente
.\iniciar-tudo.bat

# Banco H2 é recriado do zero a cada inicialização
```

### 🐛 Debug de Problemas

```batch
# 1. Verificar status
.\verificar-status.bat

# 2. Se backend não está rodando
.\iniciar-backend.bat
# Veja os logs na janela que abriu

# 3. Se frontend não está rodando
.\iniciar-frontend.bat

# 4. Popular dados novamente (se necessário)
.\inserir-dados.bat
```

---

## 🚨 Troubleshooting

### Erro: "Port 8080 already in use"

**Causa:** Outra aplicação está usando a porta 8080, ou o backend já está rodando.

**Solução:**
```batch
# Opção 1: Parar processos
.\parar-sistema.bat

# Opção 2: Matar processo Java manualmente
taskkill /F /IM java.exe

# Opção 3: Mudar a porta (application.properties)
server.port=8081
```

### Erro: "Port 5500 already in use"

**Causa:** Servidor HTTP já está rodando na porta 5500.

**Solução:**
```batch
# Parar o servidor
# Pressione Ctrl+C na janela do frontend
# Ou execute:
.\parar-sistema.bat
```

### Erro: "Python não encontrado"

**Causa:** Python não está instalado ou não está no PATH.

**Soluções:**
```batch
# Opção 1: Instalar Python
# https://www.python.org/downloads/
# Durante instalação, marque "Add Python to PATH"

# Opção 2: Usar Node.js
# https://nodejs.org/
npx http-server frontend-web/static -p 5500

# Opção 3: Abrir HTML diretamente
# Navegue até: frontend-web/static/index.html
# Duplo-clique para abrir no navegador
```

### Backend não conecta ao MySQL

**Causa:** MySQL não está instalado ou configurado.

**Solução Rápida - Use H2:**
```properties
# backend/src/main/resources/application.properties
spring.profiles.active=h2
```

**Solução MySQL:**
1. Instale MySQL: https://dev.mysql.com/downloads/installer/
2. Inicie o serviço MySQL
3. Configure credenciais em `application-mysql.properties`
4. Use perfil MySQL: `spring.profiles.active=mysql`

### Erro 404 ao inserir dados

**Causa:** Backend não está rodando ou não iniciou completamente.

**Solução:**
```batch
# 1. Verifique o status
.\verificar-status.bat

# 2. Se backend não está rodando, inicie
.\iniciar-backend.bat

# 3. Aguarde 30-60 segundos até ver:
# "Started SejaSenaiApplication"

# 4. Tente inserir dados novamente
.\inserir-dados.bat
```

### Script não executa (Erro de permissão)

**Causa:** Política de execução do PowerShell.

**Solução:**
```powershell
# Execute como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Ou execute com bypass (não requer admin)
powershell -ExecutionPolicy Bypass -File .\script.bat
```

---

## 💡 Dicas e Boas Práticas

### ✅ Ordem Recomendada
1. Backend primeiro (leva 30-60s para iniciar)
2. Frontend depois (inicia em 2-5s)
3. Inserir dados por último

### ✅ Janelas de Terminal
- Não feche as janelas do backend/frontend
- Minimize se estiver atrapalhando
- Use `parar-sistema.bat` para fechar tudo de uma vez

### ✅ Performance
- Use H2 para desenvolvimento (mais rápido)
- Use MySQL para testes de produção
- Reinicie o backend após mudanças no código Java

### ✅ Dados de Teste
- Execute `inserir-dados.bat` sempre que limpar o banco
- Com H2, dados são perdidos ao parar o backend
- Com MySQL, dados persistem entre reinicializações

### ✅ Múltiplos Desenvolvedores
- Cada desenvolvedor pode ter seu próprio banco H2
- Para compartilhar dados, use MySQL
- Compartilhe o script `inserir-dados.bat` para sincronizar dados

---

## 📞 Comandos Úteis

### Verificar Portas em Uso
```batch
netstat -ano | findstr ":8080"
netstat -ano | findstr ":5500"
```

### Matar Processo por Porta
```batch
# Backend (porta 8080)
for /f "tokens=5" %a in ('netstat -ano ^| findstr :8080') do taskkill /F /PID %a

# Frontend (porta 5500)
for /f "tokens=5" %a in ('netstat -ano ^| findstr :5500') do taskkill /F /PID %a
```

### Ver Logs do Backend
```batch
# Os logs aparecem na janela que foi aberta
# Ou redirecione para arquivo:
cd backend
mvnw.cmd spring-boot:run > logs.txt 2>&1
```

### Testar API com curl
```batch
# Listar editais (público)
curl http://localhost:8080/api/editais

# Login
curl -X POST http://localhost:8080/api/usuarios/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@senai.com\",\"senha\":\"Admin@123\"}"
```

---

## 🎓 Resumo Rápido

| Quero... | Use este script |
|----------|----------------|
| **Começar do zero** | `iniciar-tudo.bat` |
| **Só o backend** | `iniciar-backend.bat` |
| **Só o frontend** | `iniciar-frontend.bat` |
| **Adicionar dados** | `inserir-dados.bat` |
| **Ver se está rodando** | `verificar-status.bat` |
| **Parar tudo** | `parar-sistema.bat` |

---

**Versão:** 1.0  
**Data:** Março 2026  
**Suporte:** Consulte a [documentação técnica](docs/index.html)

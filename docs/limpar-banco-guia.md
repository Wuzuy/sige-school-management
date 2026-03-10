# 🗑️ Guia Rápido: Como Zerar o Banco de Dados

## 🎯 Método Mais Fácil (Recomendado)

Execute na raiz do projeto:
```bash
.\limpar-banco.bat
```

O script detecta automaticamente se você está usando **H2** ou **MySQL** e executa o procedimento correto.

---

## 📘 Banco H2 (Em Memória - Testes)

### ✅ Método Automático
O banco é **automaticamente zerado** ao reiniciar o backend!

**Por quê?** 
- Configuração: `spring.jpa.hibernate.ddl-auto=create-drop`
- H2 armazena dados em memória RAM
- Quando o backend para, os dados são perdidos

### 🔄 Como Fazer

**Opção 1: Scripts Separados**
```bash
.\parar-sistema.bat          # Para backend
.\iniciar-backend.bat        # Inicia backend (banco zerado)
.\inserir-dados.bat          # (Opcional) Popula dados de teste
```

**Opção 2: Tudo em Um**
```bash
.\limpar-banco.bat           # Faz tudo automaticamente
```

### ✅ Quando Usar
- Corrigir dados inconsistentes
- Começar teste do zero
- Após mudar estrutura de entidades (model)

---

## 📙 Banco MySQL (Persistente - Produção)

### ⚠️ IMPORTANTE
MySQL **NÃO zera automaticamente** ao reiniciar!
- Configuração: `spring.jpa.hibernate.ddl-auto=update`
- Dados ficam salvos em disco
- Precisa dropar manualmente

### 🔄 Como Fazer

**Opção 1: Script Automático**
```bash
.\limpar-banco.bat
```
Requer `mysql.exe` no PATH e senha do root.

**Opção 2: MySQL Workbench (Visual)**
1. Abra MySQL Workbench
2. Conecte ao servidor local
3. Execute no SQL Editor:
```sql
DROP DATABASE IF EXISTS sige_db;
CREATE DATABASE sige_db;
```
4. Reinicie backend: `.\parar-sistema.bat` → `.\iniciar-backend.bat`
5. Popule dados: `.\inserir-dados.bat`

**Opção 3: Linha de Comando**
```bash
mysql -u root -p
# Digite senha

DROP DATABASE IF EXISTS sige_db;
CREATE DATABASE sige_db;
exit;

# Reinicie backend
.\parar-sistema.bat
.\iniciar-backend.bat
.\inserir-dados.bat
```

**Opção 4: Deletar Só Tabelas (Alternativa)**
```sql
USE sige_db;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS inscricao;
DROP TABLE IF EXISTS edital;
DROP TABLE IF EXISTS curso;
DROP TABLE IF EXISTS unidade;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS usuario;

SET FOREIGN_KEY_CHECKS = 1;
```

### 🔒 BACKUP (PRODUÇÃO)
**SEMPRE faça backup antes de zerar em produção:**
```bash
mysqldump -u root -p sige_db > backup_2026-03-08.sql
```

---

## 📊 Comparação Rápida

| Característica | H2 (Testes) | MySQL (Produção) |
|----------------|-------------|------------------|
| **Zerar Banco** | Automático ao reiniciar | Manual (DROP DATABASE) |
| **Persistência** | Em memória (perde ao parar) | Disco (mantém sempre) |
| **Dificuldade** | ⭐ Muito Fácil | ⭐⭐⭐ Requer SQL |
| **Comando** | `.\parar-sistema.bat` → `.\iniciar-backend.bat` | DROP + CREATE DATABASE |
| **Uso Recomendado** | Desenvolvimento e Testes | Produção |

---

## 🎯 Qual Usar Quando?

### Use H2 quando:
- ✅ Estiver desenvolvendo/testando
- ✅ Quiser resetar rápido entre testes
- ✅ Não precisar manter dados permanentemente
- ✅ For fazer demo/apresentação

### Use MySQL quando:
- ✅ For para produção
- ✅ Precisar manter histórico de dados
- ✅ Tiver múltiplos usuários simultâneos
- ✅ Precisar fazer backup de dados

---

## 🚨 Troubleshooting

### Problema: "Dados não foram zerados no H2"
**Causa:** Backend ainda está rodando

**Solução:**
```bash
.\parar-sistema.bat    # Garanta que parou
.\iniciar-backend.bat  # Inicie novamente
```

### Problema: "Access denied for user 'root'@'localhost' (MySQL)"
**Causa:** Senha incorreta ou usuário sem permissões

**Solução:**
1. Verifique senha do MySQL
2. Teste login: `mysql -u root -p`
3. Se esqueceu senha, reinstale MySQL

### Problema: "Unknown database 'sige_db'"
**Causa:** Banco foi deletado ou nunca criado

**Solução:**
```sql
CREATE DATABASE sige_db;
```
Depois reinicie o backend.

---

## 📚 Documentação Completa

- **Troubleshooting Geral:** [docs/troubleshooting.html](troubleshooting.html)
- **Configuração Backend:** [docs/backend.html](backend.html)
- **Guia Inicialização:** [docs/init.html](init.html)

---

## 🔗 Links Rápidos

- **H2 Console:** http://localhost:8080/h2-console
  - JDBC: `jdbc:h2:mem:testdb`
  - User: `sa`
  - Pass: (vazio)
  
- **Backend API:** http://localhost:8080/api
- **Frontend:** http://localhost:5500

---

**📅 Última atualização:** Março 2026  
**💡 Dica:** Use `.\limpar-banco.bat` - é o método mais fácil e seguro!

# 📜 Scripts Utilitários

Esta pasta contém scripts auxiliares para facilitar o gerenciamento do projeto SEJA SENAI.

## � Formatos Disponíveis

Cada script tem **duas versões**:
- **`.bat`** - Versão Windows Batch (funciona em qualquer Windows)
- **`.ps1`** - Versão PowerShell (mais recursos e mensagens coloridas)

**Recomendação:** Use os arquivos `.bat` para máxima compatibilidade.

## �📋 Scripts Disponíveis

### 🗄️ `popular-dados-teste.bat`
**Descrição:** Popula o banco de dados com dados de teste.

**O que cria:**
- 1 Administrador (admin@senai.com)
- 3 Usuários de teste
- 4 Unidades SENAI
- 5 Cursos ativos
- 3 Editais

**Quando usar:**
- Após iniciar o backend pela primeira vez
- Quando quiser resetar os dados para testes
- Para demonstrações

**Como usar:**
```bash
cd scripts
popular-dados-teste.bat
```

---

### 🧹 `limpar-banco.bat`
**Descrição:** Remove todos os dados do banco de dados H2.

**Atenção:** ⚠️ Esta operação é **irreversível** e apaga todos os dados!

**Quando usar:**
- Antes de popular com novos dados de teste
- Para resetar o sistema completamente
- Em ambiente de desenvolvimento

**Como usar:**
```bash
cd scripts
limpar-banco.bat
```

---

### 🛑 `parar-sistema.bat`
**Descrição:** Para todos os processos Java (backend) em execução.

**Quando usar:**
- Para parar o backend rapidamente
- Quando houver processos travados
- Antes de fazer alterações no código do backend

**Como usar:**
```bash
cd scripts
parar-sistema.bat
```

---

### 🔍 `verificar-status.bat`
**Descrição:** Verifica o status de todos os componentes do sistema.

**O que verifica:**
- Processos Java (backend)
- Conexão com localhost:8080
- Porta 8080 ocupada
- Memória utilizada

**Quando usar:**
- Para diagnosticar problemas
- Verificar se o backend está rodando
- Ver quantos processos estão ativos

**Como usar:**
```bash
cd scripts
verificar-status.bat
```

---

## � Como Executar Scripts PowerShell (.ps1)

Se você preferir usar os scripts PowerShell (`.ps1`), execute desta forma:

### Opção 1: Diretamente no PowerShell
```powershell
cd scripts
.\popular-dados-teste.ps1
```

### Opção 2: Com ExecutionPolicy
Se der erro de "não pode ser carregado porque a execução de scripts foi desabilitada":

```powershell
cd scripts
powershell -ExecutionPolicy Bypass -File .\popular-dados-teste.ps1
```

### Opção 3: Mudar política permanentemente (Admin)
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**💡 Dica:** Se tiver dúvida, use os arquivos `.bat` que funcionam sem configuração!

---

## �🔄 Fluxo de Uso Recomendado

### Iniciar o projeto do zero:

```bash
# 1. Iniciar backend (na raiz do projeto)
INICIAR-PROJETO.bat

# 2. Popular com dados de teste
cd scripts
popular-dados-teste.bat
```

### Resetar dados de teste:

```bash
cd scripts
limpar-banco.bat
popular-dados-teste.bat
```

### Parar tudo:

```bash
cd scripts
parar-sistema.bat
```

### Verificar se está funcionando:

```bash
cd scripts
verificar-status.bat
```

---

## 📝 Notas

- Todos os scripts devem ser executados a partir da pasta `scripts`
- Os scripts verificam pré-requisitos antes de executar
- Mensagens de erro são exibidas em vermelho
- Mensagens de sucesso são exibidas em verde
- Para voltar à raiz do projeto: `cd ..`

---

## ⚠️ Troubleshooting

### "Não é possível executar o script"
- Certifique-se de estar na pasta `scripts`
- Execute `cd scripts` antes de rodar o script

### "Backend não está rodando"
- Execute `INICIAR-PROJETO.bat` na raiz do projeto primeiro
- Aguarde ~30 segundos para o backend inicializar

### "Porta 8080 já está em uso"
- Execute `parar-sistema.bat` para parar processos antigos
- Execute `verificar-status.bat` para verificar

---

## 🚀 Script Principal

O script principal para iniciar o projeto está na **raiz do projeto**:

```bash
# Na raiz do projeto (seja-senai)
INICIAR-PROJETO.bat
```

Este script inicia o backend automaticamente e mostra instruções para o frontend.

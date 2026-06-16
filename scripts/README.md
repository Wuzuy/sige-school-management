# Scripts Utilitarios

Scripts auxiliares para gerenciamento do projeto SIGE.

## Formatos Disponiveis

Cada script tem duas versoes:
- **`.bat`** - Windows Batch (funciona em qualquer Windows)
- **`.ps1`** - PowerShell (mais recursos e mensagens coloridas)

Recomendacao: Use os arquivos `.bat` para maxima compatibilidade.

## Scripts Disponiveis

### `popular-dados-teste.bat`
**Descricao:** Popula o banco Supabase com dados de teste via API.

**O que cria:**
- 1 Administrador (admin@senai.com)
- 3 Usuarios de teste
- 4 Unidades SENAI
- 5 Cursos ativos
- 3 Editais

**Como usar:**
```bash
cd scripts
popular-dados-teste.bat
```
Requer o backend rodando em `http://localhost:8080`.

### `limpar-banco.bat`
**Descricao:** Remove dados de teste do banco via API.

**Atencao:** Operacao irreversivel!

**Como usar:**
```bash
cd scripts
limpar-banco.bat
```

### `parar-sistema.bat`
**Descricao:** Para processos do Node (backend) em execucao na porta 8080.

**Como usar:**
```bash
cd scripts
parar-sistema.bat
```

### `verificar-status.bat`
**Descricao:** Verifica se o backend esta rodando (porta 8080).

**Como usar:**
```bash
cd scripts
verificar-status.bat
```

## Como Executar Scripts PowerShell (.ps1)

```powershell
cd scripts
.\popular-dados-teste.ps1
```

Se der erro de execucao:
```powershell
powershell -ExecutionPolicy Bypass -File .\popular-dados-teste.ps1
```

---

## Fluxo de Uso Recomendado

### Iniciar o projeto do zero:
```bash
# 1. Instalar dependencias
cd backend && npm install

# 2. Iniciar backend
npm run dev

# 3. Em outro terminal, iniciar frontend
cd frontend-web && npx http-server -p 5500
```

### Resetar dados de teste:
```bash
cd scripts
limpar-banco.bat
popular-dados-teste.bat
```

---

## Troubleshooting

### "Porta 8080 ja em uso"
Execute `parar-sistema.bat` para parar processos antigos.

### "Backend nao esta rodando"
Inicie o backend com `npm run dev` na pasta `backend/`.

---

**Ultima atualizacao:** Junho 2026

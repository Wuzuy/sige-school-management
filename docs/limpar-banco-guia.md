# Guia para Zerar o Banco de Dados (Supabase)

## Metodo Rapido

O banco usa Supabase (PostgreSQL). Para resetar:

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione o projeto
3. Va em **SQL Editor**
4. Execute os comandos para limpar as tabelas:
```sql
TRUNCATE TABLE inscricoes CASCADE;
TRUNCATE TABLE matriculas CASCADE;
TRUNCATE TABLE documentos CASCADE;
TRUNCATE TABLE frequencia CASCADE;
TRUNCATE TABLE agenda CASCADE;
TRUNCATE TABLE calendario CASCADE;
TRUNCATE TABLE cursos CASCADE;
TRUNCATE TABLE unidades CASCADE;
TRUNCATE TABLE editais CASCADE;
TRUNCATE TABLE usuarios CASCADE;
```
5. Execute novamente `database/supabase-aluno-tables.sql` para recriar os dados

## Via Script

Use o script `scripts/limpar-banco.bat` que faz isso pela API:

```bash
cd scripts
limpar-banco.bat
```

Requer o backend rodando em `http://localhost:8080`.

## Via API

Com o backend rodando, use os endpoints de admin para gerenciar dados.

---

> O banco e PostgreSQL gerenciado pelo Supabase. Dados persistem mesmo apos reiniciar o backend.

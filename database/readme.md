# Database - SIGE

Scripts de estruturação e alimentação inicial do banco de dados relacional.

## Estrutura

* `01-schema.sql`: Comandos DDL (CREATE TABLE, ALTER TABLE).
* `02-data.sql`: Comandos DML (INSERT) para popular dados de teste (cursos, unidades).

## Como Executar

Importe os scripts via terminal ou interface gráfica (MySQL Workbench/DBeaver):

```bash
mysql -u seu_usuario -p < 01-schema.sql
mysql -u seu_usuario -p < 02-data.sql

---

## Script de exemplo para PostgreSQL

Além dos scripts existentes, há um script pronto para PostgreSQL que facilita testes rápidos com dados fictícios:

- `sample_data.sql` — cria tabelas compatíveis com o frontend e insere um usuário admin (email `admin@local`, senha `admin`), algumas unidades, cursos, editais e inscrições.

Exemplo de carregamento (PostgreSQL):

```bash
# criar o banco (se necessário)
createdb sige_demo

# executar o script
psql -d sige_demo -f database/sample_data.sql
```

OBS: o `sample_data.sql` usa senha em texto claro apenas para demonstração; se seu backend exigir hash (bcrypt), substitua os valores na coluna `senha` por hashes compatíveis.
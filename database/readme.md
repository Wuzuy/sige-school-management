# Database - SEJA SENAI

Scripts de estruturação e alimentação inicial do banco de dados relacional.

## Estrutura

* `01-schema.sql`: Comandos DDL (CREATE TABLE, ALTER TABLE).
* `02-data.sql`: Comandos DML (INSERT) para popular dados de teste (cursos, unidades).

## Como Executar

Importe os scripts via terminal ou interface gráfica (MySQL Workbench/DBeaver):

```bash
mysql -u seu_usuario -p < 01-schema.sql
mysql -u seu_usuario -p < 02-data.sql
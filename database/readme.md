# Database - SIGE

Scripts SQL para o banco de dados Supabase (PostgreSQL).

## Estrutura

- `supabase-aluno-tables.sql` - Script completo com tabelas, dados iniciais e triggers

## Como Executar no Supabase

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione o projeto
3. Va em **SQL Editor**
4. Cole o conteudo de `supabase-aluno-tables.sql`
5. Execute

## Tabelas Principais

O banco possui as seguintes tabelas:
- `usuarios` - Alunos e administradores
- `unidades` - Unidades do SENAI
- `cursos` - Cursos oferecidos
- `editais` - Editais publicados
- `inscricoes` - Inscricoes em cursos
- `disciplinas`, `professores`, `turmas`, `matriculas` - Dados academicos
- `documentos`, `frequencia`, `agenda`, `calendario` - Modulos do aluno

## Dados Iniciais

O script ja inclui:
- 1 Administrador (admin@senai.com / admin123)
- 2 Usuarios de teste
- 4 Unidades SENAI
- 5 Cursos ativos
- 3 Editais

## Tecnologia

Banco de dados PostgreSQL gerenciado pelo Supabase, acessado via API REST pelo backend Node.js/Express.

# Database

Scripts SQL para o banco de dados **MySQL** do projeto Seja SENAI.

## Estrutura
```
database/
├── schema.sql          # Criação de tabelas
├── seed.sql            # Dados iniciais
├── migrations/         # Migrações do banco
└── README.md
```

## Configuração

### Criar banco de dados
```sql
CREATE DATABASE seja_senai;
USE seja_senai;
```

### Executar scripts
```bash
mysql -u root -p seja_senai < schema.sql
mysql -u root -p seja_senai < seed.sql
```

## Tecnologia
- MySQL 8.0+

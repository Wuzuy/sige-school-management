# Seja SENAI

Sistema integrado para gerenciamento de inscrições e carteirinhas digitais do SENAI.

## 📋 Sobre o Projeto

O **Seja SENAI** é uma plataforma completa que facilita o processo de inscrição de novos alunos e o gerenciamento de suas carteirinhas digitais. O sistema é composto por três componentes principais:

- **Backend**: API REST em Java/Spring Boot
- **Frontend Web**: Interface para inscrição e administração
- **Mobile App**: Aplicativo da carteirinha digital em Kotlin

## 🏗️ Estrutura do Projeto

```
seja-senai/
├── backend/             # Java + Spring Boot (API e Regras de Negócio)
├── frontend-web/        # HTML, CSS e JS (Inscrição e Admin)
├── mobile-app/          # Kotlin (Aplicativo da Carteirinha)
├── docs/                # Prototipagem Figma, Diagramas e Pesquisas
├── database/            # Scripts SQL do MySQL
└── README.md            # Documentação principal do projeto
```

## 🚀 Tecnologias Utilizadas

### Backend
- Java 17+
- Spring Boot
- Spring Data JPA
- Spring Security
- MySQL

### Frontend Web
- HTML5
- CSS3
- JavaScript

### Mobile
- Kotlin
- Android SDK
- Retrofit

### Banco de Dados
- MySQL 8.0+

## 📦 Componentes

### [Backend](./backend/)
API REST que gerencia toda a lógica de negócio, autenticação e integração com o banco de dados.

### [Frontend Web](./frontend-web/)
Interface web responsiva para:
- Inscrição de novos alunos
- Painel administrativo
- Gerenciamento de usuários

### [Mobile App](./mobile-app/)
Aplicativo Android para:
- Visualização da carteirinha digital
- Acesso rápido às informações do aluno
- Notificações

### [Documentação](./docs/)
Documentação completa incluindo:
- Prototipagem Figma
- Diagramas UML
- Pesquisas e análises

### [Database](./database/)
Scripts SQL para:
- Criação do schema
- Dados iniciais (seed)
- Migrações

## 🛠️ Como Executar

### Pré-requisitos
- Java 17+
- Node.js (opcional, para servidor local)
- Android Studio
- MySQL 8.0+

### Configuração do Banco de Dados
```bash
cd database
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Web
```bash
cd frontend-web
python -m http.server 8000
# ou abrir index.html diretamente no navegador
```

### Mobile App
1. Abrir o projeto no Android Studio
2. Executar no emulador ou dispositivo físico

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).

## 📧 Contato

Para mais informações, entre em contato com a equipe de desenvolvimento.
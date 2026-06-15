# SIGE - Aplicativo Mobile (Portal do Aluno)

Bem-vindo ao repositório do aplicativo mobile do **SIGE (Sistema Integrado de Gestão Escolar)**. Este aplicativo foi desenvolvido utilizando **React Native** com **Expo Router**, focado em proporcionar uma experiência moderna, intuitiva e segura para os alunos da Firjan SENAI.

---

## Tecnologias Utilizadas

- **React Native / Expo** — Desenvolvimento multiplataforma para Android e iOS.
- **Expo Router** — Sistema de navegação baseado em arquivos (File-Based Routing).
- **React Native SVG / QR Code** — Geração de QR Codes e tokens de acesso dinâmicos.
- **Supabase** *(em breve)* — Backend as a Service (BaaS) para autenticação e banco de dados.

---

## Como Executar o Projeto Localmente

Siga os passos abaixo para executar o aplicativo em seu dispositivo físico.

### 1. Pré-requisitos

Antes de começar, certifique-se de possuir:

- [Node.js](https://nodejs.org/) instalado.
- Aplicativo **Expo Go** instalado no smartphone:
  - [iOS](https://apps.apple.com/us/app/expo-go/id982107779)
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- Computador e celular conectados à mesma rede Wi-Fi.

---

### 2. Instalação

Acesse a pasta do projeto e instale as dependências:

```bash
npm install
```

---

### 3. Executando o Aplicativo

Para evitar problemas de cache e garantir que a versão mais recente do projeto seja carregada, execute:

```bash
npx expo start -c
```

> O parâmetro `-c` limpa o cache do Expo antes da inicialização.

---

### 4. Visualizando no Celular

#### iPhone (iOS)

1. Abra a câmera do iPhone.
2. Aponte para o QR Code exibido no terminal ou navegador.
3. Toque na notificação exibida.
4. O projeto será aberto automaticamente no Expo Go.

#### Android

1. Abra o aplicativo Expo Go.
2. Selecione **Scan QR Code**.
3. Aponte para o QR Code exibido na tela do computador.

---

## Estrutura Principal do Projeto

A navegação da aplicação é organizada através da pasta `app/`.

```text
app/
├── index.tsx                    # Tela de login
├── (tabs)/
│   ├── _layout.tsx              # Configuração da Bottom Tab Navigation
│   ├── secretaria.tsx           # Dashboard principal do aluno
│   ├── carteirinha.tsx          # Carteirinha digital
│   └── autenticacao.tsx         # QR Code dinâmico para acesso
├── notas.tsx                    # Consulta de notas
├── agenda.tsx                   # Agenda acadêmica
└── ...
```

---

## Funcionalidades Atuais

- Login de usuário (modo demonstrativo).
- Dashboard acadêmico.
- Carteirinha digital.
- Geração de QR Code dinâmico.
- Navegação por abas.
- Interface responsiva para dispositivos móveis.

---

## Próximos Passos

Atualmente o frontend utiliza dados fictícios (*mockados*) para validação de interface e experiência do usuário.

As próximas etapas incluem a integração com o Supabase para:

- Autenticação real de usuários.
- Consulta de notas e faltas em tempo real.
- Integração com dados financeiros.
- Sincronização com sistemas institucionais.
- Geração de tokens JWT válidos para autenticação nas catracas.
- Persistência de dados e configurações do usuário.

---

## Status do Projeto

🚧 Em desenvolvimento.

O aplicativo encontra-se em fase de validação de interface e funcionalidades antes da integração completa com o backend.

---

## Licença

Este projeto foi desenvolvido para fins educacionais e institucionais da Firjan SENAI.
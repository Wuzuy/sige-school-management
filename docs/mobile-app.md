# Mobile App — SIGE

React Native (Expo SDK 54) com TypeScript e Expo Router v6 (file-based routing).

---

## Stack

| Tecnologia | Versão |
|------------|--------|
| React Native | Expo SDK 54 |
| TypeScript | 5.x |
| Expo Router | v6 |
| AsyncStorage | Armazenamento local |
| Expo Camera | QR Code scanning |
| Expo Clipboard | Cópia de QR Code |

---

## Estrutura

```
mobile-app/
├── app/                             # File-based routing
│   ├── _layout.tsx                  # Root layout (AuthProvider)
│   ├── index.tsx                    # Redireciona para login
│   ├── login.tsx                    # Tela de login
│   ├── (tabs)/                      # Abas principais
│   │   ├── _layout.tsx              # Layout das tabs
│   │   ├── home.tsx                 # Home / Dashboard
│   │   ├── qrcode.tsx              # QR Code + câmera
│   │   ├── notas.tsx               # Notas
│   │   ├── frequencia.tsx          # Frequência
│   │   ├── horarios.tsx            # Horários
│   │   ├── documentos.tsx          # Documentos
│   │   ├── reclamacoes.tsx         # Reclamações
│   │   ├── calendario.tsx          # Calendário
│   │   ├── agenda.tsx              # Agenda
│   │   ├── historico.tsx           # Histórico
│   │   └── suporte.tsx             # Suporte
│   └── (stack)/                    # Telas modais
│       ├── _layout.tsx             # Stack navigator
│       ├── conta.tsx               # Conta / Perfil
│       └── documento-detalhe.tsx   # Detalhe do documento
├── app/api.ts                      # API service wrapper
├── app/auth.tsx                    # AuthContext (React Context)
├── app.json                        # Expo config
├── eas.json                        # EAS Build config
├── tsconfig.json
├── babel.config.js
└── package.json
```

---

## Telas

### Login (`login.tsx`)
- Formulário email + senha
- Chamada `POST /api/usuarios/login`
- Armazena token no AsyncStorage via AuthContext

### Home (`home.tsx`)
- Exibe nome do aluno, curso, unidade, matrícula
- QR Code gerado dinamicamente a partir do ID do aluno

### QR Code (`qrcode.tsx`)
- Geração de QR Code com dados do aluno
- Câmera para scan (validação de acesso via `/auth/codigo`)
- Permissão de câmera (Expo Camera)

### Notas (`notas.tsx`)
- Lista de disciplinas com nota, frequência, status
- Modal de detalhes por disciplina

### Frequência (`frequencia.tsx`)
- Porcentagem de presença por disciplina
- Total de aulas, presenças, faltas

### Horários (`horarios.tsx`)
- Grade semanal com disciplina, horário, professor

### Documentos (`documentos.tsx`)
- Lista de documentos com status (emitido, pendente)
- Detalhe do documento via stack navigation

### Reclamações (`reclamacoes.tsx`)
- Lista de reclamações com protocolo e status
- Formulário para nova reclamação (categoria, assunto, descrição, prioridade)

### Calendário (`calendario.tsx`)
- Eventos escolares
- Filtro por tipo (FERIADO, PROVA, EVENTO)

### Agenda (`agenda.tsx`)
- Agendamento de compromissos
- Tipo, data, horário

### Histórico (`historico.tsx`)
- Disciplinas concluídas
- Nota final, status, semestre

### Suporte (`suporte.tsx`)
- FAQ com itens expansíveis
- Informações de contato

### Conta (`conta.tsx`)
- Dados do perfil
- Botão de logout

---

## API Service (`api.ts`)

```typescript
const API_BASE = 'https://sige-1gqx.onrender.com/api';

async function apiRequest(path: string, options?: RequestInit) {
  const token = await AsyncStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

---

## AuthContext (`auth.tsx`)

React Context para estado global de autenticação:
- `signIn(email, senha)` — login + salva token
- `signOut()` — logout + limpa token
- `user` — dados do usuário logado
- `isAuthenticated` — booleano

---

## Configuração

```bash
# Instalar dependências
cd mobile-app
npm install

# Desenvolvimento
npx expo start

# Build
eas build --platform android
eas build --platform ios
```

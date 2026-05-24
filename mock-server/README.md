# SIGE — Mock Server (simples)

Servidor API de demonstração para o frontend do SIGE. Usa `database/mock_data.json` como armazenamento.

Requisitos mínimos
- Node.js (recomendado >= 16)
- npm (vem com o Node)

Passos rápidos

1) Instalar dependências e iniciar o mock server:

```bash
cd mock-server
npm install
npm start
```

O servidor fica em: `http://localhost:3000/api`

Endpoints principais

- `GET /api/health` — health check
- `GET /api/usuarios/count` — retorna `{ count: N }`
- `POST /api/usuarios/login` — body `{ email, senha }` retorna `{ token, usuario }`
- `POST /api/usuarios` — registrar usuário
- `GET /api/editais` — lista editais
- `GET /api/cursos` — lista cursos
- `GET /api/inscricoes` — lista inscrições
- `POST /api/inscricoes` — criar inscrição

Servir o frontend localmente

É importante servir os arquivos estáticos por HTTP (não usar `file://`). Exemplos simples:

Usando `http-server` (npx):

```bash
npx http-server frontend-web/portal-escolar -p 8080
# abrir http://localhost:8080
```

Usando Python 3:

```bash
cd frontend-web/portal-escolar
python -m http.server 8080
# abrir http://localhost:8080
```

Apontar o frontend para o mock server

- Pelo console do navegador:

```js
localStorage.setItem('API_BASE_URL', 'http://localhost:3000/api');
location.reload();
```

- Ou injetar no HTML antes do `scripts.js`:

```html
<script>window.API_BASE_URL = 'http://localhost:3000/api';</script>
```

Observações

- O servidor usa senhas em texto no `database/mock_data.json` apenas para demo. Em produção, use hashing (bcrypt).
- O mock grava mudanças em `database/mock_data.json`.
- Se preferir usar PostgreSQL real, há o script `database/sample_data.sql` para popular um banco.

Suporte

Se quiser, posso adicionar um comando `start-all` que instala dependências e inicia o mock server + servidor estático em paralelo.

Start-all (iniciar mock + frontend)

Após instalar dependências em `mock-server`, rode:

```bash
npm run start-all
```

Isso iniciará o mock em `http://localhost:3000/api` e um servidor estático servindo `frontend-web/portal-escolar` em `http://localhost:8080`.

Observação: o comando usa `concurrently` e `npx http-server`; o `npm install` em `mock-server` instalará `concurrently` automaticamente.

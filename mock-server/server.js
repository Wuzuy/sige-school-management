const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const DATA_FILE = path.join(__dirname, '..', 'database', 'mock_data.json');

function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// base: /api
const router = express.Router();

// health
router.get('/health', (req, res) => res.json({ ok: true }));

// usuarios count
router.get('/usuarios/count', (req, res) => {
  const data = readData();
  res.json({ count: data.usuarios.length });
});

// listar editais
router.get('/editais', (req, res) => {
  const data = readData();
  res.json(data.editais || []);
});

// listar cursos
router.get('/cursos', (req, res) => {
  const data = readData();
  res.json(data.cursos || []);
});

// listar inscricoes
router.get('/inscricoes', (req, res) => {
  const data = readData();
  res.json(data.inscricoes || []);
});

// criar inscricao
router.post('/inscricoes', (req, res) => {
  const data = readData();
  const { id_usuario, id_curso } = req.body;
  if (!id_usuario || !id_curso) return res.status(400).json({ error: 'Missing id_usuario or id_curso' });
  const nextId = (data.inscricoes.reduce((m, i) => Math.max(m, i.id), 0) || 0) + 1;
  const insc = { id: nextId, id_usuario, id_curso, data_inscricao: new Date().toISOString(), status: 'PENDENTE' };
  data.inscricoes.push(insc);
  writeData(data);
  res.status(201).json(insc);
});

// recuperar senha (simula envio)
router.post('/usuarios/recuperar-senha', (req, res) => {
  // apenas retorna 200 para simular envio
  res.json({ ok: true });
});

// registrar usuario
router.post('/usuarios', (req, res) => {
  const data = readData();
  const { nomeCompleto, email, senha } = req.body;
  if (!nomeCompleto || !email || !senha) return res.status(400).json({ error: 'Missing fields' });
  const exists = data.usuarios.find(u => u.email === email);
  if (exists) return res.status(409).json({ error: 'Email already exists' });
  const nextId = (data.usuarios.reduce((m, u) => Math.max(m, u.id), 0) || 0) + 1;
  const usuario = { id: nextId, nomeCompleto, email, senha, role: 'ROLE_USER' };
  data.usuarios.push(usuario);
  writeData(data);
  res.status(201).json({ ok: true });
});

// login
router.post('/usuarios/login', (req, res) => {
  const data = readData();
  const { email, senha } = req.body;
  const user = data.usuarios.find(u => u.email === email && u.senha === senha);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  const token = `mock-${Math.random().toString(36).slice(2)}-${Date.now()}`;
  res.json({ token, usuario: { id: user.id, nomeCompleto: user.nomeCompleto, email: user.email, role: user.role } });
});

// middleware básico para rotas protegidas (devolve 401 se token inválido)
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Sem autorização' });
  // aceita qualquer token que comece com 'mock-' ou 'fake.'
  if (auth.startsWith('Bearer mock-') || auth.startsWith('Bearer fake.')) return next();
  return res.status(401).json({ error: 'Token inválido' });
}

// rota protegida de exemplo
router.get('/usuarios/me', requireAuth, (req, res) => {
  // token no formato 'Bearer mock-...'
  const auth = req.headers.authorization;
  const data = readData();
  // para simplicidade, retorna primeiro usuário admin se token válido
  const user = data.usuarios[0];
  res.json({ id: user.id, nomeCompleto: user.nomeCompleto, email: user.email, role: user.role });
});

app.use('/api', router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Mock server running at http://localhost:${port}/api`));

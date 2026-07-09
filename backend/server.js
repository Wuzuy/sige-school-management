require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Importa e usa as rotas
const cursosRoutes = require('./routes/cursos');
const usuariosRoutes = require('./routes/usuarios');
const inscricoesRoutes = require('./routes/inscricoes');
const unidadesRoutes = require('./routes/unidades');
const editaisRoutes = require('./routes/editais');
const alunoRoutes = require('./routes/aluno');
const alunosRoutes = require('./routes/alunos');
const authCodigoRoutes = require('./routes/auth-codigo');

app.use('/api/cursos', cursosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/unidades', unidadesRoutes);
app.use('/api/editais', editaisRoutes);
app.use('/api/auth', authCodigoRoutes);
const { requireAuth, requirePortalAtivo, requirePermissao } = require('./middleware/auth');
app.use('/api/inscricoes', requireAuth, requirePermissao('portal.inscricao'), inscricoesRoutes);
const portaisRoutes = require('./routes/portais');
app.use('/api/portais', portaisRoutes);

// Gate: rotas exclusivas de cada portal (ativo + permissao)
app.use('/api/aluno', requirePortalAtivo('escolar'), requireAuth, requirePermissao('portal.escolar'), alunoRoutes);
app.use('/api/alunos', requirePortalAtivo('secretaria'), requireAuth, requirePermissao('portal.secretaria'), alunosRoutes);

const cargosRoutes = require('./routes/cargos');
app.use('/api/cargos', cargosRoutes);
const turmasRoutes = require('./routes/turmas');
app.use('/api/turmas', turmasRoutes);
const auditoriaRoutes = require('./routes/auditoria');
app.use('/api/auditoria', auditoriaRoutes);
const reclamacoesRoutes = require('./routes/reclamacoes');
app.use('/api/reclamacoes', reclamacoesRoutes);
const professorRoutes = require('./routes/professor');
app.use('/api/professor', requirePortalAtivo('professor'), requireAuth, requirePermissao('portal.professor'), professorRoutes);
const disciplinasRoutes = require('./routes/disciplinas');
app.use('/api/disciplinas', disciplinasRoutes);
const planosAulaRoutes = require('./routes/planos-aula');
app.use('/api/planos-ensino', requirePortalAtivo('professor'), requireAuth, requirePermissao('portal.professor'), planosAulaRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
require('dotenv').config();
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
const frequenciasRoutes = require('./routes/frequencias');
const historicoRoutes = require('./routes/historico');
const reclamacoesRoutes = require('./routes/reclamacoes');
const atendimentosRoutes = require('./routes/atendimentos');
const estruturaCurricularRoutes = require('./routes/estrutura-curricular');
const agendaRoutes = require('./routes/agenda');
const horariosRoutes = require('./routes/horarios');
const documentosRoutes = require('./routes/documentos');
const calendarioRoutes = require('./routes/calendario');

app.use('/api/cursos', cursosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/inscricoes', inscricoesRoutes);
app.use('/api/unidades', unidadesRoutes);
app.use('/api/editais', editaisRoutes);
app.use('/api/frequencias', frequenciasRoutes);
app.use('/api/historico', historicoRoutes);
app.use('/api/reclamacoes', reclamacoesRoutes);
app.use('/api/atendimentos', atendimentosRoutes);
app.use('/api/estrutura-curricular', estruturaCurricularRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/documentos', documentosRoutes);
app.use('/api/calendario', calendarioRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
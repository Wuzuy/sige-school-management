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
const alunoRoutes = require('./routes/aluno');
const alunosRoutes = require('./routes/alunos');

app.use('/api/cursos', cursosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/inscricoes', inscricoesRoutes);
app.use('/api/unidades', unidadesRoutes);
app.use('/api/editais', editaisRoutes);
app.use('/api/aluno', alunoRoutes);
app.use('/api/alunos', alunosRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
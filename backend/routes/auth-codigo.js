const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

function gerarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function buscarDadosAluno(idUsuario) {
  const { data: matriculas } = await supabase
    .from('matriculas')
    .select('numero_matricula, status, id_curso (nome_curso), id_turma (nome_turma)')
    .eq('id_usuario', idUsuario)
    .order('data_matricula', { ascending: false })
    .limit(1);
  return matriculas?.[0] || null;
}

// Gerar codigo de acesso (aluno logado)
router.post('/gerar-codigo', requireAuth, async (req, res) => {
  const codigo = gerarCodigo();
  const expiraEm = new Date(Date.now() + 30 * 1000).toISOString();
  const matricula = await buscarDadosAluno(req.user.id);

  const { error } = await supabase.from('codigos_acesso').insert([{
    id_usuario: req.user.id,
    codigo,
    expira_em: expiraEm
  }]);

  if (error) return res.status(400).json({ error: error.message });

  res.json({
    codigo,
    expira_em: expiraEm,
    ...(matricula && {
      curso: matricula.id_curso?.nome_curso || null,
      turma: matricula.id_turma?.nome_turma || null
    })
  });
});

// Validar codigo de acesso (gate / catraca)
router.post('/validar-codigo', async (req, res) => {
  const { codigo } = req.body;
  if (!codigo) return res.status(400).json({ error: 'Codigo obrigatorio' });

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('codigos_acesso')
    .select('*, id_usuario (id, nome_completo, email, cpf, foto_url)')
    .eq('codigo', codigo)
    .eq('usado', false)
    .gt('expira_em', now)
    .order('criado_em', { ascending: false })
    .limit(1);

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Codigo invalido ou expirado' });
  }

  const entry = data[0];

  await supabase
    .from('codigos_acesso')
    .update({ usado: true, validado_em: now })
    .eq('id', entry.id);

  const matricula = await buscarDadosAluno(entry.id_usuario.id);

  res.json({
    valido: true,
    usuario: entry.id_usuario,
    matricula: matricula && {
      numero: matricula.numero_matricula,
      status: matricula.status,
      curso: matricula.id_curso?.nome_curso,
      turma: matricula.id_turma?.nome_turma
    }
  });
});

module.exports = router;

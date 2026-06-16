const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');

const userId = (req) => req.user.id;

// ============================================
// MATRICULAS DO ALUNO
// ============================================
router.get('/matriculas', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('matriculas')
    .select(`
      *,
      id_curso (id, nome_curso, tipo, turno),
      id_turma (id, nome, ano, turno)
    `)
    .eq('id_usuario', userId(req))
    .order('data_matricula', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// ============================================
// HISTORICO ESCOLAR
// ============================================
router.get('/historico', requireAuth, async (req, res) => {
  const uid = userId(req);

  // Busca matriculas do aluno
  const { data: matriculas, error: errMat } = await supabase
    .from('matriculas')
    .select('id, id_curso (id, nome_curso)')
    .eq('id_usuario', uid);

  if (errMat) return res.status(500).json({ error: errMat.message });

  if (!matriculas || matriculas.length === 0) {
    return res.json([]);
  }

  const idsMatriculas = matriculas.map((m) => m.id);

  const { data, error } = await supabase
    .from('historico_escolar')
    .select(`
      *,
      id_disciplina (id, nome, codigo, carga_horaria),
      id_professor (id, nome_completo)
    `)
    .in('id_matricula', idsMatriculas)
    .order('ano', { ascending: false })
    .order('semestre', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// ============================================
// DOCUMENTOS DO ALUNO
// ============================================
router.get('/documentos', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('documentos')
    .select('*')
    .eq('id_usuario', userId(req))
    .order('data_envio', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// ============================================
// FREQUENCIA
// ============================================
router.get('/frequencia', requireAuth, async (req, res) => {
  const uid = userId(req);

  const { data: matriculas, error: errMat } = await supabase
    .from('matriculas')
    .select('id')
    .eq('id_usuario', uid);

  if (errMat) return res.status(500).json({ error: errMat.message });
  if (!matriculas || matriculas.length === 0) return res.json([]);

  const idsMatriculas = matriculas.map((m) => m.id);

  const { data, error } = await supabase
    .from('frequencia')
    .select(`
      *,
      id_disciplina (id, nome),
      id_matricula (id, id_curso (nome_curso))
    `)
    .in('id_matricula', idsMatriculas)
    .order('data_aula', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  // Agrupa por disciplina: total aulas, presencas, faltas, %
  const resumo = {};
  (data || []).forEach((f) => {
    const discNome = f.id_disciplina?.nome || 'Desconhecida';
    if (!resumo[discNome]) {
      resumo[discNome] = { disciplina: discNome, totalAulas: 0, presencas: 0, faltas: 0 };
    }
    resumo[discNome].totalAulas++;
    if (f.presenca) resumo[discNome].presencas++;
    else resumo[discNome].faltas++;
  });

  const resultado = Object.values(resumo).map((r) => ({
    ...r,
    frequenciaPercentual: r.totalAulas > 0 ? Math.round((r.presencas / r.totalAulas) * 100) : 0
  }));

  res.json(resultado);
});

// ============================================
// AGENDA / EVENTOS
// ============================================
router.get('/agenda', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('agenda_eventos')
    .select('*')
    .eq('publico', true)
    .order('data_inicio', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// ============================================
// CALENDARIO
// ============================================
router.get('/calendario', requireAuth, async (req, res) => {
  const { mes, ano } = req.query;
  let query = supabase.from('agenda_eventos').select('*').eq('publico', true);

  if (mes) {
    const m = String(mes).padStart(2, '0');
    const a = ano || new Date().getFullYear();
    query = query.gte('data_inicio', `${a}-${m}-01`);
    query = query.lte('data_inicio', `${a}-${m}-31`);
  }

  const { data, error } = await query.order('data_inicio', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// ============================================
// HORARIOS DO ALUNO
// ============================================
router.get('/horarios', requireAuth, async (req, res) => {
  const uid = userId(req);

  const { data: matriculas, error: errMat } = await supabase
    .from('matriculas')
    .select('id_turma')
    .eq('id_usuario', uid)
    .eq('status', 'ATIVO')
    .not('id_turma', 'is', null);

  if (errMat) return res.status(500).json({ error: errMat.message });
  if (!matriculas || matriculas.length === 0) return res.json([]);

  const idsTurmas = [...new Set(matriculas.map((m) => m.id_turma))];

  const { data, error } = await supabase
    .from('horarios')
    .select(`
      *,
      id_disciplina (id, nome),
      id_professor (id, nome_completo)
    `)
    .in('id_turma', idsTurmas)
    .order('dia_semana', { ascending: true })
    .order('hora_inicio', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// ============================================
// RECLAMACOES
// ============================================
router.get('/reclamacoes', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('reclamacoes')
    .select('*')
    .eq('id_usuario', userId(req))
    .order('data_abertura', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

router.get('/reclamacoes/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('reclamacoes')
    .select(`
      *,
      reclamacoes_historico (*)
    `)
    .eq('id', req.params.id)
    .eq('id_usuario', userId(req))
    .single();

  if (error) return res.status(404).json({ error: 'Reclamacao nao encontrada' });
  res.json(data);
});

router.post('/reclamacoes', requireAuth, async (req, res) => {
  const uid = userId(req);
  const { categoria, assunto, descricao, prioridade } = req.body;

  const protocolo = `PROT-${Date.now()}-${String(Math.random()).slice(2, 6)}`;

  const { data, error } = await supabase
    .from('reclamacoes')
    .insert([{
      id_usuario: uid,
      protocolo,
      categoria,
      assunto,
      descricao,
      prioridade: prioridade || 'NORMAL',
      status: 'PENDENTE',
      data_abertura: new Date().toISOString().slice(0, 10)
    }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  // Adiciona entrada no historico
  await supabase.from('reclamacoes_historico').insert([{
    id_reclamacao: data.id,
    evento: 'Reclamacao Registrada',
    descricao: 'Reclamacao recebida e aguardando analise.'
  }]);

  res.status(201).json(data);
});

// ============================================
// ATENDIMENTOS AGENDADOS
// ============================================
router.get('/atendimentos', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('atendimentos')
    .select(`
      *,
      id_responsavel (id, nome_completo)
    `)
    .eq('id_usuario', userId(req))
    .order('data_atendimento', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

router.post('/atendimentos', requireAuth, async (req, res) => {
  const { tipo, data_atendimento, hora, observacoes } = req.body;

  const { data, error } = await supabase
    .from('atendimentos')
    .insert([{
      id_usuario: userId(req),
      tipo,
      data_atendimento,
      hora,
      observacoes,
      status: 'AGENDADO'
    }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// ============================================
// CURRICULO (disciplinas do curso do aluno)
// ============================================
router.get('/curriculo', requireAuth, async (req, res) => {
  const uid = userId(req);

  const { data: matriculas, error: errMat } = await supabase
    .from('matriculas')
    .select('id_curso')
    .eq('id_usuario', uid)
    .eq('status', 'ATIVO')
    .not('id_curso', 'is', null)
    .limit(1);

  if (errMat) return res.status(500).json({ error: errMat.message });
  if (!matriculas || matriculas.length === 0) return res.json([]);

  const idCurso = matriculas[0].id_curso;

  const { data, error } = await supabase
    .from('disciplinas')
    .select('*')
    .eq('id_curso', idCurso)
    .order('nome', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

module.exports = router;

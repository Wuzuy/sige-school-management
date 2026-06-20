const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');

const userId = (req) => req.user.id;

// Allow both teachers and admins
router.use(requireAuth, requireRole('ROLE_TEACHER', 'ROLE_ADMIN'));

function isAdmin(req) {
  return req.user.role === 'ROLE_ADMIN';
}

// GET /api/professor/turmas
router.get('/turmas', async (req, res) => {
  if (isAdmin(req)) {
    const { data, error } = await supabase
      .from('turmas')
      .select(`*, id_curso (id, nome_curso, tipo, turno)`)
      .order('nome');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  }

  const uid = userId(req);
  const { data: horarios, error: errH } = await supabase
    .from('horarios')
    .select('id_turma')
    .eq('id_professor', uid);

  if (errH) return res.status(500).json({ error: errH.message });

  const idsTurmas = [...new Set((horarios || []).map(h => h.id_turma).filter(Boolean))];
  if (idsTurmas.length === 0) return res.json([]);

  const { data, error } = await supabase
    .from('turmas')
    .select(`*, id_curso (id, nome_curso, tipo, turno)`)
    .in('id', idsTurmas)
    .order('nome');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// GET /api/professor/turmas/:id/alunos
router.get('/turmas/:id/alunos', async (req, res) => {
  const { id } = req.params;

  const { data: matriculas, error: errM } = await supabase
    .from('matriculas')
    .select(`
      id, numero_matricula, status, data_matricula,
      id_usuario (id, nome_completo, email, cpf, telefone),
      id_curso (id, nome_curso)
    `)
    .eq('id_turma', id)
    .order('id_usuario->>nome_completo');

  if (errM) return res.status(500).json({ error: errM.message });
  res.json(matriculas || []);
});

// GET /api/professor/turmas/:id/disciplinas
router.get('/turmas/:id/disciplinas', async (req, res) => {
  const { id } = req.params;
  const uid = userId(req);

  let query = supabase
    .from('horarios')
    .select(`id_disciplina (id, nome, codigo, carga_horaria, semestre)`)
    .eq('id_turma', id)
    .not('id_disciplina', 'is', null);

  if (!isAdmin(req)) {
    query = query.eq('id_professor', uid);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  const disciplinas = [...new Map((data || []).map(d => [
    d.id_disciplina.id, d.id_disciplina
  ])).values()];

  res.json(disciplinas);
});

// GET /api/professor/notas?turma=X&disciplina=Y
router.get('/notas', async (req, res) => {
  const { turma, disciplina } = req.query;
  if (!turma || !disciplina) return res.status(400).json({ error: 'turma e disciplina required' });

  const { data: matriculas, error: errM } = await supabase
    .from('matriculas')
    .select('id, id_usuario')
    .eq('id_turma', turma);

  if (errM) return res.status(500).json({ error: errM.message });
  if (!matriculas || matriculas.length === 0) return res.json([]);

  const idsMatriculas = matriculas.map(m => m.id);

  const { data, error } = await supabase
    .from('historico_escolar')
    .select(`*, id_matricula (id_usuario (id, nome_completo, email))`)
    .in('id_matricula', idsMatriculas)
    .eq('id_disciplina', disciplina);

  if (error) return res.status(500).json({ error: error.message });

  const existing = data || [];
  const uid = userId(req);

  const result = [];
  for (const m of matriculas) {
    const record = existing.find(h => h.id_matricula?.id === m.id);
    if (record) {
      result.push(record);
    } else {
      result.push({
        id: null,
        id_matricula: m.id,
        id_disciplina: parseInt(disciplina),
        id_professor: isAdmin(req) ? null : uid,
        nota_final: null,
        frequencia_percentual: null,
        status: 'CURSANDO',
        ano: new Date().getFullYear(),
        semestre: 1,
        _aluno: m.id_usuario
      });
    }
  }

  res.json(result);
});

// PUT /api/professor/notas
router.put('/notas', async (req, res) => {
  const { id_matricula, id_disciplina, nota_final, frequencia_percentual, status, ano, semestre } = req.body;
  const uid = userId(req);

  if (!id_matricula || !id_disciplina) {
    return res.status(400).json({ error: 'id_matricula e id_disciplina required' });
  }

  const { data: existing } = await supabase
    .from('historico_escolar')
    .select('id')
    .eq('id_matricula', id_matricula)
    .eq('id_disciplina', id_disciplina)
    .single();

  const record = {
    id_matricula,
    id_disciplina,
    id_professor: isAdmin(req) ? null : uid,
    nota_final: nota_final !== undefined ? nota_final : null,
    frequencia_percentual: frequencia_percentual !== undefined ? frequencia_percentual : null,
    status: status || 'CURSANDO',
    ano: ano || new Date().getFullYear(),
    semestre: semestre || 1
  };

  if (existing) {
    const { data, error } = await supabase
      .from('historico_escolar')
      .update(record)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } else {
    const { data, error } = await supabase
      .from('historico_escolar')
      .insert([record])
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  }
});

// GET /api/professor/frequencia?turma=X&disciplina=Y&data=YYYY-MM-DD
router.get('/frequencia', async (req, res) => {
  const { turma, disciplina, data } = req.query;
  if (!turma || !disciplina) return res.status(400).json({ error: 'turma e disciplina required' });

  const { data: matriculas, error: errM } = await supabase
    .from('matriculas')
    .select('id, id_usuario')
    .eq('id_turma', turma);

  if (errM) return res.status(500).json({ error: errM.message });
  if (!matriculas || matriculas.length === 0) return res.json([]);

  const idsMatriculas = matriculas.map(m => m.id);

  let query = supabase
    .from('frequencia')
    .select(`*, id_matricula (id_usuario (id, nome_completo))`)
    .in('id_matricula', idsMatriculas)
    .eq('id_disciplina', disciplina);

  if (data) {
    query = query.eq('data_aula', data);
  }

  const { data: records, error } = await query.order('data_aula', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  res.json(records || []);
});

// POST /api/professor/frequencia
router.post('/frequencia', async (req, res) => {
  const { registros } = req.body;

  if (!Array.isArray(registros) || registros.length === 0) {
    return res.status(400).json({ error: 'registros array required' });
  }

  const results = [];
  for (const r of registros) {
    const { id_matricula, id_disciplina, data_aula, presenca, justificativa } = r;
    if (!id_matricula || !id_disciplina || !data_aula) continue;

    const { data: existing } = await supabase
      .from('frequencia')
      .select('id')
      .eq('id_matricula', id_matricula)
      .eq('id_disciplina', id_disciplina)
      .eq('data_aula', data_aula)
      .single();

    const record = {
      id_matricula,
      id_disciplina,
      data_aula,
      presenca: presenca !== undefined ? presenca : true,
      justificativa: justificativa || null
    };

    if (existing) {
      const { data } = await supabase.from('frequencia').update(record).eq('id', existing.id).select().single();
      if (data) results.push(data);
    } else {
      const { data } = await supabase.from('frequencia').insert([record]).select().single();
      if (data) results.push(data);
    }
  }

  res.json(results);
});

module.exports = router;

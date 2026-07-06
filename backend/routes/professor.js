const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const supabase = require('../config/supabase');
const { requireAuth, requirePermissao } = require('../middleware/auth');

const userId = (req) => req.user.id;

// --- Concluidas storage (file-based) ---
const DATA_DIR = path.join(__dirname, '..', 'data');
const CONCLUIDAS_FILE = path.join(DATA_DIR, 'conclusoes.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(CONCLUIDAS_FILE)) fs.writeFileSync(CONCLUIDAS_FILE, '{}');

function loadConcluidas() {
  try { return JSON.parse(fs.readFileSync(CONCLUIDAS_FILE, 'utf8')); } catch { return {}; }
}

function saveConcluidas(data) {
  fs.writeFileSync(CONCLUIDAS_FILE, JSON.stringify(data, null, 2));
}

function isConcluida(turmaId, disciplinaId) {
  const data = loadConcluidas();
  return !!data[`${turmaId}_${disciplinaId}`];
}

async function getTurmasByTeacher(uid) {
  const { data: horarios } = await supabase
    .from('horarios')
    .select('id_turma')
    .eq('id_professor', uid);

  const idsTurmas = [...new Set((horarios || []).map(h => h.id_turma).filter(Boolean))];
  if (idsTurmas.length === 0) return [];
  return idsTurmas;
}

// Allow teachers and admins
router.use(requireAuth, requirePermissao('portal.professor'));

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
    d.id_disciplina.id, { ...d.id_disciplina, concluida: isConcluida(parseInt(id), d.id_disciplina.id) }
  ])).values()];

  res.json(disciplinas);
});

// GET /api/professor/notas?turma=X&disciplina=Y
router.get('/notas', requirePermissao('nota.visualizar'), async (req, res) => {
  const { turma, disciplina } = req.query;
  if (!turma || !disciplina) return res.status(400).json({ error: 'turma e disciplina required' });

  const { data: matriculas, error: errM } = await supabase
    .from('matriculas')
    .select('id, id_usuario (id, nome_completo)')
    .eq('id_turma', turma);

  if (errM) return res.status(500).json({ error: errM.message });
  if (!matriculas || matriculas.length === 0) return res.json([]);

  const idsMatriculas = matriculas.map(m => m.id);

  const { data, error } = await supabase
    .from('historico_escolar')
    .select(`*, id_matricula (id, id_usuario (id, nome_completo, email))`)
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
        id_matricula: { id: m.id, id_usuario: m.id_usuario },
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
router.put('/notas', requirePermissao('nota.lancar'), async (req, res) => {
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
router.get('/frequencia', requirePermissao('frequencia.visualizar'), async (req, res) => {
  const { turma, disciplina, data } = req.query;
  const uid = userId(req);

  // When turma=0 or not provided, return ALL frequency for all professor's turmas (used by dashboard KPI)
  if (!turma || turma === '0') {
    if (isAdmin(req)) {
      const { data: todas, error } = await supabase
        .from('frequencia')
        .select(`*, id_matricula (id, id_usuario (id, nome_completo))`)
        .order('data_aula', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.json(todas || []);
    }

    const { data: horarios } = await supabase
      .from('horarios')
      .select('id_turma')
      .eq('id_professor', uid)
      .not('id_turma', 'is', null);

    const idsTurmas = [...new Set((horarios || []).map(h => h.id_turma))];
    if (idsTurmas.length === 0) return res.json([]);

    const { data: todas } = await supabase
      .from('matriculas')
      .select('id')
      .in('id_turma', idsTurmas);

    const idsMatriculas = (todas || []).map(m => m.id);
    if (idsMatriculas.length === 0) return res.json([]);

    let q = supabase
      .from('frequencia')
        .select(`*, id_matricula (id, id_usuario (id, nome_completo))`)
        .in('id_matricula', idsMatriculas);

    if (disciplina && disciplina !== '0') q = q.eq('id_disciplina', disciplina);
    if (data) q = q.eq('data_aula', data);

    const { data: records, error } = await q.order('data_aula', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(records || []);
  }

  const { data: matriculas, error: errM } = await supabase
    .from('matriculas')
    .select('id, id_usuario')
    .eq('id_turma', turma);

  if (errM) return res.status(500).json({ error: errM.message });
  if (!matriculas || matriculas.length === 0) return res.json([]);

  const idsMatriculas = matriculas.map(m => m.id);

  let query = supabase
    .from('frequencia')
    .select(`*, id_matricula (id, id_usuario (id, nome_completo))`)
    .in('id_matricula', idsMatriculas)
    .eq('id_disciplina', disciplina);

  if (data) {
    query = query.eq('data_aula', data);
  }

  const { data: records, error } = await query.order('data_aula', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  res.json(records || []);
});

// PUT /api/professor/disciplina/concluir
router.put('/disciplina/concluir', requirePermissao('disciplina.concluir'), async (req, res) => {
  const { id_turma, id_disciplina, concluida } = req.body;
  if (!id_turma || !id_disciplina) {
    return res.status(400).json({ error: 'id_turma e id_disciplina required' });
  }
  const data = loadConcluidas();
  const key = `${id_turma}_${id_disciplina}`;
  if (concluida) {
    data[key] = { concluida: true, concluida_em: new Date().toISOString(), id_professor: userId(req) };
  } else {
    delete data[key];
  }
  saveConcluidas(data);
  res.json({ concluida: !!concluida });
});

// GET /api/professor/dashboard/stats
router.get('/dashboard/stats', async (req, res) => {
  const uid = userId(req);
  try {
    const idsTurmas = await getTurmasByTeacher(uid);
    if (idsTurmas.length === 0) return res.json({ turmas: 0, alunos: 0, disciplinas: 0, aulas: 0, statusCounts: {}, frequenciaStats: { total: 0, presentes: 0, ausentes: 0 } });

    // Turmas
    const { data: turmas } = await supabase.from('turmas').select('id').in('id', idsTurmas);
    const totalTurmas = (turmas || []).length;

    // Matriculas
    const { data: matriculas } = await supabase.from('matriculas').select('id').in('id_turma', idsTurmas);
    const idsMatriculas = (matriculas || []).map(m => m.id);
    const totalAlunos = new Set((matriculas || []).filter(m => m.id_usuario).map(m => typeof m.id_usuario === 'object' ? m.id_usuario.id : m.id_usuario)).size || idsMatriculas.length;
    if (idsMatriculas.length === 0) return res.json({ turmas: totalTurmas, alunos: 0, disciplinas: 0, aulas: 0, statusCounts: {}, frequenciaStats: { total: 0, presentes: 0, ausentes: 0 } });

    // Disciplinas from horarios
    const { data: horarios } = await supabase.from('horarios').select('id_disciplina').eq('id_professor', uid).not('id_disciplina', 'is', null);
    const totalDisciplinas = new Set((horarios || []).map(h => h.id_disciplina)).size;

    // Aulas count
    const { data: todasFreq } = await supabase.from('frequencia').select('presenca').in('id_matricula', idsMatriculas);
    const totalAulas = (todasFreq || []).length;
    const presentes = (todasFreq || []).filter(f => f.presenca === true).length;
    const ausentes = (todasFreq || []).filter(f => f.presenca === false).length;

    // Status from historico_escolar
    const { data: historicos } = await supabase.from('historico_escolar').select('status').in('id_matricula', idsMatriculas);
    const statusCounts = { CURSANDO: 0, APROVADO: 0, REPROVADO: 0, RECUPERACAO: 0 };
    (historicos || []).forEach(h => { if (statusCounts[h.status] !== undefined) statusCounts[h.status]++; });

    res.json({
      turmas: totalTurmas,
      alunos: idsMatriculas.length,
      disciplinas: totalDisciplinas,
      aulas: totalAulas,
      statusCounts,
      frequenciaStats: { total: totalAulas, presentes, ausentes }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/professor/frequencia/historico/:matriculaId?disciplina=X
router.get('/frequencia/historico/:matriculaId', async (req, res) => {
  const { matriculaId } = req.params;
  const { disciplina } = req.query;
  let q = supabase
    .from('frequencia')
    .select('*')
    .eq('id_matricula', matriculaId)
    .order('data_aula', { ascending: false });
  if (disciplina) q = q.eq('id_disciplina', disciplina);
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// POST /api/professor/frequencia
router.post('/frequencia', requirePermissao('frequencia.lancar'), async (req, res) => {
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

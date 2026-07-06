const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requirePermissao } = require('../middleware/auth');

// =====================
// PLANO DE ENSINO (macro)
// =====================

// GET /api/planos-ensino — list (filtered by professor if teacher)
router.get('/', requireAuth, requirePermissao('plano_ensino.visualizar'), async (req, res) => {
  const isAdmin = req.user.role === 'ROLE_ADMIN';
  let query = supabase
    .from('planos_ensino')
    .select(`*, id_disciplina (id, nome), id_professor (id, nome_completo)`)
    .order('created_at', { ascending: false });
  if (!isAdmin) query = query.eq('id_professor', req.user.id);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// GET /api/planos-ensino/:id
router.get('/:id', requireAuth, requirePermissao('plano_ensino.visualizar'), async (req, res) => {
  const { data, error } = await supabase
    .from('planos_ensino')
    .select(`*, id_disciplina (id, nome), id_professor (id, nome_completo)`)
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Plano de ensino nao encontrado' });
  res.json(data);
});

// POST /api/planos-ensino
router.post('/', requireAuth, requirePermissao('plano_ensino.criar'), async (req, res) => {
  const { id_disciplina, carga_horaria, ementa, objetivos_gerais, objetivos_especificos, conteudo_programatico, metodologia_geral, criterios_avaliacao, bibliografia_basica, bibliografia_complementar } = req.body;
  if (!id_disciplina) return res.status(400).json({ error: 'Disciplina obrigatoria' });
  const { data, error } = await supabase.from('planos_ensino').insert([{
    id_disciplina,
    id_professor: req.user.id,
    carga_horaria: carga_horaria || 0,
    ementa: ementa || '',
    objetivos_gerais: objetivos_gerais || '',
    objetivos_especificos: objetivos_especificos || '',
    conteudo_programatico: conteudo_programatico || [],
    metodologia_geral: metodologia_geral || '',
    criterios_avaliacao: criterios_avaliacao || '',
    bibliografia_basica: bibliografia_basica || '',
    bibliografia_complementar: bibliografia_complementar || ''
  }]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/planos-ensino/:id
router.put('/:id', requireAuth, requirePermissao('plano_ensino.editar'), async (req, res) => {
  const allowed = ['carga_horaria', 'ementa', 'objetivos_gerais', 'objetivos_especificos', 'conteudo_programatico', 'metodologia_geral', 'criterios_avaliacao', 'bibliografia_basica', 'bibliografia_complementar'];
  const updateData = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) updateData[k] = req.body[k]; });
  updateData.updated_at = new Date();
  const { data, error } = await supabase.from('planos_ensino').update(updateData).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/planos-ensino/:id (cascade deletes planos_aula)
router.delete('/:id', requireAuth, requirePermissao('plano_ensino.excluir'), async (req, res) => {
  const { error: errAulas } = await supabase.from('planos_aula').delete().eq('id_plano_ensino', req.params.id);
  if (errAulas) return res.status(400).json({ error: errAulas.message });
  const { error } = await supabase.from('planos_ensino').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

// =====================
// PLANO DE AULA (micro)
// =====================

// GET /api/planos-ensino/:id_plano/aulas — list aulas for a plano
router.get('/:id_plano/aulas', requireAuth, requirePermissao('plano_ensino.visualizar'), async (req, res) => {
  const { data, error } = await supabase
    .from('planos_aula')
    .select('*')
    .eq('id_plano_ensino', req.params.id_plano)
    .order('data', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// POST /api/planos-ensino/:id_plano/aulas
router.post('/:id_plano/aulas', requireAuth, requirePermissao('plano_ensino.criar'), async (req, res) => {
  const { data, horario_inicio, horario_fim, id_topico, objetivo_aula, metodologia_dia, recursos_didaticos, atividades_realizadas, observacoes } = req.body;
  if (!data) return res.status(400).json({ error: 'Data obrigatoria' });
  const { data: inserted, error } = await supabase.from('planos_aula').insert([{
    id_plano_ensino: parseInt(req.params.id_plano),
    data, horario_inicio: horario_inicio || null,
    horario_fim: horario_fim || null,
    id_topico: id_topico || null,
    objetivo_aula: objetivo_aula || '',
    metodologia_dia: metodologia_dia || '',
    recursos_didaticos: recursos_didaticos || '',
    atividades_realizadas: atividades_realizadas || '',
    observacoes: observacoes || ''
  }]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(inserted);
});

// PUT /api/planos-ensino/aulas/:id
router.put('/aulas/:id', requireAuth, requirePermissao('plano_ensino.editar'), async (req, res) => {
  const allowed = ['data', 'horario_inicio', 'horario_fim', 'id_topico', 'objetivo_aula', 'metodologia_dia', 'recursos_didaticos', 'atividades_realizadas', 'observacoes'];
  const updateData = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) updateData[k] = req.body[k]; });
  updateData.updated_at = new Date();
  const { data, error } = await supabase.from('planos_aula').update(updateData).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/planos-ensino/aulas/:id
router.delete('/aulas/:id', requireAuth, requirePermissao('plano_ensino.excluir'), async (req, res) => {
  const { error } = await supabase.from('planos_aula').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;

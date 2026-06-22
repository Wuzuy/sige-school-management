const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requirePermissao } = require('../middleware/auth');

router.get('/', requireAuth, requirePermissao('disciplina.visualizar'), async (req, res) => {
  const { data, error } = await supabase
    .from('disciplinas')
    .select(`*, id_curso (id, nome_curso)`)
    .order('nome');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

router.get('/atribuicoes', requireAuth, requirePermissao('disciplina.visualizar'), async (req, res) => {
  const { data, error } = await supabase
    .from('horarios')
    .select(`*, id_turma (id, nome), id_disciplina (id, nome, codigo, carga_horaria), id_professor (id, nome_completo)`)
    .order('id_turma');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

router.get('/:id', requireAuth, requirePermissao('disciplina.visualizar'), async (req, res) => {
  const { data, error } = await supabase
    .from('disciplinas')
    .select(`*, id_curso (id, nome_curso)`)
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Disciplina nao encontrada' });
  res.json(data);
});

router.post('/', requireAuth, requirePermissao('disciplina.criar'), async (req, res) => {
  const { nome, codigo, carga_horaria, id_curso, semestre, obrigatoria } = req.body;
  const { data, error } = await supabase.from('disciplinas').insert([{
    nome, codigo: codigo || null, carga_horaria: carga_horaria || 0,
    id_curso: id_curso || null, semestre: semestre || 1,
    obrigatoria: obrigatoria !== undefined ? obrigatoria : true, ativo: true
  }]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/:id', requireAuth, requirePermissao('disciplina.editar'), async (req, res) => {
  const { nome, codigo, carga_horaria, id_curso, semestre, obrigatoria, ativo } = req.body;
  const updateData = {};
  if (nome !== undefined) updateData.nome = nome;
  if (codigo !== undefined) updateData.codigo = codigo;
  if (carga_horaria !== undefined) updateData.carga_horaria = carga_horaria;
  if (id_curso !== undefined) updateData.id_curso = id_curso;
  if (semestre !== undefined) updateData.semestre = semestre;
  if (obrigatoria !== undefined) updateData.obrigatoria = obrigatoria;
  if (ativo !== undefined) updateData.ativo = ativo;
  const { data, error } = await supabase.from('disciplinas').update(updateData).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', requireAuth, requirePermissao('disciplina.excluir'), async (req, res) => {
  const { error: errH } = await supabase.from('horarios').delete().eq('id_disciplina', req.params.id);
  if (errH) return res.status(400).json({ error: errH.message });
  const { error } = await supabase.from('disciplinas').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

router.post('/:id/atribuir', requireAuth, requirePermissao('disciplina.criar'), async (req, res) => {
  const { id_turma, id_professor } = req.body;
  if (!id_turma) return res.status(400).json({ error: 'Turma obrigatoria' });
  const { data, error } = await supabase.from('horarios').insert([{
    id_turma, id_disciplina: parseInt(req.params.id),
    id_professor: id_professor || null,
    dia_semana: 1, hora_inicio: '08:00', hora_fim: '09:30'
  }]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.delete('/atribuicoes/:id', requireAuth, requirePermissao('disciplina.excluir'), async (req, res) => {
  const { error } = await supabase.from('horarios').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;

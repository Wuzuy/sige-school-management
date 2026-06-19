const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('turmas')
    .select(`*, id_curso (id, nome_curso, tipo, turno)`)
    .order('nome');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('turmas')
    .select(`*, id_curso (id, nome_curso)`)
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Turma nao encontrada' });
  res.json(data);
});

router.post('/', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  const { nome, id_curso, ano, turno, vagas, status } = req.body;
  const { data, error } = await supabase.from('turmas').insert([{
    nome, id_curso, ano, turno, vagas, status: status || 'ATIVO', ativo: true
  }]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/:id', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  const { nome, id_curso, ano, turno, vagas, status } = req.body;
  const updateData = {};
  if (nome !== undefined) updateData.nome = nome;
  if (id_curso !== undefined) updateData.id_curso = id_curso;
  if (ano !== undefined) updateData.ano = ano;
  if (turno !== undefined) updateData.turno = turno;
  if (vagas !== undefined) updateData.vagas = vagas;
  if (status !== undefined) updateData.status = status;
  const { data, error } = await supabase.from('turmas').update(updateData).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  const { error } = await supabase.from('turmas').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;

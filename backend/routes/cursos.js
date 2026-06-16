const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Retorna todos os cursos (admin) ou apenas ativos (publico)
router.get('/', async (req, res) => {
  const { todos } = req.query;
  let query = supabase.from('cursos').select(`*, id_unidade (id, nome, cidade, estado)`);

  if (todos !== 'true') {
    query = query.eq('status', 'ATIVO');
  }

  const { data, error } = await query.order('nome_curso', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Obter curso especifico
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('cursos')
    .select(`*, id_unidade (id, nome, cidade, estado)`)
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Curso nao encontrado' });
  res.json(data);
});

// Criar curso
router.post('/', async (req, res) => {
  const { id_unidade, nome_curso, tipo, turno, data_inicio, duracao_meses, status } = req.body;

  const insertData = {
    id_unidade: id_unidade?.id || id_unidade,
    nome_curso,
    tipo: tipo || null,
    turno: turno || null,
    data_inicio: data_inicio || null,
    duracao_meses: duracao_meses || null,
    status: status || 'ATIVO'
  };

  const { data, error } = await supabase.from('cursos').insert([insertData]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Atualizar curso
router.put('/:id', async (req, res) => {
  const { id_unidade, nome_curso, tipo, turno, data_inicio, duracao_meses, status } = req.body;

  const updateData = {};
  if (id_unidade !== undefined) updateData.id_unidade = id_unidade?.id || id_unidade;
  if (nome_curso !== undefined) updateData.nome_curso = nome_curso;
  if (tipo !== undefined) updateData.tipo = tipo;
  if (turno !== undefined) updateData.turno = turno;
  if (data_inicio !== undefined) updateData.data_inicio = data_inicio;
  if (duracao_meses !== undefined) updateData.duracao_meses = duracao_meses;
  if (status !== undefined) updateData.status = status;

  const { data, error } = await supabase.from('cursos').update(updateData).eq('id', req.params.id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Excluir curso
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('cursos').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
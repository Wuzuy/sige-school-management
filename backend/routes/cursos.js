const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Retorna todos os cursos ativos com o nome da unidade
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('cursos')
    .select(`*, id_unidade (nome)`)
    .eq('status', 'ATIVO');

  if (error) return res.json([]);
  res.json(data);
});

// Retorna um curso específico
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('cursos')
    .select(`*, id_unidade (nome)`)
    .eq('id', req.params.id)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Curso não encontrado' });
  }

  res.json(data);
});

// Criar um novo curso
router.post('/', async (req, res) => {
  const payload = req.body;

  const insertData = {
    id_unidade: payload.id_unidade?.id || payload.id_unidade,
    nome_curso: payload.nome_curso,
    tipo: payload.tipo,
    turno: payload.turno,
    data_inicio: payload.data_inicio,
    duracao_meses: payload.duracao_meses,
    status: payload.status || 'ATIVO'
  };

  const { data, error } = await supabase
    .from('cursos')
    .insert([insertData])
    .select(`*, id_unidade (nome)`);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Atualizar curso
router.put('/:id', async (req, res) => {
  const { data, error } = await supabase.from('cursos').update(req.body).eq('id', req.params.id).select(`*, id_unidade (nome)`);
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
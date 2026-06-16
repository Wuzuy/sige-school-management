const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('reclamacoes').select('*');
  if (error) return res.json([]);
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase.from('reclamacoes').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Reclamação não encontrada' });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('reclamacoes').insert([req.body]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

module.exports = router;

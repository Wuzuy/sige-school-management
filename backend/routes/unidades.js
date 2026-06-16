const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Lista unidades
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('unidades').select('*');
  if (error) return res.json([]);
  res.json(data);
});

// Cria unidade
router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('unidades').insert([req.body]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Atualiza unidade
router.put('/:id', async (req, res) => {
  const { data, error } = await supabase.from('unidades').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Exclui unidade
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('unidades').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
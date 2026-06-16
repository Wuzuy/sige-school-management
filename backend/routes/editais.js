const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Lista editais
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('editais').select('*');
  if (error) return res.json([]);
  res.json(data);
});

// Cria edital
router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('editais').insert([req.body]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Atualiza edital
router.put('/:id', async (req, res) => {
  const { data, error } = await supabase.from('editais').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Exclui edital
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('editais').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
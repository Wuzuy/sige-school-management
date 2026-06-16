const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');

// Lista unidades
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('unidades').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Cria unidade (admin)
router.post('/', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  const { data, error } = await supabase.from('unidades').insert([req.body]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Atualiza unidade (admin)
router.put('/:id', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  const { data, error } = await supabase.from('unidades').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Exclui unidade (admin)
router.delete('/:id', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  const { error } = await supabase.from('unidades').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
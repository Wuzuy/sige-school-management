const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requirePermissao } = require('../middleware/auth');

// Lista editais
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('editais').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Cria edital (admin)
router.post('/', requireAuth, requirePermissao('edital.criar'), async (req, res) => {
  const { data, error } = await supabase.from('editais').insert([req.body]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Atualiza edital (admin)
router.put('/:id', requireAuth, requirePermissao('edital.editar'), async (req, res) => {
  const { data, error } = await supabase.from('editais').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Exclui edital (admin)
router.delete('/:id', requireAuth, requirePermissao('edital.excluir'), async (req, res) => {
  const { error } = await supabase.from('editais').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('documentos').select('*');
  if (error) return res.json([]);
  res.json(data);
});

router.get('/:id/download', async (req, res) => {
  const { data, error } = await supabase.from('documentos').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Documento não encontrado' });
  res.json({ url: data.url || null, mensagem: 'Download simulado' });
});

module.exports = router;

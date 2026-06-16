const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('atendimentos').select('*');
  if (error) return res.json([]);
  res.json(data);
});

module.exports = router;

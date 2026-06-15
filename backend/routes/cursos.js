const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Retorna todos os cursos ativos com o nome da unidade
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('cursos')
    .select(`*, id_unidade (nome)`)
    .eq('status', 'ATIVO');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;
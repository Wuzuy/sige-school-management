const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');

// POST /api/auditoria/init - Create auditoria table (one-time setup)
router.post('/init', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  try {
    // Use raw SQL via supabase.rpc (will be executed server-side)
    const { error } = await supabase.rpc('exec_sql', {
      query: 'CREATE TABLE IF NOT EXISTS auditoria (id SERIAL PRIMARY KEY, timestamp TIMESTAMP DEFAULT NOW(), usuario VARCHAR(200) NOT NULL, tipo VARCHAR(50) NOT NULL, acao TEXT NOT NULL, detalhes TEXT, created_at TIMESTAMP DEFAULT NOW())'
    });
    if (error) {
      // Fallback: try using the pgjs query method
      return res.status(500).json({ error: error.message, hint: 'Execute o SQL manualmente no Supabase' });
    }
    res.json({ message: 'Tabela auditoria criada com sucesso' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/auditoria - List auditoria entries with pagination and filters
router.get('/', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  try {
    const { texto, tipo, offset = 0, limit = 100 } = req.query;
    let query = supabase.from('auditoria').select('*', { count: 'exact' }).order('timestamp', { ascending: false });

    if (tipo && tipo !== 'TODOS') query = query.eq('tipo', tipo);
    if (texto) {
      const t = String(texto);
      query = query.or(`usuario.ilike.%${t}%,acao.ilike.%${t}%,detalhes.ilike.%${t}%`);
    }

    const { data, error, count } = await query.range(Number(offset), Number(offset) + Number(limit) - 1);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ data: data || [], total: count || 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/auditoria - Create a new auditoria entry
router.post('/', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  try {
    const { tipo, acao, detalhes } = req.body;
    const usuario = req.user?.nomeCompleto || req.user?.email || 'Sistema';
    const { data, error } = await supabase.from('auditoria').insert([{
      timestamp: new Date().toISOString(),
      usuario,
      tipo,
      acao,
      detalhes: detalhes || ''
    }]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

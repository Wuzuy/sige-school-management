const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requirePermissao } = require('../middleware/auth');

// GET /api/portais — lista todos os portais (qualquer user autenticado)
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('portais').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  for (const p of data || []) {
    if (!p.ativo && p.reativar_em && new Date(p.reativar_em) <= new Date()) {
      p.ativo = true;
      p.desativado_em = null;
      p.reativar_em = null;
      await supabase.from('portais').update({ ativo: true, desativado_em: null, reativar_em: null }).eq('id', p.id);
    }
  }
  res.json(data || []);
});

// GET /api/portais/:codigo — status de um portal
router.get('/:codigo', requireAuth, async (req, res) => {
  let { data, error } = await supabase.from('portais').select('*').eq('codigo', req.params.codigo).single();
  if (error) return res.status(404).json({ error: 'Portal nao encontrado' });
  if (!data.ativo && data.reativar_em && new Date(data.reativar_em) <= new Date()) {
    const { data: updated } = await supabase.from('portais').update({ ativo: true, desativado_em: null, reativar_em: null }).eq('id', data.id).select().single();
    data = updated || data;
  }
  res.json(data);
});

// PUT /api/portais/:codigo — ativar/desativar (admin ou portal.gerenciar)
router.put('/:codigo', requireAuth, requirePermissao('portal.gerenciar'), async (req, res) => {
  const { ativo, reativar_em, motivo } = req.body;
  const updateData = { updated_at: new Date() };
  if (ativo !== undefined) {
    updateData.ativo = ativo;
    if (!ativo) updateData.desativado_em = new Date();
    else { updateData.desativado_em = null; updateData.reativar_em = null; }
  }
  if (reativar_em !== undefined) updateData.reativar_em = reativar_em || null;
  if (motivo !== undefined) updateData.motivo = motivo || null;
  const { data, error } = await supabase.from('portais').update(updateData).eq('codigo', req.params.codigo).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;

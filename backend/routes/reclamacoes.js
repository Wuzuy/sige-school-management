const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /api/reclamacoes - List all reclamacoes with aluno info (admin)
router.get('/', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  try {
    const { texto, status, offset = 0, limit = 100 } = req.query;
    let query = supabase
      .from('reclamacoes')
      .select('*, id_usuario (id, nome_completo, email)', { count: 'exact' })
      .order('data_abertura', { ascending: false });

    if (status && status !== 'TODOS') query = query.eq('status', status);
    if (texto) {
      const t = String(texto);
      query = query.or(`assunto.ilike.%${t}%,descricao.ilike.%${t}%`);
    }

    const { data, error, count } = await query.range(Number(offset), Number(offset) + Number(limit) - 1);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ data: data || [], total: count || 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/reclamacoes/:id - Responder/atualizar status de reclamacao (admin)
router.put('/:id', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  try {
    const { resposta, status } = req.body;
    const updates = {};
    if (resposta !== undefined) updates.resposta_admin = resposta;
    if (status !== undefined) {
      updates.status = status;
      if (status === 'RESOLVIDA' || status === 'FECHADA') {
        updates.data_resolucao = new Date().toISOString().slice(0, 10);
      }
    }

    const { data, error } = await supabase
      .from('reclamacoes')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    // Add to history
    await supabase.from('reclamacoes_historico').insert([{
      id_reclamacao: data.id,
      evento: status ? `Status alterado para ${status}` : 'Resposta registrada',
      descricao: resposta || `Atualização administrativa`
    }]);

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

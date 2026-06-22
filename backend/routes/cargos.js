const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requirePermissao, getUserPermissoes } = require('../middleware/auth');

// === LISTAR todos os cargos ===
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('cargos').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// === LISTAR todas as permissoes (deve vir antes de /:id) ===
router.get('/permissoes/all', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('permissoes').select('*').order('modulo').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// === VERIFICAR permissoes do usuario autenticado (deve vir antes de /:id) ===
router.get('/minhas/permissoes', requireAuth, async (req, res) => {
  try {
    const permissoes = await getUserPermissoes(req.user.id);
    res.json(permissoes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// === OBTER um cargo com suas permissoes ===
router.get('/:id', requireAuth, async (req, res) => {
  const { data: cargo, error } = await supabase.from('cargos').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Cargo nao encontrado' });

  const { data: permissoes } = await supabase
    .from('cargos_permissoes')
    .select('id_permissao')
    .eq('id_cargo', req.params.id);

  const ids = (permissoes || []).map(p => p.id_permissao);

  const { data: todas } = await supabase.from('permissoes').select('*').order('modulo').order('id');

  res.json({ ...cargo, permissaoIds: ids, todasPermissoes: todas || [] });
});

// === CRIAR cargo ===
router.post('/', requireAuth, requirePermissao('cargo.gerenciar'), async (req, res) => {
  const { nome, descricao, permissaoIds } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });

  const { data: cargo, error } = await supabase.from('cargos').insert([{ nome, descricao, is_admin_master: false }]).select().single();
  if (error) return res.status(400).json({ error: error.message });

  if (permissaoIds && permissaoIds.length) {
    const inserts = permissaoIds.map(id_permissao => ({ id_cargo: cargo.id, id_permissao }));
    await supabase.from('cargos_permissoes').insert(inserts);
  }

  res.status(201).json(cargo);
});

// === ATUALIZAR cargo ===
router.put('/:id', requireAuth, requirePermissao('cargo.gerenciar'), async (req, res) => {
  const { nome, descricao, permissaoIds } = req.body;

  const { error: upErr } = await supabase.from('cargos').update({ nome, descricao }).eq('id', req.params.id);
  if (upErr) return res.status(400).json({ error: upErr.message });

  if (permissaoIds !== undefined) {
    await supabase.from('cargos_permissoes').delete().eq('id_cargo', req.params.id);
    if (permissaoIds.length) {
      const inserts = permissaoIds.map(id_permissao => ({ id_cargo: parseInt(req.params.id), id_permissao }));
      await supabase.from('cargos_permissoes').insert(inserts);
    }
  }

  const { data: cargo } = await supabase.from('cargos').select('*').eq('id', req.params.id).single();
  res.json(cargo);
});

// === EXCLUIR cargo ===
router.delete('/:id', requireAuth, requirePermissao('cargo.gerenciar'), async (req, res) => {
  const { data: cargo } = await supabase.from('cargos').select('*').eq('id', req.params.id).single();
  if (cargo?.is_admin_master) return res.status(403).json({ error: 'Não é possível excluir o Admin Master' });

  const { error } = await supabase.from('cargos').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;

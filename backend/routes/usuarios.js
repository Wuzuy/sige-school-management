const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'secreta_sige_123';

// Registo de novo utilizador
router.post('/', async (req, res) => {
  const { nomeCompleto, email, senha } = req.body;
  
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(senha, salt);

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nome_completo: nomeCompleto, email, senha: senhaHash }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return res.status(401).json({ error: 'Utilizador não encontrado.' });

  const senhaValida = await bcrypt.compare(senha, data.senha);
  if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta.' });

  const token = jwt.sign({ id: data.id, role: data.role }, JWT_SECRET, { expiresIn: '1d' });

  // Mapeamento para o formato esperado pelo frontend
  const usuario = {
    id: data.id,
    nomeCompleto: data.nome_completo,
    email: data.email,
    cpf: data.cpf,
    telefone: data.telefone,
    dataNascimento: data.data_nascimento,
    role: data.role
  };

  res.json({ token, usuario });
});

// Obter dados do utilizador autenticado
router.get('/me', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(401).json({ error: 'Erro ao buscar dados.' });

  res.json({
    id: data.id,
    nomeCompleto: data.nome_completo,
    email: data.email,
    cpf: data.cpf,
    telefone: data.telefone,
    dataNascimento: data.data_nascimento,
    role: data.role
  });
});

// Atualizar perfil
router.put('/me', requireAuth, async (req, res) => {
  const { nomeCompleto, telefone, dataNascimento } = req.body;

  const { data, error } = await supabase
    .from('usuarios')
    .update({ 
      nome_completo: nomeCompleto, 
      telefone, 
      data_nascimento: dataNascimento 
    })
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: 'Erro ao atualizar dados.' });

  res.json({
    nomeCompleto: data.nome_completo,
    telefone: data.telefone,
    dataNascimento: data.data_nascimento
  });
});

// === ADMIN: Listar todos os usuarios ===
router.get('/', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  const { data, error } = await supabase.from('usuarios').select('*').order('id', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });

  const usuarios = data.map(u => ({
    id: u.id,
    nomeCompleto: u.nome_completo,
    email: u.email,
    cpf: u.cpf,
    telefone: u.telefone,
    dataNascimento: u.data_nascimento,
    role: u.role
  }));

  res.json(usuarios);
});

// Contagem de usuarios (publica)
router.get('/count', async (req, res) => {
  const { count, error } = await supabase.from('usuarios').select('*', { count: 'exact', head: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ count });
});

// === ADMIN: Obter usuario especifico ===
router.get('/:id', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  const { data, error } = await supabase.from('usuarios').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Usuario nao encontrado' });

  res.json({
    id: data.id,
    nomeCompleto: data.nome_completo,
    email: data.email,
    cpf: data.cpf,
    telefone: data.telefone,
    dataNascimento: data.data_nascimento,
    role: data.role
  });
});

// === ADMIN: Atualizar usuario ===
router.put('/:id', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  const { nomeCompleto, email, cpf, telefone, dataNascimento, role } = req.body;
  const updateData = {};
  if (nomeCompleto !== undefined) updateData.nome_completo = nomeCompleto;
  if (email !== undefined) updateData.email = email;
  if (cpf !== undefined) updateData.cpf = cpf;
  if (telefone !== undefined) updateData.telefone = telefone;
  if (dataNascimento !== undefined) updateData.data_nascimento = dataNascimento;
  if (role !== undefined) updateData.role = role;

  const { data, error } = await supabase.from('usuarios').update(updateData).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });

  res.json({
    id: data.id,
    nomeCompleto: data.nome_completo,
    email: data.email,
    cpf: data.cpf,
    telefone: data.telefone,
    dataNascimento: data.data_nascimento,
    role: data.role
  });
});

// === ADMIN: Excluir usuario ===
router.delete('/:id', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  const { error } = await supabase.from('usuarios').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

// === ADMIN: Criar usuario com role ===
router.post('/admin', requireAuth, requireRole('ROLE_ADMIN'), async (req, res) => {
  const { nomeCompleto, email, senha, cpf, telefone, dataNascimento, role } = req.body;

  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(senha, salt);

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{
      nome_completo: nomeCompleto,
      email,
      senha: senhaHash,
      cpf: cpf || null,
      telefone: telefone || null,
      data_nascimento: dataNascimento || null,
      role: role || 'ROLE_USER'
    }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({
    id: data.id,
    nomeCompleto: data.nome_completo,
    email: data.email,
    cpf: data.cpf,
    telefone: data.telefone,
    dataNascimento: data.data_nascimento,
    role: data.role
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { requireAuth, requirePermissao, getUserPermissoes } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'secreta_sige_123';

// Registo de novo utilizador (cargo padrão: Candidato)
router.post('/', async (req, res) => {
  const { nomeCompleto, email, senha } = req.body;

  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(senha, salt);

  // Busca o cargo Candidato (default para novos registos)
  const { data: cargoCandidato } = await supabase
    .from('cargos')
    .select('id')
    .eq('nome', 'Candidato')
    .single();

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nome_completo: nomeCompleto, email, senha: senhaHash, id_cargo: cargoCandidato?.id || null }])
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

  const permissoes = await getUserPermissoes(data.id);
  const token = jwt.sign({ id: data.id, role: data.role, id_cargo: data.id_cargo, permissoes }, JWT_SECRET, { expiresIn: '1d' });

  // Mapeamento para o formato esperado pelo frontend
  const usuario = {
    id: data.id,
    nomeCompleto: data.nome_completo,
    email: data.email,
    cpf: data.cpf,
    telefone: data.telefone,
    dataNascimento: data.data_nascimento,
    role: data.role,
    id_cargo: data.id_cargo
  };

  res.json({ token, usuario, permissoes });
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
    role: data.role,
    id_cargo: data.id_cargo
  });
});

// Atualizar perfil
router.put('/me', requireAuth, async (req, res) => {
  const { nomeCompleto, telefone, dataNascimento, senha, senhaAtual } = req.body;

  const updateData = {};
  if (nomeCompleto !== undefined) updateData.nome_completo = nomeCompleto;
  if (telefone !== undefined) updateData.telefone = telefone;
  if (dataNascimento !== undefined) updateData.data_nascimento = dataNascimento;

  // Alteracao de senha
  if (senha) {
    if (!senhaAtual) {
      return res.status(400).json({ error: 'Senha atual é obrigatória.' });
    }
    const { data: user, error: userErr } = await supabase
      .from('usuarios')
      .select('senha')
      .eq('id', req.user.id)
      .single();
    if (userErr) return res.status(500).json({ error: 'Erro ao verificar senha.' });
    const valida = await bcrypt.compare(senhaAtual, user.senha);
    if (!valida) return res.status(401).json({ error: 'Senha atual incorreta.' });
    const salt = await bcrypt.genSalt(10);
    updateData.senha = await bcrypt.hash(senha, salt);
  }

  const { data, error } = await supabase
    .from('usuarios')
    .update(updateData)
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
router.get('/', requireAuth, requirePermissao('usuario.visualizar'), async (req, res) => {
  const { data, error } = await supabase.from('usuarios').select('*').order('id', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });

  const usuarios = data.map(u => ({
    id: u.id,
    nomeCompleto: u.nome_completo,
    email: u.email,
    cpf: u.cpf,
    telefone: u.telefone,
    dataNascimento: u.data_nascimento,
    role: u.role,
    id_cargo: u.id_cargo
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
router.get('/:id', requireAuth, requirePermissao('usuario.visualizar'), async (req, res) => {
  const { data, error } = await supabase.from('usuarios').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Usuario nao encontrado' });

  res.json({
    id: data.id,
    nomeCompleto: data.nome_completo,
    email: data.email,
    cpf: data.cpf,
    telefone: data.telefone,
    dataNascimento: data.data_nascimento,
    role: data.role,
    id_cargo: data.id_cargo
  });
});

// === ADMIN: Atualizar usuario ===
router.put('/:id', requireAuth, requirePermissao('usuario.editar'), async (req, res) => {
  const { nomeCompleto, email, cpf, telefone, dataNascimento, role, id_cargo } = req.body;
  const updateData = {};
  if (nomeCompleto !== undefined) updateData.nome_completo = nomeCompleto;
  if (email !== undefined) updateData.email = email;
  if (cpf !== undefined) updateData.cpf = cpf;
  if (telefone !== undefined) updateData.telefone = telefone;
  if (dataNascimento !== undefined) updateData.data_nascimento = dataNascimento;
  if (role !== undefined) updateData.role = role;
  if (id_cargo !== undefined) updateData.id_cargo = id_cargo;

  const { data, error } = await supabase.from('usuarios').update(updateData).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });

  res.json({
    id: data.id,
    nomeCompleto: data.nome_completo,
    email: data.email,
    cpf: data.cpf,
    telefone: data.telefone,
    dataNascimento: data.data_nascimento,
    role: data.role,
    id_cargo: data.id_cargo
  });
});

// === ADMIN: Excluir usuario ===
router.delete('/:id', requireAuth, requirePermissao('usuario.excluir'), async (req, res) => {
  const { error } = await supabase.from('usuarios').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

// === ADMIN: Criar usuario com role ===
router.post('/admin', requireAuth, requirePermissao('usuario.criar'), async (req, res) => {
  const { nomeCompleto, email, senha, cpf, telefone, dataNascimento, role, id_cargo: reqIdCargo } = req.body;

  // Se nao especificou cargo, usa Candidato como padrao
  let cargoId = reqIdCargo;
  if (!cargoId) {
    const { data: cargoCandidato } = await supabase
      .from('cargos')
      .select('id')
      .eq('nome', 'Candidato')
      .single();
    cargoId = cargoCandidato?.id || null;
  }

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
      role: role || 'ROLE_USER',
      id_cargo: cargoId
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
    role: data.role,
    id_cargo: data.id_cargo
  });
});

module.exports = router;
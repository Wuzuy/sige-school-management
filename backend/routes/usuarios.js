const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

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
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Acesso negado.' });

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error) throw error;
    
    res.json({
      id: data.id,
      nomeCompleto: data.nome_completo,
      email: data.email,
      cpf: data.cpf,
      telefone: data.telefone,
      dataNascimento: data.data_nascimento,
      role: data.role
    });
  } catch (err) {
    res.status(401).json({ error: 'Token inválido.' });
  }
});

// Atualizar perfil
router.put('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Acesso negado.' });

  const token = authHeader.split(' ')[1];
  const { nomeCompleto, telefone, dataNascimento } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { data, error } = await supabase
      .from('usuarios')
      .update({ 
        nome_completo: nomeCompleto, 
        telefone, 
        data_nascimento: dataNascimento 
      })
      .eq('id', decoded.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      nomeCompleto: data.nome_completo,
      telefone: data.telefone,
      dataNascimento: data.data_nascimento
    });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar dados.' });
  }
});

module.exports = router;
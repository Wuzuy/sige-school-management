const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreta_sige_123';

// Middleware de autenticacao simples
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Nao autorizado' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Token invalido' });
  }
};

// Criar inscricao
router.post('/', authMiddleware, async (req, res) => {
  const payload = req.body;
  
  const insertData = {
    id_usuario: payload.id_usuario.id,
    id_curso: payload.id_curso.id,
    data_inscricao: payload.data_inscricao,
    status_aprovacao: payload.status_aprovacao,
    escolaridade_declarada: payload.escolaridade_declarada,
    nome_completo_inscricao: payload.nome_completo_inscricao,
    rg_inscricao: payload.rg_inscricao,
    cpf_inscricao: payload.cpf_inscricao,
    telefone_inscricao: payload.telefone_inscricao,
    email_inscricao: payload.email_inscricao,
    data_nascimento_inscricao: payload.data_nascimento_inscricao
  };

  const { data, error } = await supabase.from('inscricoes').insert([insertData]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Listar inscricoes (com dados do curso e usuario)
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('inscricoes')
    .select(`
      *,
      id_curso (id, nome_curso, turno, data_inicio, duracao_meses),
      id_usuario (id, nome_completo, cpf, email, telefone, data_nascimento)
    `);
    
  if (error) return res.json([]);
  res.json(data);
});

// Obter inscricao especifica
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('inscricoes')
    .select(`
      *,
      id_curso (id, nome_curso, turno, data_inicio, duracao_meses),
      id_usuario (id, nome_completo, cpf, email)
    `)
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Inscricao nao encontrada' });
  res.json(data);
});

// Atualizar inscricao (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('inscricoes')
    .update(req.body)
    .eq('id', req.params.id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Aceitar/Recusar matricula (Aluno)
router.put('/:id/matricula', authMiddleware, async (req, res) => {
  const { status_matricula, data_aceite_matricula } = req.body;
  const { data, error } = await supabase
    .from('inscricoes')
    .update({ status_matricula, data_aceite_matricula })
    .eq('id', req.params.id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

module.exports = router;
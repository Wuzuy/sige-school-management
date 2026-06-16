const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');

// Criar inscricao
router.post('/', requireAuth, async (req, res) => {
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
    
  if (error) return res.status(500).json({ error: error.message });
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
router.put('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('inscricoes')
    .update(req.body)
    .eq('id', req.params.id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Aceitar/Recusar matricula (Aluno) + promove ROLE_USER para ROLE_STUDENT
router.put('/:id/matricula', requireAuth, async (req, res) => {
  const { status_matricula, data_aceite_matricula } = req.body;
  const { data, error } = await supabase
    .from('inscricoes')
    .update({ status_matricula, data_aceite_matricula })
    .eq('id', req.params.id)
    .select();

  if (error) return res.status(400).json({ error: error.message });

  // Se matricula foi aceita, promover usuario para ROLE_STUDENT
  if (status_matricula === 'ACEITA' && data && data.length > 0) {
    const inscricao = data[0];
    const { data: userData } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', inscricao.id_usuario)
      .single();

    if (userData && userData.role === 'ROLE_USER') {
      await supabase
        .from('usuarios')
        .update({ role: 'ROLE_STUDENT' })
        .eq('id', inscricao.id_usuario);
    }
  }

  res.json(data[0]);
});

module.exports = router;
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

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
  const userId = req.query.user_id;
  let query = supabase
    .from('inscricoes')
    .select(`
      *,
      id_curso (id, nome_curso, turno, data_inicio, duracao_meses),
      id_usuario (id, nome_completo, cpf, email, telefone, data_nascimento)
    `, { count: 'exact' });

  if (userId) {
    query = query.eq('id_usuario', userId);
  }

  const { data, error, count } = await query.order('id', { ascending: false }).limit(5000);

  if (error) return res.status(500).json({ error: error.message });
  res.set('X-Total-Count', count);
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
  const COLUNAS_VALIDAS = [
    'status_aprovacao', 'status_matricula', 'data_aceite_matricula',
    'escolaridade_declarada', 'data_inscricao'
  ];
  const updates = {};
  for (const key of COLUNAS_VALIDAS) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Nenhum campo valido para atualizar.' });
  }

  const { data, error } = await supabase
    .from('inscricoes')
    .update(updates)
    .eq('id', req.params.id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Inscricao nao encontrada.' });

  const inscricao = data[0];

  // Se matricula foi aceita, promover usuario e criar registro em matriculas
  if (updates.status_matricula === 'ACEITA') {
    // Promover ROLE_USER para ROLE_STUDENT e atualizar cargo
    const { data: userData } = await supabase
      .from('usuarios')
      .select('role, id_cargo')
      .eq('id', inscricao.id_usuario)
      .single();

    if (userData && userData.role === 'ROLE_USER') {
      const { data: cargoAluno } = await supabase
        .from('cargos')
        .select('id')
        .eq('nome', 'Aluno')
        .single();
      await supabase
        .from('usuarios')
        .update({ role: 'ROLE_STUDENT', id_cargo: cargoAluno?.id || null })
        .eq('id', inscricao.id_usuario);
    }

    // Criar registro em matriculas se ainda nao existir
    const { data: matExisting } = await supabase
      .from('matriculas')
      .select('id')
      .eq('id_usuario', inscricao.id_usuario)
      .limit(1);

    if (!matExisting || matExisting.length === 0) {
      // Buscar turma do curso
      const { data: turmas } = await supabase
        .from('turmas')
        .select('id')
        .eq('id_curso', inscricao.id_curso)
        .eq('ativo', true)
        .limit(1);

      await supabase.from('matriculas').insert([{
        id_usuario: inscricao.id_usuario,
        id_curso: inscricao.id_curso,
        id_turma: turmas?.[0]?.id || null,
        numero_matricula: 'MAT-' + new Date().getFullYear() + '-' + String(inscricao.id_usuario).padStart(4, '0'),
        status: 'ATIVO',
        data_matricula: new Date().toISOString().slice(0, 10)
      }]);
    }
  }

  res.json(inscricao);
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

  // Se matricula foi aceita, promover usuario e criar matricula
  if (status_matricula === 'ACEITA' && data && data.length > 0) {
    const inscricao = data[0];
    const { data: userData } = await supabase
      .from('usuarios')
      .select('role, id_cargo')
      .eq('id', inscricao.id_usuario)
      .single();

    if (userData && userData.role === 'ROLE_USER') {
      const { data: cargoAluno } = await supabase
        .from('cargos')
        .select('id')
        .eq('nome', 'Aluno')
        .single();
      await supabase
        .from('usuarios')
        .update({ role: 'ROLE_STUDENT', id_cargo: cargoAluno?.id || null })
        .eq('id', inscricao.id_usuario);
    }

    // Criar registro em matriculas se ainda nao existir
    const { data: matExisting } = await supabase
      .from('matriculas')
      .select('id')
      .eq('id_usuario', inscricao.id_usuario)
      .limit(1);

    if (!matExisting || matExisting.length === 0) {
      const { data: turmas } = await supabase
        .from('turmas')
        .select('id')
        .eq('id_curso', inscricao.id_curso)
        .eq('ativo', true)
        .limit(1);

      await supabase.from('matriculas').insert([{
        id_usuario: inscricao.id_usuario,
        id_curso: inscricao.id_curso,
        id_turma: turmas?.[0]?.id || null,
        numero_matricula: 'MAT-' + new Date().getFullYear() + '-' + String(inscricao.id_usuario).padStart(4, '0'),
        status: 'ATIVO',
        data_matricula: new Date().toISOString().slice(0, 10)
      }]);
    }
  }

  res.json(data[0]);
});

module.exports = router;
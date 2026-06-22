const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth, requirePermissao } = require('../middleware/auth');

// GET /api/alunos - Listar todos os alunos (ROLE_STUDENT) com matriculas
router.get('/', requireAuth, requirePermissao('aluno.visualizar'), async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id, nome_completo, email, cpf, telefone, data_nascimento, role,
      matriculas:matriculas(
        id, numero_matricula, status, data_matricula,
        id_turma(id, nome, ano, turno),
        id_curso(id, nome_curso, tipo, turno)
      )
    `)
    .eq('role', 'ROLE_STUDENT')
    .order('nome_completo');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// GET /api/alunos/:id - Detalhes de um aluno (inclui historico, documentos, reclamacoes, atendimentos)
router.get('/:id', requireAuth, requirePermissao('aluno.visualizar'), async (req, res) => {
  const { data: usuario, error: errUser } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (errUser) return res.status(404).json({ error: 'Aluno nao encontrado' });

  const { data: matriculas } = await supabase
    .from('matriculas')
    .select('*')
    .eq('id_usuario', usuario.id);

  const { data: historico } = await supabase
    .from('historico_escolar')
    .select('*, id_disciplina(id, nome, codigo, carga_horaria)')
    .in('id_matricula', (matriculas || []).map(m => m.id));

  const { data: documentos } = await supabase
    .from('documentos')
    .select('*')
    .eq('id_usuario', usuario.id);

  const { data: reclamacoes } = await supabase
    .from('reclamacoes')
    .select('*')
    .eq('id_usuario', usuario.id);

  const { data: atendimentos } = await supabase
    .from('atendimentos')
    .select('*')
    .eq('id_usuario', usuario.id);

  res.json({
    ...usuario,
    matriculas: matriculas || [],
    historico: historico || [],
    documentos: documentos || [],
    reclamacoes: reclamacoes || [],
    atendimentos: atendimentos || [],
  });
});

// PUT /api/alunos/:id/matricula - Atualizar status/turma de matricula
router.put('/:id/matricula', requireAuth, requirePermissao('aluno.editar'), async (req, res) => {
  const { status, id_turma } = req.body;
  const updates = {};
  if (status !== undefined) updates.status = status;
  if (id_turma !== undefined) updates.id_turma = id_turma;

  const { data, error } = await supabase
    .from('matriculas')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;

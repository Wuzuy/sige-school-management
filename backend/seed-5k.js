require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);
const headers = { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' };

const BATCH = 100;
const DAY = 86400000;
const NOW = Date.now();

async function insertBatch(table, rows) {
  if (rows.length === 0) return 0;
  const r = await fetch(supabaseUrl + '/rest/v1/' + table, { method: 'POST', headers, body: JSON.stringify(rows) });
  if (!r.ok) { const t = await r.text(); console.error('  INSERT ' + table + ' ERROR:', t.substring(0, 200)); return 0; }
  return rows.length;
}

async function deleteAll(table) {
  let total = 0;
  while (true) {
    const r = await supabase.from(table).delete().neq('id', 0).limit(1000);
    if (r.error && r.error.code === 'PGRST116') break;
    if (r.error) { console.error('  DELETE ' + table + ' ERROR:', r.error.message); break; }
    if (!r.data || r.data.length === 0) break;
    total += r.data.length;
  }
  return total;
}

function onlyId(arr) { return arr.map(o => o.id); }

// ===================================================================
function dataEntre(ini, fim) {
  const s = new Date(ini).getTime(), e = new Date(fim).getTime();
  return new Date(s + Math.random() * (e - s)).toISOString().split('T')[0];
}

function aleatorio(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function notaRealista() {
  if (Math.random() < 0.15) return +(4 + Math.random() * 2).toFixed(1);
  if (Math.random() < 0.10) return +(9 + Math.random()).toFixed(1);
  return +(6 + Math.random() * 3).toFixed(1);
}

// ===================================================================
const PROFESSORES = [
  { nome: 'Carlos Alberto Mendes', email: 'carlos.mendes@sige.edu.br', cpf: '111.222.333-44' },
  { nome: 'Ana Paula Silveira', email: 'ana.silveira@sige.edu.br', cpf: '222.333.444-55' },
  { nome: 'Roberto Lima Costa', email: 'roberto.costa@sige.edu.br', cpf: '333.444.555-66' },
  { nome: 'Juliana Martins Rocha', email: 'juliana.rocha@sige.edu.br', cpf: '444.555.666-77' },
  { nome: 'Fernando Oliveira Souza', email: 'fernando.souza@sige.edu.br', cpf: '555.666.777-88' },
  { nome: 'Patricia Barbosa Neves', email: 'patricia.neves@sige.edu.br', cpf: '666.777.888-99' },
  { nome: 'Marcelo Dias Pereira', email: 'marcelo.pereira@sige.edu.br', cpf: '777.888.999-00' },
  { nome: 'Cristina Alves Teixeira', email: 'cristina.teixeira@sige.edu.br', cpf: '888.999.000-11' },
];

const ALUNOS = [
  { nome: 'João Vitor Santos', email: 'joao.santos@aluno.edu.br', cpf: '100.200.300-01' },
  { nome: 'Maria Eduarda Lima', email: 'maria.lima@aluno.edu.br', cpf: '100.200.300-02' },
  { nome: 'Pedro Henrique Costa', email: 'pedro.costa@aluno.edu.br', cpf: '100.200.300-03' },
  { nome: 'Ana Clara Oliveira', email: 'ana.oliveira@aluno.edu.br', cpf: '100.200.300-04' },
  { nome: 'Lucas Gabriel Pereira', email: 'lucas.pereira@aluno.edu.br', cpf: '100.200.300-05' },
  { nome: 'Beatriz Souza Martins', email: 'beatriz.martins@aluno.edu.br', cpf: '100.200.300-06' },
  { nome: 'Rafael Almeida Neto', email: 'rafael.neto@aluno.edu.br', cpf: '100.200.300-07' },
  { nome: 'Julia Fernanda Rocha', email: 'julia.rocha@aluno.edu.br', cpf: '100.200.300-08' },
  { nome: 'Gabriel Barbosa Silva', email: 'gabriel.silva@aluno.edu.br', cpf: '100.200.300-09' },
  { nome: 'Larissa Dias Carvalho', email: 'larissa.carvalho@aluno.edu.br', cpf: '100.200.300-10' },
  { nome: 'Felipe Nascimento Araujo', email: 'felipe.araujo@aluno.edu.br', cpf: '100.200.300-11' },
  { nome: 'Camila Teixeira Gomes', email: 'camila.gomes@aluno.edu.br', cpf: '100.200.300-12' },
  { nome: 'Thiago Rodrigues Alves', email: 'thiago.alves@aluno.edu.br', cpf: '100.200.300-13' },
  { nome: 'Isabela Cristina Freitas', email: 'isabela.freitas@aluno.edu.br', cpf: '100.200.300-14' },
  { nome: 'Gustavo Henrique Melo', email: 'gustavo.melo@aluno.edu.br', cpf: '100.200.300-15' },
  { nome: 'Amanda Ribeiro Moreira', email: 'amanda.moreira@aluno.edu.br', cpf: '100.200.300-16' },
  { nome: 'Matheus Oliveira Cardoso', email: 'matheus.cardoso@aluno.edu.br', cpf: '100.200.300-17' },
  { nome: 'Fernanda Castro Lopes', email: 'fernanda.lopes@aluno.edu.br', cpf: '100.200.300-18' },
  { nome: 'Vinicius Almeida Moraes', email: 'vinicius.moraes@aluno.edu.br', cpf: '100.200.300-19' },
  { nome: 'Mariana Souza Pinto', email: 'mariana.pinto@aluno.edu.br', cpf: '100.200.300-20' },
  { nome: 'Leonardo Santos Goncalves', email: 'leonardo.goncalves@aluno.edu.br', cpf: '100.200.300-21' },
  { nome: 'Rafaela Martins Nunes', email: 'rafaela.nunes@aluno.edu.br', cpf: '100.200.300-22' },
  { nome: 'Diego Costa Barbosa', email: 'diego.barbosa@aluno.edu.br', cpf: '100.200.300-23' },
  { nome: 'Tatiane Lima Campos', email: 'tatiane.campos@aluno.edu.br', cpf: '100.200.300-24' },
  { nome: 'Bruno Rocha Teixeira', email: 'bruno.teixeira@aluno.edu.br', cpf: '100.200.300-25' },
  { nome: 'Aline Pereira Ribeiro', email: 'aline.ribeiro@aluno.edu.br', cpf: '100.200.300-26' },
  { nome: 'Eduardo Silva Machado', email: 'eduardo.machado@aluno.edu.br', cpf: '100.200.300-27' },
  { nome: 'Jessica Oliveira Souza', email: 'jessica.souza@aluno.edu.br', cpf: '100.200.300-28' },
  { nome: 'Rodrigo Nascimento Santos', email: 'rodrigo.santos@aluno.edu.br', cpf: '100.200.300-29' },
  { nome: 'Vanessa Almeida Castro', email: 'vanessa.castro@aluno.edu.br', cpf: '100.200.300-30' },
];

const CANDIDATOS = [
  { nome: 'Andre Luis Fernandes', email: 'andre.fernandes@email.com', cpf: '300.400.500-01' },
  { nome: 'Sabrina Goncalves Dias', email: 'sabrina.dias@email.com', cpf: '300.400.500-02' },
  { nome: 'Paulo Henrique Barbosa', email: 'paulo.barbosa@email.com', cpf: '300.400.500-03' },
  { nome: 'Renata Carvalho Neves', email: 'renata.neves@email.com', cpf: '300.400.500-04' },
  { nome: 'Fabio Roberto Alves', email: 'fabio.alves@email.com', cpf: '300.400.500-05' },
];

// ===================================================================
const CURSOS_DATA = [
  { nome: 'Administracao', tipo: 'Bacharelado', turno: 'Noturno', duracao: 8, disciplinas: ['Gestao Empresarial', 'Marketing Digital', 'Contabilidade Geral', 'Direito Empresarial', 'Gestao de Pessoas', 'Financas Corporativas'] },
  { nome: 'Tecnologia da Informacao', tipo: 'Tecnologo', turno: 'Matutino', duracao: 6, disciplinas: ['Programacao Web', 'Banco de Dados', 'Redes de Computadores', 'Seguranca da Informacao', 'Engenharia de Software', 'Inteligencia Artificial'] },
  { nome: 'Enfermagem', tipo: 'Bacharelado', turno: 'Integral', duracao: 10, disciplinas: ['Anatomia Humana', 'Farmacologia', 'Saude Coletiva', 'Enfermagem Clinica', 'Bioetica', 'Urgencia e Emergencia'] },
  { nome: 'Pedagogia', tipo: 'Licenciatura', turno: 'Noturno', duracao: 8, disciplinas: ['Psicologia da Educacao', 'Didatica Geral', 'Fundamentos da Educacao', 'Alfabetizacao e Letramento', 'Educacao Inclusiva', 'Gestao Escolar'] },
];

function criarTurmaNome(cursoNome, ano, turno) {
  const mapT = { 'Matutino': 'A', 'Vespertino': 'B', 'Noturno': 'C', 'Integral': 'D' };
  return cursoNome.substring(0, 4).toUpperCase() + ano.toString().slice(-2) + (mapT[turno] || 'A');
}

// ===================================================================
async function main() {
  console.log('=== SEED 5K — DADOS REALISTAS ===\n');

  // ----- DELETE EXISTING -----
  console.log('Deletando dados existentes...');
  const delTables = ['financeiro', 'planos_aula', 'planos_ensino', 'frequencia', 'historico_escolar', 'horarios', 'atendimentos', 'auditoria', 'reclamacoes', 'matriculas', 'inscricoes', 'codigos_acesso', 'documentos', 'editais', 'agenda_eventos'];
  for (const t of delTables) { await deleteAll(t); console.log('  Deletados registros de ' + t); }
  await supabase.from('unidades').delete().neq('id', 0);
  await supabase.from('cursos').delete().neq('id', 0);
  await supabase.from('turmas').delete().neq('id', 0);
  await supabase.from('disciplinas').delete().neq('id', 0);
  await supabase.from('usuarios').delete().gt('id', 10);
  console.log('  Dados existentes removidos.\n');

  // ----- 1. UNIDADE -----
  console.log('1. Criando unidade...');
  const { data: unidade } = await supabase.from('unidades').insert({ nome: 'Escola Modelo SIGE', cnpj: '12.345.678/0001-90', cidade: 'Sao Paulo', estado: 'SP' }).select().single();
  console.log('  [OK] Unidade ID ' + unidade.id + '\n');

  // ----- 2. USUARIOS -----
  console.log('2. Criando usuarios (professores, alunos, candidatos)...');
  let batch = [];
  for (const p of PROFESSORES) {
    batch.push({ nome_completo: p.nome, email: p.email, senha: '$2a$10$dummyhash', cpf: p.cpf, role: 'ROLE_TEACHER', id_cargo: 4 });
  }
  await insertBatch('usuarios', batch);
  const { data: professores } = await supabase.from('usuarios').select('id').in('email', PROFESSORES.map(p => p.email));
  const profIds = onlyId(professores || []);
  console.log('  [OK] ' + profIds.length + ' professores');

  batch = [];
  for (const a of ALUNOS) {
    batch.push({ nome_completo: a.nome, email: a.email, senha: '$2a$10$dummyhash', cpf: a.cpf, role: 'ROLE_STUDENT', id_cargo: 5 });
  }
  await insertBatch('usuarios', batch);
  const { data: alunos } = await supabase.from('usuarios').select('id').in('email', ALUNOS.map(a => a.email));
  const alunoIds = onlyId(alunos || []);
  console.log('  [OK] ' + alunoIds.length + ' alunos');

  batch = [];
  for (const c of CANDIDATOS) {
    batch.push({ nome_completo: c.nome, email: c.email, senha: '$2a$10$dummyhash', cpf: c.cpf, role: 'ROLE_USER', id_cargo: 6 });
  }
  await insertBatch('usuarios', batch);
  const { data: candidatos } = await supabase.from('usuarios').select('id').in('email', CANDIDATOS.map(c => c.email));
  const candidatoIds = onlyId(candidatos || []);
  console.log('  [OK] ' + candidatoIds.length + ' candidatos\n');

  // ----- 3. CURSOS -----
  console.log('3. Criando cursos...');
  const cursoInfos = [];
  for (const c of CURSOS_DATA) {
    const { data: curso } = await supabase.from('cursos').insert({ id_unidade: unidade.id, nome_curso: c.nome, tipo: c.tipo, turno: c.turno, duracao_meses: c.duracao, status: 'ATIVO' }).select().single();
    cursoInfos.push({ ...c, id: curso.id });
    console.log('  [OK] Curso: ' + c.nome + ' (ID ' + curso.id + ')');
  }

  // ----- 4. DISCIPLINAS -----
  console.log('\n4. Criando disciplinas...');
  const todasDisciplinas = [];
  for (const ci of cursoInfos) {
    for (let s = 0; s < ci.disciplinas.length; s++) {
      const { data: d } = await supabase.from('disciplinas').insert({ nome: ci.disciplinas[s], codigo: ci.nome.substring(0, 3).toUpperCase() + (s + 1) * 100, carga_horaria: 60 + Math.floor(Math.random() * 20) * 10, id_curso: ci.id, semestre: Math.floor(s / 3) + 1 }).select().single();
      todasDisciplinas.push({ id: d.id, id_curso: ci.id, nome: d.nome, semestre: d.semestre });
    }
  }
  console.log('  [OK] ' + todasDisciplinas.length + ' disciplinas criadas');

  // ----- 5. TURMAS -----
  console.log('\n5. Criando turmas...');
  const turmas = [];
  for (const ci of cursoInfos) {
    const qtd = ci.nome === 'Enfermagem' ? 2 : 1;
    for (let t = 0; t < qtd; t++) {
      const nomeTurma = criarTurmaNome(ci.nome, 2026, ci.turno) + (qtd > 1 ? String.fromCharCode(65 + t) : '');
      const { data: turma } = await supabase.from('turmas').insert({ nome: nomeTurma, id_curso: ci.id, ano: 2026, turno: ci.turno, vagas: 40, status: 'ATIVO' }).select().single();
      turmas.push({ id: turma.id, id_curso: ci.id, nome: nomeTurma, turno: ci.turno });
    }
  }
  console.log('  [OK] ' + turmas.length + ' turmas criadas');

  function discDoCurso(cursoId) {
    return todasDisciplinas.filter(d => d.id_curso === cursoId);
  }

  // ----- 6. INSCRICOES -----
  console.log('\n6. Criando inscricoes (candidatos)...');
  batch = [];
  for (const cid of candidatoIds) {
    const curso = aleatorio(cursoInfos);
    batch.push({ id_usuario: cid, id_curso: curso.id, status_aprovacao: 'APROVADO', escolaridade_declarada: 'Ensino Medio Completo', data_inscricao: dataEntre('2026-01-01', '2026-02-28') });
  }
  // Tambem inscreve alguns alunos
  for (let i = 0; i < 10; i++) {
    const curso = aleatorio(cursoInfos);
    batch.push({ id_usuario: alunoIds[i], id_curso: curso.id, status_aprovacao: 'APROVADO', escolaridade_declarada: 'Ensino Medio Completo', data_inscricao: dataEntre('2026-01-01', '2026-02-28') });
  }
  await insertBatch('inscricoes', batch);
  const { data: inscricoes } = await supabase.from('inscricoes').select('id, id_usuario, id_curso');
  console.log('  [OK] ' + (inscricoes || []).length + ' inscricoes');

  // ----- 7. MATRICULAS -----
  console.log('\n7. Criando matriculas...');
  batch = [];
  // Matricula alunos ativos (25 students)
  const ativos = alunoIds.slice(0, 25);
  for (let i = 0; i < ativos.length; i++) {
    const uid = ativos[i];
    const cursoId = (i < 7) ? cursoInfos[0].id : (i < 14) ? cursoInfos[1].id : (i < 20) ? cursoInfos[2].id : cursoInfos[3].id;
    const turma = turmas.filter(t => t.id_curso === cursoId)[0];
    const numMat = 'MAT-' + String(uid).padStart(4, '0');
    batch.push({ id_usuario: uid, id_turma: turma ? turma.id : null, id_curso: cursoId, data_matricula: dataEntre('2026-01-15', '2026-02-10'), numero_matricula: numMat, status: 'ATIVO' });
  }
  // Alunos concluidos (5)
  for (let i = 25; i < 30; i++) {
    const uid = alunoIds[i];
    const cursoId = (i < 27) ? cursoInfos[0].id : (i < 28) ? cursoInfos[2].id : cursoInfos[3].id;
    const numMat = 'MAT-' + String(uid).padStart(4, '0');
    batch.push({ id_usuario: uid, id_curso: cursoId, data_matricula: dataEntre('2024-01-15', '2024-02-10'), numero_matricula: numMat, status: 'CONCLUIDO', data_conclusao: dataEntre('2025-11-01', '2025-12-15') });
  }
  await insertBatch('matriculas', batch);
  const { data: todasMatriculas } = await supabase.from('matriculas').select('id, id_usuario, id_curso, status');
  const matriculas = todasMatriculas || [];
  console.log('  [OK] ' + matriculas.length + ' matriculas');

  // ----- 8. HORARIOS -----
  console.log('\n8. Criando horarios...');
  batch = [];
  const diasSemana = [1, 2, 3, 4, 5];
  for (const turma of turmas) {
    const disc = discDoCurso(turma.id_curso);
    for (let d = 0; d < diasSemana.length && d < disc.length; d++) {
      batch.push({ id_turma: turma.id, id_disciplina: disc[d].id, id_professor: aleatorio(profIds), dia_semana: diasSemana[d], hora_inicio: turma.turno === 'Noturno' ? '19:00' : (turma.turno === 'Matutino' ? '08:00' : '14:00'), hora_fim: turma.turno === 'Noturno' ? '22:00' : (turma.turno === 'Matutino' ? '11:00' : '17:00'), local: 'Sala ' + (100 + (turma.id % 10) + d) });
    }
  }
  await insertBatch('horarios', batch);
  console.log('  [OK] ' + batch.length + ' horarios');

  // ----- 9. HISTORICO ESCOLAR -----
  console.log('\n9. Criando historico escolar...');
  batch = [];
  for (const mat of matriculas) {
    if (mat.status !== 'ATIVO' && mat.status !== 'CONCLUIDO') continue;
    const disc = discDoCurso(mat.id_curso);
    for (const d of disc) {
      const nota = d.semestre <= 2 ? notaRealista() : null;
      const freqPerc = 70 + Math.floor(Math.random() * 30);
      const histStatus = (nota && nota >= 6) ? 'APROVADO' : (nota && nota < 6) ? 'REPROVADO' : 'CURSANDO';
      if (!nota) continue;
      batch.push({ id_matricula: mat.id, id_disciplina: d.id, id_professor: aleatorio(profIds), nota_final: nota, frequencia_percentual: freqPerc, status: histStatus, ano: mat.status === 'CONCLUIDO' ? 2024 : 2026, semestre: d.semestre });
    }
  }
  await insertBatch('historico_escolar', batch);
  console.log('  [OK] ' + batch.length + ' registros de historico');

  // ----- 10. FREQUENCIA -----
  console.log('\n10. Criando frequencia...');
  batch = [];
  for (const mat of matriculas) {
    if (mat.status !== 'ATIVO') continue;
    const disc = discDoCurso(mat.id_curso);
    for (const d of disc) {
      for (let a = 0; a < 20; a++) {
        const dataAula = new Date(2026, 2, 1 + a * 7);
        if (dataAula > new Date(2026, 10, 30)) break;
        batch.push({ id_matricula: mat.id, id_disciplina: d.id, data_aula: dataAula.toISOString().split('T')[0], presenca: Math.random() > 0.15 });
      }
    }
  }
  await insertBatch('frequencia', batch);
  console.log('  [OK] ' + batch.length + ' registros de frequencia');

  // ----- 11. PLANOS DE ENSINO -----
  console.log('\n11. Criando planos de ensino...');
  batch = [];
  for (const d of todasDisciplinas) {
    batch.push({ id_disciplina: d.id, id_professor: aleatorio(profIds), carga_horaria: 80, ementa: 'Estudo dos fundamentos de ' + d.nome, objetivos_gerais: 'Compreender os conceitos fundamentais.', objetivos_especificos: 'Aplicar os conhecimentos na pratica.', conteudo_programatico: JSON.stringify(['Introducao', 'Desenvolvimento', 'Conclusao']), metodologia_geral: 'Aulas expositivas e praticas' });
  }
  await insertBatch('planos_ensino', batch);
  console.log('  [OK] ' + batch.length + ' planos de ensino');

  // ----- 12. DOCUMENTOS -----
  console.log('\n12. Criando documentos dos alunos...');
  batch = [];
  const docNomes = ['RG', 'CPF', 'Comprovante de Residencia', 'Historico Escolar', 'Diploma', 'Certidao de Nascimento', 'Foto 3x4'];
  for (const uid of ativos) {
    for (let d = 0; d < 3 + Math.floor(Math.random() * 3); d++) {
      const status = Math.random() > 0.7 ? 'PENDENTE' : (Math.random() > 0.5 ? 'APROVADO' : 'APROVADO');
      batch.push({ id_usuario: uid, nome: aleatorio(docNomes) + ' - ' + uid + '-' + d, tipo: 'pdf', arquivo_url: '/uploads/documentos/doc-' + uid + '-' + d + '.pdf', data_envio: dataEntre('2026-01-01', '2026-03-15'), status });
    }
  }
  await insertBatch('documentos', batch);
  console.log('  [OK] ' + batch.length + ' documentos');

  // ----- 13. FINANCEIRO -----
  console.log('\n13. Criando financeiro (mensalidades)...');
  batch = [];
  for (const uid of ativos) {
    for (let m = 1; m <= 6; m++) {
      const isPago = m < 4 && Math.random() > 0.1;
      const status = isPago ? 'PAGO' : (m < 4 ? 'PENDENTE' : 'VENCIDO');
      const venc = new Date(2026, m - 1, 10);
      const pagto = isPago ? new Date(venc.getTime() - Math.floor(Math.random() * 5) * DAY).toISOString().split('T')[0] : null;
      const valor = 600 + Math.floor(Math.random() * 900);
      batch.push({ id_usuario: uid, descricao: 'Mensalidade ' + String(m).padStart(2, '0') + '/2026', tipo: 'MENSALIDADE', valor, data_vencimento: venc.toISOString().split('T')[0], data_pagamento: pagto, status, mes_referencia: m, ano_referencia: 2026 });
    }
  }
  await insertBatch('financeiro', batch);
  console.log('  [OK] ' + batch.length + ' registros financeiros');

  // ----- 14. RECLAMACOES -----
  console.log('\n14. Criando reclamacoes...');
  batch = [];
  const reclamacoes = [
    { assunto: 'Problema com acesso ao portal', descricao: 'Nao consigo acessar minhas notas pelo portal.' },
    { assunto: 'Atraso na entrega de documentos', descricao: 'Solicitei meu historico ha 15 dias e ainda nao ficou pronto.' },
    { assunto: 'Horario de aula alterado', descricao: 'A disciplina de Programacao Web teve o horario alterado sem aviso previo.' },
    { assunto: 'Requerimento de revisao de nota', descricao: 'Gostaria de solicitar revisao da nota final de Anatomia.' },
    { assunto: 'Problema com boleto', descricao: 'O boleto da mensalidade nao esta disponivel para download.' },
    { assunto: 'Sugestao de melhoria na biblioteca', descricao: 'Sugiro aumentar o acervo de livros de Administracao.' },
    { assunto: 'Erro no registro de frequencia', descricao: 'Minha presenca do dia 15/03 nao foi registrada.' },
    { assunto: 'Duvida sobre matricula', descricao: 'Preciso de informacoes sobre trancamento de matricula.' },
  ];
  for (const r of reclamacoes) {
    const aluno = aleatorio(ativos);
    batch.push({ id_usuario: aluno, protocolo: 'PROT-' + Date.now() + '-' + String(Math.random()).slice(2, 6), categoria: 'ACADEMICO', assunto: r.assunto, descricao: r.descricao, prioridade: 'NORMAL', status: Math.random() > 0.5 ? 'PENDENTE' : 'RESOLVIDO', data_abertura: dataEntre('2026-02-01', '2026-04-30') });
  }
  await insertBatch('reclamacoes', batch);
  console.log('  [OK] ' + batch.length + ' reclamacoes');

  // ----- 15. AGENDA EVENTOS -----
  console.log('\n15. Criando agenda de eventos...');
  batch = [];
  const eventos = [
    { titulo: 'Inicio das Aulas 2026', tipo: 'CALENDARIO' }, { titulo: 'Semana de Provas - 1 Bimestre', tipo: 'PROVA' },
    { titulo: 'Feriado - Carnaval', tipo: 'FERIADO' }, { titulo: 'Feriado - Pascoa', tipo: 'FERIADO' },
    { titulo: 'Recesso Escolar Julho', tipo: 'RECESSO' }, { titulo: 'Semana de Provas - 2 Bimestre', tipo: 'PROVA' },
    { titulo: 'Feriado - Independencia', tipo: 'FERIADO' }, { titulo: 'Feriado - Finados', tipo: 'FERIADO' },
    { titulo: 'Encerramento do Ano Letivo', tipo: 'CALENDARIO' }, { titulo: 'Formatura 2026', tipo: 'EVENTO' },
    { titulo: 'Feira de Profissoes', tipo: 'EVENTO' }, { titulo: 'Palestra - Mercado de Trabalho', tipo: 'EVENTO' },
  ];
  for (const ev of eventos) {
    const dtInicio = dataEntre('2026-02-01', '2026-12-15');
    const dtFim = new Date(new Date(dtInicio).getTime() + 86400000).toISOString().split('T')[0];
    batch.push({ titulo: ev.titulo, descricao: ev.titulo + ' - evento academico.', data_inicio: dtInicio, data_fim: dtFim, tipo: ev.tipo, publico: true });
  }
  await insertBatch('agenda_eventos', batch);
  console.log('  [OK] ' + batch.length + ' eventos');

  // ----- 16. EDITAIS -----
  console.log('\n16. Criando editais...');
  batch = [];
  const editais = [
    { titulo: 'Processo Seletivo 2026.1 - Vagas Remanescentes', ativo: true },
    { titulo: 'Edital de Bolsas de Estudo 2026', ativo: true },
    { titulo: 'Edital de Monitoria 2026', ativo: true },
    { titulo: 'Edital de Iniciacao Cientifica', ativo: false },
    { titulo: 'Processo Seletivo Simplificado para Docentes', ativo: true },
    { titulo: 'Edital de Transferencia Externa 2026.2', ativo: true },
  ];
  for (const e of editais) batch.push({ titulo: e.titulo, url: '/editais/' + e.titulo.toLowerCase().replace(/\s+/g, '-'), ativo: e.ativo });
  await insertBatch('editais', batch);
  console.log('  [OK] ' + batch.length + ' editais');

  // ----- 17. CODIGOS DE ACESSO -----
  console.log('\n17. Criando codigos de acesso (catraca)...');
  batch = [];
  for (let i = 0; i < 30 && i < ativos.length; i++) {
    const usado = Math.random() > 0.5;
    const criado = new Date(NOW - Math.floor(Math.random() * 30) * DAY);
    batch.push({ id_usuario: ativos[i], codigo: String(100000 + i).slice(-6), criado_em: criado.toISOString(), expira_em: new Date(criado.getTime() + DAY).toISOString(), usado, validado_em: usado ? new Date(criado.getTime() + 60000).toISOString() : null });
  }
  await insertBatch('codigos_acesso', batch);
  console.log('  [OK] ' + batch.length + ' codigos de acesso');

  // ----- 18. ATENDIMENTOS -----
  console.log('\n18. Criando atendimentos agendados...');
  batch = [];
  for (let i = 0; i < 10; i++) {
    const aluno = aleatorio(ativos);
    const dataAtend = new Date(Date.now() + (1 + Math.floor(Math.random() * 30)) * DAY);
    batch.push({ id_usuario: aluno, id_responsavel: aleatorio(profIds), tipo: 'ORIENTACAO', data_atendimento: dataAtend.toISOString().split('T')[0], hora: String(8 + Math.floor(Math.random() * 10)).padStart(2, '0') + ':00', status: 'AGENDADO', observacoes: 'Atendimento academico agendado.' });
  }
  await insertBatch('atendimentos', batch);
  console.log('  [OK] ' + batch.length + ' atendimentos\n');

  // ----- RESUMO -----
  console.log('=== RESUMO FINAL ===');
  const tables = ['inscricoes', 'matriculas', 'historico_escolar', 'frequencia', 'horarios', 'reclamacoes', 'atendimentos', 'planos_ensino', 'documentos', 'editais', 'agenda_eventos', 'codigos_acesso', 'financeiro'];
  let totalGeral = 0;
  for (const t of tables) {
    const r = await fetch(supabaseUrl + '/rest/v1/' + t + '?select=id&limit=0', { headers: { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey, 'Prefer': 'count=exact' } });
    let c = 0;
    if (r.ok) { const cr = r.headers.get('content-range'); if (cr) c = parseInt(cr.split('/')[1], 10); }
    console.log('  ' + t.padEnd(20) + c);
    totalGeral += c;
  }
  console.log('  ' + ''.padEnd(20) + '---');
  console.log('  ' + 'TOTAL GERAL'.padEnd(20) + totalGeral);
  console.log('\nSeed concluido com sucesso!');
}

main().catch(e => { console.error('ERRO FATAL:', e); process.exit(1); });

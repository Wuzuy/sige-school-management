const { createClient } = require('@supabase/supabase-js');
const supabaseUrl2 = 'https://seu-projeto.supabase.co';
const serviceKey = 'SUA_CHAVE_SERVICE_ROLE';

const supabase = createClient(supabaseUrl2, serviceKey);
const headers = { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' };

const DAY = 86400000;
const BATCH = 100;
const NOW = Date.now();

async function insertBatch(table, rows) {
  if (rows.length === 0) return 0;
  const r = await fetch(supabaseUrl2 + '/rest/v1/' + table, { method: 'POST', headers, body: JSON.stringify(rows) });
  if (!r.ok) { const t = await r.text(); console.error('INSERT ' + table + ' ERROR:', t.substring(0, 200)); return 0; }
  return rows.length;
}

async function countRows(table) {
  const r = await fetch(supabaseUrl2 + '/rest/v1/' + table + '?select=id', { headers: { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey } });
  if (!r.ok) return 0;
  return (await r.json()).length;
}

// Gera data com padrao sazonal (picos em jan-fev e jul-ago, vales em dez e jun)
function dataSazonal(diasAtras, pico1Centro, pico2Centro) {
  // pico1Centro = dia do ano do primeiro pico (ex: 15 = ~15 jan)
  // pico2Centro = dia do ano do segundo pico (ex: 198 = ~15 jul)
  const diaDoAno = Math.floor(Math.random() * 365);
  const proximidadePico1 = Math.max(0, 30 - Math.abs(diaDoAno - pico1Centro));
  const proximidadePico2 = Math.max(0, 30 - Math.abs(diaDoAno - pico2Centro));
  const peso = Math.max(0.1, (proximidadePico1 + proximidadePico2) / 15);
  const variacao = Math.floor(Math.random() * Math.max(1, diasAtras * (1 - peso * 0.6)));
  return new Date(NOW - variacao * DAY).toISOString();
}

function dataEntre(ini, fim) {
  const start = new Date(ini).getTime();
  const end = new Date(fim).getTime();
  return new Date(start + Math.random() * (end - start)).toISOString().split('T')[0];
}

function aleatorio(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function notaRealista() {
  // distribui notas com pico entre 6-9, alguns abaixo de 6 (reprovados ~15%)
  if (Math.random() < 0.15) return +(5 + Math.random() * 1.5).toFixed(1); // reprovado
  return +(6 + Math.random() * 3.5).toFixed(1);
}

async function main() {
  console.log('=== POPULARIZACAO DE DADOS REALISTA ===\n');

  // Buscar dados existentes
  const rCursos = await fetch(supabaseUrl2 + '/rest/v1/cursos?select=id', { headers: { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey } });
  const cursos = (await rCursos.json()).map(c => c.id);
  const rTurmas = await fetch(supabaseUrl2 + '/rest/v1/turmas?select=id,id_curso', { headers: { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey } });
  const turmas = await rTurmas.json();
  const rDisciplinas = await fetch(supabaseUrl2 + '/rest/v1/disciplinas?select=id,id_curso', { headers: { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey } });
  const disciplinas = await rDisciplinas.json();
  const rProfessores = await fetch(supabaseUrl2 + '/rest/v1/usuarios?select=id&role=eq.ROLE_TEACHER', { headers: { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey } });
  const professores = (await rProfessores.json()).map(p => p.id);
  const rAlunos = await fetch(supabaseUrl2 + '/rest/v1/usuarios?select=id&role=eq.ROLE_STUDENT', { headers: { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey } });
  const estudantes = (await rAlunos.json()).map(a => a.id);

  if (!cursos.length || !turmas.length || !disciplinas.length || !professores.length || !estudantes.length) {
    console.error('[ERRO] Dados base insuficientes. Execute seed.sql primeiro.');
    process.exit(1);
  }

  console.log(`Base: ${cursos.length} cursos, ${turmas.length} turmas, ${disciplinas.length} disciplinas, ${professores.length} professores, ${estudantes.length} estudantes\n`);

  // ============================================================
  // 1. INSCRICOES (~140 com picos sazonais)
  // ============================================================
  console.log('=== 1. Gerando inscricoes (~140) ===');
  const statusInsc = ['EM_ANALISE', 'APROVADO', 'RECUSADO'];
  const escolaridades = ['fundamental-completo','medio-incompleto','medio-completo','superior-incompleto','superior-completo'];
  const cursosPorUnidade = {};

  let batch = [];
  let total = 0;
  const inscExist = await countRows('inscricoes');

  for (let i = 0; i < 140; i++) {
    const curso = aleatorio(cursos);
    const alunoId = aleatorio(estudantes);
    const diasAtras = Math.floor(Math.random() * 365);
    const dtInsc = new Date(NOW - diasAtras * DAY).toISOString().split('T')[0];
    const status = aleatorio(statusInsc);

    batch.push({
      id_usuario: alunoId,
      id_curso: curso,
      data_inscricao: dtInsc,
      status_aprovacao: status,
      escolaridade_declarada: aleatorio(escolaridades),
      nome_completo_inscricao: 'Candidato ' + (i + 1),
      cpf_inscricao: String(100 + i).padStart(3,'0') + '.' + String(200 + i).padStart(3,'0') + '.' + String(300 + i).padStart(3,'0') + '-0' + (i % 9 + 1),
      telefone_inscricao: '(11) 9' + String(8000 + i).padStart(4,'0') + '-' + String(4000 + i).padStart(4,'0'),
      email_inscricao: 'candidato' + (i + 1) + '@email.com',
      data_nascimento_inscricao: dataEntre('1995-01-01', '2005-12-31'),
      consentimento_lgpd: true
    });

    if (batch.length >= BATCH) { total += await insertBatch('inscricoes', batch); batch = []; }
  }
  if (batch.length) total += await insertBatch('inscricoes', batch);
  console.log(`  [OK] ${total} inscricoes\n`);

  // ============================================================
  // 2. MATRICULAS (~85, algumas trancadas)
  // ============================================================
  console.log('=== 2. Gerando matriculas (~85) ===');
  const statusMat = ['ATIVO', 'ATIVO', 'ATIVO', 'TRANCADO', 'CONCLUIDO'];
  const matExist = await countRows('matriculas');
  batch = [];
  let totalMat = 0;

  for (let i = 0; i < 85; i++) {
    const turma = aleatorio(turmas);
    const alunoId = aleatorio(estudantes);
    const diasAtras = Math.floor(Math.random() * 300);
    const dtMat = new Date(NOW - diasAtras * DAY).toISOString().split('T')[0];
    const status = aleatorio(statusMat);

    batch.push({
      id_usuario: alunoId,
      id_turma: turma.id,
      id_curso: turma.id_curso,
      data_matricula: dtMat,
      numero_matricula: 'MAT-' + (2025 + Math.floor(Math.random() * 2)) + '-' + String(i + 1 + matExist).padStart(4, '0'),
      status
    });

    if (batch.length >= BATCH) { totalMat += await insertBatch('matriculas', batch); batch = []; }
  }
  if (batch.length) totalMat += await insertBatch('matriculas', batch);
  console.log(`  [OK] ${totalMat} matriculas\n`);

  // ============================================================
  // 3. HISTORICO ESCOLAR (~180 com notas realistas)
  // ============================================================
  console.log('=== 3. Gerando historico escolar (~180) ===');
  const rMatriculas = await fetch(supabaseUrl2 + '/rest/v1/matriculas?select=id', { headers: { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey } });
  const mats = (await rMatriculas.json()).map(m => m.id);
  batch = [];
  let totalHist = 0;

  for (let i = 0; i < 180 && mats.length > 0; i++) {
    const matId = aleatorio(mats);
    const disc = aleatorio(disciplinas);
    const prof = aleatorio(professores);
    const nota = notaRealista();
    const freq = +(70 + Math.random() * 28).toFixed(1);
    const aprovado = nota >= 6 && freq >= 75;
    const statusH = aprovado ? 'APROVADO' : (nota < 4 ? 'REPROVADO' : 'RECUPERACAO');
    const ano = Math.random() > 0.5 ? 2025 : 2026;
    const semestre = Math.random() > 0.5 ? 1 : 2;

    batch.push({
      id_matricula: matId,
      id_disciplina: disc.id,
      id_professor: prof,
      nota_final: nota,
      frequencia_percentual: freq,
      status: statusH,
      ano,
      semestre
    });

    if (batch.length >= BATCH) { totalHist += await insertBatch('historico_escolar', batch); batch = []; }
  }
  if (batch.length) totalHist += await insertBatch('historico_escolar', batch);
  console.log(`  [OK] ${totalHist} registros\n`);

  // ============================================================
  // 4. FREQUENCIA (~180 com presenca variada)
  // ============================================================
  console.log('=== 4. Gerando frequencia (~180) ===');
  batch = [];
  let totalFreq = 0;

  for (let i = 0; i < 180 && mats.length > 0; i++) {
    const matId = aleatorio(mats);
    const disc = aleatorio(disciplinas);
    const diasAtras = Math.floor(Math.random() * 180);
    const dataAula = new Date(NOW - diasAtras * DAY).toISOString().split('T')[0];
    const presente = Math.random() < 0.85; // 85% presenca
    const justificativa = presente ? null : aleatorio(['Médico', 'Familiar', ''])
    batch.push({
      id_matricula: matId,
      id_disciplina: disc.id,
      data_aula: dataAula,
      presenca: presente,
      justificativa
    });

    if (batch.length >= BATCH) { totalFreq += await insertBatch('frequencia', batch); batch = []; }
  }
  if (batch.length) totalFreq += await insertBatch('frequencia', batch);
  console.log(`  [OK] ${totalFreq} registros\n`);

  // ============================================================
  // 5. RECLAMACOES (~85)
  // ============================================================
  console.log('=== 5. Gerando reclamacoes (~85) ===');
  const catgs = ['Secretaria','Acadêmico','Financeiro','Infraestrutura','Professores','Matrícula','Biblioteca','Transporte'];
  const assuntos = ['Erro no histórico escolar','Problema com acesso ao sistema','Atraso na entrega de documentos','Reclamação sobre professor','Problema na matrícula','Cobrança indevida','Problema no transporte','Falta de material na biblioteca','Horário de aulas','Divergência de notas','Atendimento da secretaria','Problema no laboratório','Falta de limpeza','Problema com uniforme','Acesso à plataforma EAD','Problema no estacionamento','Problema no estágio','Barulho em sala de aula','Problema na cantina'];
  const sts = ['PENDENTE','EM_ANDAMENTO','RESOLVIDA','FECHADA'];
  const prios = ['BAIXA','NORMAL','ALTA','URGENTE'];
  const recExist = await countRows('reclamacoes');
  batch = [];
  let totalRec = 0;

  for (let i = 0; i < 85; i++) {
    const alunoId = aleatorio(estudantes);
    const diasAtras = Math.floor(Math.random() * 180);
    const dtAbertura = new Date(NOW - diasAtras * DAY).toISOString().split('T')[0];
    const status = aleatorio(sts);
    const dtResolucao = (status === 'RESOLVIDA' || status === 'FECHADA')
      ? new Date(NOW - (diasAtras - Math.floor(Math.random() * 5) - 1) * DAY).toISOString().split('T')[0] : null;

    batch.push({
      id_usuario: alunoId,
      protocolo: 'PROT-' + String(i + 1 + recExist).padStart(6, '0'),
      categoria: aleatorio(catgs),
      assunto: aleatorio(assuntos),
      prioridade: aleatorio(prios),
      status,
      descricao: 'Descricao: ' + aleatorio(assuntos) + '. O aluno solicita providencias.',
      data_abertura: dtAbertura,
      data_resolucao: dtResolucao
    });

    if (batch.length >= BATCH) { totalRec += await insertBatch('reclamacoes', batch); batch = []; }
  }
  if (batch.length) totalRec += await insertBatch('reclamacoes', batch);
  console.log(`  [OK] ${totalRec} reclamacoes\n`);

  // ============================================================
  // 6. AUDITORIA (~180 registros realistas)
  // ============================================================
  console.log('=== 6. Gerando auditoria (~180) ===');
  const auditTipos = ['LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'VIEW'];
  const auditAcoes = {
    LOGIN: ['Usuario fez login no sistema','Usuario fez logout','Tentativa de login falhou'],
    CREATE: ['Criou inscricao','Cadastrou curso','Criou turma','Cadastrou usuario','Criou edital'],
    UPDATE: ['Atualizou inscricao','Editou dados do aluno','Alterou turma','Modificou nota','Atualizou frequencia'],
    DELETE: ['Removeu inscricao','Excluiu documento','Removeu reclamacao'],
    VIEW: ['Consultou historico','Visualizou relatorio','Acessou dashboard','Visualizou inscricoes']
  };
  const auditUsers = ['admin@sige.com.br', 'secretaria@sige.com.br', 'professor@sige.com.br', 'sistema@auto.com'];
  batch = [];
  let totalAudit = 0;

  for (let i = 0; i < 180; i++) {
    const tipo = aleatorio(auditTipos);
    const usuario = aleatorio(auditUsers);
    const acoes = auditAcoes[tipo];
    const acao = aleatorio(acoes) + (Math.random() > 0.6 ? ' ID: ' + Math.floor(Math.random() * 100 + 1) : '');
    const diasAtras = Math.floor(Math.random() * 120);
    const timestamp = new Date(NOW - diasAtras * DAY).toISOString();
    const detalhes = Math.random() > 0.4 ? 'Operacao via interface web' : '';

    batch.push({ timestamp, usuario, tipo, acao, detalhes });
    if (batch.length >= BATCH) { totalAudit += await insertBatch('auditoria', batch); batch = []; }
  }
  if (batch.length) totalAudit += await insertBatch('auditoria', batch);
  console.log(`  [OK] ${totalAudit} registros\n`);

  // ============================================================
  // 7. ATENDIMENTOS (~50)
  // ============================================================
  console.log('=== 7. Gerando atendimentos (~50) ===');
  const tiposAtend = ['Orientacao Academica','Documentacao','Suporte Financeiro','Suporte Tecnico','Matricula'];
  const statusAtend = ['AGENDADO','REALIZADO','CANCELADO','REAGENDADO'];
  batch = [];
  let totalAtend = 0;

  for (let i = 0; i < 50; i++) {
    const alunoId = aleatorio(estudantes);
    const secretarioId = aleatorio(estudantes);
    const diasAtras = Math.floor(Math.random() * 120);
    const dt = new Date(NOW - diasAtras * DAY);
    const status = aleatorio(statusAtend);

    batch.push({
      id_usuario: alunoId,
      id_responsavel: secretarioId,
      tipo: aleatorio(tiposAtend),
      data_atendimento: dt.toISOString().split('T')[0],
      hora: String(8 + Math.floor(Math.random() * 8)).padStart(2,'0') + ':' + String(Math.floor(Math.random() * 4) * 15).padStart(2,'0'),
      status,
      observacoes: Math.random() > 0.5 ? 'Atendimento realizado sem intercorrencias.' : null
    });

    if (batch.length >= BATCH) { totalAtend += await insertBatch('atendimentos', batch); batch = []; }
  }
  if (batch.length) totalAtend += await insertBatch('atendimentos', batch);
  console.log(`  [OK] ${totalAtend} atendimentos\n`);

  // ============================================================
  // RESUMO
  // ============================================================
  console.log('=== RESUMO FINAL ===');
  const tables = ['inscricoes','matriculas','historico_escolar','frequencia','reclamacoes','auditoria','atendimentos'];
  let totalGeral = 0;
  for (const t of tables) {
    const c = await countRows(t);
    console.log('  ' + t.padEnd(20) + c);
    totalGeral += c;
  }
  console.log('  ' + ''.padEnd(20) + '---');
  console.log('  ' + 'TOTAL'.padEnd(20) + totalGeral);
  console.log('\nConcluido!');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });

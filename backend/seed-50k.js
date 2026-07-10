const { createClient } = require('@supabase/supabase-js');
const supabaseUrl2 = 'https://seu-projeto.supabase.co';
const serviceKey = 'SUA_CHAVE_SERVICE_ROLE';

const supabase = createClient(supabaseUrl2, serviceKey);
const headers = { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' };

const DAY = 86400000;
const BATCH = 200;
const NOW = Date.now();

async function deleteAll(table) {
  let total = 0;
  while (true) {
    const r = await supabase.from(table).delete().neq('id', 0).limit(1000);
    if (r.error && r.error.code === 'PGRST116') break;
    if (r.error) { console.error('DELETE ' + table + ' ERROR:', r.error.message); break; }
    if (!r.data || r.data.length === 0) break;
    total += r.data.length;
    console.log('  Deletados ' + total + ' de ' + table);
  }
  return total;
}

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

function dataEntre(ini, fim) {
  const start = new Date(ini).getTime();
  const end = new Date(fim).getTime();
  return new Date(start + Math.random() * (end - start)).toISOString().split('T')[0];
}

function aleatorio(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function notaRealista() {
  if (Math.random() < 0.15) return +(5 + Math.random() * 1.5).toFixed(1);
  return +(6 + Math.random() * 3.5).toFixed(1);
}

function cpfCurto(i) {
  const n = 100 + (i % 899);
  return String(n).padStart(3,'0') + '.' + String(n).padStart(3,'0') + '.' + String(n).padStart(3,'0') + '-' + String(i % 9 + 1).padStart(2,'0');
}

const nomesM = ['Joao','Pedro','Carlos','Lucas','Gabriel','Rafael','Marcos','Felipe','Bruno','Diego','Thiago','Andre','Ricardo','Eduardo','Leonardo','Guilherme','Vinicius','Rodrigo','Fernando','Gustavo','Daniel','Jose','Antonio','Francisco','Paulo','Luis','Marcelo','Alexandre','Leandro','Sergio','Adriano','Igor','Leonardo','Fabio','Ramon','Samuel','Vitor','Julio','Roberto','Mauricio'];
const nomesF = ['Maria','Ana','Juliana','Fernanda','Camila','Larissa','Patricia','Amanda','Bruna','Carla','Daniela','Gabriela','Jessica','Leticia','Mariana','Nathalia','Rafaela','Tatiane','Vanessa','Aline','Beatriz','Cristina','Daniele','Eliane','Fabiana','Gisele','Helena','Isabela','Joana','Karina','Luciana','Milena','Renata','Sabrina','Tais','Valeria','Simone','Priscila','Raquel','Viviane'];
const sobrenomes = ['Silva','Santos','Oliveira','Souza','Costa','Pereira','Almeida','Nascimento','Lima','Araujo','Carvalho','Gomes','Martins','Barbosa','Ribeiro','Alves','Ferreira','Rodrigues','Moraes','Nunes','Correia','Dias','Teixeira','Cardoso','Cavalcanti','Melo','Castro','Rocha','Moreira','Monteiro','Freitas','Machado','Fernandes','Vieira','Lopes','Campos','Borges','Pinto','Mendes','Soares'];
function nomeRealistico(i) {
  const masc = (i % 2 === 0);
  const nome = masc ? nomesM[i % nomesM.length] : nomesF[i % nomesF.length];
  const sob1 = sobrenomes[i % sobrenomes.length];
  const sob2 = sobrenomes[(i * 3 + 7) % sobrenomes.length];
  return nome + ' ' + sob1 + ' ' + sob2;
}
function emailRealistico(i) {
  const masc = (i % 2 === 0);
  const nome = masc ? nomesM[i % nomesM.length] : nomesF[i % nomesF.length];
  return nome.toLowerCase() + '.' + sobrenomes[i % sobrenomes.length].toLowerCase() + '.' + (i + 1) + '@email.com';
}

async function main() {
  console.log('=== POPULACAO 50K REGISTROS ===\n');

  // Delete existing data
  console.log('=== Deletando dados existentes ===');
  const delTables = ['planos_aula', 'planos_ensino', 'frequencia', 'historico_escolar', 'atendimentos', 'auditoria', 'reclamacoes', 'matriculas', 'inscricoes'];
  for (const t of delTables) {
    console.log('  Deletando ' + t + '...');
    await deleteAll(t);
  }

  // Buscar dados base
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
    console.error('[ERRO] Dados base insuficientes.');
    process.exit(1);
  }

  console.log(`\nBase: ${cursos.length} cursos, ${turmas.length} turmas, ${disciplinas.length} disciplinas, ${professores.length} professores, ${estudantes.length} estudantes\n`);

  // 1. INSCRICOES (~8000)
  console.log('=== 1. Gerando inscricoes (~8000) ===');
  const statusInsc = ['EM_ANALISE', 'APROVADO', 'RECUSADO'];
  const escolaridades = ['fundamental-completo','medio-incompleto','medio-completo','superior-incompleto','superior-completo'];
  let batch = [];
  let total = 0;

  for (let i = 0; i < 8000; i++) {
    batch.push({
      id_usuario: aleatorio(estudantes),
      id_curso: aleatorio(cursos),
      data_inscricao: new Date(NOW - Math.floor(Math.random() * 365) * DAY).toISOString().split('T')[0],
      status_aprovacao: aleatorio(statusInsc),
      escolaridade_declarada: aleatorio(escolaridades),
      nome_completo_inscricao: nomeRealistico(i),
      cpf_inscricao: cpfCurto(i),
      telefone_inscricao: '(11) 9' + String(8000 + (i % 9999)).padStart(4,'0') + '-' + String(4000 + (i % 9999)).padStart(4,'0'),
      email_inscricao: emailRealistico(i),
      data_nascimento_inscricao: dataEntre('1995-01-01', '2005-12-31'),
      consentimento_lgpd: true
    });
    if (batch.length >= BATCH) { total += await insertBatch('inscricoes', batch); batch = []; }
  }
  if (batch.length) total += await insertBatch('inscricoes', batch);
  console.log('  [OK] ' + total + ' inscricoes\n');

  // 2. MATRICULAS (~5000)
  console.log('=== 2. Gerando matriculas (~5000) ===');
  const statusMat = ['ATIVO', 'ATIVO', 'ATIVO', 'TRANCADO', 'CONCLUIDO'];
  batch = [];
  let totalMat = 0;

  for (let i = 0; i < 5000; i++) {
    const turma = aleatorio(turmas);
    batch.push({
      id_usuario: aleatorio(estudantes),
      id_turma: turma.id,
      id_curso: turma.id_curso,
      data_matricula: new Date(NOW - Math.floor(Math.random() * 300) * DAY).toISOString().split('T')[0],
      numero_matricula: 'MAT-2026-' + String(i + 1).padStart(6, '0'),
      status: aleatorio(statusMat)
    });
    if (batch.length >= BATCH) { totalMat += await insertBatch('matriculas', batch); batch = []; }
  }
  if (batch.length) totalMat += await insertBatch('matriculas', batch);
  console.log('  [OK] ' + totalMat + ' matriculas\n');

  // Buscar matriculas para FK
  const rMats = await fetch(supabaseUrl2 + '/rest/v1/matriculas?select=id', { headers: { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey } });
  const mats = (await rMats.json()).map(m => m.id);

  // 3. HISTORICO ESCOLAR (~10000)
  console.log('=== 3. Gerando historico escolar (~10000) ===');
  batch = [];
  let totalHist = 0;

  for (let i = 0; i < 10000 && mats.length > 0; i++) {
    const nota = notaRealista();
    const freq = +(70 + Math.random() * 28).toFixed(1);
    const aprovado = nota >= 6 && freq >= 75;
    batch.push({
      id_matricula: aleatorio(mats),
      id_disciplina: aleatorio(disciplinas).id,
      id_professor: aleatorio(professores),
      nota_final: nota,
      frequencia_percentual: freq,
      status: aprovado ? 'APROVADO' : (nota < 4 ? 'REPROVADO' : 'RECUPERACAO'),
      ano: Math.random() > 0.5 ? 2025 : 2026,
      semestre: Math.random() > 0.5 ? 1 : 2
    });
    if (batch.length >= BATCH) { totalHist += await insertBatch('historico_escolar', batch); batch = []; }
  }
  if (batch.length) totalHist += await insertBatch('historico_escolar', batch);
  console.log('  [OK] ' + totalHist + ' registros\n');

  // 4. FREQUENCIA (~10000)
  console.log('=== 4. Gerando frequencia (~10000) ===');
  batch = [];
  let totalFreq = 0;

  for (let i = 0; i < 10000 && mats.length > 0; i++) {
    const presente = Math.random() < 0.85;
    batch.push({
      id_matricula: aleatorio(mats),
      id_disciplina: aleatorio(disciplinas).id,
      data_aula: new Date(NOW - Math.floor(Math.random() * 180) * DAY).toISOString().split('T')[0],
      presenca: presente,
      justificativa: presente ? null : aleatorio(['Medico', 'Familiar', ''])
    });
    if (batch.length >= BATCH) { totalFreq += await insertBatch('frequencia', batch); batch = []; }
  }
  if (batch.length) totalFreq += await insertBatch('frequencia', batch);
  console.log('  [OK] ' + totalFreq + ' registros\n');

  // 5. RECLAMACOES (~5000)
  console.log('=== 5. Gerando reclamacoes (~5000) ===');
  const catgs = ['Secretaria','Academico','Financeiro','Infraestrutura','Professores','Matricula','Biblioteca','Transporte'];
  const assuntos = ['Erro no historico escolar','Problema com acesso ao sistema','Atraso na entrega de documentos','Reclamacao sobre professor','Problema na matricula','Cobranca indevida','Problema no transporte','Falta de material na biblioteca','Horario de aulas','Divergencia de notas','Atendimento da secretaria','Problema no laboratorio','Falta de limpeza','Problema com uniforme','Acesso a plataforma EAD','Problema no estacionamento','Problema no estagio','Barulho em sala de aula','Problema na cantina'];
  const sts = ['PENDENTE','EM_ANDAMENTO','RESOLVIDA','FECHADA'];
  const prios = ['BAIXA','NORMAL','ALTA','URGENTE'];
  batch = [];
  let totalRec = 0;

  for (let i = 0; i < 5000; i++) {
    const diasAtras = Math.floor(Math.random() * 180);
    const status = aleatorio(sts);
    batch.push({
      id_usuario: aleatorio(estudantes),
      protocolo: 'PROT-' + String(i + 1).padStart(7, '0'),
      categoria: aleatorio(catgs),
      assunto: aleatorio(assuntos),
      prioridade: aleatorio(prios),
      status,
      descricao: 'Descricao: ' + aleatorio(assuntos) + '. O aluno solicita providencias.',
      data_abertura: new Date(NOW - diasAtras * DAY).toISOString().split('T')[0],
      data_resolucao: (status === 'RESOLVIDA' || status === 'FECHADA')
        ? new Date(NOW - (diasAtras - Math.floor(Math.random() * 5) - 1) * DAY).toISOString().split('T')[0] : null
    });
    if (batch.length >= BATCH) { totalRec += await insertBatch('reclamacoes', batch); batch = []; }
  }
  if (batch.length) totalRec += await insertBatch('reclamacoes', batch);
  console.log('  [OK] ' + totalRec + ' reclamacoes\n');

  // 6. AUDITORIA (~10000)
  console.log('=== 6. Gerando auditoria (~10000) ===');
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

  for (let i = 0; i < 10000; i++) {
    const tipo = aleatorio(auditTipos);
    const acoes = auditAcoes[tipo];
    batch.push({
      timestamp: new Date(NOW - Math.floor(Math.random() * 120) * DAY).toISOString(),
      usuario: aleatorio(auditUsers),
      tipo,
      acao: aleatorio(acoes) + (Math.random() > 0.6 ? ' ID: ' + Math.floor(Math.random() * 100 + 1) : ''),
      detalhes: Math.random() > 0.4 ? 'Operacao via interface web' : ''
    });
    if (batch.length >= BATCH) { totalAudit += await insertBatch('auditoria', batch); batch = []; }
  }
  if (batch.length) totalAudit += await insertBatch('auditoria', batch);
  console.log('  [OK] ' + totalAudit + ' registros\n');

  // 7. ATENDIMENTOS (~2000)
  console.log('=== 7. Gerando atendimentos (~2000) ===');
  const tiposAtend = ['Orientacao Academica','Documentacao','Suporte Financeiro','Suporte Tecnico','Matricula'];
  const statusAtend = ['AGENDADO','REALIZADO','CANCELADO','REAGENDADO'];
  batch = [];
  let totalAtend = 0;

  for (let i = 0; i < 2000; i++) {
    const dt = new Date(NOW - Math.floor(Math.random() * 120) * DAY);
    batch.push({
      id_usuario: aleatorio(estudantes),
      id_responsavel: aleatorio(estudantes),
      tipo: aleatorio(tiposAtend),
      data_atendimento: dt.toISOString().split('T')[0],
      hora: String(8 + Math.floor(Math.random() * 8)).padStart(2,'0') + ':' + String(Math.floor(Math.random() * 4) * 15).padStart(2,'0'),
      status: aleatorio(statusAtend),
      observacoes: Math.random() > 0.5 ? 'Atendimento realizado sem intercorrencias.' : null
    });
    if (batch.length >= BATCH) { totalAtend += await insertBatch('atendimentos', batch); batch = []; }
  }
  if (batch.length) totalAtend += await insertBatch('atendimentos', batch);
  console.log('  [OK] ' + totalAtend + ' atendimentos\n');

  // RESUMO
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

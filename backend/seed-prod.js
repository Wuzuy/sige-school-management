const { createClient } = require('@supabase/supabase-js');
const supabaseUrl2 = 'https://seu-projeto.supabase.co';
const serviceKey = 'SUA_CHAVE_SERVICE_ROLE';

const supabase = createClient(supabaseUrl2, serviceKey);
const headers = { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' };

async function execSQL(sql) {
  sql = sql.replace(/\s+/g, ' ').trim();
  // Try X-SQL header approach first (works with service_role key)
  const r = await fetch(supabaseUrl2 + '/rest/v1/', {
    method: 'POST',
    headers: { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey, 'Content-Type': 'application/json', 'Prefer': 'params=object', 'X-SQL': sql }
  });
  if (r.ok) return true;
  const txt = await r.text();
  // Try RPC fallback
  const { error } = await supabase.rpc('exec_sql', { query: sql });
  if (!error) return true;
  console.error('SQL ERROR:', txt.substring(0, 300));
  console.error('RPC ERROR:', (error.message || '').substring(0, 200));
  return false;
}

async function insertBatch(table, rows) {
  if (rows.length === 0) return 0;
  const r = await fetch(supabaseUrl2 + '/rest/v1/' + table, { method: 'POST', headers, body: JSON.stringify(rows) });
  if (!r.ok) { const t = await r.text(); console.error('INSERT ' + table + ' ERROR:', t.substring(0, 200)); return 0; }
  return rows.length;
}

async function countRows(table) {
  const r = await fetch(supabaseUrl2 + '/rest/v1/' + table + '?select=id', {
    headers: { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey }
  });
  if (!r.ok) return 0;
  return (await r.json()).length;
}

async function main() {
  // Step 1: Create auditoria table
  console.log('=== Creating auditoria table ===');
  const ok = await execSQL('CREATE TABLE IF NOT EXISTS auditoria (id SERIAL PRIMARY KEY, timestamp TIMESTAMP DEFAULT NOW(), usuario VARCHAR(200) NOT NULL, tipo VARCHAR(50) NOT NULL, acao TEXT NOT NULL, detalhes TEXT, created_at TIMESTAMP DEFAULT NOW())');
  if (!ok) { console.error('[FAIL] Create table failed'); process.exit(1); }
  console.log('  [OK] auditoria table');

  // Step 2: Generate ~6000 auditoria entries
  console.log('\n=== Generating auditoria entries ===');
  const tipos = ['CURSO', 'TURMA', 'CARGO', 'ALUNO', 'SISTEMA'];
  const usuarios = ['Ana Beatriz Oliveira', 'Carlos Eduardo Santos', 'Marina Fernandes Costa', 'Admin', 'Sistema'];
  const acoesPorTipo = {
    CURSO: ['Criou curso: Técnico em Informática','Editou curso: Técnico em Administração','Removeu curso: Técnico em Enfermagem','Ativou curso: Técnico em Logística','Desativou curso: Técnico em RH','Alterou carga horária do curso','Modificou pré-requisitos do curso'],
    TURMA: ['Criou turma: INF-M1-2026','Editou turma: ADM-V1','Removeu turma: LOG-V2','Alterou vagas da turma ENF-N1','Transferiu alunos da turma MEC-M1','Encerrou turma: ELE-V1','Reabriu turma: MKT-N2'],
    CARGO: ['Criou cargo: Coordenador Pedagógico','Editou cargo: Secretário','Removeu cargo: Auxiliar Administrativo','Alterou permissões do cargo','Atribuiu cargo a usuário','Criou cargo: Professor Titular'],
    ALUNO: ['Editou dados do aluno','Alterou turma do aluno','Resetou senha do aluno','Aprovou documento','Rejeitou documento','Removeu documento','Respondeu reclamação','Matriculou aluno','Trancou matrícula','Validou inscrição','Reprovou inscrição'],
    SISTEMA: ['Backup automático realizado','Sistema reiniciado para manutenção','Atualização de segurança aplicada','Configurações do sistema alteradas','Sincronização de bases concluída','Limpeza de cache executada']
  };
  const now = Date.now();
  const day = 86400000;
  const BATCH = 100;
  let totalAudit = 0;
  let batch = [];

  for (let i = 0; i < 6000; i++) {
    const tipo = tipos[i % tipos.length];
    const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
    const acoes = acoesPorTipo[tipo];
    const sufixo = Math.random() > 0.7 ? ' ID: ' + (Math.floor(Math.random() * 200) + 1) : '';
    const acao = acoes[Math.floor(Math.random() * acoes.length)] + sufixo;
    const detalhes = Math.random() > 0.4 ? 'Operação executada por ' + usuario + ' via interface web' : '';
    const offset = Math.floor(Math.random() * 60 * day);
    batch.push({ timestamp: new Date(now - offset).toISOString(), usuario, tipo, acao, detalhes });
    if (batch.length >= BATCH) { totalAudit += await insertBatch('auditoria', batch); batch = []; }
  }
  if (batch.length) totalAudit += await insertBatch('auditoria', batch);
  console.log('  [OK] ' + totalAudit + ' auditoria entries');

  // Step 3: Add reclamacoes (total ~250)
  console.log('\n=== Adding reclamacoes ===');
  const existing = await countRows('reclamacoes');
  console.log('  Current: ' + existing + ' reclamacoes');

  const catgs = ['Secretaria','Acadêmico','Financeiro','Infraestrutura','Professores','Matrícula','Biblioteca','Transporte'];
  const assuntos = ['Erro no histórico escolar','Problema com acesso ao sistema','Atraso na entrega de documentos','Reclamação sobre professor','Problema na matrícula','Cobrança indevida','Problema no transporte','Falta de material na biblioteca','Horário de aulas','Problema no estágio','Divergência de notas','Atendimento da secretaria','Problema no laboratório','Barulho em sala de aula','Falta de limpeza','Problema com uniforme','Acesso à plataforma EAD','Problema no estacionamento'];
  const sts = ['PENDENTE','EM_ANDAMENTO','RESOLVIDA','FECHADA'];
  const prios = ['BAIXA','NORMAL','ALTA','URGENTE'];

  const r = await fetch(supabaseUrl2 + '/rest/v1/usuarios?select=id&role=eq.ROLE_STUDENT', {
    headers: { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey }
  });
  const users = await r.json();
  const alunos = users.map(u => u.id);
  console.log('  Available students: ' + alunos.length);

  batch = [];
  let totalRec = 0;
  const target = Math.max(250, existing + 220);
  for (let i = existing + 1; i <= target; i++) {
    const alunoId = alunos[Math.floor(Math.random() * alunos.length)];
    const cat = catgs[Math.floor(Math.random() * catgs.length)];
    const assunto = assuntos[Math.floor(Math.random() * assuntos.length)];
    const prio = prios[Math.floor(Math.random() * prios.length)];
    const status = sts[Math.floor(Math.random() * sts.length)];
    const daysAgo = Math.floor(Math.random() * 180);
    const dtAbertura = new Date(now - daysAgo * day).toISOString().split('T')[0];
    const dtResolucao = (status === 'RESOLVIDA' || status === 'FECHADA')
      ? new Date(now - (daysAgo - Math.floor(Math.random() * 5) - 1) * day).toISOString().split('T')[0] : null;

    batch.push({
      id_usuario: alunoId, protocolo: 'PROT-' + String(i).padStart(6, '0'),
      categoria: cat, assunto, prioridade: prio, status,
      descricao: 'Descrição: ' + assunto + '. O aluno solicita providências.',
      data_abertura: dtAbertura, data_resolucao: dtResolucao
    });
    if (batch.length >= BATCH) { totalRec += await insertBatch('reclamacoes', batch); batch = []; }
  }
  if (batch.length) totalRec += await insertBatch('reclamacoes', batch);
  console.log('  [OK] ' + totalRec + ' new reclamacoes (total: ' + (existing + totalRec) + ')');

  // Summary
  console.log('\n=== Final counts ===');
  for (const t of ['auditoria', 'reclamacoes', 'inscricoes', 'horarios', 'frequencia', 'historico_escolar', 'atendimentos', 'matriculas']) {
    const c = await countRows(t);
    console.log('  ' + t.padEnd(20) + c);
  }
  console.log('\nDone!');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });

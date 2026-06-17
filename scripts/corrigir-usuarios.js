/**
 * Script de correcao: ajusta roles e popula dados faltantes
 *
 * Uso (na pasta backend/):
 *   $env:NODE_PATH="C:\Users\ffxtr\OneDrive\Desktop\Github\sige\backend\node_modules"
 *   node ..\scripts\corrigir-usuarios.js
 */
const path = require('path');
require(path.join(__dirname, '..', 'backend', 'node_modules', 'dotenv'))
  .config({ path: path.join(__dirname, '..', 'backend', '.env') });
const { createClient } = require(path.join(__dirname, '..', 'backend', 'node_modules', '@supabase', 'supabase-js'));
const bcrypt = require(path.join(__dirname, '..', 'backend', 'node_modules', 'bcryptjs'));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function main() {
  console.log('=== Corrigindo usuarios e populando dados faltantes ===\n');

  // 1. Roles: ROLE_USER -> ROLE_STUDENT (exceto admin)
  console.log('1. Ajustando roles...');
  const { data: usuarios } = await supabase.from('usuarios').select('id, email, role, nome_completo');
  const alunos = usuarios.filter(u => u.role === 'ROLE_USER');
  for (const u of alunos) {
    await supabase.from('usuarios').update({ role: 'ROLE_STUDENT' }).eq('id', u.id);
    console.log(`  ${u.email}: ROLE_USER -> ROLE_STUDENT`);
  }

  // 2. Garantir que todos (exceto admin) tenham matricula + historico
  console.log('\n2. Verificando matriculas e historicos...');
  const { data: turmas } = await supabase.from('turmas').select('id').limit(1);
  const turmaId = turmas?.[0]?.id;
  const { data: profs } = await supabase.from('usuarios').select('id').eq('role', 'ROLE_TEACHER').limit(1);
  const profId = profs?.[0]?.id;
  const { data: disciplinas } = await supabase.from('disciplinas').select('id, nome').eq('ativo', true);

  for (const u of usuarios) {
    if (u.role === 'ROLE_ADMIN') continue;

    // Verifica matricula
    const { data: mats } = await supabase.from('matriculas').select('id').eq('id_usuario', u.id);
    let matId;
    if (!mats || mats.length === 0) {
      const { data: newMat } = await supabase
        .from('matriculas')
        .insert([{ id_usuario: u.id, id_turma: turmaId, numero_matricula: 'MAT-2026-' + String(u.id).padStart(4, '0'), status: 'ATIVO' }])
        .select().single();
      matId = newMat?.id;
      console.log(`  ${u.email}: matricula criada (id=${matId})`);
    } else {
      matId = mats[0].id;
      console.log(`  ${u.email}: matricula ja existe (id=${matId})`);
    }

    if (!matId) continue;

    // Verifica historico
    const { data: hists } = await supabase.from('historico_escolar').select('id').eq('id_matricula', matId);
    if (!hists || hists.length === 0) {
      const histInsert = (disciplinas || []).map(d => ({
        id_matricula: matId,
        id_disciplina: d.id,
        id_professor: profId,
        nota_final: +(7 + (u.id % 20) * 0.1).toFixed(2),
        frequencia_percentual: +(85 + (u.id % 15)).toFixed(2),
        status: d.nome === 'Matematica' || d.nome === 'Portugues' || d.nome === 'Ciencias' ? 'APROVADO' : 'CURSANDO',
        ano: 2026, semestre: 1
      }));
      await supabase.from('historico_escolar').insert(histInsert);
      console.log(`  ${u.email}: historico inserido (${histInsert.length} disciplinas)`);
    } else {
      console.log(`  ${u.email}: historico ja existe (${hists.length} registros)`);
    }

    // Verifica reclamacoes
    const { data: recls } = await supabase.from('reclamacoes').select('id').eq('id_usuario', u.id);
    if (!recls || recls.length === 0) {
      const data = [
        { protocolo:'PROT-2026-'+String(u.id).padStart(4,'0')+'1', categoria:'Infraestrutura', assunto:'Problema na sala', descricao:'Relato sobre infraestrutura.', prioridade:'NORMAL', status:'PENDENTE', data_abertura: new Date(Date.now()-10*86400000).toISOString().slice(0,10) },
        { protocolo:'PROT-2026-'+String(u.id).padStart(4,'0')+'2', categoria:'Academico', assunto:'Sugestao de melhoria', descricao:'Melhoria no material didatico.', prioridade:'BAIXA', status:'EM_ANDAMENTO', data_abertura: new Date(Date.now()-5*86400000).toISOString().slice(0,10), resposta_admin:'Recebemos sua sugestao.' },
        { protocolo:'PROT-2026-'+String(u.id).padStart(4,'0')+'3', categoria:'Administrativo', assunto:'Duvida sobre documentos', descricao:'Orientacao sobre documentos.', prioridade:'ALTA', status:'RESOLVIDO', data_abertura: new Date(Date.now()-20*86400000).toISOString().slice(0,10), data_resolucao: new Date().toISOString().slice(0,10), resposta_admin:'Resolvido.' },
      ];
      await supabase.from('reclamacoes').insert(data.map(d => ({...d, id_usuario: u.id})));
      const { data: newRecls } = await supabase.from('reclamacoes').select('id').eq('id_usuario', u.id);
      if (newRecls) {
        await supabase.from('reclamacoes_historico').insert(
          newRecls.map(r => ({ id_reclamacao: r.id, evento:'Reclamacao Registrada', descricao:'Recebida e aguardando analise.' }))
        );
      }
      console.log(`  ${u.email}: reclamacoes inseridas (3)`);
    } else {
      console.log(`  ${u.email}: reclamacoes ja existem (${recls.length})`);
    }

    // Verifica atendimentos
    const { data: atds } = await supabase.from('atendimentos').select('id').eq('id_usuario', u.id);
    if (!atds || atds.length === 0) {
      await supabase.from('atendimentos').insert([
        { id_usuario: u.id, id_responsavel: profId, tipo:'Pedagogico', data_atendimento: new Date(Date.now()+7*86400000).toISOString().slice(0,10), hora:'14:00', status:'AGENDADO', observacoes:'Rendimento academico.' },
        { id_usuario: u.id, id_responsavel: profId, tipo:'Secretaria', data_atendimento: new Date(Date.now()+30*86400000).toISOString().slice(0,10), hora:'09:30', status:'AGENDADO', observacoes:'Documentos.' },
        { id_usuario: u.id, id_responsavel: profId, tipo:'Orientacao', data_atendimento: new Date(Date.now()-15*86400000).toISOString().slice(0,10), hora:'10:00', status:'REALIZADO', observacoes:'Orientacao vocacional.' },
      ]);
      console.log(`  ${u.email}: atendimentos inseridos (3)`);
    } else {
      console.log(`  ${u.email}: atendimentos ja existem (${atds.length})`);
    }

    // Verifica documentos
    const { data: docs } = await supabase.from('documentos').select('id').eq('id_usuario', u.id);
    if (!docs || docs.length === 0) {
      await supabase.from('documentos').insert([
        { id_usuario: u.id, nome:'RG - Frente', tipo:'RG', arquivo_url:'/docs/rg_'+u.id+'.pdf', data_envio: new Date(Date.now()-60*86400000).toISOString().slice(0,10), status:'APROVADO' },
        { id_usuario: u.id, nome:'RG - Verso', tipo:'RG', arquivo_url:'/docs/rgv_'+u.id+'.pdf', data_envio: new Date(Date.now()-60*86400000).toISOString().slice(0,10), status:'APROVADO' },
        { id_usuario: u.id, nome:'CPF', tipo:'CPF', arquivo_url:'/docs/cpf_'+u.id+'.pdf', data_envio: new Date(Date.now()-60*86400000).toISOString().slice(0,10), status:'APROVADO' },
        { id_usuario: u.id, nome:'Comprovante', tipo:'COMPROVANTE', arquivo_url:'/docs/comp_'+u.id+'.pdf', data_envio: new Date(Date.now()-55*86400000).toISOString().slice(0,10), status:'PENDENTE' },
      ]);
      console.log(`  ${u.email}: documentos inseridos (4)`);
    } else {
      console.log(`  ${u.email}: documentos ja existem (${docs.length})`);
    }
  }

  // 3. Resultado final
  console.log('\n=== VERIFICACAO FINAL ===');
  for (const t of ['usuarios','matriculas','historico_escolar','frequencia','documentos','reclamacoes','atendimentos','horarios']) {
    const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
    console.log(t+':', count);
  }
  const { data: finalUsers } = await supabase.from('usuarios').select('id,email,role');
  console.log('\nUsuarios:');
  finalUsers.forEach(u => console.log(`  ${u.id} ${u.email} [${u.role}]`));
  console.log('\nSenha de todos: 123Sige@');
}

main().catch(e => { console.error(e); process.exit(1); });

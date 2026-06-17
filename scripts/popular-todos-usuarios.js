/**
 * Script para popular dados de demonstracao para TODOS os usuarios
 * e atualizar todas as senhas para 123Sige@ (com hash bcrypt)
 *
 * Uso: node scripts/popular-todos-usuarios.js
 */
const path = require('path');
require(path.join(__dirname, '..', 'backend', 'node_modules', 'dotenv')).config({ path: path.join(__dirname, '..', 'backend', '.env') });
const { createClient } = require(path.join(__dirname, '..', 'backend', 'node_modules', '@supabase', 'supabase-js'));
const bcrypt = require(path.join(__dirname, '..', 'backend', 'node_modules', 'bcryptjs'));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function main() {
  console.log('=== Populando dados para todos os usuarios ===\n');

  // 1. Atualizar todas as senhas para 123Sige@
  console.log('1. Atualizando senhas para 123Sige@...');
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash('123Sige@', salt);
  const { error: errSenha } = await supabase
    .from('usuarios')
    .update({ senha: senhaHash })
    .neq('id', 0);
  if (errSenha) {
    console.error('  ERRO ao atualizar senhas:', errSenha.message);
    return;
  }
  console.log('  Senhas atualizadas com sucesso!');

  // 2. Buscar todos os usuarios
  const { data: usuarios, error: errUsers } = await supabase
    .from('usuarios')
    .select('id, email, nome_completo, role');
  if (errUsers) {
    console.error('  ERRO ao buscar usuarios:', errUsers.message);
    return;
  }
  console.log(`  Encontrados ${usuarios.length} usuarios`);

  // 3. Buscar turmas e disciplinas existentes
  const { data: turmas } = await supabase.from('turmas').select('id, nome');
  const { data: disciplinas } = await supabase.from('disciplinas').select('id, nome, carga_horaria, obrigatoria').eq('ativo', true);
  const { data: professores } = await supabase.from('usuarios').select('id, nome_completo').eq('role', 'ROLE_TEACHER');

  if (!turmas || turmas.length === 0) {
    console.log('  Nenhuma turma encontrada. Execute primeiro o script SQL para criar turmas e disciplinas.');
    return;
  }

  const turmaPadrao = turmas[0];
  const profPadrao = professores?.[0] || null;

  // 4. Para cada usuario, criar/garantir matricula + dados
  for (const user of usuarios) {
    console.log(`\n--- ${user.nome_completo} (${user.email}) ---`);

    // 4a. Verificar se ja tem matricula
    const { data: matExisting } = await supabase
      .from('matriculas')
      .select('id')
      .eq('id_usuario', user.id)
      .limit(1);

    let matId;
    if (matExisting && matExisting.length > 0) {
      matId = matExisting[0].id;
      console.log(`  Matricula ja existe (id=${matId})`);
    } else {
      const numMat = `MAT-2026-${String(user.id).padStart(4, '0')}`;
      const { data: newMat, error: errMat } = await supabase
        .from('matriculas')
        .insert([{
          id_usuario: user.id,
          id_turma: turmaPadrao.id,
          id_curso: null,
          numero_matricula: numMat,
          status: 'ATIVO',
          data_matricula: new Date().toISOString().slice(0, 10)
        }])
        .select()
        .single();

      if (errMat) {
        console.error(`  ERRO ao criar matricula: ${errMat.message}`);
        continue;
      }
      matId = newMat.id;
      console.log(`  Matricula criada (id=${matId})`);
    }

    // 4b. Historico escolar (se nao existir)
    const { data: histExisting } = await supabase
      .from('historico_escolar')
      .select('id')
      .eq('id_matricula', matId)
      .limit(1);

    if (!histExisting || histExisting.length === 0) {
      const notasBase = { 'Matematica': 8.5, 'Portugues': 7.0, 'Historia': 9.0, 'Ciencias': 8.0, 'Ingles': 9.5, 'Educacao Fisica': 10.0, 'Artes': 8.5, 'Geografia': 7.5, 'Fisica': 8.0, 'Quimica': 8.0 };
      const freqBase = { 'Matematica': 95, 'Portugues': 90, 'Historia': 88, 'Ciencias': 92, 'Ingles': 98, 'Educacao Fisica': 100, 'Artes': 85, 'Geografia': 80, 'Fisica': 90, 'Quimica': 88 };
      // Variacao para cada usuario
      const variacao = (user.id % 20) - 10;

      const histInsert = (disciplinas || []).map(d => ({
        id_matricula: matId,
        id_disciplina: d.id,
        id_professor: profPadrao?.id || null,
        nota_final: Math.min(10, Math.max(0, (notasBase[d.nome] || 7.0) + variacao * 0.1)),
        frequencia_percentual: Math.min(100, Math.max(50, (freqBase[d.nome] || 85) + variacao * 0.5)),
        status: d.nome === 'Matematica' || d.nome === 'Portugues' || d.nome === 'Ciencias' ? 'APROVADO' : 'CURSANDO',
        ano: 2026,
        semestre: 1
      }));

      if (histInsert.length > 0) {
        const { error: errHist } = await supabase.from('historico_escolar').insert(histInsert);
        if (errHist) console.error(`  ERRO ao inserir historico: ${errHist.message}`);
        else console.log(`  Historico inserido (${histInsert.length} disciplinas)`);
      }
    } else {
      console.log('  Historico ja existe');
    }

    // 4c. Documentos (se nao existir)
    const { data: docsExisting } = await supabase
      .from('documentos')
      .select('id')
      .eq('id_usuario', user.id)
      .limit(1);

    if (!docsExisting || docsExisting.length === 0) {
      const docs = [
        { nome: 'RG - Frente', tipo: 'RG', arquivo_url: `/documentos/rg_frente_${user.id}.pdf`, status: 'APROVADO' },
        { nome: 'RG - Verso', tipo: 'RG', arquivo_url: `/documentos/rg_verso_${user.id}.pdf`, status: 'APROVADO' },
        { nome: 'CPF', tipo: 'CPF', arquivo_url: `/documentos/cpf_${user.id}.pdf`, status: 'APROVADO' },
        { nome: 'Comprovante de Residencia', tipo: 'COMPROVANTE', arquivo_url: `/documentos/comprovante_${user.id}.pdf`, status: 'PENDENTE' },
      ];
      const { error: errDocs } = await supabase.from('documentos').insert(
        docs.map(d => ({ ...d, id_usuario: user.id, data_envio: new Date().toISOString().slice(0, 10) }))
      );
      if (errDocs) console.error(`  ERRO ao inserir documentos: ${errDocs.message}`);
      else console.log(`  Documentos inseridos (${docs.length})`);
    } else {
      console.log('  Documentos ja existem');
    }

    // 4d. Reclamacoes (se nao existir)
    const { data: reclExisting } = await supabase
      .from('reclamacoes')
      .select('id')
      .eq('id_usuario', user.id)
      .limit(1);

    if (!reclExisting || reclExisting.length === 0) {
      const categorias = ['Infraestrutura', 'Academico', 'Merenda', 'Transporte', 'Administrativo'];
      const statuses = ['PENDENTE', 'EM_ANDAMENTO', 'RESOLVIDO'];
      const assuntos = [
        'Problema na sala de aula',
        'Sugestao de melhoria',
        'Duvida sobre notas',
        'Horario de aulas',
      ];
      const reclams = Array.from({ length: 3 }, (_, i) => {
        const status = statuses[i % statuses.length];
        return {
          id_usuario: user.id,
          protocolo: `PROT-2026-${String(user.id).padStart(4, '0')}${i + 1}`,
          categoria: categorias[i % categorias.length],
          assunto: assuntos[i % assuntos.length],
          descricao: `Descricao detalhada sobre: ${assuntos[i % assuntos.length]}`,
          prioridade: ['BAIXA', 'NORMAL', 'ALTA'][i],
          status: status,
          data_abertura: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
          data_resolucao: status === 'RESOLVIDO' ? new Date().toISOString().slice(0, 10) : null,
          resposta_admin: status === 'RESOLVIDO' ? 'Sua solicitacao foi resolvida. Obrigado pelo contato.' : null,
        };
      });
      const { error: errRecl } = await supabase.from('reclamacoes').insert(reclams);
      if (errRecl) console.error(`  ERRO ao inserir reclamacoes: ${errRecl.message}`);
      else {
        console.log(`  Reclamacoes inseridas (${reclams.length})`);
        // Inserir historico para cada reclamacao
        for (const r of reclams) {
          const { data: reclData } = await supabase
            .from('reclamacoes')
            .select('id')
            .eq('protocolo', r.protocolo)
            .single();
          if (reclData) {
            await supabase.from('reclamacoes_historico').insert([{
              id_reclamacao: reclData.id,
              evento: 'Reclamacao Registrada',
              descricao: 'Reclamacao recebida e aguardando analise.'
            }]);
          }
        }
      }
    } else {
      console.log('  Reclamacoes ja existem');
    }

    // 4e. Atendimentos (se nao existir)
    const { data: atdExisting } = await supabase
      .from('atendimentos')
      .select('id')
      .eq('id_usuario', user.id)
      .limit(1);

    if (!atdExisting || atdExisting.length === 0) {
      const atendimentos = [
        { tipo: 'Pedagogico', data_atendimento: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), hora: '14:00', status: 'AGENDADO', observacoes: 'Conversa sobre rendimento academico.' },
        { tipo: 'Secretaria', data_atendimento: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10), hora: '09:30', status: 'AGENDADO', observacoes: 'Solicitacao de documentos.' },
        { tipo: 'Orientacao', data_atendimento: new Date(Date.now() - 15 * 86400000).toISOString().slice(0, 10), hora: '10:00', status: 'REALIZADO', observacoes: 'Orientacao vocacional realizada.', link_reuniao: null },
      ];
      const { error: errAtd } = await supabase.from('atendimentos').insert(
        atendimentos.map(a => ({
          ...a,
          id_usuario: user.id,
          id_responsavel: profPadrao?.id || null,
        }))
      );
      if (errAtd) console.error(`  ERRO ao inserir atendimentos: ${errAtd.message}`);
      else console.log(`  Atendimentos inseridos (${atendimentos.length})`);
    } else {
      console.log('  Atendimentos ja existem');
    }
  }

  // 5. Garantir que haja horarios para a turma
  console.log('\n--- Verificando horarios ---');
  const { data: horariosExisting } = await supabase
    .from('horarios')
    .select('id')
    .eq('id_turma', turmaPadrao.id)
    .limit(1);

  if (!horariosExisting || horariosExisting.length === 0) {
    const horariosData = [
      { dia_semana: 1, nome_disc: 'Matematica', hora_inicio: '08:00', hora_fim: '09:30', local: 'Sala 101' },
      { dia_semana: 1, nome_disc: 'Portugues', hora_inicio: '09:45', hora_fim: '11:15', local: 'Sala 101' },
      { dia_semana: 2, nome_disc: 'Historia', hora_inicio: '08:00', hora_fim: '09:30', local: 'Sala 102' },
      { dia_semana: 2, nome_disc: 'Ciencias', hora_inicio: '09:45', hora_fim: '11:15', local: 'Lab. Ciencias' },
      { dia_semana: 3, nome_disc: 'Ingles', hora_inicio: '08:00', hora_fim: '09:30', local: 'Sala 103' },
      { dia_semana: 3, nome_disc: 'Educacao Fisica', hora_inicio: '09:45', hora_fim: '11:15', local: 'Ginasio' },
      { dia_semana: 4, nome_disc: 'Artes', hora_inicio: '08:00', hora_fim: '09:30', local: 'Sala 104' },
      { dia_semana: 5, nome_disc: 'Geografia', hora_inicio: '08:00', hora_fim: '10:00', local: 'Sala 101' },
    ];
    const horariosInsert = [];
    for (const h of horariosData) {
      const disc = (disciplinas || []).find(d => d.nome === h.nome_disc);
      if (disc) {
        horariosInsert.push({
          id_turma: turmaPadrao.id,
          id_disciplina: disc.id,
          id_professor: profPadrao?.id || null,
          dia_semana: h.dia_semana,
          hora_inicio: h.hora_inicio,
          hora_fim: h.hora_fim,
          local: h.local,
        });
      }
    }
    if (horariosInsert.length > 0) {
      const { error: errHor } = await supabase.from('horarios').insert(horariosInsert);
      if (errHor) console.error(`  ERRO ao inserir horarios: ${errHor.message}`);
      else console.log(`  Horarios inseridos (${horariosInsert.length})`);
    }
  } else {
    console.log('  Horarios ja existem');
  }

  console.log('\n=== Populacao concluida! ===');
  console.log('Senha de todos os usuarios: 123Sige@');
  process.exit(0);
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});

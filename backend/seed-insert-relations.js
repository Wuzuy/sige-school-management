const supabaseUrl = 'https://seu-projeto.supabase.co';
const serviceKey = 'SUA_CHAVE_SERVICE_ROLE';
const headers = { 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' };

async function insert(table, rows) {
  const r = await fetch(supabaseUrl + '/rest/v1/' + table, { method: 'POST', headers, body: JSON.stringify(rows) });
  if (!r.ok) { const t = await r.text(); console.error('  FAIL ' + table + ':', t.substring(0, 200)); return 0; }
  console.log('  OK ' + table + ': ' + rows.length + ' rows');
  return rows.length;
}

async function clearTable(table) {
  const r = await fetch(supabaseUrl + '/rest/v1/' + table, { method: 'DELETE', headers });
  if (!r.ok) { const t = await r.text(); console.log('  clear ' + table + ':', t.substring(0, 100)); }
  else console.log('  cleared ' + table);
}

async function main() {
  console.log('=== Inserting seed relationship data ===\n');

  // Clear existing data first
  await clearTable('frequencia');
  await clearTable('historico_escolar');
  await clearTable('horarios');
  await clearTable('matriculas');
  await clearTable('planos_aula');
  await clearTable('planos_ensino');

  // Matriculas
  console.log('\n--- Matriculas ---');
  await insert('matriculas', [
    { id_usuario: 7, id_turma: 1, id_curso: 1, data_matricula: '2026-01-15', numero_matricula: 'MAT-2026-0001', status: 'ATIVO' },
    { id_usuario: 8, id_turma: 2, id_curso: 1, data_matricula: '2026-01-20', numero_matricula: 'MAT-2026-0002', status: 'ATIVO' },
    { id_usuario: 9, id_turma: 4, id_curso: 3, data_matricula: '2026-01-18', numero_matricula: 'MAT-2026-0003', status: 'ATIVO' },
    { id_usuario: 10, id_turma: 6, id_curso: 4, data_matricula: '2026-01-22', numero_matricula: 'MAT-2026-0004', status: 'ATIVO' },
  ]);

  // Horarios (professor x turma x disciplina)
  console.log('\n--- Horarios ---');
  await insert('horarios', [
    { id_turma: 1, id_disciplina: 1, id_professor: 5, dia_semana: 2, hora_inicio: '19:00', hora_fim: '20:30', local: 'Lab A' },
    { id_turma: 1, id_disciplina: 1, id_professor: 5, dia_semana: 4, hora_inicio: '19:00', hora_fim: '20:30', local: 'Lab A' },
    { id_turma: 1, id_disciplina: 2, id_professor: 5, dia_semana: 2, hora_inicio: '20:40', hora_fim: '22:10', local: 'Lab B' },
    { id_turma: 2, id_disciplina: 1, id_professor: 6, dia_semana: 3, hora_inicio: '19:00', hora_fim: '20:30', local: 'Lab A' },
    { id_turma: 3, id_disciplina: 3, id_professor: 6, dia_semana: 2, hora_inicio: '08:00', hora_fim: '09:30', local: 'Sala 101' },
    { id_turma: 4, id_disciplina: 4, id_professor: 5, dia_semana: 3, hora_inicio: '14:00', hora_fim: '15:30', local: 'Lab Anat' },
  ]);

  // Historico Escolar
  console.log('\n--- Historico Escolar ---');
  await insert('historico_escolar', [
    { id_matricula: 1, id_disciplina: 1, id_professor: 5, nota_final: 8.5, frequencia_percentual: 95.0, status: 'APROVADO', ano: 2026, semestre: 1 },
    { id_matricula: 1, id_disciplina: 2, id_professor: 5, nota_final: 7.0, frequencia_percentual: 90.0, status: 'APROVADO', ano: 2026, semestre: 1 },
    { id_matricula: 2, id_disciplina: 1, id_professor: 6, nota_final: 6.5, frequencia_percentual: 85.0, status: 'APROVADO', ano: 2026, semestre: 1 },
    { id_matricula: 3, id_disciplina: 4, id_professor: 5, nota_final: 9.0, frequencia_percentual: 98.0, status: 'APROVADO', ano: 2026, semestre: 1 },
  ]);

  // Frequencia
  console.log('\n--- Frequencia ---');
  await insert('frequencia', [
    { id_matricula: 1, id_disciplina: 1, data_aula: '2026-02-10', presenca: true, justificativa: null },
    { id_matricula: 1, id_disciplina: 1, data_aula: '2026-02-12', presenca: true, justificativa: null },
    { id_matricula: 1, id_disciplina: 2, data_aula: '2026-02-10', presenca: true, justificativa: null },
    { id_matricula: 2, id_disciplina: 1, data_aula: '2026-02-11', presenca: false, justificativa: 'Falta justificada - medico' },
    { id_matricula: 2, id_disciplina: 1, data_aula: '2026-02-13', presenca: true, justificativa: null },
    { id_matricula: 3, id_disciplina: 4, data_aula: '2026-02-11', presenca: true, justificativa: null },
    { id_matricula: 3, id_disciplina: 4, data_aula: '2026-02-13', presenca: true, justificativa: null },
    { id_matricula: 4, id_disciplina: 6, data_aula: '2026-02-12', presenca: false, justificativa: null },
  ]);

  // Planos de Ensino
  console.log('\n--- Planos de Ensino ---');
  await insert('planos_ensino', [
    { id_disciplina: 1, id_professor: 5, carga_horaria: 80,
      ementa: 'Desenvolvimento de aplicacoes web com HTML, CSS, JavaScript e frameworks.',
      objetivos_gerais: 'Capacitar o aluno a construir aplicacoes web completas e responsivas.',
      conteudo_programatico: '["Introducao a Web","HTML5","CSS3","JavaScript basico","Frameworks Front-end","Back-end basico","Projeto final"]',
      metodologia_geral: 'Aulas teoricas e praticas em laboratorio com projetos reais.',
      criterios_avaliacao: 'Prova 1 (peso 3) + Prova 2 (peso 3) + Projeto (peso 4).',
      bibliografia_basica: 'SILVA, J. Desenvolvimento Web. Ed. Pearson.',
      bibliografia_complementar: 'FREEMAN, E. Use a Cabeca! Programacao Web. Ed. Alta Books.' },
    { id_disciplina: 2, id_professor: 5, carga_horaria: 60,
      ementa: 'Modelagem e implementacao de bancos de dados relacionais com SQL.',
      objetivos_gerais: 'Capacitar o aluno a modelar, criar e consultar bancos de dados.',
      conteudo_programatico: '["Modelagem conceitual","Modelo relacional","SQL basico","SQL avancado","Normalizacao","Indices e performance"]',
      metodologia_geral: 'Aulas expositivas com exercicios praticos em ferramentas SQL.',
      criterios_avaliacao: 'Prova 1 (peso 4) + Prova 2 (peso 4) + Exercicios (peso 2).',
      bibliografia_basica: 'DATE, C. J. Introducao a Sistemas de Bancos de Dados. Ed. Campus.',
      bibliografia_complementar: 'ELMASRI, R. Sistemas de Banco de Dados. Ed. Pearson.' },
    { id_disciplina: 4, id_professor: 5, carga_horaria: 80,
      ementa: 'Estudo da estrutura e funcao do corpo humano, sistemas e orgaos.',
      objetivos_gerais: 'Proporcionar conhecimento anatomico basico para profissionais de saude.',
      conteudo_programatico: '["Introducao a Anatomia","Sistema Oseo","Sistema Muscular","Sistema Nervoso","Sistema Cardiovascular","Sistema Respiratorio"]',
      metodologia_geral: 'Aulas teoricas com aulas praticas em laboratorio de anatomia.',
      criterios_avaliacao: 'Prova teorica (peso 5) + Prova pratica (peso 5).',
      bibliografia_basica: 'GRAY, H. Anatomia. Ed. Guanabara Koogan.',
      bibliografia_complementar: 'NETTER, F. Atlas de Anatomia Humana. Ed. Elsevier.' },
  ]);

  // Planos de Aula
  console.log('\n--- Planos de Aula ---');
  await insert('planos_aula', [
    { id_plano_ensino: 1, data: '2026-02-10', horario_inicio: '19:00', horario_fim: '20:30', id_topico: 0,
      objetivo_aula: 'Apresentar conceitos basicos da web e configuracao do ambiente.',
      metodologia_dia: 'Aula expositiva com demonstracao pratica.',
      recursos_didaticos: 'Projetor, computadores, VS Code',
      atividades_realizadas: 'Configuracao do ambiente, primeiros comandos HTML.',
      observacoes: 'Alunos tiveram duvidas na configuracao do ambiente.' },
    { id_plano_ensino: 1, data: '2026-02-12', horario_inicio: '19:00', horario_fim: '20:30', id_topico: 1,
      objetivo_aula: 'Ensinar estrutura basica de documentos HTML.',
      metodologia_dia: 'Aula pratica com exercicios guiados.',
      recursos_didaticos: 'Computadores, material de apoio impresso',
      atividades_realizadas: 'Criacao de pagina HTML com tags semanticas basicas.',
      observacoes: 'Boa participacao da turma.' },
    { id_plano_ensino: 2, data: '2026-02-10', horario_inicio: '20:40', horario_fim: '22:10', id_topico: 0,
      objetivo_aula: 'Introduzir conceitos de modelagem conceitual de dados.',
      metodologia_dia: 'Aula expositiva com diagramacao no quadro.',
      recursos_didaticos: 'Quadro branco, projetor',
      atividades_realizadas: 'Criacao de diagrama entidade-relacionamento para estudo de caso.',
      observacoes: 'Conceitos bem absorvidos pela turma.' },
    { id_plano_ensino: 2, data: '2026-02-12', horario_inicio: '20:40', horario_fim: '22:10', id_topico: 1,
      objetivo_aula: 'Apresentar o modelo relacional e chaves primarias/estrangeiras.',
      metodologia_dia: 'Aula teorico-pratica com exemplos no PostgreSQL.',
      recursos_didaticos: 'Computadores, PostgreSQL',
      atividades_realizadas: 'Mapeamento do diagrama para tabelas relacionais.',
      observacoes: null },
    { id_plano_ensino: 3, data: '2026-02-11', horario_inicio: '14:00', horario_fim: '15:30', id_topico: 0,
      objetivo_aula: 'Apresentar a nomenclatura anatomica e planos de referencia.',
      metodologia_dia: 'Aula expositiva com uso de atlas e modelos 3D.',
      recursos_didaticos: 'Atlas anatomicos, projetor, modelos 3D digitais',
      atividades_realizadas: 'Reconhecimento de planos anatomicos em imagens e modelos.',
      observacoes: 'Alunos demonstraram grande interesse.' },
    { id_plano_ensino: 3, data: '2026-02-13', horario_inicio: '14:00', horario_fim: '15:30', id_topico: 1,
      objetivo_aula: 'Estudar os ossos do cranio e da face.',
      metodologia_dia: 'Aula pratica no laboratorio com pecas sinteticas.',
      recursos_didaticos: 'Pecas sinteticas, atlas, luvas descartaveis',
      atividades_realizadas: 'Identificacao de ossos do cranio nas pecas sinteticas.',
      observacoes: 'Laboratorio reservado com antecedencia.' },
  ]);

  console.log('\n=== All seed data inserted! ===');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });

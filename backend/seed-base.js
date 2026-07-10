const b = 'https://seu-projeto.supabase.co/rest/v1/';
const k = 'SUA_CHAVE_SERVICE_ROLE';
const h = { 'apikey': k, 'Authorization': 'Bearer ' + k, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' };

async function i(t, rows) {
  const r = await fetch(b + t, { method: 'POST', headers: h, body: JSON.stringify(rows) });
  if (!r.ok) { const e = await r.text(); console.error(t + ' ERROR:', e.substring(0, 200)); }
  else console.log('  ' + t + ': ' + rows.length);
}

async function d(table) {
  let total = 0;
  while (true) {
    const r = await fetch(b + table + '?id=neq.0', { method: 'DELETE', headers: { ...h, 'Prefer': 'return=representation' } });
    if (r.status === 404 || r.status === 406) break;
    if (!r.ok) { console.error('DELETE ' + table + ' ERROR:', r.status); break; }
    const data = await r.json();
    if (!data || !data.length) break;
    total += data.length;
  }
  return total;
}

const senha = '$2b$10$AT//Wih4CoxhVnuQ.TCKOeerkQGvNiyBfXqb.JVCZ2J.GCJVq8nI6';

(async () => {
  console.log('=== Resetando dados existentes ===');
  const delOrder = ['planos_aula','planos_ensino','frequencia','historico_escolar','atendimentos','auditoria','reclamacoes','codigos_acesso','documentos','matriculas','inscricoes','horarios','turmas','disciplinas','cursos','unidades','usuarios'];
  for (const t of delOrder) {
    const c = await d(t);
    if (c > 0) console.log('  Deletados ' + c + ' de ' + t);
  }

  console.log('\n=== Populando dados base ===');

  // USUARIOS com nomes realistas
  const usuarios = [
    { id: 1, nome_completo: 'Lucas Matheus Lima Sandin',  email: 'lucas.sandin@sige.com.br',    senha, cpf: '000.000.000-01', telefone: '(11) 99999-0001', data_nascimento: '1980-01-15', role: 'ROLE_ADMIN',   id_cargo: 1 },
    { id: 2, nome_completo: 'Ricardo Augusto Barbosa',     email: 'ricardo.barbosa@sige.com.br', senha, cpf: '000.000.000-02', telefone: '(11) 99999-0002', data_nascimento: '1985-03-20', role: 'ROLE_ADMIN',   id_cargo: 2 },
    { id: 3, nome_completo: 'Patricia Oliveira Santos',    email: 'patricia.santos@sige.com.br', senha, cpf: '000.000.000-03', telefone: '(11) 99999-0003', data_nascimento: '1990-05-10', role: 'ROLE_USER',    id_cargo: 3 },
    { id: 4, nome_completo: 'Camila Rodrigues Costa',      email: 'camila.costa@sige.com.br',    senha, cpf: '000.000.000-04', telefone: '(11) 99999-0004', data_nascimento: '1992-07-22', role: 'ROLE_USER',    id_cargo: 3 },
    { id: 5, nome_completo: 'Marcelo Henrique Pereira',    email: 'marcelo.pereira@sige.com.br', senha, cpf: '000.000.000-05', telefone: '(11) 99999-0005', data_nascimento: '1988-11-30', role: 'ROLE_TEACHER', id_cargo: 4 },
    { id: 6, nome_completo: 'Fernando Alves Nunes',        email: 'fernando.nunes@sige.com.br',  senha, cpf: '000.000.000-06', telefone: '(11) 99999-0006', data_nascimento: '1991-09-15', role: 'ROLE_TEACHER', id_cargo: 4 },
    { id: 7, nome_completo: 'Joao Vitor Silva',            email: 'joao.silva@sige.com.br',      senha, cpf: '111.111.111-01', telefone: '(11) 98888-0001', data_nascimento: '2002-02-10', role: 'ROLE_STUDENT', id_cargo: 5 },
    { id: 8, nome_completo: 'Maria Eduarda Souza',         email: 'maria.souza@sige.com.br',     senha, cpf: '111.111.111-02', telefone: '(11) 98888-0002', data_nascimento: '2003-04-18', role: 'ROLE_STUDENT', id_cargo: 5 },
    { id: 9, nome_completo: 'Gabriel Santos Lima',         email: 'gabriel.lima@sige.com.br',    senha, cpf: '222.222.222-01', telefone: '(11) 97777-0001', data_nascimento: '2001-08-05', role: 'ROLE_USER',    id_cargo: 6 },
    { id: 10, nome_completo: 'Rafaela Martins Dias',       email: 'rafaela.dias@sige.com.br',    senha, cpf: '222.222.222-02', telefone: '(11) 97777-0002', data_nascimento: '2000-12-25', role: 'ROLE_USER',    id_cargo: 6 }
  ];
  await i('usuarios', usuarios);

  // UNIDADES
  await i('unidades', [
    { id: 1, nome: 'Unidade Sao Paulo', cnpj: '11.111.111/0001-01', cidade: 'Sao Paulo', estado: 'SP' },
    { id: 2, nome: 'Unidade Campinas', cnpj: '22.222.222/0001-01', cidade: 'Campinas', estado: 'SP' }
  ]);

  // CURSOS
  await i('cursos', [
    { id: 1, id_unidade: 1, nome_curso: 'Analise e Desenvolvimento de Sistemas', tipo: 'Tecnologo', turno: 'Noturno', data_inicio: '2026-02-01', duracao_meses: 24, status: 'ATIVO' },
    { id: 2, id_unidade: 1, nome_curso: 'Administracao', tipo: 'Bacharelado', turno: 'Matutino', data_inicio: '2026-02-01', duracao_meses: 36, status: 'ATIVO' },
    { id: 3, id_unidade: 2, nome_curso: 'Enfermagem', tipo: 'Tecnologo', turno: 'Vespertino', data_inicio: '2026-02-01', duracao_meses: 24, status: 'ATIVO' },
    { id: 4, id_unidade: 2, nome_curso: 'Logistica', tipo: 'Tecnologo', turno: 'Noturno', data_inicio: '2026-02-01', duracao_meses: 18, status: 'ATIVO' }
  ]);

  // TURMAS
  await i('turmas', [
    { id: 1, nome: 'ADS Noturno 2026 A', id_curso: 1, ano: 2026, turno: 'Noturno', vagas: 40, status: 'ATIVO' },
    { id: 2, nome: 'ADS Noturno 2026 B', id_curso: 1, ano: 2026, turno: 'Noturno', vagas: 40, status: 'ATIVO' },
    { id: 3, nome: 'ADM Matutino 2026', id_curso: 2, ano: 2026, turno: 'Matutino', vagas: 35, status: 'ATIVO' },
    { id: 4, nome: 'Enfermagem 2026 A', id_curso: 3, ano: 2026, turno: 'Vespertino', vagas: 30, status: 'ATIVO' },
    { id: 5, nome: 'Enfermagem 2026 B', id_curso: 3, ano: 2026, turno: 'Vespertino', vagas: 30, status: 'ATIVO' },
    { id: 6, nome: 'Logistica 2026', id_curso: 4, ano: 2026, turno: 'Noturno', vagas: 30, status: 'ATIVO' }
  ]);

  // DISCIPLINAS
  await i('disciplinas', [
    { id: 1, nome: 'Programacao Web', codigo: 'ADS101', carga_horaria: 80, id_curso: 1, semestre: 1, obrigatoria: true },
    { id: 2, nome: 'Banco de Dados', codigo: 'ADS102', carga_horaria: 60, id_curso: 1, semestre: 1, obrigatoria: true },
    { id: 3, nome: 'Teoria Geral da Adm', codigo: 'ADM101', carga_horaria: 60, id_curso: 2, semestre: 1, obrigatoria: true },
    { id: 4, nome: 'Anatomia Humana', codigo: 'ENF101', carga_horaria: 80, id_curso: 3, semestre: 1, obrigatoria: true },
    { id: 5, nome: 'Farmacologia', codigo: 'ENF102', carga_horaria: 60, id_curso: 3, semestre: 1, obrigatoria: true },
    { id: 6, nome: 'Gestao de Transportes', codigo: 'LOG101', carga_horaria: 60, id_curso: 4, semestre: 1, obrigatoria: true }
  ]);

  // HORARIOS
  await i('horarios', [
    { id: 1, id_turma: 1, id_disciplina: 1, id_professor: 5, dia_semana: 2, hora_inicio: '19:00', hora_fim: '20:30', local: 'Lab A' },
    { id: 2, id_turma: 1, id_disciplina: 1, id_professor: 5, dia_semana: 4, hora_inicio: '19:00', hora_fim: '20:30', local: 'Lab A' },
    { id: 3, id_turma: 1, id_disciplina: 2, id_professor: 5, dia_semana: 2, hora_inicio: '20:40', hora_fim: '22:10', local: 'Lab B' },
    { id: 4, id_turma: 2, id_disciplina: 1, id_professor: 6, dia_semana: 3, hora_inicio: '19:00', hora_fim: '20:30', local: 'Lab A' },
    { id: 5, id_turma: 3, id_disciplina: 3, id_professor: 6, dia_semana: 2, hora_inicio: '08:00', hora_fim: '09:30', local: 'Sala 101' },
    { id: 6, id_turma: 4, id_disciplina: 4, id_professor: 5, dia_semana: 3, hora_inicio: '14:00', hora_fim: '15:30', local: 'Lab Anat' }
  ]);

  console.log('\nBase populada com sucesso!');
})();

-- ============================================
-- SIGE — DADOS DE EXEMPLO (~10 por tabela)
-- Uso:  psql -U user -d sige -f seed.sql
-- Senha padrao: 123456 (bcrypt)
-- ============================================

-- ============================================
-- USUARIOS (10)
-- Cargos: 1=AdminMaster, 2=Administrador,
--         3=Secretaria, 4=Professor,
--         5=Aluno, 6=Candidato
-- ============================================
INSERT INTO usuarios (nome_completo, email, senha, cpf, telefone, data_nascimento, role, id_cargo) VALUES
  ('Admin Master',        'admin@sige.com.br',          '$2b$10$AT//Wih4CoxhVnuQ.TCKOeerkQGvNiyBfXqb.JVCZ2J.GCJVq8nI6', '000.000.000-01', '(11) 99999-0001', '1980-01-15', 'ROLE_ADMIN',   1),
  ('Administrador',       'administrador@sige.com.br',  '$2b$10$AT//Wih4CoxhVnuQ.TCKOeerkQGvNiyBfXqb.JVCZ2J.GCJVq8nI6', '000.000.000-02', '(11) 99999-0002', '1985-03-20', 'ROLE_ADMIN',   2),
  ('Secretaria',          'secretaria@sige.com.br',     '$2b$10$AT//Wih4CoxhVnuQ.TCKOeerkQGvNiyBfXqb.JVCZ2J.GCJVq8nI6', '000.000.000-03', '(11) 99999-0003', '1990-05-10', 'ROLE_USER',    3),
  ('Secretaria 2',        'secretaria2@sige.com.br',    '$2b$10$AT//Wih4CoxhVnuQ.TCKOeerkQGvNiyBfXqb.JVCZ2J.GCJVq8nI6', '000.000.000-04', '(11) 99999-0004', '1992-07-22', 'ROLE_USER',    3),
  ('Professor',           'professor@sige.com.br',      '$2b$10$AT//Wih4CoxhVnuQ.TCKOeerkQGvNiyBfXqb.JVCZ2J.GCJVq8nI6', '000.000.000-05', '(11) 99999-0005', '1988-11-30', 'ROLE_TEACHER', 4),
  ('Professor 2',         'professor2@sige.com.br',     '$2b$10$AT//Wih4CoxhVnuQ.TCKOeerkQGvNiyBfXqb.JVCZ2J.GCJVq8nI6', '000.000.000-06', '(11) 99999-0006', '1991-09-15', 'ROLE_TEACHER', 4),
  ('Aluno',               'aluno@sige.com.br',          '$2b$10$AT//Wih4CoxhVnuQ.TCKOeerkQGvNiyBfXqb.JVCZ2J.GCJVq8nI6', '111.111.111-01', '(11) 98888-0001', '2002-02-10', 'ROLE_STUDENT', 5),
  ('Aluno 2',             'aluno2@sige.com.br',         '$2b$10$AT//Wih4CoxhVnuQ.TCKOeerkQGvNiyBfXqb.JVCZ2J.GCJVq8nI6', '111.111.111-02', '(11) 98888-0002', '2003-04-18', 'ROLE_STUDENT', 5),
  ('Candidato',           'candidato@sige.com.br',      '$2b$10$AT//Wih4CoxhVnuQ.TCKOeerkQGvNiyBfXqb.JVCZ2J.GCJVq8nI6', '222.222.222-01', '(11) 97777-0001', '2001-08-05', 'ROLE_USER',    6),
  ('Candidato 2',         'candidato2@sige.com.br',     '$2b$10$AT//Wih4CoxhVnuQ.TCKOeerkQGvNiyBfXqb.JVCZ2J.GCJVq8nI6', '222.222.222-02', '(11) 97777-0002', '2000-12-25', 'ROLE_USER',    6);

-- ============================================
-- UNIDADES (2)
-- ============================================
INSERT INTO unidades (nome, cnpj, cidade, estado) VALUES
  ('Unidade Sao Paulo',   '11.111.111/0001-01', 'Sao Paulo',   'SP'),
  ('Unidade Campinas',    '22.222.222/0001-01', 'Campinas',    'SP');

-- ============================================
-- CURSOS (4 — 2 por unidade)
-- ============================================
INSERT INTO cursos (id_unidade, nome_curso, tipo, turno, data_inicio, duracao_meses, status) VALUES
  (1, 'Analise e Desenvolvimento de Sistemas', 'Tecnologo', 'Noturno',   '2026-02-01', 24, 'ATIVO'),
  (1, 'Administracao',                         'Bacharelado','Matutino',  '2026-02-01', 36, 'ATIVO'),
  (2, 'Enfermagem',                            'Tecnologo',  'Vespertino','2026-02-01', 24, 'ATIVO'),
  (2, 'Logistica',                             'Tecnologo',  'Noturno',   '2026-02-01', 18, 'ATIVO');

-- ============================================
-- TURMAS (6 — 1 ou 2 por curso)
-- ============================================
INSERT INTO turmas (nome, id_curso, ano, turno, vagas, status) VALUES
  ('ADS Noturno 2026 A',   1, 2026, 'Noturno',    40, 'ATIVO'),
  ('ADS Noturno 2026 B',   1, 2026, 'Noturno',    40, 'ATIVO'),
  ('ADM Matutino 2026',    2, 2026, 'Matutino',   35, 'ATIVO'),
  ('Enfermagem 2026 A',    3, 2026, 'Vespertino', 30, 'ATIVO'),
  ('Enfermagem 2026 B',    3, 2026, 'Vespertino', 30, 'ATIVO'),
  ('Logistica 2026',       4, 2026, 'Noturno',    30, 'ATIVO');

-- ============================================
-- DISCIPLINAS (6 — 1 ou 2 por curso)
-- ============================================
INSERT INTO disciplinas (nome, codigo, carga_horaria, id_curso, semestre, obrigatoria) VALUES
  ('Programacao Web',         'ADS101', 80, 1, 1, TRUE),
  ('Banco de Dados',          'ADS102', 60, 1, 1, TRUE),
  ('Teoria Geral da Adm',     'ADM101', 60, 2, 1, TRUE),
  ('Anatomia Humana',         'ENF101', 80, 3, 1, TRUE),
  ('Farmacologia',            'ENF102', 60, 3, 1, TRUE),
  ('Gestao de Transportes',   'LOG101', 60, 4, 1, TRUE);

-- ============================================
-- MATRICULAS (4 — alunos nos cursos)
-- ============================================
INSERT INTO matriculas (id_usuario, id_turma, id_curso, data_matricula, numero_matricula, status) VALUES
  (7,  1, 1, '2026-01-15', 'MAT-2026-0001', 'ATIVO'),
  (8,  2, 1, '2026-01-20', 'MAT-2026-0002', 'ATIVO'),
  (9,  4, 3, '2026-01-18', 'MAT-2026-0003', 'ATIVO'),
  (10, 6, 4, '2026-01-22', 'MAT-2026-0004', 'ATIVO');

-- ============================================
-- INSCRICOES (6 — candidatos + alunos)
-- ============================================
INSERT INTO inscricoes (id_usuario, id_curso, data_inscricao, status_aprovacao, escolaridade_declarada, nome_completo_inscricao, cpf_inscricao, telefone_inscricao, email_inscricao, status_matricula) VALUES
  (7,  1, '2025-11-01', 'APROVADO', 'Ensino Medio Completo',    'Aluno',             '111.111.111-01', '(11) 98888-0001', 'aluno@sige.com.br',          'ACEITA'),
  (8,  1, '2025-11-05', 'APROVADO', 'Ensino Medio Completo',    'Aluno 2',           '111.111.111-02', '(11) 98888-0002', 'aluno2@sige.com.br',         'ACEITA'),
  (9,  3, '2025-12-01', 'APROVADO', 'Ensino Medio Completo',    'Candidato',         '222.222.222-01', '(11) 97777-0001', 'candidato@sige.com.br',      'ACEITA'),
  (10, 4, '2025-12-10', 'APROVADO', 'Ensino Medio Completo',    'Candidato 2',       '222.222.222-02', '(11) 97777-0002', 'candidato2@sige.com.br',     'ACEITA'),
  (9,  2, '2026-01-10', 'EM_ANALISE','Ensino Medio Completo',   'Candidato',         '222.222.222-01', '(11) 97777-0001', 'candidato@sige.com.br',      NULL),
  (10, 1, '2026-01-15', 'RECUSADO', 'Ensino Medio Incompleto', 'Candidato 2',       '222.222.222-02', '(11) 97777-0002', 'candidato2@sige.com.br',     NULL);

-- ============================================
-- HORARIOS (6 — professor x turma x disciplina)
-- ============================================
INSERT INTO horarios (id_turma, id_disciplina, id_professor, dia_semana, hora_inicio, hora_fim, local) VALUES
  (1, 1, 5, 2, '19:00', '20:30', 'Lab A'),   -- Rafa Web seg
  (1, 1, 5, 4, '19:00', '20:30', 'Lab A'),   -- Rafa Web qua
  (1, 2, 5, 2, '20:40', '22:10', 'Lab B'),   -- Rafa BD seg
  (2, 1, 6, 3, '19:00', '20:30', 'Lab A'),   -- Ju Web ter
  (3, 3, 6, 2, '08:00', '09:30', 'Sala 101'),-- Ju TGA seg
  (4, 4, 5, 3, '14:00', '15:30', 'Lab Anat');-- Rafa Anat ter

-- ============================================
-- HISTORICO ESCOLAR (4 — notas dos alunos)
-- ============================================
INSERT INTO historico_escolar (id_matricula, id_disciplina, id_professor, nota_final, frequencia_percentual, status, ano, semestre) VALUES
  (1, 1, 5, 8.5, 95.0, 'APROVADO',  2026, 1),
  (1, 2, 5, 7.0, 90.0, 'APROVADO',  2026, 1),
  (2, 1, 6, 6.5, 85.0, 'APROVADO',  2026, 1),
  (3, 4, 5, 9.0, 98.0, 'APROVADO',  2026, 1);

-- ============================================
-- FREQUENCIA (8 — presenca dos alunos)
-- ============================================
INSERT INTO frequencia (id_matricula, id_disciplina, data_aula, presenca, justificativa) VALUES
  (1, 1, '2026-02-10', TRUE,  NULL),
  (1, 1, '2026-02-12', TRUE,  NULL),
  (1, 2, '2026-02-10', TRUE,  NULL),
  (2, 1, '2026-02-11', FALSE, 'Falta justificada - medico'),
  (2, 1, '2026-02-13', TRUE,  NULL),
  (3, 4, '2026-02-11', TRUE,  NULL),
  (3, 4, '2026-02-13', TRUE,  NULL),
  (4, 6, '2026-02-12', FALSE, NULL);

-- ============================================
-- PLANOS DE ENSINO (3 — professor cadastra)
-- ============================================
INSERT INTO planos_ensino (id_disciplina, id_professor, carga_horaria, ementa, objetivos_gerais, conteudo_programatico, metodologia_geral, criterios_avaliacao, bibliografia_basica, bibliografia_complementar) VALUES
  (1, 5, 80,
   'Desenvolvimento de aplicacoes web com HTML, CSS, JavaScript e frameworks.',
   'Capacitar o aluno a construir aplicacoes web completas e responsivas.',
   '["Introducao a Web", "HTML5", "CSS3", "JavaScript basico", "Frameworks Front-end", "Back-end basico", "Projeto final"]',
   'Aulas teoricas e praticas em laboratorio com projetos reais.',
   'Prova 1 (peso 3) + Prova 2 (peso 3) + Projeto (peso 4).',
   'SILVA, J. Desenvolvimento Web. Ed. Pearson.',
   'FREEMAN, E. Use a Cabeca! Programacao Web. Ed. Alta Books.'),
  (2, 5, 60,
   'Modelagem e implementacao de bancos de dados relacionais com SQL.',
   'Capacitar o aluno a modelar, criar e consultar bancos de dados.',
   '["Modelagem conceitual", "Modelo relacional", "SQL basico", "SQL avancado", "Normalizacao", "Indices e performance"]',
   'Aulas expositivas com exercicios praticos em ferramentas SQL.',
   'Prova 1 (peso 4) + Prova 2 (peso 4) + Exercicios (peso 2).',
   'DATE, C. J. Introducao a Sistemas de Bancos de Dados. Ed. Campus.',
   'ELMASRI, R. Sistemas de Banco de Dados. Ed. Pearson.'),
  (4, 5, 80,
   'Estudo da estrutura e funcao do corpo humano, sistemas e orgaos.',
   'Proporcionar conhecimento anatomico basico para profissionais de saude.',
   '["Introducao a Anatomia", "Sistema Oseo", "Sistema Muscular", "Sistema Nervoso", "Sistema Cardiovascular", "Sistema Respiratorio"]',
   'Aulas teoricas com aulas praticas em laboratorio de anatomia.',
   'Prova teorica (peso 5) + Prova pratica (peso 5).',
   'GRAY, H. Anatomia. Ed. Guanabara Koogan.',
   'NETTER, F. Atlas de Anatomia Humana. Ed. Elsevier.');

-- ============================================
-- PLANOS DE AULA (6 — 2 por plano)
-- ============================================
INSERT INTO planos_aula (id_plano_ensino, data, horario_inicio, horario_fim, id_topico, objetivo_aula, metodologia_dia, recursos_didaticos, atividades_realizadas, observacoes) VALUES
  (1, '2026-02-10', '19:00', '20:30', 0,
   'Apresentar conceitos basicos da web e configuracao do ambiente.',
   'Aula expositiva com demonstracao pratica.',
   'Projetor, computadores, VS Code',
   'Configuracao do ambiente, primeiros comandos HTML.',
   'Alunos tiveram duvidas na configuracao do ambiente.'),
  (1, '2026-02-12', '19:00', '20:30', 1,
   'Ensinar estrutura basica de documentos HTML.',
   'Aula pratica com exercicios guiados.',
   'Computadores, material de apoio impresso',
   'Criacao de pagina HTML com tags semanticas basicas.',
   'Boa participacao da turma.'),
  (2, '2026-02-10', '20:40', '22:10', 0,
   'Introduzir conceitos de modelagem conceitual de dados.',
   'Aula expositiva com diagramacao no quadro.',
   'Quadro branco, projetor',
   'Criacao de diagrama entidade-relacionamento para estudo de caso.',
   'Conceitos bem absorvidos pela turma.'),
  (2, '2026-02-12', '20:40', '22:10', 1,
   'Apresentar o modelo relacional e chaves primarias/estrangeiras.',
   'Aula teorico-pratica com exemplos no PostgreSQL.',
   'Computadores, PostgreSQL',
   'Mapeamento do diagrama para tabelas relacionais.',
   NULL),
  (3, '2026-02-11', '14:00', '15:30', 0,
   'Apresentar a nomenclatura anatomica e planos de referencia.',
   'Aula expositiva com uso de atlas e modelos 3D.',
   'Atlas anatomicos, projetor, modelos 3D digitais',
   'Reconhecimento de planos anatomicos em imagens e modelos.',
   'Alunos demonstraram grande interesse.'),
  (3, '2026-02-13', '14:00', '15:30', 1,
   'Estudar os ossos do cranio e da face.',
   'Aula pratica no laboratorio com pecas sinteticas.',
   'Pecas sinteticas, atlas, luvas descartaveis',
   'Identificacao de ossos do cranio nas pecas sinteticas.',
   'Laboratorio reservado com antecedencia.');

-- ============================================
-- RECLAMACOES (4)
-- ============================================
INSERT INTO reclamacoes (id_usuario, protocolo, categoria, assunto, descricao, prioridade, status, data_abertura) VALUES
  (7,  'REC-2026-0001', 'Infraestrutura', 'Ar condicionado com defeito',  'O ar condicionado da sala 101 esta quebrado ha mais de 15 dias.', 'ALTA', 'PENDENTE', '2026-03-01'),
  (8,  'REC-2026-0002', 'Academico',      'Nota incorreta no boletim',   'Minha nota na disciplina Web esta 5.0 mas eu fiz a prova de recuperacao.', 'ALTA', 'EM_ANDAMENTO', '2026-03-10'),
  (9,  'REC-2026-0003', 'Secretaria',     'Documento nao recebido',      'Enviei meu comprovante de residencia ha 20 dias e ainda nao foi aprovado.', 'NORMAL', 'PENDENTE', '2026-03-15'),
  (10, 'REC-2026-0004', 'Financeiro',     'Duvida sobre boleto',         'O boleto da matricula veio com valor diferente do contratado.', 'BAIXA', 'RESOLVIDA', '2026-02-20');

-- ============================================
-- DOCUMENTOS (6 — dos alunos)
-- ============================================
INSERT INTO documentos (id_usuario, nome, tipo, data_envio, status) VALUES
  (7,  'RG Aluno',      'RG',                  '2026-01-10',  'APROVADO'),
  (7,  'CPF Aluno',     'CPF',                 '2026-01-10',  'APROVADO'),
  (8,  'RG Aluno 2',    'RG',                  '2026-01-15',  'APROVADO'),
  (8,  'Comprovante',   'COMPROVANTE_ENDERECO','2026-01-15',  'PENDENTE'),
  (9,  'RG Candidato',  'RG',                  '2026-01-12',  'APROVADO'),
  (10, 'RG Candidato 2','RG',                  '2026-01-20',  'PENDENTE');

-- ============================================
-- EDITAIS (3)
-- ============================================
INSERT INTO editais (titulo, url, ativo) VALUES
  ('Edital de Bolsas 2026 - Primeiro Semestre',   'https://sige.edu.br/editais/bolsas-2026-1', TRUE),
  ('Processo Seletivo Simplificado 2026',         'https://sige.edu.br/editais/ps-2026',       TRUE),
  ('Edital de Monitoria 2026',                     'https://sige.edu.br/editais/monitoria-2026',FALSE);

-- ============================================
-- AGENDA (3 eventos)
-- ============================================
INSERT INTO agenda_eventos (titulo, descricao, data_inicio, data_fim, tipo, id_curso, publico) VALUES
  ('Prova POO - ADS',     'Avaliacao bimestral de Programacao Orientada a Objetos.',   '2026-04-15', NULL, 'PROVA',  1, FALSE),
  ('Feriado - Tiradentes','Feriado nacional.',                                          '2026-04-21', NULL, 'FERIADO', NULL, TRUE),
  ('Semana da Saude',     'Palestras e workshops sobre saude e bem-estar.',             '2026-05-05', '2026-05-09', 'EVENTO', 3, TRUE);

-- ============================================
-- ATENDIMENTOS (3)
-- ============================================
INSERT INTO atendimentos (id_usuario, id_responsavel, tipo, data_atendimento, hora, status, observacoes) VALUES
  (7,  3, 'Orientacao Academica', '2026-03-05', '14:00', 'REALIZADO', 'Aluno tirou duvidas sobre rematricula.'),
  (9,  4, 'Documentacao',         '2026-03-12', '10:30', 'AGENDADO',  'Regularizar documentos pendentes.'),
  (8,  3, 'Suporte Financeiro',   '2026-03-08', '16:00', 'CANCELADO', NULL);

-- ============================================
-- CODIGOS DE ACESSO (3)
-- ============================================
INSERT INTO codigos_acesso (id_usuario, codigo, expira_em, usado) VALUES
  (5,  'ABC123', NOW() + INTERVAL '1 hour', FALSE),
  (6,  'DEF456', NOW() + INTERVAL '1 hour', FALSE),
  (7,  'GHI789', NOW() + INTERVAL '1 hour', TRUE);

-- ============================================
-- AUDITORIA (5 registros)
-- ============================================
INSERT INTO auditoria (usuario, tipo, acao, detalhes) VALUES
  ('admin@sige.com.br',          'LOGIN',    'Usuario fez login no sistema',       '{"ip": "192.168.1.100"}'),
  ('admin@sige.com.br',          'CREATE',   'Criou novo curso: Enfermagem',       '{"curso_id": 3}'),
  ('professor@sige.com.br',      'LOGIN',    'Professor acessou o portal',         '{"ip": "192.168.1.101"}'),
  ('secretaria@sige.com.br',     'UPDATE',   'Aprovou inscricao do aluno Aluno',   '{"inscricao_id": 1}'),
  ('admin@sige.com.br',          'DELETE',   'Excluiu edital de monitoria antigo', '{"edital_id": 3}');

-- ============================================
-- AJUSTA SEQUENCES APOS INSERTS
-- ============================================
SELECT setval('cargos_id_seq',       COALESCE((SELECT MAX(id) FROM cargos),       6));
SELECT setval('permissoes_id_seq',   COALESCE((SELECT MAX(id) FROM permissoes),   60));
SELECT setval('usuarios_id_seq',     COALESCE((SELECT MAX(id) FROM usuarios),     10));
SELECT setval('unidades_id_seq',     COALESCE((SELECT MAX(id) FROM unidades),     2));
SELECT setval('cursos_id_seq',       COALESCE((SELECT MAX(id) FROM cursos),       4));
SELECT setval('turmas_id_seq',       COALESCE((SELECT MAX(id) FROM turmas),       6));
SELECT setval('disciplinas_id_seq',  COALESCE((SELECT MAX(id) FROM disciplinas),  6));
SELECT setval('matriculas_id_seq',   COALESCE((SELECT MAX(id) FROM matriculas),   4));
SELECT setval('inscricoes_id_seq',   COALESCE((SELECT MAX(id) FROM inscricoes),   6));
SELECT setval('horarios_id_seq',     COALESCE((SELECT MAX(id) FROM horarios),     6));
SELECT setval('planos_ensino_id_seq',COALESCE((SELECT MAX(id) FROM planos_ensino),3));
SELECT setval('planos_aula_id_seq',  COALESCE((SELECT MAX(id) FROM planos_aula),  6));
SELECT setval('reclamacoes_id_seq',  COALESCE((SELECT MAX(id) FROM reclamacoes),  4));
SELECT setval('documentos_id_seq',   COALESCE((SELECT MAX(id) FROM documentos),   6));
SELECT setval('editais_id_seq',      COALESCE((SELECT MAX(id) FROM editais),      3));
SELECT setval('agenda_eventos_id_seq',COALESCE((SELECT MAX(id) FROM agenda_eventos),3));
SELECT setval('atendimentos_id_seq', COALESCE((SELECT MAX(id) FROM atendimentos), 3));
SELECT setval('codigos_acesso_id_seq',COALESCE((SELECT MAX(id) FROM codigos_acesso),3));
SELECT setval('auditoria_id_seq',    COALESCE((SELECT MAX(id) FROM auditoria),    5));
SELECT setval('portais_id_seq',      COALESCE((SELECT MAX(id) FROM portais),      4));

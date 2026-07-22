-- ====================================================================
-- Preencher dados do aluno joaomiguel@gmail.com (ID 54)
-- Turma: TECI26A | Curso: Tecnologia da Informacao | Matricula: MAT-0054
-- ====================================================================

-- ################################################################
-- 1. ATUALIZAR DADOS PESSOAIS (CPF, data nascimento 2007, telefone)
-- ################################################################
UPDATE usuarios
SET
  cpf             = '529.847.160-38',
  data_nascimento = '2007-03-15',
  telefone        = '(11) 98765-4321'
WHERE id = 54;

-- ################################################################
-- 2. HISTORICO ESCOLAR (notas por disciplina)
-- ################################################################
INSERT INTO historico_escolar (id, id_matricula, id_disciplina, id_professor, nota_final, frequencia_percentual, status, ano, semestre) VALUES
(181, 31, 7,  16, 8.5, 90.0, 'APROVADO',  2026, 1),
(182, 31, 8,  17, 7.0, 82.0, 'APROVADO',  2026, 1),
(183, 31, 9,  18, 9.2, 95.0, 'APROVADO',  2026, 1),
(184, 31, 10, 11, 6.5, 76.0, 'APROVADO',  2026, 2),
(185, 31, 11, 12, 8.0, 88.0, 'APROVADO',  2026, 2),
(186, 31, 12, 13, 7.5, 84.0, 'APROVADO',  2026, 2);

-- ################################################################
-- 3. FREQUENCIA (10 aulas por disciplina, misto presenca/falta)
-- ################################################################
INSERT INTO frequencia (id_matricula, id_disciplina, data_aula, presenca) VALUES
-- Programacao Web (7)
(31, 7, '2026-03-02', TRUE),  (31, 7, '2026-03-09', TRUE),
(31, 7, '2026-03-16', TRUE),  (31, 7, '2026-03-23', FALSE),
(31, 7, '2026-03-30', TRUE),  (31, 7, '2026-04-06', TRUE),
(31, 7, '2026-04-13', FALSE), (31, 7, '2026-04-27', TRUE),
(31, 7, '2026-05-04', TRUE),  (31, 7, '2026-05-11', TRUE),
-- Banco de Dados (8)
(31, 8, '2026-03-03', TRUE),  (31, 8, '2026-03-10', TRUE),
(31, 8, '2026-03-17', TRUE),  (31, 8, '2026-03-24', TRUE),
(31, 8, '2026-03-31', FALSE), (31, 8, '2026-04-07', TRUE),
(31, 8, '2026-04-14', TRUE),  (31, 8, '2026-04-28', TRUE),
(31, 8, '2026-05-05', FALSE), (31, 8, '2026-05-12', TRUE),
-- Redes de Computadores (9)
(31, 9, '2026-03-04', TRUE),  (31, 9, '2026-03-11', TRUE),
(31, 9, '2026-03-18', TRUE),  (31, 9, '2026-03-25', TRUE),
(31, 9, '2026-04-01', TRUE),  (31, 9, '2026-04-08', TRUE),
(31, 9, '2026-04-15', TRUE),  (31, 9, '2026-04-29', TRUE),
(31, 9, '2026-05-06', TRUE),  (31, 9, '2026-05-13', TRUE),
-- Seguranca da Informacao (10)
(31, 10, '2026-03-05', TRUE),  (31, 10, '2026-03-12', TRUE),
(31, 10, '2026-03-19', TRUE),  (31, 10, '2026-03-26', FALSE),
(31, 10, '2026-04-02', TRUE),  (31, 10, '2026-04-09', FALSE),
(31, 10, '2026-04-16', TRUE),  (31, 10, '2026-04-30', TRUE),
(31, 10, '2026-05-07', TRUE),  (31, 10, '2026-05-14', TRUE),
-- Engenharia de Software (11)
(31, 11, '2026-03-06', TRUE),  (31, 11, '2026-03-13', TRUE),
(31, 11, '2026-03-20', FALSE), (31, 11, '2026-03-27', TRUE),
(31, 11, '2026-04-03', TRUE),  (31, 11, '2026-04-10', TRUE),
(31, 11, '2026-04-17', FALSE), (31, 11, '2026-05-01', TRUE),
(31, 11, '2026-05-08', TRUE),  (31, 11, '2026-05-15', TRUE),
-- Inteligencia Artificial (12)
(31, 12, '2026-03-07', TRUE),  (31, 12, '2026-03-14', TRUE),
(31, 12, '2026-03-21', TRUE),  (31, 12, '2026-03-28', TRUE),
(31, 12, '2026-04-04', TRUE),  (31, 12, '2026-04-11', FALSE),
(31, 12, '2026-04-18', TRUE),  (31, 12, '2026-05-02', TRUE),
(31, 12, '2026-05-09', FALSE), (31, 12, '2026-05-16', TRUE);

-- ################################################################
-- 4. DOCUMENTOS (RG, CPF, Comprovante Residencia, Foto)
-- ################################################################
INSERT INTO documentos (id, id_usuario, nome, tipo, arquivo_url, data_envio, status) VALUES
(101, 54, 'RG - 54-0',        'pdf', '/uploads/documentos/doc-54-0.pdf', '2026-07-10', 'APROVADO'),
(102, 54, 'CPF - 54-1',       'pdf', '/uploads/documentos/doc-54-1.pdf', '2026-07-10', 'APROVADO'),
(103, 54, 'Comprovante Residencia - 54-2', 'pdf', '/uploads/documentos/doc-54-2.pdf', '2026-07-11', 'APROVADO'),
(104, 54, 'Foto 3x4 - 54-3',  'jpg', '/uploads/documentos/doc-54-3.jpg', '2026-07-12', 'APROVADO');

-- ################################################################
-- 5. FINANCEIRO (mensalidades do curso)
-- ################################################################
INSERT INTO financeiro (id, id_usuario, id_matricula, descricao, tipo, valor, data_vencimento, status, mes_referencia, ano_referencia) VALUES
(151, 54, 31, 'Mensalidade 01/2026 - Tecnologia da Informacao', 'MENSALIDADE', 720.00, '2026-01-10', 'PAGO',   1, 2026),
(152, 54, 31, 'Mensalidade 02/2026 - Tecnologia da Informacao', 'MENSALIDADE', 720.00, '2026-02-10', 'PAGO',   2, 2026),
(153, 54, 31, 'Mensalidade 03/2026 - Tecnologia da Informacao', 'MENSALIDADE', 720.00, '2026-03-10', 'PAGO',   3, 2026),
(154, 54, 31, 'Mensalidade 04/2026 - Tecnologia da Informacao', 'MENSALIDADE', 720.00, '2026-04-10', 'PAGO',   4, 2026),
(155, 54, 31, 'Mensalidade 05/2026 - Tecnologia da Informacao', 'MENSALIDADE', 720.00, '2026-05-10', 'PAGO',   5, 2026),
(156, 54, 31, 'Mensalidade 06/2026 - Tecnologia da Informacao', 'MENSALIDADE', 720.00, '2026-06-10', 'PENDENTE', 6, 2026),
(157, 54, 31, 'Mensalidade 07/2026 - Tecnologia da Informacao', 'MENSALIDADE', 720.00, '2026-07-10', 'PENDENTE', 7, 2026),
(158, 54, 31, 'Material Didatico - 1 Semestre',                 'TAXA',       350.00, '2026-01-15', 'PAGO',   1, 2026);

-- ################################################################
-- 6. CODIGO DE ACESSO (catraca)
-- ################################################################
INSERT INTO codigos_acesso (id, id_usuario, codigo, criado_em, expira_em, usado, validado_em) VALUES
(31, 54, '100030', '2026-07-13T08:00:00Z', '2026-07-14T08:00:00Z', FALSE, NULL);

-- Corrigir sequences
ALTER SEQUENCE historico_escolar_id_seq RESTART WITH 187;
ALTER SEQUENCE documentos_id_seq RESTART WITH 105;
ALTER SEQUENCE financeiro_id_seq RESTART WITH 159;
ALTER SEQUENCE codigos_acesso_id_seq RESTART WITH 32;

-- ============================================
-- SIGE — MINIMAL SEED (apenas admin)
-- Uso: executar apos schema.sql
-- Senha padrao: 123456
-- ============================================

INSERT INTO usuarios (nome_completo, email, senha, role, id_cargo) VALUES
  ('Administrador', 'admin@sige.com.br',
   '$2b$10$AT//Wih4CoxhVnuQ.TCKOeerkQGvNiyBfXqb.JVCZ2J.GCJVq8nI6',
   'ROLE_ADMIN', 1);

SELECT setval('usuarios_id_seq', COALESCE((SELECT MAX(id) FROM usuarios), 1));

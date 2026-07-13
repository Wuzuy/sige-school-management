-- ============================================
-- MIGRATION: MODULO FINANCEIRO
-- ============================================

DROP TABLE IF EXISTS financeiro CASCADE;

CREATE TABLE financeiro (
  id              SERIAL PRIMARY KEY,
  id_usuario      INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  id_matricula    INTEGER REFERENCES matriculas(id) ON DELETE SET NULL,
  descricao       VARCHAR(300) NOT NULL,
  tipo            VARCHAR(50) DEFAULT 'MENSALIDADE',
  valor           DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento  DATE,
  status          VARCHAR(20) DEFAULT 'PENDENTE',
  boleto_url      TEXT,
  boleto_codigo   VARCHAR(100),
  mes_referencia  INTEGER,
  ano_referencia  INTEGER,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- Permissao para aluno visualizar financeiro
INSERT INTO permissoes (codigo, nome, descricao, modulo)
VALUES ('financeiro.visualizar', 'Visualizar Financeiro', 'Ver boletos e mensalidades', 'financeiro')
ON CONFLICT (codigo) DO NOTHING;

-- Concede permissao ao Aluno (cargo 5)
INSERT INTO cargos_permissoes (id_cargo, id_permissao)
SELECT 5, id FROM permissoes WHERE codigo = 'financeiro.visualizar'
ON CONFLICT DO NOTHING;

-- Concede permissao a Secretaria (cargo 3)
INSERT INTO cargos_permissoes (id_cargo, id_permissao)
SELECT 3, id FROM permissoes WHERE codigo = 'financeiro.visualizar'
ON CONFLICT DO NOTHING;

-- Concede permissao a Administrador (cargo 2)
INSERT INTO cargos_permissoes (id_cargo, id_permissao)
SELECT 2, id FROM permissoes WHERE codigo = 'financeiro.visualizar'
ON CONFLICT DO NOTHING;

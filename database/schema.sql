-- ============================================
-- SIGE — SCHEMA COMPLETO
-- Cria toda a estrutura do zero
-- Ordem: cargos → permissoes → cargos_permissoes
--        → usuarios → unidades → cursos → turmas
--        → disciplinas → demais tabelas
-- ============================================

DROP TABLE IF EXISTS
  auditoria, codigos_acesso, planos_aula, planos_ensino,
  horarios, frequencia, historico_escolar, matriculas,
  inscricoes, documentos, reclamacoes_historico, reclamacoes,
  agenda_eventos, atendimentos, editais, disciplinas,
  turmas, cursos, unidades, usuarios,
  cargos_permissoes, permissoes, cargos, portais
CASCADE;

-- ============================================
-- 1. CARGOS (RBAC)
-- ============================================
CREATE TABLE cargos (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL UNIQUE,
  descricao   TEXT,
  is_admin_master BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. PERMISSOES
-- ============================================
CREATE TABLE permissoes (
  id          SERIAL PRIMARY KEY,
  codigo      VARCHAR(100) NOT NULL UNIQUE,
  nome        VARCHAR(200) NOT NULL,
  descricao   TEXT,
  modulo      VARCHAR(100) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. CARGOS_PERMISSOES
-- ============================================
CREATE TABLE cargos_permissoes (
  id            SERIAL PRIMARY KEY,
  id_cargo      INTEGER NOT NULL REFERENCES cargos(id) ON DELETE CASCADE,
  id_permissao  INTEGER NOT NULL REFERENCES permissoes(id) ON DELETE CASCADE,
  UNIQUE(id_cargo, id_permissao)
);

-- ============================================
-- 4. USUARIOS
-- ============================================
CREATE TABLE usuarios (
  id              SERIAL PRIMARY KEY,
  nome_completo   VARCHAR(200) NOT NULL,
  email           VARCHAR(200) UNIQUE NOT NULL,
  senha           VARCHAR(255) NOT NULL,
  cpf             VARCHAR(14),
  telefone        VARCHAR(20),
  data_nascimento DATE,
  role            VARCHAR(20) DEFAULT 'ROLE_USER',
  id_cargo        INTEGER REFERENCES cargos(id) ON DELETE SET NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. UNIDADES
-- ============================================
CREATE TABLE unidades (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(200) NOT NULL,
  cnpj        VARCHAR(20),
  cidade      VARCHAR(100),
  estado      VARCHAR(2),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. CURSOS
-- ============================================
CREATE TABLE cursos (
  id            SERIAL PRIMARY KEY,
  id_unidade    INTEGER REFERENCES unidades(id) ON DELETE SET NULL,
  nome_curso    VARCHAR(200) NOT NULL,
  tipo          VARCHAR(100),
  turno         VARCHAR(20),
  data_inicio   DATE,
  duracao_meses INTEGER,
  status        VARCHAR(20) DEFAULT 'ATIVO',
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 7. TURMAS
-- ============================================
CREATE TABLE turmas (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100),
  id_curso    INTEGER REFERENCES cursos(id) ON DELETE SET NULL,
  ano         INTEGER NOT NULL,
  turno       VARCHAR(20),
  vagas       INTEGER DEFAULT 40,
  status      VARCHAR(20) DEFAULT 'ATIVO',
  ativo       BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 8. DISCIPLINAS
-- ============================================
CREATE TABLE disciplinas (
  id              SERIAL PRIMARY KEY,
  nome            VARCHAR(200) NOT NULL,
  codigo          VARCHAR(20) UNIQUE,
  carga_horaria   INTEGER,
  id_curso        INTEGER REFERENCES cursos(id) ON DELETE SET NULL,
  semestre        INTEGER DEFAULT 1,
  obrigatoria     BOOLEAN DEFAULT TRUE,
  ativo           BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 9. INSCRICOES
-- ============================================
CREATE TABLE inscricoes (
  id                      SERIAL PRIMARY KEY,
  id_usuario              INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  id_curso                INTEGER REFERENCES cursos(id) ON DELETE SET NULL,
  data_inscricao          DATE DEFAULT CURRENT_DATE,
  status_aprovacao        VARCHAR(20) DEFAULT 'EM_ANALISE',
  escolaridade_declarada  VARCHAR(100),
  nome_completo_inscricao VARCHAR(200),
  rg_inscricao            VARCHAR(20),
  cpf_inscricao           VARCHAR(14),
  telefone_inscricao      VARCHAR(20),
  email_inscricao         VARCHAR(200),
  data_nascimento_inscricao DATE,
  status_matricula        VARCHAR(20),
  data_aceite_matricula   DATE,
  created_at              TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 10. MATRICULAS
-- ============================================
CREATE TABLE matriculas (
  id              SERIAL PRIMARY KEY,
  id_usuario      INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  id_turma        INTEGER REFERENCES turmas(id) ON DELETE SET NULL,
  id_curso        INTEGER REFERENCES cursos(id) ON DELETE SET NULL,
  data_matricula  DATE DEFAULT CURRENT_DATE,
  numero_matricula VARCHAR(50) UNIQUE,
  status          VARCHAR(20) DEFAULT 'ATIVO',
  data_conclusao  DATE,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 11. HISTORICO ESCOLAR
-- ============================================
CREATE TABLE historico_escolar (
  id                    SERIAL PRIMARY KEY,
  id_matricula          INTEGER REFERENCES matriculas(id) ON DELETE CASCADE,
  id_disciplina         INTEGER REFERENCES disciplinas(id) ON DELETE SET NULL,
  id_professor          INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  nota_final            DECIMAL(4,2),
  frequencia_percentual DECIMAL(5,2),
  status                VARCHAR(20) DEFAULT 'CURSANDO',
  ano                   INTEGER,
  semestre              INTEGER,
  created_at            TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 12. FREQUENCIA
-- ============================================
CREATE TABLE frequencia (
  id              SERIAL PRIMARY KEY,
  id_matricula    INTEGER REFERENCES matriculas(id) ON DELETE CASCADE,
  id_disciplina   INTEGER REFERENCES disciplinas(id) ON DELETE SET NULL,
  data_aula       DATE NOT NULL,
  presenca        BOOLEAN DEFAULT TRUE,
  justificativa   TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 13. HORARIOS
-- ============================================
CREATE TABLE horarios (
  id            SERIAL PRIMARY KEY,
  id_turma      INTEGER REFERENCES turmas(id) ON DELETE CASCADE,
  id_disciplina INTEGER REFERENCES disciplinas(id) ON DELETE SET NULL,
  id_professor  INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  dia_semana    INTEGER NOT NULL,
  hora_inicio   TIME NOT NULL,
  hora_fim      TIME NOT NULL,
  local         VARCHAR(100),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 14. PLANOS DE ENSINO
-- ============================================
CREATE TABLE planos_ensino (
  id                      SERIAL PRIMARY KEY,
  id_disciplina           INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  id_professor            INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  carga_horaria           INTEGER DEFAULT 0,
  ementa                  TEXT,
  objetivos_gerais        TEXT,
  objetivos_especificos   TEXT,
  conteudo_programatico   JSONB DEFAULT '[]'::jsonb,
  metodologia_geral       TEXT,
  criterios_avaliacao     TEXT,
  bibliografia_basica     TEXT,
  bibliografia_complementar TEXT,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 15. PLANOS DE AULA
-- ============================================
CREATE TABLE planos_aula (
  id                  SERIAL PRIMARY KEY,
  id_plano_ensino     INTEGER NOT NULL REFERENCES planos_ensino(id) ON DELETE CASCADE,
  data                DATE NOT NULL,
  horario_inicio      TIME,
  horario_fim         TIME,
  id_topico           INTEGER,
  objetivo_aula       TEXT,
  metodologia_dia     TEXT,
  recursos_didaticos  TEXT,
  atividades_realizadas TEXT,
  observacoes         TEXT,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 16. RECLAMACOES
-- ============================================
CREATE TABLE reclamacoes (
  id                SERIAL PRIMARY KEY,
  id_usuario        INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  protocolo         VARCHAR(50) UNIQUE,
  categoria         VARCHAR(100),
  assunto           VARCHAR(300) NOT NULL,
  descricao         TEXT,
  prioridade        VARCHAR(20) DEFAULT 'NORMAL',
  status            VARCHAR(20) DEFAULT 'PENDENTE',
  data_abertura     DATE DEFAULT CURRENT_DATE,
  data_resolucao    DATE,
  id_responsavel    INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  resposta_admin    TEXT,
  created_at        TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 17. DOCUMENTOS
-- ============================================
CREATE TABLE documentos (
  id          SERIAL PRIMARY KEY,
  id_usuario  INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  nome        VARCHAR(200) NOT NULL,
  tipo        VARCHAR(50),
  arquivo_url TEXT,
  data_envio  DATE DEFAULT CURRENT_DATE,
  status      VARCHAR(20) DEFAULT 'PENDENTE',
  observacoes TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 18. EDITAIS
-- ============================================
CREATE TABLE editais (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(300) NOT NULL,
  url         TEXT,
  ativo       BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 19. AGENDA EVENTOS
-- ============================================
CREATE TABLE agenda_eventos (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(200) NOT NULL,
  descricao   TEXT,
  data_inicio DATE NOT NULL,
  data_fim    DATE,
  tipo        VARCHAR(50),
  id_curso    INTEGER REFERENCES cursos(id) ON DELETE SET NULL,
  publico     BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 20. ATENDIMENTOS
-- ============================================
CREATE TABLE atendimentos (
  id              SERIAL PRIMARY KEY,
  id_usuario      INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  id_responsavel  INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  tipo            VARCHAR(100),
  data_atendimento DATE NOT NULL,
  hora            TIME NOT NULL,
  status          VARCHAR(20) DEFAULT 'AGENDADO',
  observacoes     TEXT,
  link_reuniao    TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 21. CODIGOS DE ACESSO
-- ============================================
CREATE TABLE codigos_acesso (
  id          SERIAL PRIMARY KEY,
  id_usuario  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  codigo      VARCHAR(6) NOT NULL,
  criado_em   TIMESTAMP DEFAULT NOW(),
  expira_em   TIMESTAMP NOT NULL,
  usado       BOOLEAN DEFAULT FALSE,
  validado_em TIMESTAMP
);

-- ============================================
-- 22. AUDITORIA
-- ============================================
CREATE TABLE auditoria (
  id          SERIAL PRIMARY KEY,
  timestamp   TIMESTAMP DEFAULT NOW(),
  usuario     VARCHAR(200) NOT NULL,
  tipo        VARCHAR(50) NOT NULL,
  acao        TEXT NOT NULL,
  detalhes    TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 23. PORTAIS (feature flags)
-- ============================================
CREATE TABLE portais (
  id              SERIAL PRIMARY KEY,
  codigo          VARCHAR(50) UNIQUE NOT NULL,
  nome            VARCHAR(100) NOT NULL,
  descricao       TEXT,
  ativo           BOOLEAN NOT NULL DEFAULT TRUE,
  desativado_em   TIMESTAMP,
  reativar_em     TIMESTAMP,
  motivo          TEXT,
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- RBAC — CARGOS
-- ============================================
INSERT INTO cargos (id, nome, descricao, is_admin_master) VALUES
  (1, 'Admin Master',   'Acesso total ao sistema', TRUE),
  (2, 'Administrador',  'Gere o sistema',          FALSE),
  (3, 'Secretaria',     'Gestao academica',        FALSE),
  (4, 'Professor',      'Lancamento de notas',     FALSE),
  (5, 'Aluno',          'Portal do aluno',         FALSE),
  (6, 'Candidato',      'Inscricoes e editais',    FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RBAC — PERMISSOES
-- ============================================
INSERT INTO permissoes (codigo, nome, descricao, modulo) VALUES
  -- ALUNOS
  ('aluno.visualizar',         'Visualizar Alunos',       'Ver dados dos alunos', 'alunos'),
  ('aluno.criar',              'Criar Aluno',             'Cadastrar novo aluno', 'alunos'),
  ('aluno.editar',             'Editar Aluno',            'Alterar dados do aluno', 'alunos'),
  ('aluno.excluir',            'Excluir Aluno',           'Remover aluno', 'alunos'),
  ('aluno.resetar-senha',      'Resetar Senha Aluno',     'Redefinir senha do aluno', 'alunos'),
  ('aluno.alterar-turma',      'Alterar Turma Aluno',     'Mover aluno de turma', 'alunos'),
  ('aluno.visualizar-notas',   'Ver Proprias Notas',      'Visualizar historico escolar', 'aluno'),
  ('aluno.visualizar-frequencia', 'Ver Propria Frequencia','Visualizar frequencia', 'aluno'),
  ('aluno.visualizar-horarios','Ver Horarios',            'Visualizar grade horaria', 'aluno'),
  ('matricula.visualizar',     'Ver Matricula',           'Visualizar dados da matricula', 'aluno'),
  -- DOCUMENTOS
  ('documento.aprovar',        'Aprovar Documento',       'Aprovar documento enviado', 'documentos'),
  ('documento.reprovar',       'Reprovar Documento',      'Reprovar documento enviado', 'documentos'),
  ('documento.excluir',        'Excluir Documento',       'Remover documento', 'documentos'),
  -- TURMAS
  ('turma.visualizar',         'Visualizar Turmas',       'Ver lista de turmas', 'turmas'),
  ('turma.criar',              'Criar Turma',             'Cadastrar nova turma', 'turmas'),
  ('turma.editar',             'Editar Turma',            'Alterar dados da turma', 'turmas'),
  ('turma.excluir',            'Excluir Turma',           'Remover turma', 'turmas'),
  -- DISCIPLINAS
  ('disciplina.visualizar',    'Visualizar Disciplinas',  'Ver lista de disciplinas', 'disciplinas'),
  ('disciplina.criar',         'Criar Disciplina',        'Cadastrar nova disciplina', 'disciplinas'),
  ('disciplina.editar',        'Editar Disciplina',       'Alterar dados da disciplina', 'disciplinas'),
  ('disciplina.excluir',       'Excluir Disciplina',      'Remover disciplina', 'disciplinas'),
  ('disciplina.concluir',      'Concluir Disciplina',     'Marcar disciplina como concluida', 'professor'),
  -- CURSOS
  ('curso.visualizar',         'Visualizar Cursos',       'Ver lista de cursos', 'cursos'),
  ('curso.criar',              'Criar Curso',             'Cadastrar novo curso', 'cursos'),
  ('curso.editar',             'Editar Curso',            'Alterar dados do curso', 'cursos'),
  ('curso.excluir',            'Excluir Curso',           'Remover curso', 'cursos'),
  -- UNIDADES
  ('unidade.visualizar',       'Visualizar Unidades',     'Ver lista de unidades', 'unidades'),
  ('unidade.criar',            'Criar Unidade',           'Cadastrar nova unidade', 'unidades'),
  ('unidade.editar',           'Editar Unidade',          'Alterar dados da unidade', 'unidades'),
  ('unidade.excluir',          'Excluir Unidade',         'Remover unidade', 'unidades'),
  -- INSCRICOES
  ('inscricao.visualizar',     'Visualizar Inscricoes',   'Ver lista de inscricoes', 'inscricoes'),
  ('inscricao.aprovar',        'Aprovar Inscricao',       'Aprovar/rejeitar inscricao', 'inscricoes'),
  ('inscricao.editar',         'Editar Inscricao',        'Alterar dados da inscricao', 'inscricoes'),
  ('inscricao.excluir',        'Excluir Inscricao',       'Remover inscricao', 'inscricoes'),
  -- USUARIOS
  ('usuario.visualizar',       'Visualizar Usuarios',     'Ver lista de usuarios', 'usuarios'),
  ('usuario.criar',            'Criar Usuario',           'Cadastrar novo usuario', 'usuarios'),
  ('usuario.editar',           'Editar Usuario',          'Alterar dados do usuario', 'usuarios'),
  ('usuario.excluir',          'Excluir Usuario',         'Remover usuario', 'usuarios'),
  -- EDITAIS
  ('edital.visualizar',        'Visualizar Editais',      'Ver lista de editais', 'editais'),
  ('edital.criar',             'Criar Edital',            'Cadastrar novo edital', 'editais'),
  ('edital.editar',            'Editar Edital',           'Alterar dados do edital', 'editais'),
  ('edital.excluir',           'Excluir Edital',          'Remover edital', 'editais'),
  -- RECLAMACOES
  ('reclamacao.visualizar',    'Visualizar Reclamacoes',  'Ver lista de reclamacoes', 'reclamacoes'),
  ('reclamacao.responder',     'Responder Reclamacao',    'Responder reclamacao do aluno', 'reclamacoes'),
  -- RELATORIOS
  ('relatorio.visualizar',     'Visualizar Relatorios',   'Acessar relatorios', 'relatorios'),
  ('relatorio.exportar',       'Exportar Relatorios',     'Exportar dados', 'relatorios'),
  -- AUDITORIA
  ('auditoria.visualizar',     'Visualizar Auditoria',    'Ver registro de auditoria', 'auditoria'),
  -- CARGOS
  ('cargo.gerenciar',          'Gerenciar Cargos',        'Criar/editar cargos e permissoes', 'cargos'),
  -- PROFESSOR (granular)
  ('nota.visualizar',          'Visualizar Notas',        'Ver notas dos alunos', 'professor'),
  ('nota.lancar',              'Lancar Nota',             'Inserir nota no sistema', 'professor'),
  ('nota.editar',              'Editar Nota',             'Alterar nota existente', 'professor'),
  ('frequencia.visualizar',    'Visualizar Frequencia',   'Ver frequencia dos alunos', 'professor'),
  ('frequencia.lancar',        'Lancar Frequencia',       'Registrar presenca/falta', 'professor'),
  ('frequencia.editar',        'Editar Frequencia',       'Alterar registro de frequencia', 'professor'),
  -- PLANO DE ENSINO
  ('plano_ensino.visualizar',  'Visualizar Planos',       'Ver planos de ensino', 'plano_ensino'),
  ('plano_ensino.criar',       'Criar Plano',             'Cadastrar plano de ensino', 'plano_ensino'),
  ('plano_ensino.editar',      'Editar Plano',            'Alterar plano de ensino', 'plano_ensino'),
  ('plano_ensino.excluir',     'Excluir Plano',           'Remover plano de ensino', 'plano_ensino'),
  -- PORTAIS
  ('portal.secretaria',        'Acesso Secretaria',       'Acessar portal da secretaria', 'portais'),
  ('portal.professor',         'Acesso Professor',        'Acessar portal do professor', 'portais'),
  ('portal.escolar',           'Acesso Aluno',            'Acessar portal do aluno', 'portais'),
  ('portal.inscricao',         'Acesso Inscricao',        'Acessar portal de inscricao', 'portais'),
  ('portal.gerenciar',         'Gerenciar Portais',       'Ativar/desativar portais', 'portais'),
  -- CATRACA
  ('catraca.acessar',          'Acessar Catraca',         'Validar codigos de acesso na catraca', 'catraca')
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- RBAC — CARGOS_PERMISSOES
-- Admin Master (1): is_admin_master = TRUE → todas as permissoes automaticamente
-- ============================================

-- Administrador (2): todas exceto cargo.gerenciar
INSERT INTO cargos_permissoes (id_cargo, id_permissao)
SELECT 2, id FROM permissoes WHERE codigo != 'cargo.gerenciar'
ON CONFLICT DO NOTHING;

-- Secretaria (3)
INSERT INTO cargos_permissoes (id_cargo, id_permissao)
SELECT 3, id FROM permissoes WHERE codigo IN (
  'aluno.visualizar', 'aluno.editar',
  'documento.aprovar', 'documento.reprovar',
  'turma.visualizar', 'disciplina.visualizar',
  'curso.visualizar', 'unidade.visualizar',
  'inscricao.visualizar', 'inscricao.aprovar',
  'usuario.visualizar', 'edital.visualizar',
  'reclamacao.visualizar', 'reclamacao.responder',
  'relatorio.visualizar', 'relatorio.exportar',
  'auditoria.visualizar',
  'portal.secretaria',
  'catraca.acessar'
) ON CONFLICT DO NOTHING;

-- Professor (4)
INSERT INTO cargos_permissoes (id_cargo, id_permissao)
SELECT 4, id FROM permissoes WHERE codigo IN (
  'aluno.visualizar', 'turma.visualizar', 'curso.visualizar',
  'disciplina.visualizar',
  'nota.visualizar', 'nota.lancar', 'nota.editar',
  'frequencia.visualizar', 'frequencia.lancar', 'frequencia.editar',
  'disciplina.concluir',
  'plano_ensino.visualizar', 'plano_ensino.criar', 'plano_ensino.editar',
  'aluno.visualizar-notas', 'aluno.visualizar-frequencia',
  'portal.professor'
) ON CONFLICT DO NOTHING;

-- Aluno (5)
INSERT INTO cargos_permissoes (id_cargo, id_permissao)
SELECT 5, id FROM permissoes WHERE codigo IN (
  'aluno.visualizar-notas', 'aluno.visualizar-frequencia',
  'aluno.visualizar-horarios', 'matricula.visualizar',
  'portal.escolar', 'portal.inscricao'
) ON CONFLICT DO NOTHING;

-- Candidato (6)
INSERT INTO cargos_permissoes (id_cargo, id_permissao)
SELECT 6, id FROM permissoes WHERE codigo IN (
  'portal.inscricao'
) ON CONFLICT DO NOTHING;

-- ============================================
-- PORTAIS (feature flags)
-- ============================================
INSERT INTO portais (codigo, nome, descricao) VALUES
  ('inscricao',  'Portal Inscricao',   'Inscricoes e matriculas'),
  ('escolar',    'Portal Escolar',     'Portal do aluno'),
  ('professor',  'Portal Professor',   'Lancamento de notas e frequencia'),
  ('secretaria', 'Portal Secretaria',  'Gestao administrativa e academica')
ON CONFLICT (codigo) DO NOTHING;

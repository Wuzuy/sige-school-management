-- ============================================
-- Migracao: Adiciona consentimento LGPD
-- ============================================

ALTER TABLE inscricoes ADD COLUMN IF NOT EXISTS consentimento_lgpd BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE inscricoes ADD COLUMN IF NOT EXISTS data_consentimento TIMESTAMP DEFAULT NOW();

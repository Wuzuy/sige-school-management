import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = 'https://seu-projeto.supabase.co';
const supabaseServiceKey = 'SUA_CHAVE_SERVICE_ROLE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sqlPath = resolve(__dirname, 'supabase-cargos-permissoes.sql');
const sql = readFileSync(sqlPath, 'utf8');

// Split by semicolons, filter empty/whitespace
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Executando ${statements.length} comandos SQL...`);

let success = 0;
let failed = 0;

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  try {
    // Use raw query via PostgREST with service_role key
    // The service_role bypasses RLS but PostgREST still doesn't support DDL.
    // We use the "execute" RPC pattern.
    const { error } = await supabase.rpc('exec_sql', { query: stmt + ';' });
    if (error) {
      // If rpc fails because function doesn't exist, use REST API approach
      if (error.message.includes('function "exec_sql" does not exist')) {
        throw new Error('RPC function not available');
      }
      console.error(`  [${i+1}] ERRO: ${error.message}`);
      failed++;
    } else {
      console.log(`  [${i+1}] OK`);
      success++;
    }
  } catch (e) {
    if (e.message === 'RPC function not available') {
      // Fallback: use direct fetch to PostgREST with raw SQL header
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Prefer': 'params=object',
            'X-SQL': stmt + ';'
          }
        });
        if (!response.ok) {
          const text = await response.text();
          console.error(`  [${i+1}] ERRO (REST): ${text}`);
          failed++;
        } else {
          console.log(`  [${i+1}] OK`);
          success++;
        }
      } catch (e2) {
        console.error(`  [${i+1}] ERRO: ${e2.message}`);
        failed++;
      }
    } else {
      console.error(`  [${i+1}] ERRO nao esperado: ${e.message}`);
      failed++;
    }
  }
}

console.log(`\nConcluido: ${success} OK, ${failed} falhas.`);
process.exit(failed > 0 ? 1 : 0);

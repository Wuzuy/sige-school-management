const fs = require('fs');
const base = 'https://seu-projeto.supabase.co/rest/v1/';
const key = 'SUA_CHAVE_SERVICE_ROLE';
const h = { 'apikey': key, 'Authorization': 'Bearer ' + key };

function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  if (typeof v === 'number') return String(v);
  return "'" + String(v).replace(/'/g, "''") + "'";
}

async function fetchAll(table, order) {
  let all = [];
  let start = 0;
  const limit = 1000;
  while (true) {
    const url = base + table + '?select=*&limit=' + limit + '&offset=' + start + (order ? '&order=' + order : '');
    const r = await fetch(url, { headers: h });
    if (!r.ok) { console.error('FETCH ERROR ' + table + ':', r.status); break; }
    const data = await r.json();
    if (!data.length) break;
    all = all.concat(data);
    start += limit;
    if (data.length < limit) break;
  }
  return all;
}

async function main() {
  let sql = '-- ============================================\n';
  sql += '-- SIGE — FULL DATABASE DUMP\n';
  sql += '-- Gerado em ' + new Date().toISOString() + '\n';
  sql += '-- ============================================\n\n';
  sql += 'BEGIN;\n\n';

  const tables = [
    { name: 'cargos', order: 'id' },
    { name: 'permissoes', order: 'id' },
    { name: 'cargos_permissoes', order: 'id' },
    { name: 'portais', order: 'id' },
    { name: 'usuarios', order: 'id' },
    { name: 'unidades', order: 'id' },
    { name: 'cursos', order: 'id' },
    { name: 'turmas', order: 'id' },
    { name: 'disciplinas', order: 'id' },
    { name: 'horarios', order: 'id' },
    { name: 'inscricoes', order: 'id' },
    { name: 'matriculas', order: 'id' },
    { name: 'historico_escolar', order: 'id' },
    { name: 'frequencia', order: 'id' },
    { name: 'reclamacoes', order: 'id' },
    { name: 'atendimentos', order: 'id' },
    { name: 'auditoria', order: 'id' },
    { name: 'planos_ensino', order: 'id' },
    { name: 'planos_aula', order: 'id' },
    { name: 'editais', order: 'id' },
    { name: 'agenda_eventos', order: 'id' },
    { name: 'documentos', order: 'id' },
    { name: 'codigos_acesso', order: 'id' },
  ];

  for (const t of tables) {
    console.log('Exporting ' + t.name + '...');
    const rows = await fetchAll(t.name, t.order);
    if (rows.length === 0) {
      sql += '-- ' + t.name + ': vazio\n\n';
      continue;
    }

    const cols = Object.keys(rows[0]).filter(c => c !== 'id');
    sql += '-- ' + t.name + ': ' + rows.length + ' registros\n';

    const batchSize = 100;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const values = batch.map(row => {
        const vals = [esc(row.id)];
        for (const c of cols) vals.push(esc(row[c]));
        return '(' + vals.join(', ') + ')';
      }).join(',\n');

      const allCols = 'id' + (cols.length > 0 ? ', ' + cols.join(', ') : '');
      sql += 'INSERT INTO ' + t.name + ' (' + allCols + ') VALUES\n' + values + ';\n';
    }
    sql += '\n';
  }

  sql += 'COMMIT;\n';

  fs.writeFileSync('database/full-dump.sql', sql, 'utf8');
  console.log('\n=== CONCLUIDO: database/full-dump.sql (' + (sql.length / 1024 / 1024).toFixed(2) + ' MB) ===');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });

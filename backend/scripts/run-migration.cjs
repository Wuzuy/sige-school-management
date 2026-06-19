require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const { readFileSync } = require('fs');
const { resolve } = require('path');

const { Client } = require('pg');

const serviceKey = 'SUA_CHAVE_SERVICE_ROLE';

const regions = [
  'us-east-1',
  'eu-west-1',
  'eu-central-1',
  'us-west-1',
  'sa-east-1',
  'ap-southeast-1',
  'ap-northeast-1'
];

const projectRef = 'seu-projeto';
const sqlPath = resolve(__dirname, '..', '..', 'database', 'supabase-cargos-permissoes.sql');

async function tryMigrate(region) {
  const client = new Client({
    host: `aws-0-${region}.pooler.supabase.com`,
    port: 6543,
    database: 'postgres',
    user: `postgres.${projectRef}`,
    password: serviceKey,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log(`Conectado via ${region}!`);
    const sql = readFileSync(sqlPath, 'utf8');
    const result = await client.query(sql);
    console.log(`Migration executada com sucesso!`);
    await client.end();
    return true;
  } catch (e) {
    if (e.message?.includes('password') || e.message?.includes('auth')) {
      console.log(`  ${region}: falha de autenticacao`);
    } else {
      console.log(`  ${region}: ${e.message.slice(0, 100)}`);
    }
    try { await client.end(); } catch {}
    return false;
  }
}

(async () => {
  for (const region of regions) {
    console.log(`Tentando regiao ${region}...`);
    if (await tryMigrate(region)) {
      process.exit(0);
    }
  }
  console.log('\nNao foi possivel conectar em nenhuma regiao.');
  console.log('Execute o SQL manualmente no Supabase Dashboard > SQL Editor.');
  process.exit(1);
})();

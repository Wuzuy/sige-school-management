const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STATIC_PORT = 3458;
const BASE_URL = `http://localhost:${STATIC_PORT}`;
const API_BASE = 'http://localhost:8080/api';

const MIME = { '.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2','.ico':'image/x-icon' };

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function login(email, senha) {
  const r = await fetch(`${API_BASE}/usuarios/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, senha }) });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText);
  return r.json();
}

async function shot(page, url, filepath, sel) {
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    if (sel) try { await page.waitForSelector(sel, { timeout: 8000 }); } catch {}
    await wait(1000);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`OK ${path.basename(filepath)}`);
  } catch (e) {
    console.error(`ERR ${path.basename(filepath)}: ${e.message.slice(0,100)}`);
  }
}

async function main() {
  console.log('Starting static server...');
  const www = path.join(ROOT, 'frontend-web');
  const srv = http.createServer((req, res) => {
    let p = req.url.split('?')[0];
    if (p === '/') p = '/portal-inscricao/login.html';
    let fp = path.join(www, p);
    if (!fs.existsSync(fp)) {
      const idx = path.join(path.dirname(fp), 'index.html');
      if (fs.existsSync(idx)) fp = idx;
      else { res.writeHead(404); res.end(); return; }
    }
    if (fs.statSync(fp).isDirectory()) {
      const idx = path.join(fp, 'index.html');
      if (fs.existsSync(idx)) fp = idx;
      else { res.writeHead(404); res.end(); return; }
    }
    const ext = path.extname(fp);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' });
    fs.createReadStream(fp).pipe(res);
  });
  await new Promise(r => srv.listen(STATIC_PORT, r));

  console.log('Waiting for backend...');
  for (let i = 0; i < 40; i++) {
    try { await fetch(`${API_BASE}/cursos`, { signal: AbortSignal.timeout(2000) }); break; } catch { await wait(1000); }
    if (i === 39) { console.error('Backend unreachable'); srv.close(); process.exit(1); }
  }

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

  // Login page screenshot (no auth)
  const lp = await browser.newPage();
  await lp.setViewport({ width: 1366, height: 900 });
  await shot(lp, `${BASE_URL}/portal-inscricao/login.html`, `${path.join(ROOT, 'docs', 'screenshots')}\\login.png`, '.card');
  await lp.close();

  const users = {
    candidato: { email: 'andre.fernandes@email.com', senha: '123456', dir: 'inscricao' },
    aluno:     { email: 'joao.santos@aluno.edu.br', senha: '123456', dir: 'aluno' },
    professor: { email: 'carlos.mendes@sige.edu.br', senha: '123456', dir: 'professor' },
    admin:     { email: 'admin@sige.com.br', senha: '123456', dir: 'administrador' },
  };

  for (const [type, creds] of Object.entries(users)) {
    console.log(`\n--- ${type} ---`);
    let auth;
    try { auth = await login(creds.email, creds.senha); } catch (e) { console.error(`Login FAIL: ${e.message}`); continue; }
    console.log(auth.usuario.nomeCompleto);

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });

    await page.goto(`${BASE_URL}/portal-inscricao/login.html`, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.evaluate((a) => {
      localStorage.setItem('auth', JSON.stringify(a));
      localStorage.setItem('API_BASE_URL', 'http://localhost:8080/api');
    }, auth);
    await wait(500);

    const dir = path.join(ROOT, 'docs', 'screenshots', creds.dir);

    if (type === 'candidato') {
      await shot(page, `${BASE_URL}/portal-inscricao/index.html`, `${dir}\\01-cursos.png`, '.card');
      await shot(page, `${BASE_URL}/portal-inscricao/inscricao.html?cursoId=1`, `${dir}\\02-inscricao.png`, '.card');
      await shot(page, `${BASE_URL}/portal-inscricao/privacidade.html`, `${dir}\\03-privacidade.png`, 'main');
    }

    if (type === 'aluno') {
      await shot(page, `${BASE_URL}/portal-escolar/index.html`, `${dir}\\00-dashboard.png`, '.hero');
      await shot(page, `${BASE_URL}/portal-escolar/consulta-freq.html`, `${dir}\\01-frequencia.png`, '#frequencia-body');
      await shot(page, `${BASE_URL}/portal-escolar/historico-escolar.html`, `${dir}\\02-historico.png`, '#historico-body');
      await shot(page, `${BASE_URL}/portal-escolar/estrutura-curricular.html`, `${dir}\\03-curriculo.png`, '.card');
      await shot(page, `${BASE_URL}/portal-escolar/quadro-horarios.html`, `${dir}\\04-horarios.png`, '.table');
      await shot(page, `${BASE_URL}/portal-escolar/agenda-escolar.html`, `${dir}\\05-agenda.png`, '#agenda-events');
      await shot(page, `${BASE_URL}/portal-escolar/meus-documentos.html`, `${dir}\\06-documentos.png`, '#documentos-body');
      await shot(page, `${BASE_URL}/portal-escolar/financeiro.html`, `${dir}\\07-financeiro.png`, '#financeiro-content');
      await shot(page, `${BASE_URL}/portal-escolar/reclamacoes.html`, `${dir}\\08-reclamacoes.png`, '.card');
      await shot(page, `${BASE_URL}/portal-escolar/ouvidoria.html`, `${dir}\\09-ouvidoria.png`, '.card');
      await shot(page, `${BASE_URL}/portal-escolar/atendimento-agendado.html`, `${dir}\\10-atendimento.png`, '.card');
      await shot(page, `${BASE_URL}/portal-escolar/conta.html`, `${dir}\\11-conta.png`, '.card');
    }

    if (type === 'professor') {
      await shot(page, `${BASE_URL}/portal-professor/portal-professor.html`, `${dir}\\00-dashboard.png`, '.container');

      async function pm(target) {
        await page.evaluate((t) => {
          const el = document.querySelector(`[data-module-target="${t}"]`);
          if (el) el.click();
        }, target);
        await wait(2000);
      }

      const mods = [
        ['01-turmas',     'modulo-turmas'],
        ['02-notas',      'modulo-notas'],
        ['03-frequencia', 'modulo-frequencia'],
        ['04-disciplinas','modulo-disciplinas'],
        ['05-planos-aula','modulo-planos-aula'],
      ];
      for (const [label, target] of mods) {
        try {
          await pm(target);
          await page.screenshot({ path: `${dir}\\${label}.png`, fullPage: true });
          console.log(`OK ${label}.png`);
        } catch { console.error(`ERR ${label}.png`); }
      }

      // Lançar Notas with turma data loaded
      try {
        await pm('modulo-notas');
        const turmas = await page.evaluate(() =>
          Array.from(document.getElementById('notas-turma').options).filter(o => o.value).map(o => ({ id: o.value }))
        );
        if (turmas.length > 0) {
          await page.evaluate((id) => {
            const s = document.getElementById('notas-turma');
            s.value = id; s.dispatchEvent(new Event('change', { bubbles: true }));
          }, turmas[0].id);
          await wait(2000);
          const discs = await page.evaluate(() =>
            Array.from(document.getElementById('notas-disciplina').options).filter(o => o.value).map(o => ({ id: o.value }))
          );
          if (discs.length > 0) {
            await page.evaluate((id) => { document.getElementById('notas-disciplina').value = id; }, discs[0].id);
            await page.click('#btn-carregar-notas');
            await wait(3000);
            try { await page.waitForSelector('#notas-table-wrapper:not(.hidden)', { timeout: 8000 }); } catch {}
            await page.screenshot({ path: `${dir}\\06-notas-lancar.png`, fullPage: true });
            console.log('OK 06-notas-lancar.png');
          }
        }
      } catch (e) { console.error(`ERR notas-lancar: ${e.message.slice(0,100)}`); }

      // Lançar Frequência with turma data loaded
      try {
        await pm('modulo-frequencia');
        const turmas = await page.evaluate(() =>
          Array.from(document.getElementById('freq-turma').options).filter(o => o.value).map(o => ({ id: o.value }))
        );
        if (turmas.length > 0) {
          await page.evaluate((id) => {
            const s = document.getElementById('freq-turma');
            s.value = id; s.dispatchEvent(new Event('change', { bubbles: true }));
          }, turmas[0].id);
          await wait(2000);
          const discs = await page.evaluate(() =>
            Array.from(document.getElementById('freq-disciplina').options).filter(o => o.value).map(o => ({ id: o.value }))
          );
          if (discs.length > 0) {
            await page.evaluate((id) => { document.getElementById('freq-disciplina').value = id; }, discs[0].id);
            await page.click('#freq-data');
            await page.click('#btn-carregar-frequencia');
            await wait(3000);
            try { await page.waitForSelector('#freq-table-wrapper:not(.hidden)', { timeout: 8000 }); } catch {}
            await page.screenshot({ path: `${dir}\\07-frequencia-lancar.png`, fullPage: true });
            console.log('OK 07-frequencia-lancar.png');
          }
        }
      } catch (e) { console.error(`ERR frequencia-lancar: ${e.message.slice(0,100)}`); }
    }

    if (type === 'admin') {
      await shot(page, `${BASE_URL}/portal-secretaria/portal-secretaria.html`, `${dir}\\00-dashboard.png`, '.container');

      async function cm(target) {
        await page.evaluate((t) => {
          const el = document.querySelector(`[data-module-target="${t}"]`);
          if (el) el.click();
        }, target);
        await wait(2000);
      }
      async function sm(mode) {
        await page.evaluate((m) => {
          const btn = document.querySelector(`[data-sec-mode="${m}"]`);
          if (btn) btn.click();
        }, mode);
        await wait(1500);
      }

      const modules = [
        ['01-inscricoes',       'modulo-inscricoes'],
        ['02-cursos',           'modulo-cursos'],
        ['03-unidades',         'modulo-unidades'],
        ['04-editais',          'modulo-editais'],
        ['05-relatorios',       'modulo-relatorios'],
        ['06-turmas',           'modulo-turmas',             'turmas'],
        ['07-disciplinas',      'modulo-disciplinas'],
        ['08-dashboard-alunos', 'modulo-dashboard-alunos',   'alunos'],
        ['09-alunos',           'modulo-alunos'],
        ['10-reclamacoes',      'modulo-reclamacoes'],
        ['11-relatorios-alunos','modulo-relatorios-alunos'],
        ['12-dashboard-prof',   'modulo-dashboard-professor','professor'],
        ['13-professores',      'modulo-professores'],
        ['14-usuarios',         'modulo-usuarios'],
        ['15-cargos',           'modulo-cargos'],
        ['16-portais',          'modulo-portais'],
        ['17-auditoria',        'modulo-auditoria'],
        ['18-configuracoes',    'modulo-configuracoes'],
      ];
      for (const [label, target, mode] of modules) {
        try {
          if (mode) await sm(mode);
          await cm(target);
          await page.screenshot({ path: `${dir}\\${label}.png`, fullPage: true });
          console.log(`OK ${label}.png`);
        } catch { console.error(`ERR ${label}.png`); }
      }
    }

    await page.close();
  }

  await browser.close();
  srv.close();
  console.log('\nConcluido!');
}

main().catch(e => { console.error(e.message); process.exit(1); });

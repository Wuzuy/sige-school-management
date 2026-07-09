const puppeteer = require('puppeteer');
const BASE = 'https://sige-iota.vercel.app';
const DIR = 'printscreens';

const profiles = [
  { email: 'candidato@sige.com.br', senha: '123456', role: 'candidato' },
  { email: 'aluno@sige.com.br', senha: '123456', role: 'aluno' },
  { email: 'professor@sige.com.br', senha: '123456', role: 'professor' },
  { email: 'secretaria@sige.com.br', senha: '123456', role: 'secretaria' },
  { email: 'admin@sige.com.br', senha: '123456', role: 'admin' }
];

const GOTO_OPTS = { waitUntil: 'domcontentloaded', timeout: 30000 };

async function loginDirect(page, email, senha) {
  const result = await page.evaluate(async (e, s) => {
    try {
      const API = 'https://seu-backend.exemplo.com/api';
      const resp = await fetch(API + '/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e, senha: s }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        return { ok: false, error: 'HTTP ' + resp.status + ': ' + text.substring(0, 100) };
      }
      const data = await resp.json();
      if (!data.token || !data.usuario) return { ok: false, error: 'Resposta de login invalida' };
      localStorage.setItem('auth', JSON.stringify({ token: data.token, usuario: data.usuario, permissoes: data.permissoes || [] }));
      return { ok: true, permissoes: data.permissoes || [] };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, email, senha);
  console.log('  login:', result.ok ? 'OK ' + result.permissoes.length + ' perms' : 'FAIL ' + result.error);
  return result;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.setViewport({ width: 1366, height: 768 });

  await page.goto(BASE + '/portal-inscricao/login.html', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  for (const profile of profiles) {
    console.log('\n=== ' + profile.role + ' (' + profile.email + ') ===');
    await page.evaluate(() => { localStorage.clear(); });
    const result = await loginDirect(page, profile.email, profile.senha);
    if (!result.ok) { console.log('  SKIP'); continue; }

    if (profile.role === 'candidato') {
      await page.goto(BASE + '/portal-inscricao/index.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: DIR + '/portal-inscricao-candidato-cursos.png', fullPage: false });
      await page.goto(BASE + '/portal-inscricao/inscricao.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: DIR + '/portal-inscricao-candidato-inscricao.png', fullPage: false });
      await page.goto(BASE + '/portal-inscricao/status.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: DIR + '/portal-inscricao-candidato-status.png', fullPage: false });
      console.log('  OK');
    }

    if (profile.role === 'aluno') {
      await page.goto(BASE + '/portal-escolar/index.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: DIR + '/portal-escolar-aluno-dashboard.png', fullPage: false });
      await page.goto(BASE + '/portal-escolar/historico-escolar.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: DIR + '/portal-escolar-aluno-historico.png', fullPage: false });
      await page.goto(BASE + '/portal-escolar/consulta-freq.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: DIR + '/portal-escolar-aluno-frequencia.png', fullPage: false });
      await page.goto(BASE + '/portal-escolar/quadro-horarios.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: DIR + '/portal-escolar-aluno-horarios.png', fullPage: false });
      await page.goto(BASE + '/portal-escolar/calendario-escolar.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: DIR + '/portal-escolar-aluno-calendario.png', fullPage: false });
      await page.goto(BASE + '/portal-escolar/agenda-escolar.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: DIR + '/portal-escolar-aluno-agenda.png', fullPage: false });
      await page.goto(BASE + '/portal-escolar/conta.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: DIR + '/portal-escolar-aluno-perfil.png', fullPage: false });
      await page.goto(BASE + '/portal-escolar/atendimento-agendado.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: DIR + '/portal-escolar-aluno-atendimento.png', fullPage: false });
      await page.goto(BASE + '/portal-escolar/meus-documentos.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: DIR + '/portal-escolar-aluno-documentos.png', fullPage: false });
      console.log('  OK');
    }

    if (profile.role === 'professor') {
      await page.goto(BASE + '/portal-professor/portal-professor.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 10000));
      await page.screenshot({ path: DIR + '/portal-professor-professor-dashboard.png', fullPage: false });
      console.log('  OK');
    }

    if (profile.role === 'secretaria') {
      await page.goto(BASE + '/portal-secretaria/portal-secretaria.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 5000));
      await page.screenshot({ path: DIR + '/portal-secretaria-secretaria-dashboard.png', fullPage: false });
      console.log('  OK');
    }

    if (profile.role === 'admin') {
      await page.goto(BASE + '/portal-secretaria/portal-secretaria.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 5000));
      await page.screenshot({ path: DIR + '/portal-secretaria-admin-dashboard.png', fullPage: false });
      await page.goto(BASE + '/portal-professor/portal-professor.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 5000));
      await page.screenshot({ path: DIR + '/portal-professor-admin-dashboard.png', fullPage: false });
      await page.goto(BASE + '/portal-escolar/index.html', GOTO_OPTS);
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: DIR + '/portal-escolar-admin-dashboard.png', fullPage: false });
      console.log('  OK');
    }
  }

  await browser.close();
  console.log('\n=== CONCLUIDO ===');
})();

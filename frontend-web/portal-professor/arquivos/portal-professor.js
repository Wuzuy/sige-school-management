window.initPortalSecretariaPage = async function () {};

const state = {
  turmas: [], alunos: [], disciplinas: [], notas: [], frequencia: [],
  chartDesempenho: null,
};

function showConfirm(msg) {
  return new Promise((resolve) => {
    document.getElementById('confirm-message').textContent = msg;
    document.getElementById('modal-confirm').classList.remove('hidden');
    document.getElementById('confirm-ok').onclick = () => { document.getElementById('modal-confirm').classList.add('hidden'); resolve(true); };
    document.getElementById('confirm-cancel').onclick = () => { document.getElementById('modal-confirm').classList.add('hidden'); resolve(false); };
    document.getElementById('confirm-close').onclick = () => { document.getElementById('modal-confirm').classList.add('hidden'); resolve(false); };
  });
}

function requireTeacherAuth() {
  const auth = getAuth();
  if (!auth?.token || !auth?.usuario) { window.location.href = getLoginPageUrl(); return null; }
  const permissoes = auth.permissoes || [];
  if (permissoes.includes('portal.professor') || auth.usuario.role === 'ROLE_TEACHER' || auth.usuario.role === 'ROLE_ADMIN') return auth;
  window.location.href = '../portal-escolar/index.html'; return null;
}

function populateSidebarUser(auth) {
  const user = auth?.usuario;
  if (!user) return;
  document.getElementById('sec-user-name').textContent = user.nomeCompleto || 'Professor';
  document.getElementById('sec-user-email').textContent = user.email || '-';
  const initials = (user.nomeCompleto || 'PR').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  document.getElementById('sec-user-avatar').textContent = initials || 'PR';
  const badge = document.getElementById('sec-user-role');
  const secretariaLink = document.getElementById('link-secretaria');
  if (user.role === 'ROLE_ADMIN') {
    badge.textContent = 'Admin'; badge.style.background = '#dbeafe'; badge.style.color = '#1e40af';
    if (secretariaLink) secretariaLink.style.display = '';
  } else {
    badge.textContent = 'Professor'; badge.style.background = ''; badge.style.color = '';
    if (secretariaLink) secretariaLink.style.display = 'none';
  }
}

function setupModuleNav() {
  document.querySelectorAll('[data-module-target]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.moduleTarget;
      document.querySelectorAll('.module-panel').forEach(p => p.classList.add('hidden'));
      const target = document.getElementById(targetId);
      if (target) target.classList.remove('hidden');
      document.querySelectorAll('[data-module-target]').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function setupSidebarToggle() {
  const btn = document.getElementById('sec-sidebar-toggle');
  const sidebar = document.getElementById('sec-sidebar');
  if (btn && sidebar) {
    btn.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 767 && !sidebar.contains(e.target) && e.target !== btn) sidebar.classList.remove('open');
    });
  }
}

function loadConfig() {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); document.getElementById('toggle-dark-mode').checked = true; }
  const fontSize = localStorage.getItem('fontSize') || 'md';
  document.documentElement.setAttribute('data-font-size', fontSize);
  document.querySelectorAll('[data-font]').forEach(btn => btn.classList.toggle('active', btn.dataset.font === fontSize));
  document.getElementById('toggle-dark-mode').addEventListener('change', (e) => {
    localStorage.setItem('theme', e.target.checked ? 'dark' : 'light');
    if (e.target.checked) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  });
  document.querySelectorAll('[data-font]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-font]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      localStorage.setItem('fontSize', btn.dataset.font);
      document.documentElement.setAttribute('data-font-size', btn.dataset.font);
    });
  });
}

async function apiGet(path) {
  const auth = getAuth();
  const headers = {};
  if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) {
    if (res.status === 401) { clearAuth(); window.location.href = getLoginPageUrl(); }
    const text = await res.text();
    throw new Error(text || 'Erro na requisição');
  }
  if (res.status === 204) return null;
  return res.json();
}

async function apiPut(path, body) {
  const auth = getAuth();
  const headers = { 'Content-Type': 'application/json' };
  if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    if (res.status === 401) { clearAuth(); window.location.href = getLoginPageUrl(); }
    const text = await res.text();
    throw new Error(text || 'Erro na requisição');
  }
  return res.json();
}

async function apiPost(path, body) {
  const auth = getAuth();
  const headers = { 'Content-Type': 'application/json' };
  if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    if (res.status === 401) { clearAuth(); window.location.href = getLoginPageUrl(); }
    const text = await res.text();
    throw new Error(text || 'Erro na requisição');
  }
  return res.json();
}

// =============================================
// DASHBOARD
// =============================================

async function loadDashboard() {
  try {
    const [stats, turmas] = await Promise.all([
      apiGet('/professor/dashboard/stats'),
      apiGet('/professor/turmas'),
    ]);
    state.turmas = turmas;

    document.getElementById('kpi-turmas').textContent = stats.turmas;
    document.getElementById('kpi-alunos').textContent = stats.alunos;
    document.getElementById('kpi-disciplinas').textContent = stats.disciplinas;
    document.getElementById('kpi-aulas').textContent = stats.aulas;
    document.getElementById('stat-aprovados').textContent = stats.statusCounts?.APROVADO || 0;
    document.getElementById('stat-reprovados').textContent = stats.statusCounts?.REPROVADO || 0;
    document.getElementById('stat-recuperacao').textContent = stats.statusCounts?.RECUPERACAO || 0;
    document.getElementById('stat-cursando').textContent = stats.statusCounts?.CURSANDO || 0;

    const container = document.getElementById('dash-turmas-lista');
    if (turmas.length === 0) {
      container.innerHTML = '<p class="muted">Nenhuma turma atribuída.</p>';
    } else {
      const alunosPromises = turmas.map(t => apiGet(`/professor/turmas/${t.id}/alunos`));
      const alunosResults = await Promise.all(alunosPromises);
      container.innerHTML = turmas.map((t, i) => `
        <div class="dash-turma-item">
          <div>
            <div class="dash-turma-nome">${t.nome}</div>
            <div class="dash-turma-curso">${t.id_curso?.nome_curso || '-'}</div>
          </div>
          <div class="dash-turma-info">
            <div>${(alunosResults[i] || []).length} alunos</div>
            <div>${t.turno || '-'} / ${t.ano || '-'}</div>
          </div>
        </div>
      `).join('');
    }

    try { renderDesempenhoChart(stats); } catch {}
  } catch (err) {
    showError('Erro ao carregar dashboard: ' + err.message);
  }
}

function renderDesempenhoChart(stats) {
  const canvas = document.getElementById('chart-desempenho');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (state.chartDesempenho) { state.chartDesempenho.destroy(); state.chartDesempenho = null; }

  const labels = ['Aprovados', 'Reprovados', 'Recuperação', 'Cursando'];
  const data = [
    stats.statusCounts?.APROVADO || 0,
    stats.statusCounts?.REPROVADO || 0,
    stats.statusCounts?.RECUPERACAO || 0,
    stats.statusCounts?.CURSANDO || 0,
  ];
  const colors = ['#059669', '#ef4444', '#f59e0b', '#3b82f6'];

  if (data.every(v => v === 0)) return;

  state.chartDesempenho = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } } },
    },
  });
}

// =============================================
// TURMAS
// =============================================

async function loadTurmas() {
  try {
    state.turmas = await apiGet('/professor/turmas');
    renderTurmas(state.turmas);
  } catch (err) {
    showError('Erro ao carregar turmas: ' + err.message);
  }
}

function renderTurmas(data) {
  const texto = (document.getElementById('filtro-turma-texto').value || '').toLowerCase();
  const status = document.getElementById('filtro-turma-status').value;
  const filtered = data.filter(t => {
    if (status !== 'TODOS' && t.status !== status) return false;
    if (texto && !t.nome.toLowerCase().includes(texto) && !(t.id_curso?.nome_curso || '').toLowerCase().includes(texto)) return false;
    return true;
  });
  const tbody = document.getElementById('lista-turmas');
  const empty = document.getElementById('turmas-empty');
  if (filtered.length === 0) { tbody.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  tbody.innerHTML = filtered.map(t => `
    <tr>
      <td><strong>${t.nome}</strong></td>
      <td>${t.id_curso?.nome_curso || '-'}</td>
      <td>${t.turno || '-'}</td>
      <td>${t.vagas || '-'}</td>
      <td>${t.ano || '-'}</td>
      <td><span class="badge ${t.status === 'ATIVO' ? 'badge-success' : 'badge-danger'}">${t.status || '-'}</span></td>
      <td><button class="action-btn view" title="Ver Alunos" data-ver-turma="${t.id}">&#128065;</button></td>
    </tr>
  `).join('');
  tbody.querySelectorAll('[data-ver-turma]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('notas-turma').value = btn.dataset.verTurma;
      document.querySelector('[data-module-target="modulo-notas"]').click();
      document.getElementById('btn-carregar-notas').click();
    });
  });
}

// =============================================
// NOTAS
// =============================================

async function loadNotasTurmas() {
  try {
    const turmas = await apiGet('/professor/turmas');
    const select = document.getElementById('notas-turma');
    select.innerHTML = '<option value="">Selecione...</option>' + turmas.map(t => `<option value="${t.id}">${t.nome} - ${t.id_curso?.nome_curso || ''}</option>`).join('');
    state.turmas = turmas;
  } catch (err) {
    showError('Erro ao carregar turmas: ' + err.message);
  }
}

async function loadNotasDisciplinas(turmaId) {
  try {
    const data = await apiGet(`/professor/turmas/${turmaId}/disciplinas`);
    const select = document.getElementById('notas-disciplina');
    select.innerHTML = '<option value="">Selecione...</option>' + data.map(d => `<option value="${d.id}">${d.nome} (${d.codigo || ''})</option>`).join('');
    state.disciplinas = data;
  } catch (err) {
    showError('Erro ao carregar disciplinas: ' + err.message);
  }
}

async function loadNotas() {
  const turmaId = document.getElementById('notas-turma').value;
  const disciplinaId = document.getElementById('notas-disciplina').value;
  if (!turmaId || !disciplinaId) { showError('Selecione turma e disciplina.'); return; }

  const wrapper = document.getElementById('notas-table-wrapper');
  const empty = document.getElementById('notas-empty');
  const loading = document.getElementById('notas-carregando');
  wrapper.classList.add('hidden'); empty.classList.add('hidden'); loading.classList.remove('hidden');

  try {
    const data = await apiGet(`/professor/notas?turma=${turmaId}&disciplina=${disciplinaId}`);
    state.notas = data;
    loading.classList.add('hidden');
    if (data.length === 0) { empty.classList.remove('hidden'); return; }

    const tbody = document.getElementById('lista-notas');
    tbody.innerHTML = data.map(n => {
      const aluno = n._aluno || n.id_matricula?.id_usuario || {};
      const alunoNome = aluno.nome_completo || 'Carregando...';
      return `
        <tr>
          <td><strong>${alunoNome}</strong></td>
          <td><input type="number" class="nota-input" step="0.1" min="0" max="10" value="${n.nota_final !== null ? n.nota_final : ''}" data-nota-matricula="${n.id_matricula?.id || n.id_matricula}" placeholder="0-10" /></td>
          <td><input type="number" class="nota-input" step="0.1" min="0" max="100" value="${n.frequencia_percentual !== null ? n.frequencia_percentual : ''}" data-freq-matricula="${n.id_matricula?.id || n.id_matricula}" placeholder="0-100" /></td>
          <td>
            <select class="status-select" data-status-matricula="${n.id_matricula?.id || n.id_matricula}">
              <option value="CURSANDO" ${n.status === 'CURSANDO' ? 'selected' : ''}>Cursando</option>
              <option value="APROVADO" ${n.status === 'APROVADO' ? 'selected' : ''}>Aprovado</option>
              <option value="REPROVADO" ${n.status === 'REPROVADO' ? 'selected' : ''}>Reprovado</option>
              <option value="RECUPERACAO" ${n.status === 'RECUPERACAO' ? 'selected' : ''}>Recuperação</option>
            </select>
          </td>
          <td><button class="btn btn-primary btn-sm" data-salvar-nota="${n.id_matricula?.id || n.id_matricula}">&#128190; Salvar</button></td>
        </tr>
      `;
    }).join('');
    wrapper.classList.remove('hidden');

    tbody.querySelectorAll('[data-salvar-nota]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const matriculaId = parseInt(btn.dataset.salvarNota);
        const row = btn.closest('tr');
        const inputs = row.querySelectorAll('.nota-input');
        const statusSelect = row.querySelector('.status-select');
        try {
          await apiPut('/professor/notas', {
            id_matricula: matriculaId,
            id_disciplina: parseInt(disciplinaId),
            nota_final: inputs[0].value ? parseFloat(inputs[0].value) : null,
            frequencia_percentual: inputs[1].value ? parseFloat(inputs[1].value) : null,
            status: statusSelect.value,
          });
          showSuccess('Nota salva com sucesso!');
        } catch (err) {
          showError('Erro ao salvar nota: ' + err.message);
        }
      });
    });
  } catch (err) {
    loading.classList.add('hidden');
    showError('Erro ao carregar notas: ' + err.message);
  }
}

// =============================================
// FREQUENCIA
// =============================================

async function loadFrequenciaTurmas() {
  try {
    const turmas = await apiGet('/professor/turmas');
    const select = document.getElementById('freq-turma');
    select.innerHTML = '<option value="">Selecione...</option>' + turmas.map(t => `<option value="${t.id}">${t.nome} - ${t.id_curso?.nome_curso || ''}</option>`).join('');
    if (state.turmas.length === 0) state.turmas = turmas;
  } catch (err) {
    showError('Erro ao carregar turmas: ' + err.message);
  }
}

async function loadFrequenciaDisciplinas(turmaId) {
  try {
    const data = await apiGet(`/professor/turmas/${turmaId}/disciplinas`);
    const select = document.getElementById('freq-disciplina');
    select.innerHTML = '<option value="">Selecione...</option>' + data.map(d => `<option value="${d.id}">${d.nome} (${d.codigo || ''})</option>`).join('');
  } catch (err) {
    showError('Erro ao carregar disciplinas: ' + err.message);
  }
}

function updateFreqStats() {
  const checkboxes = document.querySelectorAll('.freq-checkbox');
  const total = checkboxes.length;
  const presentes = Array.from(checkboxes).filter(cb => cb.checked).length;
  const ausentes = total - presentes;
  document.getElementById('freq-stats-presentes').textContent = presentes;
  document.getElementById('freq-stats-ausentes').textContent = ausentes;
  document.getElementById('freq-stats-total').textContent = total;
}

async function loadFrequencia() {
  const turmaId = document.getElementById('freq-turma').value;
  const disciplinaId = document.getElementById('freq-disciplina').value;
  const data = document.getElementById('freq-data').value;
  if (!turmaId || !disciplinaId || !data) { showError('Selecione turma, disciplina e data.'); return; }

  const wrapper = document.getElementById('freq-table-wrapper');
  const empty = document.getElementById('freq-empty');
  const loading = document.getElementById('freq-carregando');
  const actions = document.getElementById('freq-actions');
  const statsBar = document.getElementById('freq-stats-bar');
  wrapper.classList.add('hidden'); empty.classList.add('hidden'); loading.classList.remove('hidden');
  actions.style.display = 'none'; statsBar.classList.add('hidden');

  try {
    const [alunos, existingFreq] = await Promise.all([
      apiGet(`/professor/turmas/${turmaId}/alunos`),
      apiGet(`/professor/frequencia?turma=${turmaId}&disciplina=${disciplinaId}&data=${data}`),
    ]);
    const freqMap = {};
    (existingFreq || []).forEach(f => { if (f.id_matricula && typeof f.id_matricula === 'object') freqMap[f.id_matricula.id] = f; });

    loading.classList.add('hidden');
    if (alunos.length === 0) { empty.querySelector('h3').textContent = 'Nenhum aluno na turma'; empty.classList.remove('hidden'); return; }

    const tbody = document.getElementById('lista-frequencia');
    tbody.innerHTML = alunos.map(m => {
      const aluno = m.id_usuario || {};
      const existing = freqMap[m.id];
      const presente = existing ? existing.presenca : false;
      return `
        <tr>
          <td><strong>${aluno.nome_completo || 'Carregando...'}</strong></td>
          <td>
            <label class="freq-toggle ${presente ? 'freq-presente' : 'freq-ausente'}">
              <input type="checkbox" class="freq-checkbox" data-freq-matricula="${m.id}" ${presente ? 'checked' : ''} />
              <span class="freq-toggle-text">${presente ? 'Presente' : 'Ausente'}</span>
            </label>
          </td>
          <td><input type="text" class="freq-justificativa" data-just-matricula="${m.id}" value="${existing?.justificativa || ''}" placeholder="Justificativa (se ausente)" /></td>
          <td><button class="btn btn-sm btn-soft freq-history-btn" data-matricula="${m.id}" data-aluno="${aluno.nome_completo || ''}">&#128196; Histórico</button></td>
        </tr>
      `;
    }).join('');

    wrapper.classList.remove('hidden');
    actions.style.display = 'flex';
    statsBar.classList.remove('hidden');

    tbody.querySelectorAll('.freq-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const label = cb.closest('.freq-toggle');
        const span = label.querySelector('.freq-toggle-text');
        if (cb.checked) {
          span.textContent = 'Presente';
          label.classList.remove('freq-ausente');
          label.classList.add('freq-presente');
        } else {
          span.textContent = 'Ausente';
          label.classList.remove('freq-presente');
          label.classList.add('freq-ausente');
        }
        updateFreqStats();
      });
    });

    tbody.querySelectorAll('.freq-history-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openFreqHistory(btn.dataset.matricula, btn.dataset.aluno, disciplinaId);
      });
    });

    document.getElementById('freq-stats-presentes').textContent = alunos.length;
    document.getElementById('freq-stats-ausentes').textContent = '0';
    document.getElementById('freq-stats-total').textContent = alunos.length;
  } catch (err) {
    loading.classList.add('hidden');
    showError('Erro ao carregar frequência: ' + err.message);
  }
}

async function salvarFrequencia() {
  const disciplinaId = document.getElementById('freq-disciplina').value;
  const data = document.getElementById('freq-data').value;
  if (!disciplinaId || !data) { showError('Dados incompletos.'); return; }

  const registros = [];
  document.querySelectorAll('.freq-checkbox').forEach(cb => {
    const matriculaId = parseInt(cb.dataset.freqMatricula);
    const justInput = document.querySelector(`[data-just-matricula="${matriculaId}"]`);
    registros.push({ id_matricula: matriculaId, id_disciplina: parseInt(disciplinaId), data_aula: data, presenca: cb.checked, justificativa: justInput?.value || null });
  });

  try {
    await apiPost('/professor/frequencia', { registros });
    showSuccess('Frequência salva com sucesso!');
  } catch (err) {
    showError('Erro ao salvar frequência: ' + err.message);
  }
}

async function openFreqHistory(matriculaId, alunoNome, disciplinaId) {
  document.getElementById('freq-history-aluno').textContent = alunoNome;
  const discSelect = document.getElementById('freq-disciplina');
  const discNome = discSelect.options[discSelect.selectedIndex]?.text || '-';
  document.getElementById('freq-history-disciplina').textContent = discNome;
  document.getElementById('freq-history-body').innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';
  document.getElementById('modal-freq-history').classList.remove('hidden');

  try {
    const records = await apiGet(`/professor/frequencia/historico/${matriculaId}?disciplina=${disciplinaId}`);
    const tbody = document.getElementById('freq-history-body');
    if (records.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3">Nenhum registro de frequência encontrado.</td></tr>';
    } else {
      tbody.innerHTML = records.map(r => {
        const data = r.data_aula ? new Date(r.data_aula + 'T00:00:00').toLocaleDateString('pt-BR') : '-';
        return `<tr>
          <td>${data}</td>
          <td><span class="badge ${r.presenca ? 'badge-success' : 'badge-danger'}">${r.presenca ? 'Presente' : 'Ausente'}</span></td>
          <td>${r.justificativa || '-'}</td>
        </tr>`;
      }).join('');
    }

    const presentes = records.filter(r => r.presenca).length;
    const ausentes = records.filter(r => !r.presenca).length;
    document.getElementById('freq-history-stats').innerHTML = `
      <span class="freq-stat-item">Total: <strong>${records.length}</strong></span>
      <span class="freq-stat-item">Presentes: <strong>${presentes}</strong> (${records.length ? Math.round(presentes/records.length*100) : 0}%)</span>
      <span class="freq-stat-item">Ausentes: <strong>${ausentes}</strong> (${records.length ? Math.round(ausentes/records.length*100) : 0}%)</span>
    `;
  } catch (err) {
    document.getElementById('freq-history-body').innerHTML = '<tr><td colspan="3">Erro ao carregar histórico.</td></tr>';
  }
}

// =============================================
// DISCIPLINAS
// =============================================

async function loadDisciplinasData() {
  try {
    const turmas = await apiGet('/professor/turmas');
    const result = [];
    for (const t of turmas) {
      const disciplinas = await apiGet(`/professor/turmas/${t.id}/disciplinas`);
      disciplinas.forEach(d => result.push({ ...d, turmaNome: t.nome, turmaId: t.id }));
    }
    return result;
  } catch { return []; }
}

async function loadDisciplinas() {
  try {
    const data = await loadDisciplinasData();
    state.disciplinas = data;

    const texto = (document.getElementById('filtro-disc-texto').value || '').toLowerCase();
    const turmaFilter = document.getElementById('filtro-disc-turma').value;

    const turmasSet = new Set(data.map(d => d.turmaNome));
    const turmaSelect = document.getElementById('filtro-disc-turma');
    const currentVal = turmaSelect.value;
    turmaSelect.innerHTML = '<option value="">Todas as turmas</option>' + Array.from(turmasSet).sort().map(n => `<option value="${n}">${n}</option>`).join('');
    turmaSelect.value = currentVal || '';

    let filtered = data;
    if (texto) filtered = filtered.filter(d => d.nome.toLowerCase().includes(texto));
    if (turmaFilter) filtered = filtered.filter(d => d.turmaNome === turmaFilter);

    const tbody = document.getElementById('lista-disciplinas');
    const empty = document.getElementById('disciplinas-empty');
    if (filtered.length === 0) { tbody.innerHTML = ''; empty.classList.remove('hidden'); return; }
    empty.classList.add('hidden');

    tbody.innerHTML = filtered.map(d => `
      <tr>
        <td><strong>${d.nome}</strong></td>
        <td>${d.codigo || '-'}</td>
        <td>${d.carga_horaria || '-'}h</td>
        <td>${d.semestre || '-'}º</td>
        <td>${d.turmaNome || '-'}</td>
        <td><span class="badge ${d.concluida ? 'badge-success' : 'badge-warning'}">${d.concluida ? 'Concluída' : 'Em andamento'}</span></td>
        <td>
          <button class="btn ${d.concluida ? 'btn-soft' : 'btn-primary'} btn-sm btn-concluir-disc" data-turma="${d.turmaId}" data-disciplina="${d.id}" data-concluida="${d.concluida}">
            ${d.concluida ? '&#128260; Reabrir' : '&#9989; Concluir'}
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-concluir-disc').forEach(btn => {
      btn.addEventListener('click', async () => {
        const turmaId = btn.dataset.turma;
        const disciplinaId = btn.dataset.disciplina;
        const concluida = btn.dataset.concluida === 'true';
        const action = concluida ? 'reabrir' : 'concluir';
        const ok = await showConfirm(`Tem certeza que deseja ${action} esta disciplina?`);
        if (!ok) return;
        try {
          await apiPut('/professor/disciplina/concluir', { id_turma: parseInt(turmaId), id_disciplina: parseInt(disciplinaId), concluida: !concluida });
          showSuccess(`Disciplina ${action === 'concluir' ? 'concluída' : 'reaberta'} com sucesso!`);
          loadDisciplinas();
        } catch (err) {
          showError('Erro: ' + err.message);
        }
      });
    });
  } catch (err) {
    showError('Erro ao carregar disciplinas: ' + err.message);
  }
}

// =============================================
// INIT
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  const auth = requireTeacherAuth();
  if (!auth) return;

  populateSidebarUser(auth);
  setupModuleNav();
  setupSidebarToggle();
  setupLogoutButtons();
  loadConfig();

  loadDashboard();
  loadNotasTurmas();
  loadFrequenciaTurmas();
  loadTurmas();
  loadDisciplinas();

  document.getElementById('btn-filtrar-turmas').addEventListener('click', () => renderTurmas(state.turmas));
  document.getElementById('filtro-turma-texto').addEventListener('input', () => renderTurmas(state.turmas));
  document.getElementById('filtro-turma-status').addEventListener('change', () => renderTurmas(state.turmas));

  document.getElementById('notas-turma').addEventListener('change', (e) => { if (e.target.value) loadNotasDisciplinas(e.target.value); });
  document.getElementById('btn-carregar-notas').addEventListener('click', loadNotas);

  document.getElementById('freq-turma').addEventListener('change', (e) => { if (e.target.value) loadFrequenciaDisciplinas(e.target.value); });
  document.getElementById('btn-carregar-frequencia').addEventListener('click', loadFrequencia);
  document.getElementById('btn-salvar-frequencia').addEventListener('click', salvarFrequencia);

  document.getElementById('btn-marcar-todos').addEventListener('click', () => {
    const cbs = document.querySelectorAll('.freq-checkbox');
    if (!cbs.length) return;
    cbs.forEach(cb => { cb.checked = true; cb.closest('.freq-toggle').className = 'freq-toggle freq-presente'; cb.closest('.freq-toggle').querySelector('.freq-toggle-text').textContent = 'Presente'; });
    updateFreqStats();
  });
  document.getElementById('btn-marcar-faltas').addEventListener('click', () => {
    const cbs = document.querySelectorAll('.freq-checkbox');
    if (!cbs.length) return;
    cbs.forEach(cb => { cb.checked = false; cb.closest('.freq-toggle').className = 'freq-toggle freq-ausente'; cb.closest('.freq-toggle').querySelector('.freq-toggle-text').textContent = 'Ausente'; });
    updateFreqStats();
  });

  // Date navigation
  const freqData = document.getElementById('freq-data');
  const today = new Date().toISOString().slice(0, 10);
  freqData.value = today;

  document.getElementById('freq-date-prev').addEventListener('click', () => {
    const d = new Date(freqData.value + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    freqData.value = d.toISOString().slice(0, 10);
  });
  document.getElementById('freq-date-next').addEventListener('click', () => {
    const d = new Date(freqData.value + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    freqData.value = d.toISOString().slice(0, 10);
  });
  document.getElementById('freq-date-today').addEventListener('click', () => { freqData.value = today; });

  document.getElementById('filtro-disc-texto').addEventListener('input', () => loadDisciplinas());
  document.getElementById('filtro-disc-turma').addEventListener('change', () => loadDisciplinas());

  // History modal close
  document.getElementById('freq-history-close').addEventListener('click', () => document.getElementById('modal-freq-history').classList.add('hidden'));
  document.getElementById('freq-history-close-btn').addEventListener('click', () => document.getElementById('modal-freq-history').classList.add('hidden'));
  document.getElementById('modal-freq-history').addEventListener('click', (e) => { if (e.target === e.currentTarget) document.getElementById('modal-freq-history').classList.add('hidden'); });
});

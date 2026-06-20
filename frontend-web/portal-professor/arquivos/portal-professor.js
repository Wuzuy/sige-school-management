// =============================================
// PORTAL PROFESSOR — Main Application
// =============================================

// Prevent double init from shared scripts.js
window.initPortalSecretariaPage = async function () {};

// --- State ---
const state = {
  turmas: [],
  alunos: [],
  disciplinas: [],
  notas: [],
  frequencia: [],
  chartTurmas: null,
};

// --- Confirm Modal ---
function showConfirm(msg) {
  return new Promise((resolve) => {
    document.getElementById('confirm-message').textContent = msg;
    document.getElementById('modal-confirm').classList.remove('hidden');
    document.getElementById('confirm-ok').onclick = () => {
      document.getElementById('modal-confirm').classList.add('hidden');
      resolve(true);
    };
    document.getElementById('confirm-cancel').onclick = () => {
      document.getElementById('modal-confirm').classList.add('hidden');
      resolve(false);
    };
    document.getElementById('confirm-close').onclick = () => {
      document.getElementById('modal-confirm').classList.add('hidden');
      resolve(false);
    };
  });
}

// --- Auth Check ---
function requireTeacherAuth() {
  const auth = getAuth();
  if (!auth?.token || !auth?.usuario) {
    window.location.href = getLoginPageUrl();
    return null;
  }
  if (auth.usuario.role !== 'ROLE_TEACHER' && auth.usuario.role !== 'ROLE_ADMIN') {
    window.location.href = '../portal-escolar/index.html';
    return null;
  }
  return auth;
}

// --- Sidebar User ---
function populateSidebarUser(auth) {
  const user = auth?.usuario;
  if (!user) return;
  document.getElementById('sec-user-name').textContent = user.nomeCompleto || 'Professor';
  document.getElementById('sec-user-email').textContent = user.email || '-';
  const initials = (user.nomeCompleto || 'PR').split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();
  document.getElementById('sec-user-avatar').textContent = initials || 'PR';
  const badge = document.getElementById('sec-user-role');
  const secretariaLink = document.getElementById('link-secretaria');
  const isAdmin = user.role === 'ROLE_ADMIN';
  if (isAdmin) {
    badge.textContent = 'Admin';
    badge.style.background = '#dbeafe';
    badge.style.color = '#1e40af';
    if (secretariaLink) secretariaLink.style.display = '';
  } else {
    badge.textContent = 'Professor';
    badge.style.background = '';
    badge.style.color = '';
    if (secretariaLink) secretariaLink.style.display = 'none';
  }
}

// --- Module Navigation ---
function setupModuleNav() {
  document.querySelectorAll('[data-module-target]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.moduleTarget;
      document.querySelectorAll('.module-panel').forEach((p) => p.classList.add('hidden'));
      const target = document.getElementById(targetId);
      if (target) target.classList.remove('hidden');
      document.querySelectorAll('[data-module-target]').forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

// --- Sidebar Toggle ---
function setupSidebarToggle() {
  const btn = document.getElementById('sec-sidebar-toggle');
  const sidebar = document.getElementById('sec-sidebar');
  if (btn && sidebar) {
    btn.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 767 && !sidebar.contains(e.target) && e.target !== btn) {
        sidebar.classList.remove('open');
      }
    });
  }
}

// --- Config ---
function loadConfig() {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('toggle-dark-mode').checked = true;
  }
  const fontSize = localStorage.getItem('fontSize') || 'md';
  document.documentElement.setAttribute('data-font-size', fontSize);
  document.querySelectorAll('[data-font]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.font === fontSize);
  });

  document.getElementById('toggle-dark-mode').addEventListener('change', (e) => {
    const isDark = e.target.checked;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  });

  document.querySelectorAll('[data-font]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-font]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const size = btn.dataset.font;
      localStorage.setItem('fontSize', size);
      document.documentElement.setAttribute('data-font-size', size);
    });
  });
}

// =============================================
// API HELPERS
// =============================================

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
    const turmas = await apiGet('/professor/turmas');
    state.turmas = turmas;

    let totalAlunos = 0;
    for (const t of turmas) {
      const alunos = await apiGet(`/professor/turmas/${t.id}/alunos`);
      t._alunosCount = alunos.length;
      totalAlunos += alunos.length;
    }

    const disciplinas = await loadDisciplinasData();

    document.getElementById('kpi-turmas').textContent = turmas.length;
    document.getElementById('kpi-alunos').textContent = totalAlunos;
    document.getElementById('kpi-disciplinas').textContent = disciplinas.length;

    // Turmas list
    const container = document.getElementById('dash-turmas-lista');
    if (turmas.length === 0) {
      container.innerHTML = '<p class="muted">Nenhuma turma atribuída.</p>';
    } else {
      container.innerHTML = turmas.map((t) => `
        <div class="dash-turma-item">
          <div>
            <div class="dash-turma-nome">${t.nome}</div>
            <div class="dash-turma-curso">${t.id_curso?.nome_curso || '-'}</div>
          </div>
          <div class="dash-turma-info">
            <div>${t._alunosCount || 0} alunos</div>
            <div>${t.turno || '-'} / ${t.ano || '-'}</div>
          </div>
        </div>
      `).join('');
    }

    renderTurmasChart(turmas);

    // Aulas count from frequencia
    try {
      const freq = await apiGet('/professor/frequencia?turma=0&disciplina=0');
      document.getElementById('kpi-aulas').textContent = Array.isArray(freq) ? freq.length : 0;
    } catch {
      document.getElementById('kpi-aulas').textContent = '0';
    }
  } catch (err) {
    showError('Erro ao carregar dashboard: ' + err.message);
  }
}

function renderTurmasChart(turmas) {
  const canvas = document.getElementById('chart-turmas-alunos');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (state.chartTurmas) { state.chartTurmas.destroy(); state.chartTurmas = null; }
  if (turmas.length === 0) return;

  state.chartTurmas = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: turmas.map((t) => t.nome),
      datasets: [{
        data: turmas.map((t) => t._alunosCount || 0),
        backgroundColor: ['#059669', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } },
      },
    },
  });
}

// =============================================
// TURMAS
// =============================================

async function loadTurmas() {
  try {
    const data = await apiGet('/professor/turmas');
    state.turmas = data;
    renderTurmas(data);
  } catch (err) {
    showError('Erro ao carregar turmas: ' + err.message);
  }
}

function renderTurmas(data) {
  const texto = (document.getElementById('filtro-turma-texto').value || '').toLowerCase();
  const status = document.getElementById('filtro-turma-status').value;

  const filtered = data.filter((t) => {
    if (status !== 'TODOS' && t.status !== status) return false;
    if (texto && !t.nome.toLowerCase().includes(texto) && !(t.id_curso?.nome_curso || '').toLowerCase().includes(texto)) return false;
    return true;
  });

  const tbody = document.getElementById('lista-turmas');
  const empty = document.getElementById('turmas-empty');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  tbody.innerHTML = filtered.map((t) => `
    <tr>
      <td><strong>${t.nome}</strong></td>
      <td>${t.id_curso?.nome_curso || '-'}</td>
      <td>${t.turno || '-'}</td>
      <td>${t.vagas || '-'}</td>
      <td>${t.ano || '-'}</td>
      <td><span class="badge ${t.status === 'ATIVO' ? 'badge-success' : 'badge-danger'}">${t.status || '-'}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn view" title="Ver Alunos" data-ver-turma="${t.id}">&#128065;</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('[data-ver-turma]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const turmaId = btn.dataset.verTurma;
      // Open notas module with this turma preselected
      document.getElementById('notas-turma').value = turmaId;
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
    select.innerHTML = '<option value="">Selecione...</option>' +
      turmas.map((t) => `<option value="${t.id}">${t.nome} - ${t.id_curso?.nome_curso || ''}</option>`).join('');
    state.turmas = turmas;
  } catch (err) {
    showError('Erro ao carregar turmas: ' + err.message);
  }
}

async function loadNotasDisciplinas(turmaId) {
  try {
    const data = await apiGet(`/professor/turmas/${turmaId}/disciplinas`);
    const select = document.getElementById('notas-disciplina');
    select.innerHTML = '<option value="">Selecione...</option>' +
      data.map((d) => `<option value="${d.id}">${d.nome} (${d.codigo || ''})</option>`).join('');
    state.disciplinas = data;
  } catch (err) {
    showError('Erro ao carregar disciplinas: ' + err.message);
  }
}

async function loadNotas() {
  const turmaId = document.getElementById('notas-turma').value;
  const disciplinaId = document.getElementById('notas-disciplina').value;
  if (!turmaId || !disciplinaId) {
    showError('Selecione turma e disciplina.');
    return;
  }

  const wrapper = document.getElementById('notas-table-wrapper');
  const empty = document.getElementById('notas-empty');
  const loading = document.getElementById('notas-carregando');

  wrapper.classList.add('hidden');
  empty.classList.add('hidden');
  loading.classList.remove('hidden');

  try {
    const data = await apiGet(`/professor/notas?turma=${turmaId}&disciplina=${disciplinaId}`);
    state.notas = data;
    loading.classList.add('hidden');

    if (data.length === 0) {
      empty.classList.remove('hidden');
      return;
    }

    const tbody = document.getElementById('lista-notas');
    tbody.innerHTML = data.map((n) => {
      const aluno = n._aluno || n.id_matricula?.id_usuario || {};
      const alunoNome = aluno.nome_completo || 'Carregando...';
      const alunoId = typeof aluno === 'object' ? (aluno.id || '') : '';
      return `
        <tr>
          <td><strong>${alunoNome}</strong></td>
          <td><input type="number" class="nota-input" step="0.1" min="0" max="10" value="${n.nota_final !== null ? n.nota_final : ''}" data-nota-matricula="${n.id_matricula}" data-nota-disciplina="${disciplinaId}" placeholder="0-10" /></td>
          <td><input type="number" class="nota-input" step="0.1" min="0" max="100" value="${n.frequencia_percentual !== null ? n.frequencia_percentual : ''}" data-freq-matricula="${n.id_matricula}" placeholder="0-100" /></td>
          <td>
            <select class="status-select" data-status-matricula="${n.id_matricula}">
              <option value="CURSANDO" ${n.status === 'CURSANDO' ? 'selected' : ''}>Cursando</option>
              <option value="APROVADO" ${n.status === 'APROVADO' ? 'selected' : ''}>Aprovado</option>
              <option value="REPROVADO" ${n.status === 'REPROVADO' ? 'selected' : ''}>Reprovado</option>
              <option value="RECUPERACAO" ${n.status === 'RECUPERACAO' ? 'selected' : ''}>Recuperação</option>
            </select>
          </td>
          <td>
            <button class="btn btn-primary btn-sm" data-salvar-nota="${n.id_matricula}">&#128190; Salvar</button>
          </td>
        </tr>
      `;
    }).join('');

    wrapper.classList.remove('hidden');

    // Bind save buttons
    tbody.querySelectorAll('[data-salvar-nota]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const matriculaId = parseInt(btn.dataset.salvarNota);
        const row = btn.closest('tr');
        const notaInput = row.querySelector('.nota-input');
        const freqInput = row.querySelectorAll('.nota-input')[1];
        const statusSelect = row.querySelector('.status-select');

        try {
          await apiPut('/professor/notas', {
            id_matricula: matriculaId,
            id_disciplina: parseInt(disciplinaId),
            nota_final: notaInput.value ? parseFloat(notaInput.value) : null,
            frequencia_percentual: freqInput.value ? parseFloat(freqInput.value) : null,
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
    select.innerHTML = '<option value="">Selecione...</option>' +
      turmas.map((t) => `<option value="${t.id}">${t.nome} - ${t.id_curso?.nome_curso || ''}</option>`).join('');
    if (state.turmas.length === 0) state.turmas = turmas;
  } catch (err) {
    showError('Erro ao carregar turmas: ' + err.message);
  }
}

async function loadFrequenciaDisciplinas(turmaId) {
  try {
    const data = await apiGet(`/professor/turmas/${turmaId}/disciplinas`);
    const select = document.getElementById('freq-disciplina');
    select.innerHTML = '<option value="">Selecione...</option>' +
      data.map((d) => `<option value="${d.id}">${d.nome} (${d.codigo || ''})</option>`).join('');
  } catch (err) {
    showError('Erro ao carregar disciplinas: ' + err.message);
  }
}

async function loadFrequencia() {
  const turmaId = document.getElementById('freq-turma').value;
  const disciplinaId = document.getElementById('freq-disciplina').value;
  const data = document.getElementById('freq-data').value;

  if (!turmaId || !disciplinaId || !data) {
    showError('Selecione turma, disciplina e data.');
    return;
  }

  const wrapper = document.getElementById('freq-table-wrapper');
  const empty = document.getElementById('freq-empty');
  const loading = document.getElementById('freq-carregando');
  const actions = document.getElementById('freq-actions');

  wrapper.classList.add('hidden');
  empty.classList.add('hidden');
  loading.classList.remove('hidden');
  actions.style.display = 'none';

  try {
    const alunos = await apiGet(`/professor/turmas/${turmaId}/alunos`);
    const existingFreq = await apiGet(`/professor/frequencia?turma=${turmaId}&disciplina=${disciplinaId}&data=${data}`);

    const freqMap = {};
    (existingFreq || []).forEach((f) => {
      if (f.id_matricula && typeof f.id_matricula === 'object') {
        freqMap[f.id_matricula.id] = f;
      }
    });

    loading.classList.add('hidden');

    if (alunos.length === 0) {
      empty.querySelector('h3').textContent = 'Nenhum aluno na turma';
      empty.classList.remove('hidden');
      return;
    }

    const tbody = document.getElementById('lista-frequencia');
    tbody.innerHTML = alunos.map((m) => {
      const aluno = m.id_usuario || {};
      const alunoNome = aluno.nome_completo || 'Carregando...';
      const existing = freqMap[m.id];
      const presente = existing ? existing.presenca : true;
      return `
        <tr>
          <td><strong>${alunoNome}</strong></td>
          <td>
            <label class="freq-toggle">
              <input type="checkbox" class="freq-checkbox" data-freq-matricula="${m.id}" ${presente ? 'checked' : ''} />
              <span>${presente ? 'Presente' : 'Ausente'}</span>
            </label>
          </td>
          <td><input type="text" class="freq-justificativa" data-just-matricula="${m.id}" value="${existing?.justificativa || ''}" placeholder="Justificativa (se ausente)" /></td>
        </tr>
      `;
    }).join('');

    wrapper.classList.remove('hidden');
    actions.style.display = 'flex';

    // Bind checkbox toggle
    tbody.querySelectorAll('.freq-checkbox').forEach((cb) => {
      cb.addEventListener('change', () => {
        const span = cb.nextElementSibling;
        span.textContent = cb.checked ? 'Presente' : 'Ausente';
      });
    });
  } catch (err) {
    loading.classList.add('hidden');
    showError('Erro ao carregar frequência: ' + err.message);
  }
}

async function salvarFrequencia() {
  const disciplinaId = document.getElementById('freq-disciplina').value;
  const data = document.getElementById('freq-data').value;

  if (!disciplinaId || !data) {
    showError('Dados incompletos.');
    return;
  }

  const registros = [];
  document.querySelectorAll('.freq-checkbox').forEach((cb) => {
    const matriculaId = parseInt(cb.dataset.freqMatricula);
    const justInput = document.querySelector(`[data-just-matricula="${matriculaId}"]`);
    registros.push({
      id_matricula: matriculaId,
      id_disciplina: parseInt(disciplinaId),
      data_aula: data,
      presenca: cb.checked,
      justificativa: justInput?.value || null,
    });
  });

  try {
    await apiPost('/professor/frequencia', { registros });
    showSuccess('Frequência salva com sucesso!');
  } catch (err) {
    showError('Erro ao salvar frequência: ' + err.message);
  }
}

// =============================================
// DISCIPLINAS
// =============================================

async function loadDisciplinasData() {
  try {
    const turmas = await apiGet('/professor/turmas');
    const discSet = new Map();
    for (const t of turmas) {
      const disciplinas = await apiGet(`/professor/turmas/${t.id}/disciplinas`);
      disciplinas.forEach((d) => discSet.set(d.id, d));
    }
    return [...discSet.values()];
  } catch {
    return [];
  }
}

async function loadDisciplinas() {
  try {
    const data = await loadDisciplinasData();
    state.disciplinas = data;
    const tbody = document.getElementById('lista-disciplinas');
    const empty = document.getElementById('disciplinas-empty');

    if (data.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    const texto = (document.getElementById('filtro-disc-texto').value || '').toLowerCase();
    const filtered = data.filter((d) => !texto || d.nome.toLowerCase().includes(texto));

    tbody.innerHTML = filtered.map((d) => `
      <tr>
        <td><strong>${d.nome}</strong></td>
        <td>${d.codigo || '-'}</td>
        <td>${d.carga_horaria || '-'}h</td>
        <td>${d.semestre || '-'}º</td>
      </tr>
    `).join('');
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
  loadConfig();

  loadDashboard();
  loadNotasTurmas();
  loadFrequenciaTurmas();
  loadTurmas();
  loadDisciplinas();

  // --- Turmas Filter ---
  document.getElementById('btn-filtrar-turmas').addEventListener('click', () => renderTurmas(state.turmas));
  document.getElementById('filtro-turma-texto').addEventListener('input', () => renderTurmas(state.turmas));
  document.getElementById('filtro-turma-status').addEventListener('change', () => renderTurmas(state.turmas));

  // --- Notas ---
  document.getElementById('notas-turma').addEventListener('change', (e) => {
    if (e.target.value) loadNotasDisciplinas(e.target.value);
  });
  document.getElementById('btn-carregar-notas').addEventListener('click', loadNotas);

  // --- Frequencia ---
  document.getElementById('freq-turma').addEventListener('change', (e) => {
    if (e.target.value) loadFrequenciaDisciplinas(e.target.value);
  });
  document.getElementById('btn-carregar-frequencia').addEventListener('click', loadFrequencia);
  document.getElementById('btn-salvar-frequencia').addEventListener('click', salvarFrequencia);

  document.getElementById('btn-marcar-todos').addEventListener('click', () => {
    document.querySelectorAll('.freq-checkbox').forEach((cb) => {
      cb.checked = true;
      cb.nextElementSibling.textContent = 'Presente';
    });
  });

  document.getElementById('btn-marcar-faltas').addEventListener('click', () => {
    document.querySelectorAll('.freq-checkbox').forEach((cb) => {
      cb.checked = false;
      cb.nextElementSibling.textContent = 'Ausente';
    });
  });

  // --- Disciplinas Filter ---
  document.getElementById('filtro-disc-texto').addEventListener('input', () => loadDisciplinas());

  // Set default date to today
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('freq-data').value = today;
});

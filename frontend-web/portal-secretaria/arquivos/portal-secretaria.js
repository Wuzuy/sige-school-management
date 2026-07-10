// ======================================
// PORTAL SECRETARIA - UX ENHANCED
// ======================================
// Prevent scripts.js from double-initializing secretaria page features.
// This override runs before DOMContentLoaded fires.
window.initPortalSecretariaPage = async function() {};

// --- Session state persistence (localStorage) ---
const STATE_KEY = 'sige-secretaria-state';

function saveState() {
  const visiblePanel = document.querySelector('.module-panel:not(.hidden)');
  const moduleId = visiblePanel ? visiblePanel.id : 'modulo-dashboard';
  const modeBtn = document.querySelector('.sec-mode-btn.active');
  const mode = modeBtn ? modeBtn.dataset.secMode : 'inscricoes';
  const state = { mode, module: moduleId };
  if (moduleId === 'modulo-aluno-detalhes' && window.__currentAlunoId) state.alunoId = window.__currentAlunoId;
  if (moduleId === 'modulo-inscricoes-detalhes' && window.__currentInscricaoId) state.inscricaoId = window.__currentInscricaoId;
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    // Also update URL hash for cross-tab navigation where possible
    if (window.location.protocol !== 'file:') {
      const parts = ['mode=' + mode, 'module=' + moduleId];
      if (state.alunoId) parts.push('alunoId=' + state.alunoId);
      if (state.inscricaoId) parts.push('inscricaoId=' + state.inscricaoId);
      history.replaceState(null, '', '#' + parts.join('&'));
    }
  } catch {}
}

function restoreState() {
  // Try URL hash first (for bookmark/share support)
  let params = null;
  const h = location.hash.replace(/^#/, '');
  if (h) {
    params = Object.fromEntries(h.split('&').map(p => { const [k, ...v] = p.split('='); return [k, v.join('=')]; }));
  }
  // Fall back to localStorage
  if (!params || !params.module) {
    try {
      const saved = localStorage.getItem(STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.module) {
          params = { mode: parsed.mode, module: parsed.module };
          if (parsed.alunoId) params.alunoId = parsed.alunoId;
          if (parsed.inscricaoId) params.inscricaoId = parsed.inscricaoId;
        }
      }
    } catch {}
  }
  if (!params || !params.module) return false;

  let mode = params.mode;
  if (!mode) {
    const alunosMods = ['modulo-dashboard-alunos','modulo-alunos','modulo-reclamacoes','modulo-relatorios-alunos','modulo-aluno-detalhes'];
    mode = alunosMods.includes(params.module) ? 'alunos' : 'inscricoes';
  }
  if (mode) {
    const btn = document.querySelector(`.sec-mode-btn[data-sec-mode="${mode}"]`);
    if (btn && !btn.classList.contains('active')) btn.click();
  }
  setTimeout(() => {
    if (params.module === 'modulo-aluno-detalhes' && params.alunoId) {
      showAlunoDetailEnhanced(params.alunoId);
    } else if (params.module === 'modulo-inscricoes-detalhes' && params.inscricaoId) {
      showInscricaoDetail(params.inscricaoId);
    } else {
      const link = document.querySelector(`.sec-sidebar-item[data-module-target="${params.module}"]`);
      // So navega se o modulo nao foi oculto por permissoes
      if (link && link.style.display !== 'none') link.click();
    }
    saveState();
  }, 100);
  return true;
}

// --- Helper: notyf (robust fallback) ---
// scripts.js declares `let notyf` in global lexical scope (not window.notyf),
// so we must assign to `notyf` directly.
if (typeof Notyf !== 'undefined' && !notyf) {
  try { notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } }); } catch {}
}
if (!notyf) {
  notyf = { success: function(m){alert(m)}, error: function(m){alert('Erro: '+m)} };
}

// Safe error display helper
function showError(msg, err) {
  const text = msg + (err ? ': ' + (err.message || err) : '');
  try { notyf.error(text); } catch { alert(text); }
}
function showSuccess(msg) {
  try { notyf.success(msg); } catch { alert(msg); }
}

// --- Permission-based UI visibility ---
function filterSidebarByPerms() {
  const permModuleMap = {
    'modulo-inscricoes':     'inscricao.visualizar',
    'modulo-cursos':         'curso.visualizar',
    'modulo-turmas':         'turma.visualizar',
    'modulo-disciplinas':    'disciplina.visualizar',
    'modulo-unidades':       'unidade.visualizar',
    'modulo-usuarios':       'usuario.visualizar',
    'modulo-editais':        'edital.visualizar',
    'modulo-dashboard-alunos': 'aluno.visualizar',
    'modulo-alunos':         'aluno.visualizar',
    'modulo-reclamacoes':    'reclamacao.visualizar',
    'modulo-relatorios':     'relatorio.visualizar',
    'modulo-relatorios-alunos': 'relatorio.visualizar',
    'modulo-auditoria':      'auditoria.visualizar',
    'modulo-cargos':         'cargo.gerenciar',
    'modulo-dashboard-professor': 'disciplina.visualizar',
    'modulo-professores':    'usuario.visualizar',
    'modulo-portais':        'portal.gerenciar',
  };
  Object.keys(permModuleMap).forEach(moduleId => {
    const link = document.querySelector(`.sec-sidebar-item[data-module-target="${moduleId}"]`);
    if (link) link.style.display = hasPerm(permModuleMap[moduleId]) ? '' : 'none';
  });
  // Oculta aba "Alunos" se nenhum modulo do grupo estiver visivel
  const alunosLinks = document.querySelectorAll('[data-sec-mode-link="alunos"]');
  const anyAlunoVisible = Array.from(alunosLinks).some(l => l.style.display !== 'none');
  const alunosTab = document.querySelector('.sec-mode-btn[data-sec-mode="alunos"]');
  if (alunosTab) alunosTab.style.display = anyAlunoVisible ? '' : 'none';
  // Oculta aba "Professor" se nenhum modulo do grupo estiver visivel
  const profLinks = document.querySelectorAll('[data-sec-mode-link="professor"]');
  const anyProfVisible = Array.from(profLinks).some(l => l.style.display !== 'none');
  const profTab = document.querySelector('.sec-mode-btn[data-sec-mode="professor"]');
  if (profTab) profTab.style.display = anyProfVisible ? '' : 'none';
  // Oculta aba "Turmas" se nenhum modulo do grupo estiver visivel
  const turmasLinks = document.querySelectorAll('[data-sec-mode-link="turmas"]');
  const anyTurmasVisible = Array.from(turmasLinks).some(l => l.style.display !== 'none');
  const turmasTab = document.querySelector('.sec-mode-btn[data-sec-mode="turmas"]');
  if (turmasTab) turmasTab.style.display = anyTurmasVisible ? '' : 'none';
}

function filterCreateFormsByPerms() {
  const formPermMap = {
    'form-curso': 'curso.criar',
    'form-unidade': 'unidade.criar',
    'form-admin-user': 'usuario.criar',
    'form-edital': 'edital.criar',
    'form-turma': 'turma.criar',
    'form-disciplina': 'disciplina.criar',
    'form-atribuir-disciplina': 'disciplina.criar',
    'form-cargo': 'cargo.gerenciar',
  };
  Object.keys(formPermMap).forEach(formId => {
    const form = document.getElementById(formId);
    if (form) {
      const card = form.closest('.card');
      if (card) card.style.display = hasPerm(formPermMap[formId]) ? '' : 'none';
    }
  });
  // Export buttons
  const exportBtnIds = ['btn-exportar-csv-rel', 'btn-exportar-pdf-rel', 'btn-exportar-csv-alunos', 'btn-exportar-pdf-alunos', 'btn-exportar-auditoria-csv'];
  exportBtnIds.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.style.display = hasPerm('relatorio.exportar') ? '' : 'none';
  });
}

function filterEditDeleteButtonsByPerms(module, rows) {
  // Retorna funcao que filtra edit/delete com base em permissoes
  const permEdit = module + '.editar';
  const permDel = module + '.excluir';
  return rows.map(r => {
    const editBtn = hasPerm(permEdit) ? `<button class="btn btn-soft btn-sm" data-${module}-edit="${r.id}">Editar</button>` : '';
    const delBtn = hasPerm(permDel) ? `<button class="btn btn-danger btn-sm" data-${module}-del="${r.id}">Excluir</button>` : '';
    return { ...r, editBtn, delBtn };
  });
}

// --- Global auth & permission helpers ---
let __auth = null;
function hasPerm(codigo) {
  // Se nao tem permissoes (login antigo), libera tudo (fallback)
  if (!__auth?.permissoes || !__auth.permissoes.length) return true;
  return __auth.permissoes.includes(codigo);
}

// --- Badge helper ---
function roleLabel(role) {
  const map = {
    'ROLE_ADMIN': 'Administrador',
    'ROLE_TEACHER': 'Professor',
    'ROLE_STUDENT': 'Aluno',
    'ROLE_USER': 'Candidato'
  };
  return map[role] || role || '-';
}

function badge(status) {
  const map = {
    'APROVADA': 'badge-success', 'APROVADO': 'badge-success',
    'REPROVADA': 'badge-danger', 'REPROVADO': 'badge-danger',
    'EM_ANALISE': 'badge-warning',
    'PENDENTE': 'badge-warning',
    'ATIVO': 'badge-success',
    'INATIVO': 'badge-neutral',
    'AGUARDANDO_ACEITE': 'badge-info',
    'ACEITA': 'badge-success',
    'RECUSADA': 'badge-danger',
    'CONCLUIDA': 'badge-success',
    'CONCLUIDO': 'badge-success',
    'TRANCADO': 'badge-danger',
    'Administrador': 'badge-danger',
    'Professor': 'badge-info',
    'Aluno': 'badge-success',
    'Candidato': 'badge-neutral',
    'true': 'badge-success',
    'false': 'badge-danger',
  };
  return `<span class="badge ${map[status] || 'badge-neutral'}">${status || '-'}</span>`;
}

// --- Table sorting (client-side) ---
function setupTableSort() {
  document.querySelectorAll('.table-wrapper table').forEach(table => {
    const headers = table.querySelectorAll('thead th');
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    // Observe tbody for row changes to keep rowIdx up to date
    const obs = new MutationObserver(() => {
      Array.from(tbody.querySelectorAll('tr')).forEach((r, i) => r.dataset.rowIdx = i);
    });
    obs.observe(tbody, { childList: true, subtree: false });

    headers.forEach(th => {
      const label = (th.textContent || '').trim().toLowerCase();
      if (label === 'ações' || label === 'ação') return;
      th.style.cursor = 'pointer';
      th.title = 'Clique para ordenar';
      th.addEventListener('click', () => {
        const cur = th.dataset.dir || '';
        let newDir;
        if (!cur) newDir = 'asc';
        else if (cur === 'asc') newDir = 'desc';
        else newDir = '';
        headers.forEach(h => {
          h.dataset.dir = '';
          h.title = 'Clique para ordenar';
          const arr = h.querySelector('.sort-arrow');
          if (arr) arr.remove();
        });
        if (newDir) {
          th.dataset.dir = newDir;
          th.title = newDir === 'asc' ? 'Ordem crescente' : 'Ordem decrescente';
          const arr = document.createElement('span');
          arr.className = 'sort-arrow';
          arr.style.marginLeft = '4px';
          arr.style.fontSize = '0.7em';
          arr.textContent = newDir === 'asc' ? '\u25B2' : '\u25BC';
          th.appendChild(arr);
          obs.disconnect();
          const rows = Array.from(tbody.querySelectorAll('tr'));
          const colIdx = Array.from(th.parentNode.children).indexOf(th);
          rows.sort((a, b) => {
            const va = (a.children[colIdx]?.textContent || '').trim().toLowerCase();
            const vb = (b.children[colIdx]?.textContent || '').trim().toLowerCase();
            const na = parseFloat(va), nb = parseFloat(vb);
            const cmp = !isNaN(na) && !isNaN(nb) ? na - nb : va.localeCompare(vb, 'pt-BR');
            return newDir === 'asc' ? cmp : -cmp;
          });
          rows.forEach(r => tbody.appendChild(r));
          obs.observe(tbody, { childList: true, subtree: false });
        } else {
          // restore original order
          obs.disconnect();
          const rows = Array.from(tbody.querySelectorAll('tr'));
          const sorted = Array.from(rows).sort((a,b) => +a.dataset.rowIdx - +b.dataset.rowIdx);
          sorted.forEach(r => tbody.appendChild(r));
          obs.observe(tbody, { childList: true, subtree: false });
        }
      });
    });
  });
}
// --- Skeleton control ---
function showSkeleton(id) {
  document.getElementById(id + '-skeleton')?.classList.remove('hidden');
  document.getElementById(id + '-table')?.classList.add('hidden');
  document.getElementById(id + '-empty')?.classList.add('hidden');
}
function showTable(id) {
  document.getElementById(id + '-skeleton')?.classList.add('hidden');
  document.getElementById(id + '-table')?.classList.remove('hidden');
  document.getElementById(id + '-empty')?.classList.add('hidden');
}
function showEmpty(id, msg) {
  document.getElementById(id + '-skeleton')?.classList.add('hidden');
  document.getElementById(id + '-table')?.classList.add('hidden');
  const el = document.getElementById(id + '-empty');
  if (el) { el.classList.remove('hidden'); if (msg) el.querySelector('p').textContent = msg; }
}

// --- Confirmation dialog (modal) ---
function confirmAction(msg) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('modal-confirm');
    const msgEl = document.getElementById('confirm-message');
    const yesBtn = document.getElementById('confirm-yes');
    const noBtn = document.getElementById('confirm-no');
    const closeBtn = document.getElementById('confirm-close');
    if (!overlay || !msgEl) { resolve(true); return; }
    msgEl.textContent = msg;
    overlay.classList.remove('hidden');
    const cleanup = (result) => { overlay.classList.add('hidden'); resolve(result); };
    yesBtn.onclick = () => cleanup(true);
    noBtn.onclick = () => cleanup(false);
    closeBtn.onclick = () => cleanup(false);
    overlay.onclick = (e) => { if (e.target === overlay) cleanup(false); };
  });
}

// --- Generic edit modal ---
function openEditModal(title, bodyHtml, id, onSubmit) {
  const overlay = document.getElementById('modal-edit');
  const titleEl = document.getElementById('modal-edit-title');
  const bodyEl = document.getElementById('modal-edit-body');
  const idEl = document.getElementById('modal-edit-id');
  const form = document.getElementById('form-modal-edit');
  const closeBtn = document.getElementById('modal-edit-close');
  const cancelBtn = document.getElementById('modal-edit-cancel');
  if (!overlay) return;
  titleEl.innerHTML = title;
  bodyEl.innerHTML = bodyHtml;
  idEl.value = id || '';
  overlay.classList.remove('hidden');
  const close = () => { overlay.classList.add('hidden'); };
  closeBtn.onclick = close;
  cancelBtn.onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
  form.onsubmit = async (e) => {
    e.preventDefault();
    await onSubmit(id, form);
    close();
  };
}

// --- Modal close on Escape ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(el => el.classList.add('hidden'));
  }
});

// --- Module switching ---
document.querySelectorAll('[data-module-target]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // Ignora cliques em itens ocultos por permissoes
    if (btn.style.display === 'none') return;
    document.querySelectorAll('.sec-sidebar-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.module-panel').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(btn.dataset.moduleTarget);
    if (target) {
      target.classList.remove('hidden');
      switch (target.id) {
        case 'modulo-dashboard': loadDashboard(); break;
        case 'modulo-dashboard-alunos': loadDashboardAlunos(); break;
        case 'modulo-inscricoes': loadInscricoes(getFiltros()); break;
        case 'modulo-cursos': loadCursos(); break;
        case 'modulo-unidades': loadUnidades(); break;
        case 'modulo-usuarios': loadUsuarios(); populateCargoDropdowns(); break;
        case 'modulo-editais': loadEditais(); break;
        case 'modulo-turmas': loadTurmas(); break;
        case 'modulo-disciplinas': loadDisciplinas(); loadAtribuicoes(); break;
        case 'modulo-cargos': loadCargos(); loadPermissoesCheckboxes(); break;
        case 'modulo-relatorios': loadRelatorio(getRelFiltros()); break;
        case 'modulo-alunos': loadAlunos(); break;
        case 'modulo-relatorios-alunos': loadRelatorioAlunos(); break;
        case 'modulo-reclamacoes': loadReclamacoesStandalone(); break;
        case 'modulo-auditoria': loadAuditoria(); break;
        case 'modulo-dashboard-professor': loadDashboardProfessor(); break;
        case 'modulo-professores': loadProfessores(); break;
        case 'modulo-portais': loadPortais(); break;
      }
    }
    saveState();
    if (window.innerWidth < 768) document.getElementById('sec-sidebar')?.classList.remove('open');
  });
});

// --- Mode switcher (Inscrições / Alunos) ---
document.querySelectorAll('[data-sec-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.secMode;
    document.querySelectorAll('[data-sec-mode]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Show/hide groups
    document.querySelectorAll('[data-sec-group]').forEach(g => {
      g.classList.toggle('hidden', g.dataset.secGroup !== mode);
    });
    // Activate first VISIBLE module of the group (skip hidden-by-permission links)
    const links = document.querySelectorAll(`[data-sec-mode-link="${mode}"]`);
    let navigated = false;
    links.forEach(l => {
      if (!navigated && l.style.display !== 'none') {
        l.click();
        navigated = true;
      }
    });
    // If no visible link found, navigate to Dashboard as fallback
    if (!navigated) {
      const dashLink = document.querySelector('[data-module-target="modulo-dashboard"]');
      if (dashLink && dashLink.style.display !== 'none') dashLink.click();
    }
    saveState();
  });
});

// --- Logout ---
document.querySelectorAll('[data-logout]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof clearAuth === 'function') clearAuth();
    window.location.href = '../portal-inscricao/login.html';
  });
});

// ======================================
// STATE
// ======================================
const state = {
  inscricoes: [],
  cursos: [],
  unidades: [],
  usuarios: [],
  editais: [],
  alunos: [],
  disciplinas: [],
  atribuicoes: [],
  turmas: [],
};

// --- Chart instances (destroy before re-creating) ---
let chartDoughnut = null;
let chartCursoBar = null;
let chartTimeline = null;

function destroyChart(chart) {
  if (chart) { chart.destroy(); }
}

function chartColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: isDark ? '#94a3b8' : '#64748b',
    grid: isDark ? '#334155' : '#e2e8f0',
    accent: '#0ea5e9',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    surface: isDark ? '#1e293b' : '#ffffff',
  };
}

// ======================================
// DASHBOARD
// ======================================
let dashPeriodo = 'mes';
let dashCurso = 'TODOS';
let dashStatus = 'TODOS';
let dashBusca = '';

async function loadDashboard() {
  try {
    const allData = await request('/inscricoes?todos=true');

    // Apply filters
    let data = [...allData];
    if (dashCurso !== 'TODOS')
      data = data.filter(i => String(i.id_curso?.id || i.id_curso) === dashCurso);
    if (dashStatus !== 'TODOS')
      data = data.filter(i => i.status_aprovacao === dashStatus);
    if (dashBusca) {
      const t = dashBusca.toLowerCase();
      data = data.filter(i =>
        (i.id_usuario?.nome_completo || i.nome_completo_inscricao || '').toLowerCase().includes(t) ||
        (i.id_usuario?.cpf || i.cpf_inscricao || '').includes(t) ||
        String(i.id).includes(t)
      );
    }

    // Date range
    const hoje = new Date();
    let diasPeriodo;
    switch (dashPeriodo) {
      case 'trimestre': diasPeriodo = 90; break;
      case 'semestre': diasPeriodo = 180; break;
      case 'ano': diasPeriodo = 365; break;
      default: diasPeriodo = 30;
    }
    const dataLimite = new Date(hoje);
    dataLimite.setDate(dataLimite.getDate() - diasPeriodo);
    const dataPeriodo = data.filter(i => i.data_inscricao && new Date(i.data_inscricao) >= dataLimite);

    // KPIs
    const total = dataPeriodo.length;
    const aprovadas = dataPeriodo.filter(i => i.status_aprovacao === 'APROVADA').length;
    const analise = dataPeriodo.filter(i => i.status_aprovacao === 'EM_ANALISE').length;
    const reprovadas = dataPeriodo.filter(i => i.status_aprovacao === 'REPROVADA').length;
    const taxaAprovacao = total > 0 ? Math.round((aprovadas / total) * 100) : 0;
    const taxaReprovacao = total > 0 ? Math.round((reprovadas / total) * 100) : 0;

    // Novos do período (inscrições da última semana / últimos 7 dias no período)
    const semanaAtras = new Date(hoje);
    semanaAtras.setDate(semanaAtras.getDate() - Math.min(7, diasPeriodo));
    const novos = dataPeriodo.filter(i => i.data_inscricao && new Date(i.data_inscricao) >= semanaAtras).length;

    document.getElementById('kpi-total').textContent = total;
    document.getElementById('kpi-novos-periodo').textContent = `+${novos} no período`;
    document.getElementById('kpi-taxa-aprovacao').textContent = `${taxaAprovacao}%`;
    document.getElementById('kpi-aprovadas-total').textContent = `${aprovadas} aprovadas`;
    document.getElementById('kpi-pendencias').textContent = analise;
    document.getElementById('kpi-reprovadas').textContent = reprovadas;
    document.getElementById('kpi-taxa-reprovacao').textContent = `${taxaReprovacao}% de reprovação`;

    // Charts
    const c = chartColors();

    // Doughnut
    destroyChart(chartDoughnut);
    const ctx1 = document.getElementById('chart-status-doughnut')?.getContext('2d');
    if (ctx1) {
      chartDoughnut = new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: ['Aprovadas', 'Em Análise', 'Reprovadas'],
          datasets: [{
            data: [aprovadas, analise, reprovadas],
            backgroundColor: [c.success, c.warning, c.danger],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '70%',
          plugins: { legend: { position: 'bottom', labels: { color: c.text, padding: 10, font: { size: 11 } } } }
        }
      });
    }

    // Bar by course
    const porCurso = {};
    dataPeriodo.forEach(i => {
      const nome = i.id_curso?.nome_curso || 'Sem curso';
      if (!porCurso[nome]) porCurso[nome] = { total: 0, aprov: 0, analise: 0, reprov: 0 };
      porCurso[nome].total++;
      if (i.status_aprovacao === 'APROVADA') porCurso[nome].aprov++;
      else if (i.status_aprovacao === 'EM_ANALISE') porCurso[nome].analise++;
      else if (i.status_aprovacao === 'REPROVADA') porCurso[nome].reprov++;
    });
    const cursos = Object.keys(porCurso);
    destroyChart(chartCursoBar);
    const ctx2 = document.getElementById('chart-curso-bar')?.getContext('2d');
    if (ctx2) {
      chartCursoBar = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: cursos,
          datasets: [
            { label: 'Aprovadas', data: cursos.map(n => porCurso[n].aprov), backgroundColor: c.success, borderRadius: 4 },
            { label: 'Em Análise', data: cursos.map(n => porCurso[n].analise), backgroundColor: c.warning, borderRadius: 4 },
            { label: 'Reprovadas', data: cursos.map(n => porCurso[n].reprov), backgroundColor: c.danger, borderRadius: 4 },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { intersect: false, mode: 'index' },
          plugins: { legend: { position: 'bottom', labels: { color: c.text, boxWidth: 12, padding: 10, font: { size: 10 } } } },
          scales: {
            x: { stacked: true, ticks: { color: c.text, font: { size: 9 } }, grid: { display: false } },
            y: { stacked: true, beginAtZero: true, ticks: { color: c.text, font: { size: 9 }, stepSize: 1 }, grid: { color: c.grid } }
          }
        }
      });
    }

    // Timeline
    const numIntervalos = dashPeriodo === 'ano' ? 12 : dashPeriodo === 'semestre' || dashPeriodo === 'trimestre' ? 6 : 30;
    const intervaloSize = Math.ceil(diasPeriodo / numIntervalos);
    const labelsTimeline = [];
    const dadosTimeline = [];
    for (let i = numIntervalos - 1; i >= 0; i--) {
      const fim = new Date(hoje);
      fim.setDate(fim.getDate() - i * intervaloSize);
      const inicio = new Date(fim);
      inicio.setDate(inicio.getDate() - intervaloSize + 1);
      if (dashPeriodo === 'ano') {
        labelsTimeline.push(String(fim.getMonth() + 1).padStart(2, '0'));
      } else if (dashPeriodo === 'mes') {
        labelsTimeline.push(fim.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
      } else {
        labelsTimeline.push(
          inicio.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + '-' +
          fim.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        );
      }
      dadosTimeline.push(dataPeriodo.filter(item =>
        item.data_inscricao && new Date(item.data_inscricao) >= inicio && new Date(item.data_inscricao) <= fim
      ).length);
    }
    destroyChart(chartTimeline);
    const ctx3 = document.getElementById('chart-timeline')?.getContext('2d');
    if (ctx3) {
      chartTimeline = new Chart(ctx3, {
        type: 'line',
        data: {
          labels: labelsTimeline,
          datasets: [{
            label: 'Inscrições',
            data: dadosTimeline,
            borderColor: c.accent,
            backgroundColor: c.accent + '22',
            fill: true, tension: 0.3, pointRadius: 2, pointBackgroundColor: c.accent, borderWidth: 2,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: c.text, font: { size: 10 }, maxRotation: 45 }, grid: { display: false } },
            y: { beginAtZero: true, ticks: { color: c.text, font: { size: 9 }, stepSize: 1 }, grid: { color: c.grid } }
          }
        }
      });
    }

    // Funnel chart
    renderFunnel(dataPeriodo, total);
  } catch {}
}

function renderFunnel(data, total) {
  const container = document.getElementById('funnel-container');
  if (!container) return;

  if (total === 0) {
    container.innerHTML = '<div class="funnel-empty">Nenhum dado no período</div>';
    return;
  }

  const stages = [
    { label: 'Total Inscrições', count: total, color: '#0ea5e9' },
    { label: 'Em Análise', count: data.filter(i => i.status_aprovacao === 'EM_ANALISE').length, color: '#f59e0b' },
    { label: 'Aprovadas', count: data.filter(i => i.status_aprovacao === 'APROVADA').length, color: '#10b981' },
  ];

  const matriculadas = data.filter(i => i.status_matricula === 'ACEITA' || i.status_matricula === 'CONCLUIDA' || i.status_matricula === 'CONCLUIDO').length;
  if (matriculadas > 0) {
    stages.push({ label: 'Matriculadas', count: matriculadas, color: '#6366f1' });
  }

  const maxCount = total;
  let html = '';
  stages.forEach((stage, idx) => {
    const pct = maxCount > 0 ? Math.round((stage.count / maxCount) * 100) : 0;
    const widthPct = idx === 0 ? 100 : Math.max(8, Math.round((stage.count / maxCount) * 100));
    html += `
      <div class="funnel-stage">
        <span class="funnel-label">${stage.label}</span>
        <div class="funnel-bar-wrap">
          <div class="funnel-bar" style="width:${widthPct}%;background:${stage.color};">
            <span class="funnel-bar-inner">${stage.count}</span>
          </div>
        </div>
        <span class="funnel-pct">${pct}%</span>
      </div>`;
  });
  container.innerHTML = html;
}

// --- Dashboard filter events ---
function dashFiltrar() {
  dashBusca = document.getElementById('dash-busca')?.value || '';
  dashStatus = document.getElementById('dash-status-filtro')?.value || 'TODOS';
  dashCurso = document.getElementById('dash-curso-filtro')?.value || 'TODOS';
  loadDashboard();
}

document.querySelectorAll('.dash-periodo-btns .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.dash-periodo-btns .btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    dashPeriodo = btn.dataset.periodo;
    loadDashboard();
  });
});

document.getElementById('dash-status-filtro')?.addEventListener('change', dashFiltrar);
document.getElementById('dash-curso-filtro')?.addEventListener('change', dashFiltrar);
document.getElementById('dash-busca')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') dashFiltrar();
});
document.getElementById('btn-filtrar-dashboard')?.addEventListener('click', dashFiltrar);

// ======================================
// DASHBOARD ALUNOS
// ======================================
let chartAlunosCurso = null;
let chartAlunosStatus = null;

async function loadDashboardAlunos() {
  try {
    const data = await request('/alunos');
    let filtered = [...data];
    const cursoFiltro = document.getElementById('dash-aluno-curso-filtro')?.value || 'TODOS';
    const busca = (document.getElementById('dash-aluno-busca')?.value || '').toLowerCase();

    if (cursoFiltro !== 'TODOS')
      filtered = filtered.filter(a => a.matriculas?.some(m => String(m.id_curso?.id || m.id_curso) === cursoFiltro));
    if (busca)
      filtered = filtered.filter(a =>
        (a.nome_completo || '').toLowerCase().includes(busca) ||
        (a.cpf || '').includes(busca)
      );

    const total = filtered.length;
    let ativos = 0, trancados = 0, concluidos = 0;
    const porCurso = {};
    filtered.forEach(a => {
      const m = a.matriculas?.[0] || {};
      if (m.status === 'ATIVO') ativos++;
      else if (m.status === 'TRANCADO') trancados++;
      else if (m.status === 'CONCLUIDO' || m.status === 'CONCLUIDA') concluidos++;
      const curso = m.id_curso?.nome_curso || 'Sem curso';
      if (!porCurso[curso]) porCurso[curso] = { total: 0, ativos: 0, trancados: 0, concluidos: 0 };
      porCurso[curso].total++;
      if (m.status === 'ATIVO') porCurso[curso].ativos++;
      else if (m.status === 'TRANCADO') porCurso[curso].trancados++;
      else if (m.status === 'CONCLUIDO' || m.status === 'CONCLUIDA') porCurso[curso].concluidos++;
    });

    document.getElementById('kpi-alunos-total').textContent = total;
    document.getElementById('kpi-alunos-ativos').textContent = ativos;
    document.getElementById('kpi-alunos-trancados').textContent = trancados;
    document.getElementById('kpi-alunos-concluidos').textContent = concluidos;

    const c = chartColors();

    // Bar chart: alunos por curso
    destroyChart(chartAlunosCurso);
    const ctx1 = document.getElementById('chart-alunos-curso')?.getContext('2d');
    if (ctx1) {
      const nomes = Object.keys(porCurso);
      chartAlunosCurso = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: nomes,
          datasets: [
            { label: 'Ativos', data: nomes.map(n => porCurso[n].ativos), backgroundColor: c.success, borderRadius: 4 },
            { label: 'Trancados', data: nomes.map(n => porCurso[n].trancados), backgroundColor: c.warning, borderRadius: 4 },
            { label: 'Concluídos', data: nomes.map(n => porCurso[n].concluidos), backgroundColor: c.accent, borderRadius: 4 },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { intersect: false, mode: 'index' },
          plugins: { legend: { position: 'bottom', labels: { color: c.text, boxWidth: 12, padding: 10, font: { size: 10 } } } },
          scales: {
            x: { stacked: true, ticks: { color: c.text, font: { size: 9 } }, grid: { display: false } },
            y: { stacked: true, beginAtZero: true, ticks: { color: c.text, font: { size: 9 }, stepSize: 1 }, grid: { color: c.grid } }
          }
        }
      });
    }

    // Doughnut: status
    destroyChart(chartAlunosStatus);
    const ctx2 = document.getElementById('chart-alunos-status')?.getContext('2d');
    if (ctx2) {
      chartAlunosStatus = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Ativos', 'Trancados', 'Concluídos'],
          datasets: [{ data: [ativos, trancados, concluidos], backgroundColor: [c.success, c.warning, c.accent], borderWidth: 0 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '70%',
          plugins: { legend: { position: 'bottom', labels: { color: c.text, padding: 10, font: { size: 11 } } } }
        }
      });
    }
  } catch {}
}

// --- Alunos dashboard filter ---
document.getElementById('btn-filtrar-dashboard-alunos')?.addEventListener('click', loadDashboardAlunos);
document.getElementById('dash-aluno-busca')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadDashboardAlunos(); });
document.getElementById('dash-aluno-curso-filtro')?.addEventListener('change', loadDashboardAlunos);

// ======================================
// RELATORIO ALUNOS
// ======================================
async function loadRelatorioAlunos() {
  try {
    const data = await request('/alunos');
    const busca = (document.getElementById('rel-aluno-busca')?.value || '').toLowerCase();
    const statusMat = document.getElementById('rel-aluno-status-mat')?.value || 'TODOS';
    let filtered = [...data];
    if (busca)
      filtered = filtered.filter(a =>
        (a.nome_completo || '').toLowerCase().includes(busca) ||
        (a.email || '').toLowerCase().includes(busca) ||
        (a.cpf || '').includes(busca)
      );
    if (statusMat !== 'TODOS')
      filtered = filtered.filter(a => a.matriculas?.[0]?.status === statusMat);

    const tbody = document.getElementById('relatorio-alunos-tbody');
    const pagContainer = document.getElementById('paginacao-relatorios-alunos');
    if (!filtered.length) {
      const empty = document.getElementById('relatorio-alunos-empty');
      if (tbody) tbody.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      if (pagContainer) pagContainer.innerHTML = '';
      return;
    }
    const relEmpty = document.getElementById('relatorio-alunos-empty');
    if (relEmpty) relEmpty.classList.add('hidden');
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: document.getElementById('relatorio-alunos-empty'),
      dados: filtered,
      renderizarItem: a => {
        const m = a.matriculas?.[0] || {};
        const cursoNome = m.id_curso?.nome_curso || '-';
        return `<tr>
          <td><strong>${a.nome_completo || '-'}</strong></td>
          <td>${a.email || '-'}</td>
          <td>${a.cpf || '-'}</td>
          <td>${cursoNome}</td>
          <td>${badge(m.status)}</td>
          <td>
            <div class="action-btns">
              <button class="action-btn view" data-aluno-view="${a.id}" title="Visualizar"><i class="fas fa-eye"></i></button>
            </div>
          </td>
        </tr>`;
      },
    });
    window.__relatorioAlunosData = filtered;
  } catch {}
}

document.getElementById('btn-filtrar-rel-alunos')?.addEventListener('click', loadRelatorioAlunos);
document.getElementById('rel-aluno-busca')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadRelatorioAlunos(); });
document.getElementById('rel-aluno-status-mat')?.addEventListener('change', loadRelatorioAlunos);

document.getElementById('btn-exportar-csv-alunos')?.addEventListener('click', () => {
  const data = window.__relatorioAlunosData || [];
  if (!data.length) { notyf.error('Nenhum dado para exportar.'); return; }
  const rows = [['Nome', 'Email', 'CPF', 'Curso', 'Status Matricula']];
  data.forEach(a => {
    const m = a.matriculas?.[0] || {};
    rows.push([a.nome_completo || '', a.email || '', a.cpf || '', m.id_curso?.nome_curso || '', m.status || '']);
  });
  const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `alunos_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  notyf.success('CSV exportado!');
});

document.getElementById('btn-exportar-pdf-alunos')?.addEventListener('click', () => {
  const data = window.__relatorioAlunosData || [];
  if (!data.length) { notyf.error('Nenhum dado.'); return; }
  const now = new Date().toLocaleDateString('pt-BR');
  let html = `<div id="print-area"><h1>Relatório de Alunos - SIGE (${now})</h1>
    <table class="print-tabela"><thead><tr><th>Nome</th><th>Email</th><th>CPF</th><th>Curso</th><th>Status</th></tr></thead><tbody>`;
  data.slice(0, 100).forEach(a => {
    const m = a.matriculas?.[0] || {};
    html += `<tr><td>${a.nome_completo || '-'}</td><td>${a.email || '-'}</td><td>${a.cpf || '-'}</td>
      <td>${m.id_curso?.nome_curso || '-'}</td><td>${m.status || '-'}</td></tr>`;
  });
  if (data.length > 100) html += `<tr><td colspan="5" style="text-align:center;color:#64748b;">... +${data.length - 100}</td></tr>`;
  html += `</tbody></table></div>`;
  const pw = window.open('', '_blank', 'width=800,height=600');
  if (pw) {
    pw.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Alunos SIGE</title>
      <style>body{font-family:Arial,sans-serif;padding:30px 40px}
      h1{font-size:1.2rem;margin-bottom:12px}
      .print-tabela{width:100%;border-collapse:collapse}
      .print-tabela th,.print-tabela td{border:1px solid #e2e8f0;padding:5px 8px;font-size:0.7rem;text-align:left}
      .print-tabela th{background:#f1f5f9;font-weight:600}
      @media print{body{padding:10px}}</style></head><body>${html}</body></html>`);
    pw.document.close();
    setTimeout(() => { pw.focus(); pw.print(); }, 500);
    notyf.success('Impressão aberta.');
  } else notyf.error('Bloqueador de pop-up.');
});

// ======================================
// REAL-TIME POLLING
// ======================================
let pollInterval = null;
const POLL_MS = 30000; // 30 seconds

function startPolling() {
  stopPolling();
  pollInterval = setInterval(() => {
    const visiblePanel = document.querySelector('.module-panel:not(.hidden)');
    if (!visiblePanel) return;
    const id = visiblePanel.id;
    if (id === 'modulo-dashboard') loadDashboard();
    else if (id === 'modulo-dashboard-alunos') loadDashboardAlunos();
    else if (id === 'modulo-inscricoes') loadInscricoes(getFiltros());
    else if (id === 'modulo-relatorios') loadRelatorio(getRelFiltros());
    else if (id === 'modulo-relatorios-alunos') loadRelatorioAlunos();
    else if (id === 'modulo-alunos') loadAlunos();
  }, POLL_MS);
}

function stopPolling() {
  if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
}

// ======================================
// EXPORT DASHBOARD
// ======================================
function openExportModal() {
  document.getElementById('modal-exportar')?.classList.remove('hidden');
}

function closeExportModal() {
  document.getElementById('modal-exportar')?.classList.add('hidden');
}

document.getElementById('btn-exportar-dashboard')?.addEventListener('click', openExportModal);
document.getElementById('modal-exportar-fechar')?.addEventListener('click', closeExportModal);
document.getElementById('exportar-cancelar')?.addEventListener('click', closeExportModal);
document.getElementById('modal-exportar')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeExportModal();
});

// Select All
document.querySelector('.export-select-all')?.addEventListener('change', (e) => {
  document.querySelectorAll('.export-item').forEach(cb => cb.checked = e.target.checked);
});
document.querySelectorAll('.export-item').forEach(cb => {
  cb.addEventListener('change', () => {
    const all = document.querySelectorAll('.export-item');
    const checked = document.querySelectorAll('.export-item:checked');
    document.querySelector('.export-select-all').checked = all.length === checked.length;
  });
});

function getSelectedExports() {
  return [...document.querySelectorAll('.export-item:checked')].map(cb => cb.dataset.export);
}

async function getFilteredDataForExport() {
  const data = await request('/inscricoes?todos=true');
  let f = [...data];
  if (dashCurso !== 'TODOS')
    f = f.filter(i => String(i.id_curso?.id || i.id_curso) === dashCurso);
  if (dashStatus !== 'TODOS')
    f = f.filter(i => i.status_aprovacao === dashStatus);
  if (dashBusca) {
    const t = dashBusca.toLowerCase();
    f = f.filter(i =>
      (i.id_usuario?.nome_completo || i.nome_completo_inscricao || '').toLowerCase().includes(t) ||
      (i.id_usuario?.cpf || i.cpf_inscricao || '').includes(t) ||
      String(i.id).includes(t)
    );
  }
  const hoje = new Date();
  let dias;
  switch (dashPeriodo) {
    case 'trimestre': dias = 90; break;
    case 'semestre': dias = 180; break;
    case 'ano': dias = 365; break;
    default: dias = 30;
  }
  const limite = new Date(hoje);
  limite.setDate(limite.getDate() - dias);
  return f.filter(i => i.data_inscricao && new Date(i.data_inscricao) >= limite);
}

// Export CSV
document.getElementById('exportar-csv-btn')?.addEventListener('click', async () => {
  const selected = getSelectedExports();
  if (!selected.length) { notyf.error('Selecione ao menos um item.'); return; }
  closeExportModal();

  try {
    const data = await getFilteredDataForExport();
    const rows = [['Relatório do Dashboard - SIGE', '', '', '', '']];
    const hojeLabel = new Date().toLocaleDateString('pt-BR');
    rows.push(['Período', dashPeriodo, 'Filtros Ativos', dashStatus !== 'TODOS' ? `Status: ${dashStatus}` : 'Todos os status', '']);
    rows.push(['', '', '', '', '']);

    if (selected.includes('stats')) {
      const aprov = data.filter(i => i.status_aprovacao === 'APROVADA').length;
      const analise = data.filter(i => i.status_aprovacao === 'EM_ANALISE').length;
      const reprov = data.filter(i => i.status_aprovacao === 'REPROVADA').length;
      rows.push(['ESTATÍSTICAS', 'Total', 'Aprovadas', 'Em Análise', 'Reprovadas']);
      rows.push(['', data.length, aprov, analise, reprov]);
      rows.push(['', '', '', '', '']);
    }

    if (selected.includes('doughnut')) {
      rows.push(['INSCRIÇÕES POR STATUS', '', '', '', '']);
      rows.push(['Status', 'Quantidade', '', '', '']);
      rows.push(['Aprovadas', data.filter(i => i.status_aprovacao === 'APROVADA').length, '', '', '']);
      rows.push(['Em Análise', data.filter(i => i.status_aprovacao === 'EM_ANALISE').length, '', '', '']);
      rows.push(['Reprovadas', data.filter(i => i.status_aprovacao === 'REPROVADA').length, '', '', '']);
      rows.push(['', '', '', '', '']);
    }

    if (selected.includes('barras')) {
      const porCurso = {};
      data.forEach(i => {
        const nome = i.id_curso?.nome_curso || 'Sem curso';
        if (!porCurso[nome]) porCurso[nome] = { t: 0, a: 0, an: 0, r: 0 };
        porCurso[nome].t++;
        if (i.status_aprovacao === 'APROVADA') porCurso[nome].a++;
        else if (i.status_aprovacao === 'EM_ANALISE') porCurso[nome].an++;
        else if (i.status_aprovacao === 'REPROVADA') porCurso[nome].r++;
      });
      rows.push(['INSCRIÇÕES POR CURSO', 'Total', 'Aprovadas', 'Em Análise', 'Reprovadas']);
      Object.entries(porCurso).forEach(([nome, v]) => rows.push([nome, v.t, v.a, v.an, v.r]));
      rows.push(['', '', '', '', '']);
    }

    if (selected.includes('timeline')) {
      const hoje2 = new Date();
      const diasExport = dashPeriodo === 'mes' ? 30 : dashPeriodo === 'trimestre' ? 90 : dashPeriodo === 'semestre' ? 180 : 365;
      const numInt = dashPeriodo === 'ano' ? 12 : dashPeriodo === 'semestre' || dashPeriodo === 'trimestre' ? 6 : 30;
      const intSize = Math.ceil(diasExport / numInt);
      const rowsTimeline = [];
      for (let i = numInt - 1; i >= 0; i--) {
        const fim = new Date(hoje2);
        fim.setDate(fim.getDate() - i * intSize);
        const inicio = new Date(fim);
        inicio.setDate(inicio.getDate() - intSize + 1);
        const count = data.filter(item =>
          item.data_inscricao && new Date(item.data_inscricao) >= inicio && new Date(item.data_inscricao) <= fim
        ).length;
        let label;
        if (dashPeriodo === 'ano') label = String(fim.getMonth() + 1).padStart(2, '0');
        else if (dashPeriodo === 'mes') label = fim.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        else label = inicio.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + '-' + fim.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        rowsTimeline.push([label, count, '', '', '']);
      }
      rows.push(['EVOLUÇÃO', 'Inscrições', '', '', '']);
      rowsTimeline.forEach(r => rows.push(r));
    }

    const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dashboard_${dashPeriodo}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    notyf.success('CSV exportado com sucesso!');
  } catch { notyf.error('Erro ao exportar CSV.'); }
});

// Export PDF (print)
document.getElementById('exportar-pdf-btn')?.addEventListener('click', async () => {
  const selected = getSelectedExports();
  if (!selected.length) { notyf.error('Selecione ao menos um item.'); return; }
  closeExportModal();

  try {
    const data = await getFilteredDataForExport();
    const now = new Date().toLocaleDateString('pt-BR');
    let html = `<div id="print-area">
      <h1>Dashboard - SIGE <span style="font-weight:400;font-size:0.85rem;color:#64748b;">(${now})</span></h1>
      <p style="font-size:0.75rem;color:#64748b;margin-bottom:16px;">
        Período: ${dashPeriodo} | ${dashStatus !== 'TODOS' ? `Status: ${dashStatus}` : 'Todos os status'} | ${dashBusca ? `Busca: ${dashBusca}` : ''}
      </p>`;

    if (selected.includes('stats')) {
      const aprov = data.filter(i => i.status_aprovacao === 'APROVADA').length;
      const analise = data.filter(i => i.status_aprovacao === 'EM_ANALISE').length;
      const reprov = data.filter(i => i.status_aprovacao === 'REPROVADA').length;
      html += `<div class="print-stats">
        <div class="print-stat" style="border-top-color:#0ea5e9"><span class="num">${data.length}</span><span class="lbl">Total</span></div>
        <div class="print-stat" style="border-top-color:#10b981"><span class="num">${aprov}</span><span class="lbl">Aprovadas</span></div>
        <div class="print-stat" style="border-top-color:#f59e0b"><span class="num">${analise}</span><span class="lbl">Análise</span></div>
        <div class="print-stat" style="border-top-color:#ef4444"><span class="num">${reprov}</span><span class="lbl">Reprovadas</span></div>
      </div>`;
    }

    if (selected.includes('doughnut')) {
      html += `<div class="print-chart"><h3>Inscrições por Status</h3>
      <table class="print-tabela"><thead><tr><th>Status</th><th>Quantidade</th></tr></thead><tbody>
        <tr><td>Aprovadas</td><td>${data.filter(i => i.status_aprovacao === 'APROVADA').length}</td></tr>
        <tr><td>Em Análise</td><td>${data.filter(i => i.status_aprovacao === 'EM_ANALISE').length}</td></tr>
        <tr><td>Reprovadas</td><td>${data.filter(i => i.status_aprovacao === 'REPROVADA').length}</td></tr>
      </tbody></table></div>`;
    }

    if (selected.includes('barras')) {
      const porCurso = {};
      data.forEach(i => {
        const nome = i.id_curso?.nome_curso || 'Sem curso';
        if (!porCurso[nome]) porCurso[nome] = { t: 0, a: 0, an: 0, r: 0 };
        porCurso[nome].t++;
        if (i.status_aprovacao === 'APROVADA') porCurso[nome].a++;
        else if (i.status_aprovacao === 'EM_ANALISE') porCurso[nome].an++;
        else if (i.status_aprovacao === 'REPROVADA') porCurso[nome].r++;
      });
      html += `<div class="print-chart"><h3>Inscrições por Curso</h3>
      <table class="print-tabela"><thead><tr><th>Curso</th><th>Total</th><th>Aprovadas</th><th>Análise</th><th>Reprovadas</th></tr></thead><tbody>`;
      Object.entries(porCurso).forEach(([nome, v]) => {
        html += `<tr><td>${nome}</td><td>${v.t}</td><td>${v.a}</td><td>${v.an}</td><td>${v.r}</td></tr>`;
      });
      html += `</tbody></table></div>`;
    }

    if (selected.includes('timeline')) {
      const hoje2 = new Date();
      const diasExport = dashPeriodo === 'mes' ? 30 : dashPeriodo === 'trimestre' ? 90 : dashPeriodo === 'semestre' ? 180 : 365;
      const numInt = dashPeriodo === 'ano' ? 12 : dashPeriodo === 'semestre' || dashPeriodo === 'trimestre' ? 6 : 30;
      const intSize = Math.ceil(diasExport / numInt);
      html += `<div class="print-chart"><h3>Evolução</h3>
      <table class="print-tabela"><thead><tr><th>Período</th><th>Inscrições</th></tr></thead><tbody>`;
      for (let i = numInt - 1; i >= 0; i--) {
        const fim = new Date(hoje2);
        fim.setDate(fim.getDate() - i * intSize);
        const inicio = new Date(fim);
        inicio.setDate(inicio.getDate() - intSize + 1);
        const count = data.filter(item =>
          item.data_inscricao && new Date(item.data_inscricao) >= inicio && new Date(item.data_inscricao) <= fim
        ).length;
        let label;
        if (dashPeriodo === 'ano') label = String(fim.getMonth() + 1).padStart(2, '0');
        else if (dashPeriodo === 'mes') label = fim.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        else label = inicio.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + '-' + fim.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        html += `<tr><td>${label}</td><td>${count}</td></tr>`;
      }
      html += `</tbody></table></div>`;
    }

    html += `</div>`;
    const printWin = window.open('', '_blank', 'width=800,height=600');
    if (printWin) {
      printWin.document.write(`<!DOCTYPE html><html><head>
        <meta charset="utf-8"><title>Dashboard SIGE</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; padding: 30px 40px; color: #0f172a; }
          h1 { font-size: 1.2rem; margin-bottom: 4px; }
          .print-stats { display: flex; gap: 12px; margin-bottom: 16px; }
          .print-stat { flex: 1; text-align: center; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; border-top: 3px solid #0ea5e9; }
          .print-stat .num { display: block; font-size: 1.5rem; font-weight: 700; }
          .print-stat .lbl { display: block; font-size: 0.7rem; color: #64748b; text-transform: uppercase; margin-top: 4px; }
          .print-chart { page-break-inside: avoid; margin-bottom: 20px; }
          .print-chart h3 { font-size: 0.9rem; margin-bottom: 8px; }
          .print-tabela { width: 100%; border-collapse: collapse; }
          .print-tabela th, .print-tabela td { border: 1px solid #e2e8f0; padding: 5px 8px; font-size: 0.7rem; text-align: left; }
          .print-tabela th { background: #f1f5f9; font-weight: 600; }
          @media print { body { padding: 10px; } }
        </style>
      </head><body>${html}</body></html>`);
      printWin.document.close();
      setTimeout(() => { printWin.focus(); printWin.print(); }, 500);
      notyf.success('Janela de impressão aberta.');
    } else notyf.error('Bloqueador de pop-up impediu abrir a impressão.');
  } catch { notyf.error('Erro ao gerar PDF.'); }
});

// ======================================
// INSCRICOES
// ======================================
async function loadInscricoes(filters = {}) {
  showSkeleton('inscricoes');
  try {
    let data;
    if (filters.texto || filters.status !== 'TODOS' || filters.curso !== 'TODOS') {
      data = await request('/inscricoes?todos=true');
    } else {
      data = state.inscricoes.length ? state.inscricoes : await request('/inscricoes?todos=true');
    }
    state.inscricoes = data;

    let filtered = [...data];
    if (filters.texto) {
      const t = filters.texto.toLowerCase();
      filtered = filtered.filter(i =>
        (i.id_usuario?.nome_completo || '').toLowerCase().includes(t) ||
        (i.id_curso?.nome_curso || '').toLowerCase().includes(t) ||
        (i.cpf_inscricao || '').includes(t)
      );
    }
    if (filters.status && filters.status !== 'TODOS') {
      filtered = filtered.filter(i => i.status_aprovacao === filters.status);
    }
    if (filters.curso && filters.curso !== 'TODOS') {
      filtered = filtered.filter(i => String(i.id_curso?.id || i.id_curso) === filters.curso);
    }

    const tbody = document.getElementById('lista-inscricoes');
    const pagContainer = document.getElementById('paginacao-inscricoes');
    if (filtered.length === 0) {
      showEmpty('inscricoes', 'Nenhuma inscricao encontrada com esses filtros.');
      if (pagContainer) pagContainer.innerHTML = '';
      return;
    }
    showTable('inscricoes');
    filtered.sort((a, b) => new Date(b.data_inscricao || 0) - new Date(a.data_inscricao || 0));
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: document.getElementById('inscricoes-empty'),
      dados: filtered,
      renderizarItem: i => `<tr>
        <td><strong>${i.id_usuario?.nome_completo || i.nome_completo_inscricao || '-'}</strong></td>
        <td>${i.id_curso?.nome_curso || '-'}</td>
        <td>${i.data_inscricao ? new Date(i.data_inscricao).toLocaleDateString('pt-BR') : '-'}</td>
        <td>${badge(i.status_aprovacao)}</td>
        <td><button class="btn btn-soft btn-sm" data-inscricao-view="${i.id}">Detalhes</button></td>
      </tr>`,
    });
  } catch { showEmpty('inscricoes', 'Erro ao carregar inscricoes.'); }
}

// --- Inscricao Detail ---
async function showInscricaoDetail(id) {
  try {
    const inscricao = await request(`/inscricoes/${id}`);
    document.getElementById('det-aluno').textContent = inscricao.id_usuario?.nome_completo || inscricao.nome_completo_inscricao || '-';
    document.getElementById('det-email').textContent = inscricao.id_usuario?.email || inscricao.email_inscricao || '-';
    document.getElementById('det-telefone').textContent = inscricao.id_usuario?.telefone || inscricao.telefone_inscricao || '-';
    document.getElementById('det-cpf').textContent = inscricao.id_usuario?.cpf || inscricao.cpf_inscricao || '-';
    document.getElementById('det-rg').textContent = inscricao.rg_inscricao || '-';
    document.getElementById('det-data-nascimento').textContent = inscricao.id_usuario?.data_nascimento || inscricao.data_nascimento_inscricao || '-';
    document.getElementById('det-curso').textContent = inscricao.id_curso?.nome_curso || '-';
    document.getElementById('det-data-inscricao').textContent = inscricao.data_inscricao ? new Date(inscricao.data_inscricao).toLocaleDateString('pt-BR') : '-';
    document.getElementById('det-escolaridade').textContent = inscricao.escolaridade_declarada || '-';
    document.getElementById('inscricao-id-edicao').value = inscricao.id;
    document.getElementById('inscricao-status-aprovacao').value = inscricao.status_aprovacao || 'EM_ANALISE';
    document.getElementById('inscricao-status-matricula').value = inscricao.status_matricula || '';
    document.getElementById('form-gerenciar-inscricao').style.display = hasPerm('inscricao.editar') ? '' : 'none';
    window.__currentInscricaoId = id;
    document.getElementById('modulo-inscricoes').classList.add('hidden');
    document.getElementById('modulo-inscricoes-detalhes').classList.remove('hidden');
    saveState();
  } catch { notyf.error('Erro ao carregar detalhes da inscricao.'); }
}

// --- form gerenciar inscricao ---
document.addEventListener('submit', async (e) => {
  const form = e.target.closest('#form-gerenciar-inscricao');
  if (!form) return;
  e.preventDefault();
  const id = document.getElementById('inscricao-id-edicao').value;
  if (!id) return;
  const payload = {
    status_aprovacao: document.getElementById('inscricao-status-aprovacao').value,
    status_matricula: document.getElementById('inscricao-status-matricula').value || null,
  };
  if (payload.status_matricula === 'ACEITA') {
    payload.data_aceite_matricula = new Date().toISOString().slice(0, 10);
  }
  try {
    await request(`/inscricoes/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    notyf.success('Inscricao atualizada com sucesso!');
    window.__currentInscricaoId = null;
    document.getElementById('modulo-inscricoes-detalhes').classList.add('hidden');
    document.getElementById('modulo-inscricoes').classList.remove('hidden');
    await loadInscricoes(getFiltros());
    saveState();
  } catch (e) { notyf.error('Falha ao atualizar: ' + (e.message || '')); }
});

// --- voltar ---
document.getElementById('voltar-lista-inscricoes')?.addEventListener('click', () => {
  window.__currentInscricaoId = null;
  document.getElementById('modulo-inscricoes-detalhes').classList.add('hidden');
  document.getElementById('modulo-inscricoes').classList.remove('hidden');
  saveState();
});

// --- filter helpers ---
function getFiltros() {
  return {
    texto: document.getElementById('filtro-inscricao-texto')?.value || '',
    status: document.getElementById('filtro-inscricao-status')?.value || 'TODOS',
    curso: document.getElementById('filtro-inscricao-curso')?.value || 'TODOS',
  };
}

document.querySelectorAll('#filtro-inscricao-texto, #filtro-inscricao-status, #filtro-inscricao-curso').forEach(el => {
  el.addEventListener('input', () => loadInscricoes(getFiltros()));
  el.addEventListener('change', () => loadInscricoes(getFiltros()));
});

// ======================================
// CURSOS
// ======================================
async function loadCursos(filters = {}) {
  showSkeleton('cursos');
  try {
    const data = await request('/cursos?todos=true');
    state.cursos = data;

    // Preencher select de unidade (no form)
    const unidadeOpts = [...new Set(data.map(c => c.id_unidade?.id).filter(Boolean))];
    const unidadeNomes = {};
    data.forEach(c => { if (c.id_unidade) unidadeNomes[c.id_unidade.id] = c.id_unidade.nome || c.id_unidade; });

    const sel = document.getElementById('curso-unidade');
    if (sel) {
      sel.innerHTML = '<option value="">Selecione</option>' +
        [...new Set(data.map(c => JSON.stringify({ id: c.id_unidade?.id, nome: c.id_unidade?.nome })))]
        .map(s => JSON.parse(s)).filter(x => x.id)
        .map(u => `<option value="${u.id}">${u.nome}</option>`)
        .join('');
    }

    let filtered = [...data];
    if (filters.texto) {
      const t = filters.texto.toLowerCase();
      filtered = filtered.filter(c => c.nome_curso?.toLowerCase().includes(t) || (c.tipo || '').toLowerCase().includes(t));
    }
    if (filters.status && filters.status !== 'TODOS') {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.unidade && filters.unidade !== 'TODAS') {
      filtered = filtered.filter(c => String(c.id_unidade?.id || c.id_unidade) === filters.unidade);
    }

    const tbody = document.getElementById('lista-cursos');
    const pagContainer = document.getElementById('paginacao-cursos');
    if (filtered.length === 0) { showEmpty('cursos', 'Nenhum curso encontrado.'); if (pagContainer) pagContainer.innerHTML = ''; return; }
    showTable('cursos');
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: document.getElementById('cursos-empty'),
      dados: filtered,
      renderizarItem: c => `<tr>
        <td><strong>${c.nome_curso || '-'}</strong></td>
        <td>${c.id_unidade?.nome || '-'}</td>
        <td>${c.turno || '-'}</td>
        <td>${badge(c.status)}</td>
        <td>
          ${hasPerm('curso.editar') ? `<button class="btn btn-soft btn-sm" data-curso-edit="${c.id}">Editar</button>` : ''}
          ${hasPerm('curso.excluir') ? `<button class="btn btn-danger btn-sm" data-curso-del="${c.id}">Excluir</button>` : ''}
        </td>
      </tr>`,
    });
  } catch { showEmpty('cursos', 'Erro ao carregar cursos.'); }
}

document.getElementById('form-curso')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('curso-id').value;
  const payload = {
    nome_curso: document.getElementById('curso-nome').value,
    id_unidade: document.getElementById('curso-unidade').value || null,
    tipo: document.getElementById('curso-tipo').value,
    turno: document.getElementById('curso-turno').value,
    data_inicio: document.getElementById('curso-data').value || null,
    duracao_meses: parseInt(document.getElementById('curso-duracao').value) || null,
    status: document.getElementById('curso-status').value,
  };
  try {
    if (id) {
      await request(`/cursos/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      notyf.success('Curso atualizado!');
    } else {
      await request('/cursos', { method: 'POST', body: JSON.stringify(payload) });
      notyf.success('Curso cadastrado!');
    }
    document.getElementById('form-curso').reset();
    document.getElementById('curso-id').value = '';
    document.getElementById('cancelar-curso').style.display = 'none';
    await loadCursos();
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
});

// --- Unidade form ---
document.getElementById('form-unidade')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('unidade-id').value;
  const payload = {
    nome: document.getElementById('unidade-nome').value,
    cnpj: document.getElementById('unidade-cnpj').value,
    estado: document.getElementById('unidade-estado').value,
    cidade: document.getElementById('unidade-cidade').value,
  };
  try {
    if (id) {
      await request(`/unidades/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      notyf.success('Unidade atualizada!');
    } else {
      await request('/unidades', { method: 'POST', body: JSON.stringify(payload) });
      notyf.success('Unidade cadastrada!');
    }
    document.getElementById('form-unidade').reset();
    document.getElementById('unidade-id').value = '';
    document.getElementById('cancelar-unidade').style.display = 'none';
    await loadUnidades();
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
});

// --- Usuario form ---
document.getElementById('form-admin-user')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('admin-user-id').value;
  const cargoId = parseInt(document.getElementById('admin-user-cargo').value);
  const cargoNome = (state.cargos || []).find(c => c.id === cargoId)?.nome || '';
  const roleMap = { 'Admin Master': 'ROLE_ADMIN', 'Administrador': 'ROLE_ADMIN', 'Secretaria': 'ROLE_ADMIN', 'Professor': 'ROLE_TEACHER', 'Aluno': 'ROLE_STUDENT', 'Candidato': 'ROLE_USER' };
  const payload = {
    nomeCompleto: document.getElementById('admin-user-nome').value,
    email: document.getElementById('admin-user-email').value,
    cpf: document.getElementById('admin-user-cpf').value,
    telefone: document.getElementById('admin-user-telefone').value,
    dataNascimento: document.getElementById('admin-user-data-nascimento').value || null,
    role: roleMap[cargoNome] || 'ROLE_USER',
    id_cargo: cargoId || null,
  };
  try {
    if (id) {
      await request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      notyf.success('Usuario atualizado!');
    } else {
      payload.senha = document.getElementById('admin-user-senha').value;
      await request('/usuarios/admin', { method: 'POST', body: JSON.stringify(payload) });
      notyf.success('Usuario cadastrado!');
    }
    document.getElementById('form-admin-user').reset();
    document.getElementById('admin-user-id').value = '';
    document.getElementById('cancelar-usuario').style.display = 'none';
    await loadUsuarios();
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
});

// --- Edital form ---
document.getElementById('form-edital')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edital-id').value;
  const payload = {
    titulo: document.getElementById('edital-titulo').value,
    url: document.getElementById('edital-url').value,
    ativo: document.getElementById('edital-ativo').value === 'true',
  };
  try {
    if (id) {
      await request(`/editais/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      notyf.success('Edital atualizado!');
    } else {
      await request('/editais', { method: 'POST', body: JSON.stringify(payload) });
      notyf.success('Edital cadastrado!');
    }
    document.getElementById('form-edital').reset();
    document.getElementById('edital-id').value = '';
    document.getElementById('cancelar-edital').style.display = 'none';
    await loadEditais();
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
});

// --- Cancel buttons ---
document.getElementById('cancelar-unidade')?.addEventListener('click', () => {
  document.getElementById('form-unidade').reset();
  document.getElementById('unidade-id').value = '';
  document.getElementById('cancelar-unidade').style.display = 'none';
});
document.getElementById('cancelar-usuario')?.addEventListener('click', () => {
  document.getElementById('form-admin-user').reset();
  document.getElementById('admin-user-id').value = '';
  document.getElementById('cancelar-usuario').style.display = 'none';
});
document.getElementById('cancelar-edital')?.addEventListener('click', () => {
  document.getElementById('form-edital').reset();
  document.getElementById('edital-id').value = '';
  document.getElementById('cancelar-edital').style.display = 'none';
});

// ======================================
// UNIDADES, USUARIOS, EDITAIS, ALUNOS
// (Stubs - carregam e exibem com skeleton)
// ======================================
async function loadUnidades(filters = {}) {
  showSkeleton('unidades');
  try {
    const data = await request('/unidades');
    state.unidades = data;
    let f = [...data];
    if (filters.texto) { const t = filters.texto.toLowerCase(); f = f.filter(u => u.nome?.toLowerCase().includes(t) || (u.cnpj || '').includes(t)); }
    if (filters.estado) { f = f.filter(u => (u.estado || '').toLowerCase() === filters.estado.toLowerCase()); }
    const tbody = document.getElementById('lista-unidades');
    const pagContainer = document.getElementById('paginacao-unidades');
    if (f.length === 0) { showEmpty('unidades', 'Nenhuma unidade encontrada.'); if (pagContainer) pagContainer.innerHTML = ''; return; }
    showTable('unidades');
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: document.getElementById('unidades-empty'),
      dados: f,
      renderizarItem: u => `<tr>
        <td><strong>${u.nome || '-'}</strong></td>
        <td>${u.cnpj || '-'}</td>
        <td>${u.cidade || '-'}/${u.estado || '-'}</td>
        <td>
          ${hasPerm('unidade.editar') ? `<button class="btn btn-soft btn-sm" data-unidade-edit="${u.id}">Editar</button>` : ''}
          ${hasPerm('unidade.excluir') ? `<button class="btn btn-danger btn-sm" data-unidade-del="${u.id}">Excluir</button>` : ''}
        </td>
      </tr>`,
    });
  } catch { showEmpty('unidades', 'Erro ao carregar unidades.'); }
}

function cargoName(id) { const c = (state.cargos || []).find(c => c.id === id); return c ? c.nome : '-'; }

async function loadUsuarios(filters = {}) {
  showSkeleton('usuarios');
  try {
    const data = await request('/usuarios');
    state.usuarios = data;
    let f = [...data];
    if (filters.texto) { const t = filters.texto.toLowerCase(); f = f.filter(u => (u.nomeCompleto || u.nome_completo || '').toLowerCase().includes(t) || (u.email || '').toLowerCase().includes(t)); }
    if (filters.cargo && filters.cargo !== 'TODOS') { f = f.filter(u => u.id_cargo === parseInt(filters.cargo)); }
    const tbody = document.getElementById('lista-usuarios');
    const pagContainer = document.getElementById('paginacao-usuarios');
    if (f.length === 0) { showEmpty('usuarios', 'Nenhum usuario encontrado.'); if (pagContainer) pagContainer.innerHTML = ''; return; }
    showTable('usuarios');
    const cargos = state.cargos || [];
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: document.getElementById('usuarios-empty'),
      dados: f,
      renderizarItem: u => {
        const c = cargos.find(c => c.id === u.id_cargo);
        const nomeCargo = c ? c.nome : roleLabel(u.role);
        return `<tr>
        <td><strong>${u.nomeCompleto || u.nome_completo || '-'}</strong></td>
        <td>${u.email || '-'}</td>
        <td>${badge(nomeCargo)}</td>
        <td>
          ${hasPerm('usuario.editar') ? `<button class="btn btn-soft btn-sm" data-usuario-edit="${u.id}">Editar</button>` : ''}
          ${hasPerm('usuario.excluir') ? `<button class="btn btn-danger btn-sm" data-usuario-del="${u.id}">Excluir</button>` : ''}
        </td>
      </tr>`},
    });
  } catch { showEmpty('usuarios', 'Erro ao carregar usuarios.'); }
}

async function loadEditais(filters = {}) {
  showSkeleton('editais');
  try {
    const data = await request('/editais');
    state.editais = data;
    let f = [...data];
    if (filters.texto) { const t = filters.texto.toLowerCase(); f = f.filter(e => e.titulo?.toLowerCase().includes(t)); }
    if (filters.status && filters.status !== 'TODOS') { f = f.filter(e => (e.ativo ? 'ATIVO' : 'INATIVO') === filters.status); }
    const tbody = document.getElementById('lista-editais');
    const pagContainer = document.getElementById('paginacao-editais');
    if (f.length === 0) { showEmpty('editais', 'Nenhum edital encontrado.'); if (pagContainer) pagContainer.innerHTML = ''; return; }
    showTable('editais');
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: document.getElementById('editais-empty'),
      dados: f,
      renderizarItem: e => `<tr>
        <td><strong>${e.titulo || '-'}</strong></td>
        <td><a href="${e.url || '#'}" target="_blank" style="color:var(--sec-accent)">Abrir</a></td>
        <td>${badge(e.ativo ? 'ATIVO' : 'INATIVO')}</td>
        <td>
          ${hasPerm('edital.editar') ? `<button class="btn btn-soft btn-sm" data-edital-edit="${e.id}">Editar</button>` : ''}
          ${hasPerm('edital.excluir') ? `<button class="btn btn-danger btn-sm" data-edital-del="${e.id}">Excluir</button>` : ''}
        </td>
      </tr>`,
    });
  } catch { showEmpty('editais', 'Erro ao carregar editais.'); }
}

// ======================================
// ALUNOS + DETALHES
// ======================================
async function loadAlunos(filters = {}) {
  showSkeleton('alunos');
  try {
    const data = await request('/alunos');
    state.alunos = data;
    let f = [...data];
    if (filters.texto) {
      const t = filters.texto.toLowerCase();
      f = f.filter(a => (a.nome_completo || '').toLowerCase().includes(t) || (a.email || '').toLowerCase().includes(t) || (a.cpf || '').includes(t));
    }
    if (filters.curso && filters.curso !== 'TODOS') {
      f = f.filter(a => a.matriculas?.some(m => String(m.id_curso?.id || m.id_curso) === filters.curso));
    }
    if (filters.statusMat && filters.statusMat !== 'TODOS') {
      f = f.filter(a => a.matriculas?.some(m => m.status === filters.statusMat));
    }
    const tbody = document.getElementById('lista-alunos');
    const pagContainer = document.getElementById('paginacao-alunos');
    if (f.length === 0) { showEmpty('alunos', 'Nenhum aluno encontrado.'); if (pagContainer) pagContainer.innerHTML = ''; return; }
    showTable('alunos');
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: document.getElementById('alunos-empty'),
      dados: f,
      renderizarItem: a => {
        const m = a.matriculas?.[0] || {};
        return `<tr>
          <td><strong>${a.nome_completo || '-'}</strong></td>
          <td>${a.email || '-'}</td>
          <td>${m.id_curso?.nome_curso || '-'}</td>
          <td>${m.id_turma?.nome || '-'}</td>
          <td>${badge(m.status)}</td>
          <td><button class="btn btn-soft btn-sm" data-aluno-view="${a.id}">Detalhes</button></td>
        </tr>`;
      },
    });
  } catch { showEmpty('alunos', 'Erro ao carregar alunos.'); }
}

async function showAlunoDetail(id) {
  try {
    const aluno = await request(`/alunos/${id}`);
    const m = aluno.matriculas?.[0] || {};
    const html = `
      <div class="detail-section">
        <h3>Dados Pessoais</h3>
        <div class="detail-grid">
          <div class="detail-item"><span class="detail-label">Nome</span><span class="detail-value">${aluno.nome_completo || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">${aluno.email || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">CPF</span><span class="detail-value">${aluno.cpf || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">Telefone</span><span class="detail-value">${aluno.telefone || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">Role</span><span class="detail-value">${badge(aluno.role)}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <h3>Matricula</h3>
        <div class="detail-grid">
          <div class="detail-item"><span class="detail-label">Curso</span><span class="detail-value">${m.id_curso?.nome_curso || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">Turma</span><span class="detail-value">${m.id_turma?.nome || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">Numero</span><span class="detail-value">${m.numero_matricula || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value">${badge(m.status)}</span></div>
          <div class="detail-item"><span class="detail-label">Data</span><span class="detail-value">${m.data_matricula ? new Date(m.data_matricula).toLocaleDateString('pt-BR') : '-'}</span></div>
        </div>
      </div>
      ${(aluno.historico?.length ? `
      <div class="detail-section">
        <h3>Historico Escolar (${aluno.historico.length})</h3>
        <div class="table-wrapper" style="border:1px solid var(--sec-border);border-radius:6px;">
          <table><thead><tr><th>Disciplina</th><th>Ano/Sem</th><th>Nota</th><th>Status</th></tr></thead>
          <tbody>          ${aluno.historico.slice(0, 10).map(h => `<tr>
            <td>${h.id_disciplina?.nome || '-'}</td>
            <td>${h.ano || '-'}/${h.semestre || '-'}</td>
            <td>${h.nota ?? '-'}</td>
            <td>${badge(h.status || (h.nota >= 6 ? 'APROVADO' : 'REPROVADO'))}</td>
          </tr>`).join('')}</tbody></table>
        </div>
      </div>` : '')}
      ${(aluno.documentos?.length ? `
      <div class="detail-section">
        <h3>Documentos (${aluno.documentos.length})</h3>
        <div class="table-wrapper" style="border:1px solid var(--sec-border);border-radius:6px;">
          <table><thead><tr><th>Tipo</th><th>Data</th><th>Status</th></tr></thead>
          <tbody>${aluno.documentos.slice(0, 10).map(d => `<tr>
            <td>${d.tipo_documento || '-'}</td>
            <td>${d.data_envio ? new Date(d.data_envio).toLocaleDateString('pt-BR') : '-'}</td>
            <td>${badge(d.status)}</td>
          </tr>`).join('')}</tbody></table>
        </div>
      </div>` : '')}
      ${(aluno.reclamacoes?.length ? `
      <div class="detail-section">
        <h3>Reclamacoes (${aluno.reclamacoes.length})</h3>
        <div class="table-wrapper" style="border:1px solid var(--sec-border);border-radius:6px;">
          <table><thead><tr><th>Assunto</th><th>Data</th><th>Status</th></tr></thead>
          <tbody>${aluno.reclamacoes.slice(0, 10).map(r => `<tr>
            <td>${r.assunto || '-'}</td>
            <td>${r.data_abertura ? new Date(r.data_abertura).toLocaleDateString('pt-BR') : '-'}</td>
            <td>${badge(r.status)}</td>
          </tr>`).join('')}</tbody></table>
        </div>
      </div>` : '')}
      ${(aluno.atendimentos?.length ? `
      <div class="detail-section">
        <h3>Atendimentos (${aluno.atendimentos.length})</h3>
        <div class="table-wrapper" style="border:1px solid var(--sec-border);border-radius:6px;">
          <table><thead><tr><th>Tipo</th><th>Data</th><th>Status</th></tr></thead>
          <tbody>${aluno.atendimentos.slice(0, 10).map(a => `<tr>
            <td>${a.tipo || '-'}</td>
            <td>${a.data_atendimento ? new Date(a.data_atendimento).toLocaleDateString('pt-BR') : '-'}</td>
            <td>${badge(a.status)}</td>
          </tr>`).join('')}</tbody></table>
        </div>
      </div>` : '')}
    `;
    document.getElementById('aluno-detalhes-content').innerHTML = html;
    document.getElementById('modulo-alunos').classList.add('hidden');
    document.getElementById('modulo-aluno-detalhes').classList.remove('hidden');
  } catch { notyf.error('Erro ao carregar detalhes do aluno.'); }
}

document.getElementById('voltar-lista-alunos')?.addEventListener('click', () => {
  window.__currentAlunoId = null;
  window.__currentAluno = null;
  document.getElementById('modulo-aluno-detalhes').classList.add('hidden');
  document.getElementById('modulo-alunos').classList.remove('hidden');
  saveState();
});

// ======================================
// RELATORIO COMPLETO DE INSCRICOES
// ======================================
async function loadRelatorio(filters = {}) {
  document.getElementById('relatorio-carregando')?.classList.remove('hidden');
  document.getElementById('relatorio-empty')?.classList.add('hidden');
  const tbody = document.getElementById('relatorio-tbody');
  if (tbody) tbody.innerHTML = '';

  try {
    const data = await request('/inscricoes?todos=true');
    let filtered = [...data];

    if (filters.data_inicio)
      filtered = filtered.filter(i => i.data_inscricao && i.data_inscricao.slice(0, 10) >= filters.data_inicio);
    if (filters.data_fim)
      filtered = filtered.filter(i => i.data_inscricao && i.data_inscricao.slice(0, 10) <= filters.data_fim);
    if (filters.status && filters.status !== 'TODOS')
      filtered = filtered.filter(i => i.status_aprovacao === filters.status);
    if (filters.curso && filters.curso !== 'TODOS')
      filtered = filtered.filter(i => String(i.id_curso?.id || i.id_curso) === filters.curso);
    if (filters.busca) {
      const t = filters.busca.toLowerCase();
      filtered = filtered.filter(i =>
        (i.id_usuario?.nome_completo || i.nome_completo_inscricao || '').toLowerCase().includes(t) ||
        (i.id_usuario?.cpf || i.cpf_inscricao || '').includes(t) ||
        String(i.id).includes(t)
      );
    }

    // Summary
    const total = filtered.length;
    const aprovadas = filtered.filter(i => i.status_aprovacao === 'APROVADA').length;
    const analise = filtered.filter(i => i.status_aprovacao === 'EM_ANALISE').length;
    const reprovadas = filtered.filter(i => i.status_aprovacao === 'REPROVADA').length;
    const matriculados = filtered.filter(i => i.status_matricula === 'ACEITA' || i.status_matricula === 'CONCLUIDA' || i.status_matricula === 'CONCLUIDO').length;
    document.getElementById('rel-total').textContent = total;
    document.getElementById('rel-aprovadas').textContent = aprovadas;
    document.getElementById('rel-analise').textContent = analise;
    document.getElementById('rel-reprovadas').textContent = reprovadas;
    document.getElementById('rel-matriculados').textContent = matriculados;

    document.getElementById('relatorio-carregando')?.classList.add('hidden');

    // Table
    const pagContainer = document.getElementById('paginacao-relatorios');
    if (total === 0) {
      document.getElementById('relatorio-empty')?.classList.remove('hidden');
      if (pagContainer) pagContainer.innerHTML = '';
      return;
    }

    const sorted = [...filtered].sort((a, b) => new Date(b.data_inscricao || 0) - new Date(a.data_inscricao || 0));
    window.__relatorioData = sorted;
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: document.getElementById('relatorio-empty'),
      dados: sorted,
      renderizarItem: i => {
        const alunoNome = i.id_usuario?.nome_completo || i.nome_completo_inscricao || '-';
        const documento = i.id_usuario?.cpf || i.cpf_inscricao || '-';
        const cursoNome = i.id_curso?.nome_curso || '-';
        const dataIns = i.data_inscricao ? new Date(i.data_inscricao).toLocaleDateString('pt-BR') : '-';
        const actions = `
          <div class="action-btns">
            <button class="action-btn view" data-rel-view="${i.id}" title="Visualizar"><i class="fas fa-eye"></i></button>
            <button class="action-btn approve" data-rel-aprovar="${i.id}" title="Aprovar"><i class="fas fa-check"></i></button>
            <button class="action-btn reject" data-rel-reprovar="${i.id}" title="Reprovar"><i class="fas fa-times"></i></button>
          </div>`;
        return `<tr>
          <td style="font-size:0.75rem;color:var(--sec-muted)">#${i.id}</td>
          <td><strong>${alunoNome}</strong></td>
          <td style="font-size:0.78rem">${documento}</td>
          <td>${cursoNome}</td>
          <td style="font-size:0.78rem">${dataIns}</td>
          <td>${badge(i.status_aprovacao)}</td>
          <td>${badge(i.status_matricula || '')}</td>
          <td>${actions}</td>
        </tr>`;
      },
    });
  } catch {
    document.getElementById('relatorio-carregando')?.classList.add('hidden');
    document.getElementById('relatorio-empty')?.classList.remove('hidden');
    if (document.getElementById('relatorio-empty')?.querySelector('h3'))
      document.getElementById('relatorio-empty').querySelector('h3').textContent = 'Erro ao carregar dados';
  }
}

// --- Relatorio filter helpers ---
function getRelFiltros() {
  return {
    data_inicio: document.getElementById('rel-data-inicio')?.value || '',
    data_fim: document.getElementById('rel-data-fim')?.value || '',
    status: document.getElementById('rel-status-filtro')?.value || 'TODOS',
    curso: document.getElementById('rel-curso-filtro')?.value || 'TODOS',
    busca: document.getElementById('rel-busca-texto')?.value || '',
  };
}

document.getElementById('btn-filtrar-relatorio')?.addEventListener('click', () => loadRelatorio(getRelFiltros()));

// --- Relatorio: row actions via delegation ---
document.getElementById('relatorio-tbody')?.addEventListener('click', async (e) => {
  const view = e.target.closest('[data-rel-view]');
  if (view) {
    const id = view.dataset.relView;
    // Reuse the existing inscription detail
    showInscricaoDetail(id);
  }

  const aprovar = e.target.closest('[data-rel-aprovar]');
  if (aprovar) {
    const id = aprovar.dataset.relAprovar;
    try {
      await request(`/inscricoes/${id}`, { method: 'PUT', body: JSON.stringify({ status_aprovacao: 'APROVADA' }) });
      notyf.success('Inscrição aprovada!');
      loadRelatorio(getRelFiltros());
    } catch { notyf.error('Erro ao aprovar inscrição.'); }
  }

  const reprovar = e.target.closest('[data-rel-reprovar]');
  if (reprovar) {
    const id = reprovar.dataset.relReprovar;
    if (!await confirmAction('Reprovar esta inscrição?')) return;
    try {
      await request(`/inscricoes/${id}`, { method: 'PUT', body: JSON.stringify({ status_aprovacao: 'REPROVADA' }) });
      notyf.success('Inscrição reprovada!');
      loadRelatorio(getRelFiltros());
    } catch { notyf.error('Erro ao reprovar inscrição.'); }
  }
});

// --- Relatorio: Export CSV ---
document.getElementById('btn-exportar-csv-rel')?.addEventListener('click', () => exportRelatorioCSV());
document.getElementById('btn-exportar-pdf-rel')?.addEventListener('click', () => exportRelatorioPDF());

function exportRelatorioCSV() {
  const data = window.__relatorioData || [];
  if (!data.length) { notyf.error('Nenhum dado para exportar.'); return; }
  const rows = [['ID', 'Aluno', 'Email', 'CPF', 'Curso', 'Data Inscricao', 'Status Aprovacao', 'Status Matricula']];
  data.forEach(i => {
    rows.push([
      i.id, i.id_usuario?.nome_completo || i.nome_completo_inscricao || '',
      i.id_usuario?.email || i.email_inscricao || '',
      i.id_usuario?.cpf || i.cpf_inscricao || '',
      i.id_curso?.nome_curso || '', i.data_inscricao ? new Date(i.data_inscricao).toLocaleDateString('pt-BR') : '',
      i.status_aprovacao || '', i.status_matricula || '',
    ]);
  });
  const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `relatorio_inscricoes_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  notyf.success('CSV exportado com sucesso!');
}

function exportRelatorioPDF() {
  const data = window.__relatorioData || [];
  if (!data.length) { notyf.error('Nenhum dado para exportar.'); return; }
  const now = new Date().toLocaleDateString('pt-BR');
  let html = `<div id="print-area">
    <h1>Relatório de Inscrições - SIGE <span style="font-weight:400;font-size:0.85rem;color:#64748b;">(${now})</span></h1>
    <p style="font-size:0.78rem;color:#64748b;margin-bottom:16px;">Total: ${data.length} inscrições</p>
    <table class="print-tabela">
      <thead><tr><th>ID</th><th>Aluno</th><th>Documento</th><th>Curso</th><th>Data</th><th>Status</th></tr></thead>
      <tbody>`;
  data.slice(0, 100).forEach(i => {
    html += `<tr>
      <td>#${i.id}</td>
      <td>${i.id_usuario?.nome_completo || i.nome_completo_inscricao || '-'}</td>
      <td>${i.id_usuario?.cpf || i.cpf_inscricao || '-'}</td>
      <td>${i.id_curso?.nome_curso || '-'}</td>
      <td>${i.data_inscricao ? new Date(i.data_inscricao).toLocaleDateString('pt-BR') : '-'}</td>
      <td>${i.status_aprovacao || '-'}</td>
    </tr>`;
  });
  if (data.length > 100) html += `<tr><td colspan="6" style="text-align:center;color:#64748b;">... e mais ${data.length - 100} registros</td></tr>`;
  html += `</tbody></table></div>`;

  const printWin = window.open('', '_blank', 'width=900,height=700');
  if (printWin) {
    printWin.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"><title>Relatório SIGE - ${now}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; padding: 30px 40px; color: #0f172a; }
        h1 { font-size: 1.2rem; margin-bottom: 4px; }
        .print-tabela { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .print-tabela th, .print-tabela td { border: 1px solid #e2e8f0; padding: 5px 8px; font-size: 0.7rem; text-align: left; }
        .print-tabela th { background: #f1f5f9; font-weight: 600; }
        @media print { body { padding: 10px; } }
      </style>
    </head><body>${html}</body></html>`);
    printWin.document.close();
    setTimeout(() => { printWin.focus(); printWin.print(); }, 500);
    notyf.success('Janela de impressão aberta.');
  } else {
    notyf.error('Bloqueador de pop-up impediu abrir a impressão.');
  }
}

// ======================================
// EVENT DELEGATION
// ======================================
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-inscricao-view]');
  if (btn) { e.preventDefault(); showInscricaoDetail(btn.dataset.inscricaoView); }

  const btnAluno = e.target.closest('[data-aluno-view]');
  if (btnAluno) { e.preventDefault(); showAlunoDetail(btnAluno.dataset.alunoView); }

  // Edit buttons - populate forms
  // --- Edit com modal ---
  const editCurso = e.target.closest('[data-curso-edit]');
  if (editCurso) {
    const id = editCurso.dataset.cursoEdit;
    const item = state.cursos.find(c => String(c.id) === id);
    if (item) {
      const uOpts = state.unidades.map(u => `<option value="${u.id}" ${(item.id_unidade?.id||item.id_unidade)==u.id?'selected':''}>${u.nome}</option>`).join('');
      openEditModal('<i class="fas fa-pen"></i> Editar Curso', `
        <div class="field"><label>Nome do Curso</label><input type="text" id="ec-nome" value="${item.nome_curso||''}" required /></div>
        <div class="field"><label>Unidade</label><select id="ec-unidade"><option value="">Selecione</option>${uOpts}</select></div>
        <div class="two-col"><div class="field"><label>Tipo</label><select id="ec-tipo"><option value="Técnico" ${item.tipo==='Técnico'?'selected':''}>Técnico</option><option value="Aprendizagem" ${item.tipo==='Aprendizagem'?'selected':''}>Aprendizagem</option><option value="Graduação" ${item.tipo==='Graduação'?'selected':''}>Graduação</option></select></div>
        <div class="field"><label>Turno</label><select id="ec-turno"><option value="Matutino" ${item.turno==='Matutino'?'selected':''}>Matutino</option><option value="Vespertino" ${item.turno==='Vespertino'?'selected':''}>Vespertino</option><option value="Noturno" ${item.turno==='Noturno'?'selected':''}>Noturno</option></select></div></div>
        <div class="two-col"><div class="field"><label>Data Início</label><input type="date" id="ec-data" value="${item.data_inicio||''}" /></div>
        <div class="field"><label>Duração (meses)</label><input type="number" id="ec-duracao" value="${item.duracao_meses||1}" min="1" /></div></div>
        <div class="field"><label>Status</label><select id="ec-status"><option value="ATIVO" ${item.status==='ATIVO'?'selected':''}>Ativo</option><option value="INATIVO" ${item.status==='INATIVO'?'selected':''}>Inativo</option></select></div>`, id, async (id) => {
        await request(`/cursos/${id}`, {method:'PUT',body:JSON.stringify({
          nome_curso: document.getElementById('ec-nome').value,
          id_unidade: document.getElementById('ec-unidade').value || null,
          tipo: document.getElementById('ec-tipo').value,
          turno: document.getElementById('ec-turno').value,
          data_inicio: document.getElementById('ec-data').value || null,
          duracao_meses: parseInt(document.getElementById('ec-duracao').value),
          status: document.getElementById('ec-status').value
        })});
        addAuditLog('CURSO',`Editou curso: ${document.getElementById('ec-nome').value}`,'');
        notyf.success('Curso atualizado!');
        await loadCursos();
    });}
  }

  const editUnidade = e.target.closest('[data-unidade-edit]');
  if (editUnidade) {
    const id = editUnidade.dataset.unidadeEdit;
    const item = state.unidades.find(u => String(u.id) === id);
    if (item) {
      openEditModal('<i class="fas fa-pen"></i> Editar Unidade', `
        <div class="field"><label>Nome da Unidade</label><input type="text" id="eu-nome" value="${item.nome||''}" required /></div>
        <div class="field"><label>CNPJ</label><input type="text" id="eu-cnpj" value="${item.cnpj||''}" /></div>
        <div class="two-col"><div class="field"><label>Cidade</label><input type="text" id="eu-cidade" value="${item.cidade||''}" /></div>
        <div class="field"><label>Estado</label><select id="eu-estado">${['SP','RJ','MG','ES','PR','SC','RS','BA','PE','CE','GO','DF','AM','PA'].map(s => `<option value="${s}" ${item.estado===s?'selected':''}>${s}</option>`).join('')}</select></div></div>`, id, async (id) => {
        await request(`/unidades/${id}`, {method:'PUT',body:JSON.stringify({
          nome: document.getElementById('eu-nome').value,
          cnpj: document.getElementById('eu-cnpj').value,
          cidade: document.getElementById('eu-cidade').value,
          estado: document.getElementById('eu-estado').value
        })});
        notyf.success('Unidade atualizada!');
        await loadUnidades();
    });}
  }

  const editUsuario = e.target.closest('[data-usuario-edit]');
  if (editUsuario) {
    const id = editUsuario.dataset.usuarioEdit;
    const item = state.usuarios.find(u => String(u.id) === id);
    if (item) {
      const cargoOpts = (state.cargos || []).map(c => `<option value="${c.id}" ${item.id_cargo===c.id?'selected':''}>${c.nome}</option>`).join('');
      openEditModal('<i class="fas fa-pen"></i> Editar Usuário', `
        <div class="field"><label>Nome Completo</label><input type="text" id="euu-nome" value="${item.nomeCompleto||item.nome_completo||''}" required /></div>
        <div class="field"><label>E-mail</label><input type="email" id="euu-email" value="${item.email||''}" required /></div>
        <div class="two-col"><div class="field"><label>CPF</label><input type="text" id="euu-cpf" value="${item.cpf||''}" /></div>
        <div class="field"><label>Telefone</label><input type="text" id="euu-tel" value="${item.telefone||''}" /></div></div>
        <div class="field"><label>Data Nascimento</label><input type="date" id="euu-data" value="${item.data_nascimento||''}" /></div>
        <div class="field"><label>Cargo</label><select id="euu-cargo">${cargoOpts}</select></div>`, id, async (id) => {
        const euuCargoId = parseInt(document.getElementById('euu-cargo').value);
        const euuCargoNome = (state.cargos || []).find(c => c.id === euuCargoId)?.nome || '';
        const roleMap = { 'Admin Master': 'ROLE_ADMIN', 'Administrador': 'ROLE_ADMIN', 'Secretaria': 'ROLE_ADMIN', 'Professor': 'ROLE_TEACHER', 'Aluno': 'ROLE_STUDENT', 'Candidato': 'ROLE_USER' };
        await request(`/usuarios/${id}`, {method:'PUT',body:JSON.stringify({
          nomeCompleto: document.getElementById('euu-nome').value,
          email: document.getElementById('euu-email').value,
          cpf: document.getElementById('euu-cpf').value,
          telefone: document.getElementById('euu-tel').value,
          dataNascimento: document.getElementById('euu-data').value || null,
          role: roleMap[euuCargoNome] || 'ROLE_USER',
          id_cargo: euuCargoId
        })});
        notyf.success('Usuário atualizado!');
        await loadUsuarios();
    });}
  }

  const editEdital = e.target.closest('[data-edital-edit]');
  if (editEdital) {
    const id = editEdital.dataset.editalEdit;
    const item = state.editais.find(e => String(e.id) === id);
    if (item) {
      openEditModal('<i class="fas fa-pen"></i> Editar Edital', `
        <div class="field"><label>Título</label><input type="text" id="ee-titulo" value="${item.titulo||''}" required /></div>
        <div class="field"><label>URL do PDF</label><input type="url" id="ee-url" value="${item.url||''}" /></div>
        <div class="field"><label>Ativo</label><select id="ee-ativo"><option value="true" ${item.ativo?'selected':''}>Sim</option><option value="false" ${!item.ativo?'selected':''}>Não</option></select></div>`, id, async (id) => {
        await request(`/editais/${id}`, {method:'PUT',body:JSON.stringify({
          titulo: document.getElementById('ee-titulo').value,
          url: document.getElementById('ee-url').value,
          ativo: document.getElementById('ee-ativo').value === 'true'
        })});
        notyf.success('Edital atualizado!');
        await loadEditais();
    });}
  }

  // Delete com confirmacao
  const delCurso = e.target.closest('[data-curso-del]');
  if (delCurso && await confirmAction('Excluir este curso permanentemente?')) {
    try { await request(`/cursos/${delCurso.dataset.cursoDel}`, { method: 'DELETE' }); notyf.success('Curso excluido.'); await loadCursos(); } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
  }
  const delUnidade = e.target.closest('[data-unidade-del]');
  if (delUnidade && await confirmAction('Excluir esta unidade?')) {
    try { await request(`/unidades/${delUnidade.dataset.unidadeDel}`, { method: 'DELETE' }); notyf.success('Unidade excluida.'); await loadUnidades(); } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
  }
  const delUsuario = e.target.closest('[data-usuario-del]');
  if (delUsuario && await confirmAction('Excluir este usuario?')) {
    try { await request(`/usuarios/${delUsuario.dataset.usuarioDel}`, { method: 'DELETE' }); notyf.success('Usuario excluido.'); await loadUsuarios(); } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
  }
  const delEdital = e.target.closest('[data-edital-del]');
  if (delEdital && await confirmAction('Excluir este edital?')) {
    try { await request(`/editais/${delEdital.dataset.editalDel}`, { method: 'DELETE' }); notyf.success('Edital excluido.'); await loadEditais(); } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
  }
});

// ======================================
// FILTER LISTENERS — explicit bindings
// ======================================
function bindFilter(inputId, loadFn, filterMap) {
  const el = document.getElementById(inputId);
  if (!el) return;
  const evt = el.tagName === 'SELECT' ? 'change' : 'input';
  el.addEventListener(evt, () => {
    const filtros = {};
    Object.keys(filterMap).forEach(key => {
      const e = document.getElementById(filterMap[key]);
      if (e) filtros[key] = e.value;
    });
    loadFn(filtros);
  });
}

function initFilters() {
  bindFilter('filtro-cursos-texto', loadCursos, { texto: 'filtro-cursos-texto', status: 'filtro-cursos-status', unidade: 'filtro-cursos-unidade' });
  bindFilter('filtro-cursos-status', loadCursos, { texto: 'filtro-cursos-texto', status: 'filtro-cursos-status', unidade: 'filtro-cursos-unidade' });
  bindFilter('filtro-cursos-unidade', loadCursos, { texto: 'filtro-cursos-texto', status: 'filtro-cursos-status', unidade: 'filtro-cursos-unidade' });
  bindFilter('filtro-unidades-texto', loadUnidades, { texto: 'filtro-unidades-texto', estado: 'filtro-unidades-estado' });
  bindFilter('filtro-unidades-estado', loadUnidades, { texto: 'filtro-unidades-texto', estado: 'filtro-unidades-estado' });
  bindFilter('filtro-usuarios-texto', loadUsuarios, { texto: 'filtro-usuarios-texto', cargo: 'filtro-usuarios-cargo' });
  bindFilter('filtro-usuarios-cargo', loadUsuarios, { texto: 'filtro-usuarios-texto', cargo: 'filtro-usuarios-cargo' });
  bindFilter('filtro-editais-texto', loadEditais, { texto: 'filtro-editais-texto', status: 'filtro-editais-status' });
  bindFilter('filtro-editais-status', loadEditais, { texto: 'filtro-editais-texto', status: 'filtro-editais-status' });
  bindFilter('filtro-alunos-texto', loadAlunos, { texto: 'filtro-alunos-texto', curso: 'filtro-alunos-curso', statusMat: 'filtro-alunos-status-matricula' });
  bindFilter('filtro-alunos-curso', loadAlunos, { texto: 'filtro-alunos-texto', curso: 'filtro-alunos-curso', statusMat: 'filtro-alunos-status-matricula' });
  bindFilter('filtro-alunos-status-matricula', loadAlunos, { texto: 'filtro-alunos-texto', curso: 'filtro-alunos-curso', statusMat: 'filtro-alunos-status-matricula' });
}

// ======================================
// ADD EMPTY/SKELETON NODES (for tables that don't have them)
// ======================================
['cursos', 'unidades', 'usuarios', 'editais', 'alunos'].forEach(id => {
  const wrapper = document.querySelector(`#modulo-${id === 'cursos' ? 'cursos' : id === 'unidades' ? 'unidades' : id === 'usuarios' ? 'usuarios' : id === 'editais' ? 'editais' : 'alunos'} .table-wrapper`);
  if (!wrapper) return;

  if (!document.getElementById(`${id}-empty`)) {
    const empty = document.createElement('div');
    empty.id = `${id}-empty`;
    empty.className = 'empty-state hidden';
    empty.innerHTML = `<div class="empty-icon"><i class="fas fa-file-alt"></i></div><h3>Nenhum registro encontrado</h3><p>Tente ajustar os filtros.</p>`;
    wrapper.parentNode.insertBefore(empty, wrapper.nextSibling);
  }
  if (!document.getElementById(`${id}-skeleton`)) {
    const skel = document.createElement('div');
    skel.id = `${id}-skeleton`;
    skel.className = 'hidden';
    skel.innerHTML = Array(4).fill(0).map(() =>
      `<div class="skeleton-row">${Array(4).fill(0).map(() => '<div class="skeleton" style="flex:1"></div>').join('')}</div>`
    ).join('');
    wrapper.parentNode.insertBefore(skel, wrapper);
  }
});

// ======================================
// SIDEBAR: User Info + Mobile Toggle
// ======================================
function populateSidebarUser() {
  const auth = (typeof getAuth === 'function') ? getAuth() : null;
  if (!auth?.usuario) return;

  const u = auth.usuario;
  const initials = (u.nomeCompleto || '?').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  const roleText = roleLabel(u.role);

  const avatar = document.getElementById('sec-user-avatar');
  const name = document.getElementById('sec-user-name');
  const email = document.getElementById('sec-user-email');
  const role = document.getElementById('sec-user-role');
  if (avatar) avatar.textContent = initials;
  if (name) name.textContent = u.nomeCompleto || 'Usuário';
  if (email) email.textContent = u.email || '';
  if (role) role.textContent = roleText;
}

// Mobile sidebar toggle
document.getElementById('sec-sidebar-toggle')?.addEventListener('click', () => {
  document.getElementById('sec-sidebar')?.classList.toggle('open');
});

// Close sidebar on nav item click (mobile)
document.querySelectorAll('.sec-sidebar-item').forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      document.getElementById('sec-sidebar')?.classList.remove('open');
    }
  });
});

// ======================================
// CONFIGURACOES: Dark Mode + Font Size
// ======================================
function loadSettings() {
  const theme = localStorage.getItem('sige-theme') || 'light';
  const fontSize = localStorage.getItem('sige-font-size') || 'md';
  return { theme, fontSize };
}

function applySettings() {
  const { theme, fontSize } = loadSettings();
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-font-size', fontSize);

  // Sync switch
  const toggle = document.getElementById('toggle-dark-mode');
  if (toggle) toggle.checked = theme === 'dark';

  // Sync font buttons
  document.querySelectorAll('.config-font-selector .btn').forEach(b => {
    b.classList.toggle('active', b.dataset.font === fontSize);
    if (b.dataset.font === fontSize) b.classList.add('btn-primary');
    else b.classList.remove('btn-primary');
  });
}

function initSettings() {
  applySettings();

  const toggle = document.getElementById('toggle-dark-mode');
  if (toggle) {
    toggle.addEventListener('change', () => {
      const theme = toggle.checked ? 'dark' : 'light';
      localStorage.setItem('sige-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      // Redraw charts with new theme colors
      setTimeout(() => { loadDashboard(); loadRelatorio(getRelFiltros()); }, 100);
    });
  }

  document.querySelectorAll('.config-font-selector .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.font;
      localStorage.setItem('sige-font-size', size);
      document.documentElement.setAttribute('data-font-size', size);
      document.querySelectorAll('.config-font-selector .btn').forEach(b => {
        b.classList.remove('active', 'btn-primary');
      });
      btn.classList.add('active', 'btn-primary');
    });
  });
}

// ======================================
// AUDIT LOG UTILITY
// ======================================
function addAuditLog(tipo, acao, detalhes) {
  try {
    // Try to POST to API
    if (typeof request === 'function') {
      request('/auditoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, acao, detalhes: detalhes || '' })
      }).catch(() => {}); // silent fallback
    }
    // Also keep localStorage fallback
    const auth = (typeof getAuth === 'function') ? getAuth() : null;
    const usuario = auth?.usuario?.nomeCompleto || auth?.usuario?.email || 'Sistema';
    const log = JSON.parse(localStorage.getItem('sige-audit') || '[]');
    log.unshift({
      timestamp: new Date().toISOString(),
      usuario,
      tipo,
      acao,
      detalhes: detalhes || '',
    });
    if (log.length > 500) log.length = 500;
    localStorage.setItem('sige-audit', JSON.stringify(log));
  } catch {}
}

// ======================================
// TURMAS CRUD
// ======================================
async function loadTurmas(filters = {}) {
  try {
    const data = await request('/turmas');
    state.turmas = data;
    let f = [...data];
    if (filters.texto) { const t = filters.texto.toLowerCase(); f = f.filter(tur => (tur.nome || '').toLowerCase().includes(t) || (tur.id_curso?.nome_curso || '').toLowerCase().includes(t)); }
    if (filters.status && filters.status !== 'TODOS') f = f.filter(tur => tur.status === filters.status);

    // Preencher select curso no form
    const sel = document.getElementById('turma-curso');
    if (sel && state.cursos.length) {
      sel.innerHTML = '<option value="">Selecione</option>' + state.cursos.filter(c => c.status === 'ATIVO').map(c => `<option value="${c.id}">${c.nome_curso}</option>`).join('');
    }

    const tbody = document.getElementById('lista-turmas');
    const pagContainer = document.getElementById('paginacao-turmas');
    if (f.length === 0) { if (tbody) tbody.innerHTML = ''; if (pagContainer) pagContainer.innerHTML = ''; return; }
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: null,
      dados: f,
      renderizarItem: t => `<tr>
        <td><strong>${t.nome || '-'}</strong></td>
        <td>${t.id_curso?.nome_curso || '-'}</td>
        <td>${t.turno || '-'}</td>
        <td>${t.vagas ?? '-'}</td>
        <td>${t.ano || '-'}</td>
        <td>${badge(t.status)}</td>
        <td>
          ${hasPerm('turma.editar') ? `<button class="btn btn-soft btn-sm" data-turma-edit="${t.id}">Editar</button>` : ''}
          ${hasPerm('turma.excluir') ? `<button class="btn btn-danger btn-sm" data-turma-del="${t.id}">Excluir</button>` : ''}
        </td>
      </tr>`,
    });
  } catch { if (document.getElementById('lista-turmas')) document.getElementById('lista-turmas').innerHTML = '<tr><td colspan="7" style="text-align:center;color:#999">Erro ao carregar turmas</td></tr>'; }
}

document.getElementById('form-turma')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('turma-id').value;
  const payload = {
    nome: document.getElementById('turma-nome').value,
    id_curso: document.getElementById('turma-curso').value || null,
    turno: document.getElementById('turma-turno').value,
    vagas: parseInt(document.getElementById('turma-vagas').value) || null,
    ano: parseInt(document.getElementById('turma-ano').value) || null,
    status: document.getElementById('turma-status').value,
  };
  try {
    if (id) {
      await request(`/turmas/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      addAuditLog('TURMA', `Editou turma: ${payload.nome}`, `ID: ${id}`);
    } else {
      await request('/turmas', { method: 'POST', body: JSON.stringify(payload) });
      addAuditLog('TURMA', `Criou turma: ${payload.nome}`, '');
    }
    notyf.success('Turma salva!');
    document.getElementById('form-turma').reset();
    document.getElementById('turma-id').value = '';
    document.getElementById('cancelar-turma').style.display = 'none';
    await loadTurmas();
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
});

document.getElementById('cancelar-turma')?.addEventListener('click', () => {
  document.getElementById('form-turma').reset();
  document.getElementById('turma-id').value = '';
  document.getElementById('cancelar-turma').style.display = 'none';
});

// Filter listeners for turmas
document.querySelectorAll('#filtro-turma-texto, #filtro-turma-status').forEach(el => {
  if (!el) return;
  el.addEventListener('input', () => loadTurmas({ texto: document.getElementById('filtro-turma-texto')?.value || '', status: document.getElementById('filtro-turma-status')?.value || 'TODOS' }));
  el.addEventListener('change', () => loadTurmas({ texto: document.getElementById('filtro-turma-texto')?.value || '', status: document.getElementById('filtro-turma-status')?.value || 'TODOS' }));
});

// Event delegation for turmas (edit, delete)
document.addEventListener('click', async (e) => {
  const editTur = e.target.closest('[data-turma-edit]');
  if (editTur) {
    const id = editTur.dataset.turmaEdit;
    try {
      const data = await request(`/turmas/${id}`);
      const cursoOpts = state.cursos.filter(c=>c.status==='ATIVO').map(c => `<option value="${c.id}" ${(data.id_curso?.id||data.id_curso)==c.id?'selected':''}>${c.nome_curso}</option>`).join('');
      openEditModal('<i class="fas fa-pen"></i> Editar Turma', `
        <div class="field"><label>Nome da Turma</label><input type="text" id="et-nome" value="${data.nome||''}" required /></div>
        <div class="field"><label>Curso</label><select id="et-curso"><option value="">Selecione</option>${cursoOpts}</select></div>
        <div class="two-col"><div class="field"><label>Turno</label><select id="et-turno"><option value="Matutino" ${data.turno==='Matutino'?'selected':''}>Matutino</option><option value="Vespertino" ${data.turno==='Vespertino'?'selected':''}>Vespertino</option><option value="Noturno" ${data.turno==='Noturno'?'selected':''}>Noturno</option></select></div>
        <div class="field"><label>Vagas</label><input type="number" id="et-vagas" value="${data.vagas||40}" min="1" /></div></div>
        <div class="two-col"><div class="field"><label>Ano</label><input type="number" id="et-ano" value="${data.ano||2026}" /></div>
        <div class="field"><label>Status</label><select id="et-status"><option value="ATIVO" ${data.status==='ATIVO'||!data.status?'selected':''}>Ativo</option><option value="INATIVO" ${data.status==='INATIVO'?'selected':''}>Inativo</option></select></div></div>`, id, async (id) => {
        await request(`/turmas/${id}`, {method:'PUT',body:JSON.stringify({
          nome: document.getElementById('et-nome').value,
          id_curso: document.getElementById('et-curso').value || null,
          turno: document.getElementById('et-turno').value,
          vagas: parseInt(document.getElementById('et-vagas').value),
          ano: parseInt(document.getElementById('et-ano').value),
          status: document.getElementById('et-status').value
        })});
        addAuditLog('TURMA',`Editou turma: ${document.getElementById('et-nome').value}`, `ID: ${id}`);
        notyf.success('Turma atualizada!');
        await loadTurmas();
      });
    } catch { notyf.error('Erro ao carregar turma.'); }
  }

  const delTur = e.target.closest('[data-turma-del]');
  if (delTur && await confirmAction('Excluir esta turma?')) {
    try {
      const nome = delTur.closest('tr')?.querySelector('strong')?.textContent || '';
      await request(`/turmas/${delTur.dataset.turmaDel}`, { method: 'DELETE' });
      addAuditLog('TURMA', `Excluiu turma: ${nome}`, `ID: ${delTur.dataset.turmaDel}`);
      notyf.success('Turma excluída.');
      await loadTurmas();
    } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
  }
});

// ======================================
// ==============================================
// HIERARQUIA DE PERMISSOES (Categoria > Modulo)
// ==============================================
const PERM_CATEGORIAS = {
  'Administrativo': {
    'Alunos':      ['aluno.visualizar','aluno.criar','aluno.editar','aluno.excluir','aluno.resetar-senha','aluno.alterar-turma'],
    'Turmas':      ['turma.visualizar','turma.criar','turma.editar','turma.excluir'],
    'Cursos':      ['curso.visualizar','curso.criar','curso.editar','curso.excluir'],
    'Unidades':    ['unidade.visualizar','unidade.criar','unidade.editar','unidade.excluir'],
    'Disciplinas': ['disciplina.visualizar','disciplina.criar','disciplina.editar','disciplina.excluir','disciplina.concluir'],
    'Usuários':    ['usuario.visualizar','usuario.criar','usuario.editar','usuario.excluir'],
    'Cargos':      ['cargo.gerenciar'],
    'Relatórios':  ['relatorio.visualizar','relatorio.exportar'],
    'Auditoria':   ['auditoria.visualizar']
  },
  'Acadêmico': {
    'Notas':        ['nota.visualizar','nota.lancar','nota.editar','aluno.visualizar-notas'],
    'Frequência':   ['frequencia.visualizar','frequencia.lancar','frequencia.editar','aluno.visualizar-frequencia'],
    'Horários':     ['aluno.visualizar-horarios'],
    'Plano de Ensino': ['plano_ensino.visualizar','plano_ensino.criar','plano_ensino.editar','plano_ensino.excluir']
  },
  'Secretaria': {
    'Matrícula':    ['matricula.visualizar'],
    'Inscrições':   ['inscricao.visualizar','inscricao.aprovar','inscricao.editar','inscricao.excluir'],
    'Documentos':   ['documento.aprovar','documento.reprovar','documento.excluir'],
    'Editais':      ['edital.visualizar','edital.criar','edital.editar','edital.excluir'],
    'Reclamações':  ['reclamacao.visualizar','reclamacao.responder']
  },
  'Acesso': {
    'Portais': ['portal.secretaria','portal.professor','portal.escolar','portal.inscricao','portal.gerenciar']
  }
};

// CACHE para evitar multiplas requisicoes
let _permCache = null;

// ==============================================
// CARGOS / PERMISSOES CRUD
// ==============================================

function populateCargoDropdowns() {
  const opts = (state.cargos || []).map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
  const sel = document.getElementById('admin-user-cargo');
  if (sel) sel.innerHTML = opts;
  const filtro = document.getElementById('filtro-usuarios-cargo');
  if (filtro) {
    const cur = filtro.value;
    filtro.innerHTML = '<option value="TODOS">Todos</option>' + opts;
    if (cur !== 'TODOS') filtro.value = cur;
  }
}

async function loadCargos(filters = {}) {
  try {
    const data = await request('/cargos');
    state.cargos = data;
    populateCargoDropdowns();
    let f = [...data];
    if (filters.texto) { const t = filters.texto.toLowerCase(); f = f.filter(c => (c.nome || '').toLowerCase().includes(t) || (c.descricao || '').toLowerCase().includes(t)); }

    const tbody = document.getElementById('lista-cargos');
    const pagContainer = document.getElementById('paginacao-cargos');
    if (f.length === 0) { if (tbody) tbody.innerHTML = ''; if (pagContainer) pagContainer.innerHTML = ''; return; }
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: null,
      dados: f,
      renderizarItem: c => `<tr>
        <td><strong>${c.nome}</strong>${c.is_admin_master ? ' <span class="badge badge-warning">Admin Master</span>' : ''}</td>
        <td>${c.descricao || '-'}</td>
        <td>${c.is_admin_master || !hasPerm('cargo.gerenciar') ? '-' : `<button class="btn btn-soft btn-sm" data-cargo-edit="${c.id}">Editar</button> <button class="btn btn-danger btn-sm" data-cargo-del="${c.id}">Excluir</button>`}</td>
      </tr>`,
    });
  } catch { if (document.getElementById('lista-cargos')) document.getElementById('lista-cargos').innerHTML = '<tr><td colspan="3" style="text-align:center;color:#999">Erro ao carregar cargos</td></tr>'; }
}

async function loadPermissoesCheckboxes(selectedIds = []) {
  try {
    if (!_permCache) _permCache = await request('/cargos/permissoes/all');
    const container = document.getElementById('cargo-permissoes-checkboxes');
    if (!container) return;
    renderPermissoesCategorias(_permCache, selectedIds, 'cargo-permissoes-checkboxes');
  } catch { if (document.getElementById('cargo-permissoes-checkboxes')) document.getElementById('cargo-permissoes-checkboxes').innerHTML = '<span style="color:#999">Erro ao carregar permissões</span>'; }
}

// --- Helpers de contagem ---
function contarSelecionados(container) {
  const checks = container.querySelectorAll('.perm-check');
  const checked = container.querySelectorAll('.perm-check:checked');
  return { total: checks.length, selecionadas: checked.length };
}

function atualizarBadgeContagem(container) {
  const badge = container.closest('.perm-wrapper')?.querySelector('.perm-count-badge')
    || document.getElementById('perm-selected-count');
  if (!badge) return;
  const { total, selecionadas } = contarSelecionados(container);
  badge.textContent = `${selecionadas} de ${total} selecionadas`;
}

function atualizarContagensModulos(container) {
  container.querySelectorAll('.perm-module').forEach(mod => {
    const checks = mod.querySelectorAll('.perm-check');
    const checked = mod.querySelectorAll('.perm-check:checked');
    const countEl = mod.querySelector('.mod-count');
    if (countEl) countEl.textContent = `${checked.length}/${checks.length}`;
  });
  container.querySelectorAll('.perm-categoria').forEach(cat => {
    const checks = cat.querySelectorAll('.perm-check');
    const checked = cat.querySelectorAll('.perm-check:checked');
    const countEl = cat.querySelector('.cat-count');
    if (countEl) countEl.textContent = `${checked.length}/${checks.length}`;
  });
}

// --- Resumo legivel do cargo ---
function atualizarResumoPermissoes(containerId) {
  const resumoEl = document.getElementById('cargo-permissoes-resumo');
  if (!resumoEl) return;
  const container = document.getElementById(containerId);
  if (!container) { resumoEl.innerHTML = ''; return; }
  const checked = container.querySelectorAll('.perm-check:checked');
  if (!checked.length) { resumoEl.innerHTML = '<div class="perm-resumo-empty">Nenhuma permissão selecionada</div>'; return; }

  const checkedSet = new Set();
  checked.forEach(cb => checkedSet.add(parseInt(cb.value)));

  const permByCodigo = {};
  if (_permCache) _permCache.forEach(p => { permByCodigo[p.codigo] = p; });

  // Agrupar por categoria > modulo usando o mapa
  const grouped = {};
  Object.keys(PERM_CATEGORIAS).forEach(cat => {
    Object.keys(PERM_CATEGORIAS[cat]).forEach(mod => {
      const codigos = PERM_CATEGORIAS[cat][mod];
      const found = codigos.filter(cod => {
        const p = permByCodigo[cod];
        return p && checkedSet.has(p.id);
      });
      if (found.length) {
        if (!grouped[cat]) grouped[cat] = {};
        grouped[cat][mod] = found.map(cod => {
          const p = permByCodigo[cod];
          return p ? p.nome.replace(/^(Visualizar|Criar|Editar|Excluir|Lançar|Gerenciar|Aprovar|Reprovar|Responder|Exportar|Resetar|Alterar|Concluir) /, '') : cod;
        });
      }
    });
  });

  let html = '<div class="perm-resumo-header"><span class="perm-resumo-icon"></span>Resumo do Cargo</div><div class="perm-resumo-body">';
  Object.keys(grouped).forEach(cat => {
    html += `<div class="perm-resumo-cat"><strong>${cat}</strong>`;
    Object.keys(grouped[cat]).forEach(mod => {
      const acoes = grouped[cat][mod];
      html += `<div class="perm-resumo-item"><span class="perm-resumo-mod">${mod}</span>: ${acoes.join(', ')}</div>`;
    });
    html += '</div>';
  });
  html += '</div>';
  resumoEl.innerHTML = html;
}

// --- Filtro de busca (ignora collapse, usa display) ---
function aplicarFiltroPerm(container, termo) {
  const t = termo.toLowerCase().trim();
  const tree = container.closest('.perm-wrapper')?.querySelector('.perm-tree') || container.querySelector('.perm-tree');
  if (!tree) return;
  if (t) tree.classList.add('filter-active');
  else tree.classList.remove('filter-active');

  container.querySelectorAll('.perm-categoria').forEach(cat => {
    let catMatch = !t;
    cat.querySelectorAll('.perm-module').forEach(mod => {
      const modName = mod.querySelector('.mod-name')?.textContent?.toLowerCase() || '';
      const permRows = mod.querySelectorAll('.perm-row:not(.perm-select-all)');
      let modMatch = !t;
      permRows.forEach(row => {
        const label = row.querySelector('.perm-label')?.textContent?.toLowerCase() || '';
        const cb = row.querySelector('.perm-check');
        const codigo = cb?.dataset?.codigo?.toLowerCase() || '';
        const match = !t || label.includes(t) || codigo.includes(t) || modName.includes(t);
        row.style.display = match ? '' : 'none';
        if (match) modMatch = true;
      });
      const selectAllRow = mod.querySelector('.perm-select-all');
      if (selectAllRow) selectAllRow.style.display = (modMatch || !t) ? '' : 'none';
      mod.style.display = (modMatch || !t) ? '' : 'none';
      if (modMatch) catMatch = true;
    });
    cat.style.display = catMatch ? '' : 'none';
  });
}

// --- Renderiza a arvore hierarquica (Categoria > Modulo > Permissao) ---
function renderPermissoesCategorias(permissoes, selectedIds, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Cache global
  _permCache = permissoes;

  // Build lookup por codigo
  const permByCodigo = {};
  permissoes.forEach(p => { permByCodigo[p.codigo] = p; });

  container.innerHTML = '';

  const selectedSet = new Set(selectedIds);

  const tree = document.createElement('div');
  tree.className = 'perm-tree';

  Object.keys(PERM_CATEGORIAS).forEach(catNome => {
    const subModulos = PERM_CATEGORIAS[catNome];

    // --- Categoria ---
    const catEl = document.createElement('div');
    catEl.className = 'perm-categoria';

    // Icons SVG para cada categoria (consistentes em qualquer OS/APK)
    const CAT_SVG = {
      'Administrativo': '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="10" cy="10" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M10 1v3m0 12v3M4.1 4.1l2.1 2.1m7.7 7.7l2.1 2.1M1 10h3m12 0h3M4.1 15.9l2.1-2.1m7.7-7.7l2.1-2.1" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>',
      'Acad\u00eamico': '<svg viewBox="0 0 20 20" width="18" height="18"><rect x="3" y="4" width="14" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M10 4v12" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M6 8h8M6 11h5" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>',
      'Secretaria': '<svg viewBox="0 0 20 20" width="18" height="18"><path d="M6 2h8v3H6z" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="3" y="5" width="14" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M6 9h8M6 12h8M6 15h4" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>',
      'Acesso': '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="8" cy="8" r="4.5" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M11 11l6 6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M15 13l2 2" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>'
    };
    const CAT_COLORS = { 'Administrativo': '#0ea5e9', 'Acad\u00eamico': '#10b981', 'Secretaria': '#f59e0b', 'Acesso': '#8b5cf6' };

    // Header da categoria
    const catHeader = document.createElement('div');
    catHeader.className = 'perm-categoria-header';
    const catArrow = document.createElement('span');
    catArrow.className = 'arrow';
    catArrow.textContent = '>';
    const catIcon = document.createElement('span');
    catIcon.className = 'cat-icon';
    catIcon.innerHTML = CAT_SVG[catNome] || '';
    catIcon.style.color = CAT_COLORS[catNome] || '#0ea5e9';
    const catName = document.createElement('span');
    catName.className = 'cat-name';
    catName.textContent = catNome;

    let catTotal = 0, catSelected = 0;
    Object.keys(subModulos).forEach(modNome => {
      subModulos[modNome].forEach(cod => {
        if (permByCodigo[cod]) {
          catTotal++;
          if (selectedSet.has(permByCodigo[cod].id)) catSelected++;
        }
      });
    });

    const catCount = document.createElement('span');
    catCount.className = 'cat-count';
    catCount.textContent = `${catSelected}/${catTotal}`;

    // Select-all da categoria
    const catSelectAll = document.createElement('input');
    catSelectAll.type = 'checkbox';
    catSelectAll.className = 'cat-check-all';
    catSelectAll.checked = catSelected > 0 && catSelected === catTotal;
    catSelectAll.indeterminate = catSelected > 0 && catSelected < catTotal;

    catHeader.appendChild(catArrow);
    catHeader.appendChild(catIcon);
    catHeader.appendChild(catName);
    catHeader.appendChild(catCount);
    catHeader.appendChild(catSelectAll);
    catEl.appendChild(catHeader);

    // Progress bar
    const catProgress = document.createElement('div');
    catProgress.className = 'cat-progress';
    const catProgressFill = document.createElement('div');
    catProgressFill.className = 'cat-progress-fill';
    catProgressFill.style.width = catTotal > 0 ? ((catSelected / catTotal) * 100) + '%' : '0%';
    const catColor = CAT_COLORS[catNome] || '#0ea5e9';
    catProgressFill.style.background = catColor;
    catProgress.appendChild(catProgressFill);
    catEl.appendChild(catProgress);

    // Body da categoria
    const catBody = document.createElement('div');
    catBody.className = 'perm-categoria-body collapsed';

    // --- Sub-modulos ---
    Object.keys(subModulos).forEach(modNome => {
      const codigos = subModulos[modNome];
      const modEl = document.createElement('div');
      modEl.className = 'perm-module';

      const modHeader = document.createElement('div');
      modHeader.className = 'perm-module-header';
    const modArrow = document.createElement('span');
    modArrow.className = 'arrow';
    modArrow.textContent = '>';
      const modName = document.createElement('span');
      modName.className = 'mod-name';
      modName.textContent = modNome;

      let modTotal = 0, modSelected = 0;
      const moduloPerms = [];
      codigos.forEach(cod => {
        const p = permByCodigo[cod];
        if (p) {
          modTotal++;
          moduloPerms.push(p);
          if (selectedSet.has(p.id)) modSelected++;
        }
      });

      if (modTotal === 0) return; // skip modulo vazio

      const modCount = document.createElement('span');
      modCount.className = 'mod-count';
      modCount.textContent = `${modSelected}/${modTotal}`;

      modHeader.appendChild(modArrow);
      modHeader.appendChild(modName);
      modHeader.appendChild(modCount);
      modEl.appendChild(modHeader);

      const modBody = document.createElement('div');
      modBody.className = 'perm-module-body collapsed';

      // --- Linha "Selecionar Todos" ---
      const selectAllRow = document.createElement('label');
      selectAllRow.className = 'perm-row perm-select-all';
      const selectAllIcon = document.createElement('span');
      selectAllIcon.className = 'perm-select-all-icon';
      selectAllIcon.textContent = '<i class="far fa-square"></i>';
      const selectAllLabel = document.createElement('span');
      selectAllLabel.className = 'perm-label';
      selectAllLabel.textContent = 'Selecionar Todos';
      const selectAllCb = document.createElement('input');
      selectAllCb.type = 'checkbox';
      selectAllCb.className = 'perm-check-all';
      selectAllCb.checked = modSelected > 0 && modSelected === modTotal;
      selectAllCb.indeterminate = modSelected > 0 && modSelected < modTotal;
      selectAllRow.appendChild(selectAllIcon);
      selectAllRow.appendChild(selectAllLabel);
      selectAllRow.appendChild(selectAllCb);
      modBody.appendChild(selectAllRow);

      // --- Permissoes do modulo ---
      moduloPerms.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
      moduloPerms.forEach(p => {
        const row = document.createElement('label');
        row.className = 'perm-row';
        const label = document.createElement('span');
        label.className = 'perm-label';
        label.textContent = p.nome;
        row.appendChild(label);
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = p.id;
        cb.checked = selectedSet.has(p.id);
        cb.dataset.codigo = p.codigo;
        cb.className = 'perm-check';
        row.appendChild(cb);
        modBody.appendChild(row);
      });

      modEl.appendChild(modBody);
      catBody.appendChild(modEl);

      // --- Eventos do modulo ---

      // Select-all: marca/desmarca todas as permissoes do modulo
      selectAllCb.addEventListener('change', (ev) => {
        ev.stopPropagation();
        const checks = modBody.querySelectorAll('.perm-check');
        checks.forEach(cb => { cb.checked = selectAllCb.checked; });
        atualizarContagensModulos(container);
        atualizarBadgeContagem(container);
        atualizarResumoPermissoes(containerId);
      });

      // Checkbox individual: atualiza estado do select-all
      modBody.addEventListener('change', (ev) => {
        if (ev.target.classList.contains('perm-check')) {
          const checks = modBody.querySelectorAll('.perm-check');
          const checked = modBody.querySelectorAll('.perm-check:checked');
          selectAllCb.checked = checked.length > 0 && checked.length === checks.length;
          selectAllCb.indeterminate = checked.length > 0 && checked.length < checks.length;
          atualizarContagensModulos(container);
          atualizarBadgeContagem(container);
          atualizarResumoPermissoes(containerId);
        }
      });

      // Collapse/expand do modulo
      const animarModBody = () => {
        modBody.style.maxHeight = modBody.classList.contains('collapsed') ? '0px' : modBody.scrollHeight + 'px';
      };
      requestAnimationFrame(() => animarModBody());
      modHeader.addEventListener('click', (ev) => {
        if (ev.target.closest('.perm-check-all') || ev.target.closest('.perm-check')) return;
        modBody.classList.toggle('collapsed');
        modArrow.classList.toggle('open');
        requestAnimationFrame(() => animarModBody());
      });
      modBody.addEventListener('change', () => {
        if (!modBody.classList.contains('collapsed')) {
          modBody.style.maxHeight = modBody.scrollHeight + 'px';
        }
      });
    });

    catEl.appendChild(catBody);
    tree.appendChild(catEl);

    // Sincroniza estado do checkbox da categoria
    function syncCatCheckAll() {
      const checks = catEl.querySelectorAll('.perm-check');
      const checked = catEl.querySelectorAll('.perm-check:checked');
      catSelectAll.checked = checked.length > 0 && checked.length === checks.length;
      catSelectAll.indeterminate = checked.length > 0 && checked.length < checks.length;
      catCount.textContent = `${checked.length}/${checks.length}`;
      catProgressFill.style.width = checks.length > 0 ? ((checked.length / checks.length) * 100) + '%' : '0%';
    }

    // Select-all da categoria
    catSelectAll.addEventListener('change', (ev) => {
      ev.stopPropagation();
      const checks = catEl.querySelectorAll('.perm-check');
      checks.forEach(cb => { cb.checked = catSelectAll.checked; });
      // Sincronizar todos os select-all dos sub-modulos
      catEl.querySelectorAll('.perm-check-all').forEach(sa => {
        sa.checked = catSelectAll.checked;
        sa.indeterminate = false;
      });
      syncCatCheckAll();
      atualizarBadgeContagem(container);
      atualizarResumoPermissoes(containerId);
    });

    // Sobrescrever change dos modulos para tambem sincronizar categoria
    catBody.querySelectorAll('.perm-module').forEach(mod => {
      const modChecks = mod.querySelectorAll('.perm-check');
      const modCheckAll = mod.querySelector('.perm-check-all');
      if (!modCheckAll) return;
      // Intercepta change do modulo para atualizar categoria
      mod.addEventListener('change', (ev) => {
        if (ev.target.classList.contains('perm-check') || ev.target.classList.contains('perm-check-all')) {
          requestAnimationFrame(() => { syncCatCheckAll(); });
        }
      });
    });

    // Collapse/expand da categoria
    const animarCatBody = () => {
      catBody.style.maxHeight = catBody.classList.contains('collapsed') ? '0px' : catBody.scrollHeight + 'px';
    };
    requestAnimationFrame(() => animarCatBody());
    catHeader.addEventListener('click', (ev) => {
      if (ev.target.closest('.cat-check-all')) return;
      catBody.classList.toggle('collapsed');
      catArrow.classList.toggle('open');
      requestAnimationFrame(() => animarCatBody());
    });
  });

  container.appendChild(tree);
  atualizarBadgeContagem(container);
  atualizarResumoPermissoes(containerId);
}

document.getElementById('cancelar-cargo')?.addEventListener('click', () => {
  document.getElementById('form-cargo').reset();
  document.getElementById('cargo-id').value = '';
  document.getElementById('cancelar-cargo').style.display = 'none';
  loadPermissoesCheckboxes();
});

document.getElementById('form-cargo')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('cargo-id').value;
  const nome = document.getElementById('cargo-nome').value;
  const descricao = document.getElementById('cargo-descricao').value;
    const checked = document.querySelectorAll('#cargo-permissoes-checkboxes .perm-check:checked');
  const permissaoIds = Array.from(checked).map(cb => parseInt(cb.value));
  const payload = { nome, descricao, permissaoIds };
  try {
    if (id) {
      await request(`/cargos/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      addAuditLog('CARGO', `Editou cargo: ${nome}`, `ID: ${id}`);
    } else {
      await request('/cargos', { method: 'POST', body: JSON.stringify(payload) });
      addAuditLog('CARGO', `Criou cargo: ${nome}`, '');
    }
    notyf.success('Cargo salvo!');
    document.getElementById('form-cargo').reset();
    document.getElementById('cargo-id').value = '';
    document.getElementById('cancelar-cargo').style.display = 'none';
    await loadCargos();
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
});

document.getElementById('filtro-cargo-texto')?.addEventListener('input', () => {
  loadCargos({ texto: document.getElementById('filtro-cargo-texto')?.value || '' });
});

// Filtro de busca de permissoes
document.getElementById('perm-filtro-texto')?.addEventListener('input', () => {
  const container = document.getElementById('cargo-permissoes-checkboxes');
  if (container) aplicarFiltroPerm(container, document.getElementById('perm-filtro-texto').value);
});

document.addEventListener('click', async (e) => {
  const editCar = e.target.closest('[data-cargo-edit]');
  if (editCar) {
    const id = editCar.dataset.cargoEdit;
    try {
      const data = await request(`/cargos/${id}`);
      openEditModal('<i class="fas fa-pen"></i> Editar Cargo', `
        <div class="field"><label>Nome do Cargo</label><input type="text" id="ecarg-nome" value="${data.nome||''}" required /></div>
        <div class="field"><label>Descrição</label><textarea id="ecarg-desc" rows="2">${data.descricao||''}</textarea></div>
        <div id="ecarg-permissoes"></div>`, id, async (id) => {
        const checked = document.querySelectorAll('#ecarg-permissoes .perm-check:checked');
        const permissaoIds = Array.from(checked).map(cb => parseInt(cb.value));
        await request(`/cargos/${id}`, {method:'PUT',body:JSON.stringify({
          nome: document.getElementById('ecarg-nome').value,
          descricao: document.getElementById('ecarg-desc').value,
          permissaoIds
        })});
        addAuditLog('CARGO',`Editou cargo: ${document.getElementById('ecarg-nome').value}`, `ID: ${id}`);
        notyf.success('Cargo atualizado!');
        await loadCargos();
      });
      // Render permissoes no modal
      renderPermissoesCategorias(data.todasPermissoes || [], data.permissaoIds || [], 'ecarg-permissoes');
    } catch { notyf.error('Erro ao carregar cargo.'); }
  }

  const delCar = e.target.closest('[data-cargo-del]');
  if (delCar && await confirmAction('Excluir este cargo?')) {
    try {
      const nome = delCar.closest('tr')?.querySelector('strong')?.textContent || '';
      await request(`/cargos/${delCar.dataset.cargoDel}`, { method: 'DELETE' });
      addAuditLog('CARGO', `Excluiu cargo: ${nome}`, `ID: ${delCar.dataset.cargoDel}`);
      notyf.success('Cargo excluído.');
      await loadCargos();
    } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
  }
});

// ======================================
// ENHANCED ALUNO DETAIL
// ======================================
const alunoDetailOriginal = showAlunoDetail;
async function showAlunoDetailEnhanced(id) {
  try {
    const aluno = await request(`/alunos/${id}`);
    const m = aluno.matriculas?.[0] || {};
    const html = `
      <div class="detail-section">
        <h3>Dados Pessoais</h3>
        <div class="detail-grid">
          <div class="detail-item"><span class="detail-label">Nome</span><span class="detail-value">${aluno.nome_completo || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">${aluno.email || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">CPF</span><span class="detail-value">${aluno.cpf || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">Telefone</span><span class="detail-value">${aluno.telefone || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">Data Nasc.</span><span class="detail-value">${aluno.data_nascimento || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">Role</span><span class="detail-value">${badge(aluno.role)}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <h3>Matrícula</h3>
        <div class="detail-grid">
          <div class="detail-item"><span class="detail-label">Curso</span><span class="detail-value">${m.id_curso?.nome_curso || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">Turma</span><span class="detail-value">${m.id_turma?.nome || '-'} <button class="btn btn-soft btn-sm" id="btn-alterar-turma" style="margin-left:8px;font-size:0.7rem;" data-aluno-id="${id}">Alterar</button></span></div>
          <div class="detail-item"><span class="detail-label">Nº Matrícula</span><span class="detail-value">${m.numero_matricula || '-'}</span></div>
          <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value">${badge(m.status)}</span></div>
          <div class="detail-item"><span class="detail-label">Data Matrícula</span><span class="detail-value">${m.data_matricula ? new Date(m.data_matricula).toLocaleDateString('pt-BR') : '-'}</span></div>
        </div>
      </div>
      ${(aluno.historico?.length ? `
      <div class="detail-section">
        <h3>Histórico Escolar (${aluno.historico.length})</h3>
        <div class="table-wrapper" style="border:1px solid var(--sec-border);border-radius:6px;">
          <table><thead><tr><th>Disciplina</th><th>Ano/Sem</th><th>Nota</th><th>Status</th></tr></thead>
          <tbody>${aluno.historico.slice(0, 20).map(h => `<tr>
            <td>${h.id_disciplina?.nome || '-'}</td>
            <td>${h.ano || '-'}/${h.semestre || '-'}</td>
            <td>${h.nota ?? '-'}</td>
            <td>${badge(h.status || (h.nota >= 6 ? 'APROVADO' : 'REPROVADO'))}</td>
          </tr>`).join('')}</tbody></table>
        </div>
      </div>` : '')}
    `;
    document.getElementById('aluno-detalhes-content').innerHTML = html;

    // Populate documents table
    if (aluno.documentos?.length) {
      document.getElementById('aluno-documentos-section').classList.remove('hidden');
      document.getElementById('aluno-documentos-tbody').innerHTML = aluno.documentos.map(d => `<tr>
        <td>${d.tipo_documento || d.tipo || '-'}</td>
        <td>${d.data_envio ? new Date(d.data_envio).toLocaleDateString('pt-BR') : '-'}</td>
        <td>${badge(d.status)}</td>
        <td>
          <button class="doc-action-btn approve" data-doc-aprovar="${d.id}" data-aluno-id="${id}" title="Aprovar"><i class="fas fa-check"></i></button>
          <button class="doc-action-btn reject" data-doc-reprovar="${d.id}" data-aluno-id="${id}" title="Reprovar"><i class="fas fa-times"></i></button>
          <button class="doc-action-btn delete" data-doc-excluir="${d.id}" data-aluno-id="${id}" title="Excluir"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>`).join('');
    } else {
      document.getElementById('aluno-documentos-section').classList.add('hidden');
    }

    // Populate complaints table
    if (aluno.reclamacoes?.length) {
      document.getElementById('aluno-reclamacoes-section').classList.remove('hidden');
      document.getElementById('aluno-reclamacoes-tbody').innerHTML = aluno.reclamacoes.map(r => `<tr>
        <td>${r.assunto || '-'}</td>
        <td>${r.data_abertura ? new Date(r.data_abertura).toLocaleDateString('pt-BR') : '-'}</td>
        <td>${badge(r.status)}</td>
        <td style="font-size:0.78rem;max-width:200px;overflow:hidden;text-overflow:ellipsis;">${r.resposta || '-'}</td>
        <td>
          <button class="btn btn-soft btn-sm" data-reclamacao-responder='${JSON.stringify({ id: r.id, assunto: r.assunto, descricao: r.descricao || r.mensagem || '' }).replace(/'/g, "&#39;")}' style="font-size:0.7rem;">Responder</button>
        </td>
      </tr>`).join('');
    } else {
      document.getElementById('aluno-reclamacoes-section').classList.add('hidden');
    }

    // Populate appointments table
    if (aluno.atendimentos?.length) {
      document.getElementById('aluno-atendimentos-section').classList.remove('hidden');
      document.getElementById('aluno-atendimentos-tbody').innerHTML = aluno.atendimentos.map(a => `<tr>
        <td>${a.tipo || '-'}</td>
        <td>${a.data_atendimento ? new Date(a.data_atendimento).toLocaleDateString('pt-BR') : '-'}</td>
        <td>${badge(a.status)}</td>
      </tr>`).join('');
    } else {
      document.getElementById('aluno-atendimentos-section').classList.add('hidden');
    }

    // Store current aluno ID for edit
    window.__currentAlunoId = id;
    window.__currentAluno = aluno;

    document.getElementById('modulo-alunos').classList.add('hidden');
    document.getElementById('modulo-aluno-detalhes').classList.remove('hidden');
    saveState();
  } catch { notyf.error('Erro ao carregar detalhes do aluno.'); }
}

// Override original showAlunoDetail
showAlunoDetail = showAlunoDetailEnhanced;

// --- Edit Aluno Modal ---
document.getElementById('btn-editar-aluno')?.addEventListener('click', () => {
  const a = window.__currentAluno;
  if (!a) { notyf.error('Nenhum aluno carregado.'); return; }
  document.getElementById('edit-aluno-id').value = a.id;
  document.getElementById('edit-aluno-nome').value = a.nome_completo || '';
  document.getElementById('edit-aluno-email').value = a.email || '';
  document.getElementById('edit-aluno-cpf').value = a.cpf || '';
  document.getElementById('edit-aluno-telefone').value = a.telefone || '';
  document.getElementById('edit-aluno-data-nasc').value = a.data_nascimento || '';
  document.getElementById('modal-editar-aluno').classList.remove('hidden');
});

document.getElementById('modal-editar-fechar')?.addEventListener('click', () => document.getElementById('modal-editar-aluno').classList.add('hidden'));
document.getElementById('cancelar-editar-aluno')?.addEventListener('click', () => document.getElementById('modal-editar-aluno').classList.add('hidden'));

document.getElementById('form-editar-aluno')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-aluno-id').value;
  const payload = {
    nome_completo: document.getElementById('edit-aluno-nome').value,
    email: document.getElementById('edit-aluno-email').value,
    cpf: document.getElementById('edit-aluno-cpf').value,
    telefone: document.getElementById('edit-aluno-telefone').value,
    data_nascimento: document.getElementById('edit-aluno-data-nasc').value,
  };
  try {
    await request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    addAuditLog('ALUNO', `Editou dados do aluno: ${payload.nome_completo}`, `ID: ${id}`);
    showSuccess('Dados do aluno atualizados!');
    document.getElementById('modal-editar-aluno').classList.add('hidden');
    showAlunoDetailEnhanced(id);
  } catch (e) { showError('Erro ao editar aluno', e); }
});

// --- Alterar Turma ---
document.addEventListener('click', (e) => {
  const btnTurma = e.target.closest('#btn-alterar-turma');
  if (!btnTurma) return;
  const alunoId = btnTurma.dataset.alunoId;
  const turmas = state.turmas || [];
  const options = turmas.filter(t => t.status === 'ATIVO').map(t => `<option value="${t.id}">${t.nome} - ${t.id_curso?.nome_curso || ''}</option>`).join('');
  if (!options) { notyf.error('Nenhuma turma ativa disponível.'); return; }
  const html = `
    <div class="modal-overlay" id="modal-alterar-turma-temp">
      <div class="modal-content" style="max-width:400px;">
        <div class="modal-header"><h2><i class="fas fa-book-open"></i> Alterar Turma</h2><button class="modal-close" id="fechar-modal-turma-temp">&times;</button></div>
        <div class="modal-body">
          <div class="field"><label>Selecione a nova turma</label><select id="select-nova-turma">${options}</select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-soft" id="cancelar-modal-turma-temp">Cancelar</button>
          <button class="btn btn-primary" id="confirmar-alterar-turma">Salvar</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  const modal = document.getElementById('modal-alterar-turma-temp');
  const close = () => { if (modal) modal.remove(); };
  document.getElementById('fechar-modal-turma-temp')?.addEventListener('click', close);
  document.getElementById('cancelar-modal-turma-temp')?.addEventListener('click', close);
  document.getElementById('confirmar-alterar-turma')?.addEventListener('click', async () => {
    const turmaId = document.getElementById('select-nova-turma').value;
    if (!turmaId) { notyf.error('Selecione uma turma.'); return; }
    try {
      await request(`/alunos/${alunoId}/matricula`, { method: 'PUT', body: JSON.stringify({ id_turma: turmaId }) });
      addAuditLog('ALUNO', `Alterou turma do aluno ID: ${alunoId}`, `Nova turma ID: ${turmaId}`);
      notyf.success('Turma alterada com sucesso!');
      close();
      showAlunoDetailEnhanced(alunoId);
    } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
  });
});

// --- Resetar Senha ---
document.getElementById('btn-resetar-senha-aluno')?.addEventListener('click', async () => {
  const id = window.__currentAlunoId;
  if (!id) { notyf.error('Nenhum aluno carregado.'); return; }
  if (!await confirmAction('Resetar a senha deste aluno para Sige123@?')) return;
  try {
    await request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify({ senha: 'Sige123@' }) });
    addAuditLog('ALUNO', `Resetou senha do aluno ID: ${id}`, 'Nova senha: Sige123@');
    notyf.success('Senha redefinida para Sige123@');
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
});

// --- Document actions ---
document.addEventListener('click', async (e) => {
  const aprovar = e.target.closest('[data-doc-aprovar]');
  if (aprovar) {
    const id = aprovar.dataset.docAprovar;
    const alunoId = aprovar.dataset.alunoId;
    try {
      await request(`/documentos/${id}`, { method: 'PUT', body: JSON.stringify({ status: 'APROVADO' }) });
      addAuditLog('ALUNO', `Aprovou documento ID: ${id}`, `Aluno ID: ${alunoId}`);
      notyf.success('Documento aprovado!');
      showAlunoDetailEnhanced(alunoId);
    } catch { notyf.error('Erro ao aprovar documento.'); }
  }

  const reprovar = e.target.closest('[data-doc-reprovar]');
  if (reprovar) {
    const id = reprovar.dataset.docReprovar;
    const alunoId = reprovar.dataset.alunoId;
    try {
      await request(`/documentos/${id}`, { method: 'PUT', body: JSON.stringify({ status: 'REPROVADO' }) });
      addAuditLog('ALUNO', `Reprovou documento ID: ${id}`, `Aluno ID: ${alunoId}`);
      notyf.success('Documento reprovado!');
      showAlunoDetailEnhanced(alunoId);
    } catch { notyf.error('Erro ao reprovar documento.'); }
  }

  const excluir = e.target.closest('[data-doc-excluir]');
  if (excluir && await confirmAction('Remover este documento?')) {
    const id = excluir.dataset.docExcluir;
    const alunoId = excluir.dataset.alunoId;
    try {
      await request(`/documentos/${id}`, { method: 'DELETE' });
      addAuditLog('ALUNO', `Removeu documento ID: ${id}`, `Aluno ID: ${alunoId}`);
      notyf.success('Documento removido.');
      showAlunoDetailEnhanced(alunoId);
    } catch { notyf.error('Erro ao remover documento.'); }
  }
});

// --- Responder Reclamação (from aluno detail) ---
document.addEventListener('click', (e) => {
  const btnResp = e.target.closest('[data-reclamacao-responder]');
  if (!btnResp) return;
  try {
    const data = JSON.parse(btnResp.dataset.reclamacaoResponder);
    document.getElementById('resp-reclamacao-id').value = data.id;
    document.getElementById('resp-reclamacao-assunto').textContent = data.assunto;
    document.getElementById('resp-reclamacao-descricao').textContent = data.descricao;
    document.getElementById('resp-reclamacao-resposta').value = '';
    document.getElementById('resp-reclamacao-status').value = 'EM_ANDAMENTO';
    document.getElementById('modal-responder-reclamacao').classList.remove('hidden');
  } catch { notyf.error('Erro ao carregar reclamação.'); }
});

document.getElementById('modal-resp-reclamacao-fechar')?.addEventListener('click', () => document.getElementById('modal-responder-reclamacao').classList.add('hidden'));
document.getElementById('cancelar-resp-reclamacao')?.addEventListener('click', () => document.getElementById('modal-responder-reclamacao').classList.add('hidden'));

document.getElementById('form-responder-reclamacao')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('resp-reclamacao-id').value;
  const resposta = document.getElementById('resp-reclamacao-resposta').value;
  const status = document.getElementById('resp-reclamacao-status').value;
  try {
    await request(`/reclamacoes/${id}`, { method: 'PUT', body: JSON.stringify({ resposta, status }) });
    addAuditLog('ALUNO', `Respondeu reclamação ID: ${id}`, `Status: ${status}`);
    notyf.success('Resposta enviada!');
    document.getElementById('modal-responder-reclamacao').classList.add('hidden');
    if (window.__currentAlunoId) showAlunoDetailEnhanced(window.__currentAlunoId);
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
});

// ======================================
// RECLAMACOES (standalone module)
// ======================================
async function loadReclamacoesStandalone(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.texto) params.set('texto', filters.texto);
    if (filters.status && filters.status !== 'TODOS') params.set('status', filters.status);
    params.set('limit', '500');
    const res = await request('/reclamacoes?' + params.toString());
    const reclamacoes = (res.data || []).map(r => ({
      ...r,
      alunoNome: r.id_usuario?.nome_completo || r.id_usuario?.email || '-',
      alunoId: r.id_usuario?.id || r.id_usuario
    }));

    const tbody = document.getElementById('lista-reclamacoes');
    const pagContainer = document.getElementById('paginacao-reclamacoes');
    if (!reclamacoes.length) {
      const empty = document.getElementById('reclamacoes-empty');
      if (tbody) tbody.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      if (pagContainer) pagContainer.innerHTML = '';
      return;
    }
    const reclEmpty = document.getElementById('reclamacoes-empty');
    if (reclEmpty) reclEmpty.classList.add('hidden');
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: document.getElementById('reclamacoes-empty'),
      dados: reclamacoes,
      renderizarItem: r => `<tr>
        <td><strong>${r.alunoNome || '-'}</strong></td>
        <td>${r.assunto || '-'}</td>
        <td>${r.data_abertura ? new Date(r.data_abertura).toLocaleDateString('pt-BR') : '-'}</td>
        <td>${badge(r.status)}</td>
        <td>
          ${hasPerm('reclamacao.responder') ? `<button class="btn btn-soft btn-sm" data-reclamacao-responder='${JSON.stringify({ id: r.id, assunto: r.assunto, descricao: r.descricao || r.mensagem || '' }).replace(/'/g, "&#39;")}' style="font-size:0.7rem;">Responder</button>` : ''}
          <button class="btn btn-soft btn-sm" data-reclamacao-view-aluno="${r.alunoId}" style="font-size:0.7rem;">Ver Aluno</button>
        </td>
      </tr>`,
    });
  } catch {}
}

document.getElementById('btn-filtrar-reclamacoes')?.addEventListener('click', () => {
  loadReclamacoesStandalone({
    texto: document.getElementById('filtro-reclamacao-texto')?.value || '',
    status: document.getElementById('filtro-reclamacao-status')?.value || 'TODOS',
  });
});
document.querySelectorAll('#filtro-reclamacao-texto, #filtro-reclamacao-status').forEach(el => {
  if (el) { el.addEventListener('input', () => document.getElementById('btn-filtrar-reclamacoes')?.click()); el.addEventListener('change', () => document.getElementById('btn-filtrar-reclamacoes')?.click()); }
});

// View aluno from reclamacao
document.addEventListener('click', (e) => {
  const btnAluno = e.target.closest('[data-reclamacao-view-aluno]');
  if (btnAluno) { e.preventDefault(); showAlunoDetailEnhanced(btnAluno.dataset.reclamacaoViewAluno); }
});

// ======================================
// AUDITORIA MODULE
// ======================================
async function loadAuditoria(filters = {}) {
  const renderRow = l => `<tr>
    <td style="font-size:0.75rem;color:var(--sec-muted);white-space:nowrap;">${new Date(l.timestamp).toLocaleString('pt-BR')}</td>
    <td><strong>${l.usuario}</strong></td>
    <td>${l.acao}</td>
    <td><span class="audit-badge ${(l.tipo || '').toLowerCase()}">${l.tipo || '-'}</span></td>
    <td style="font-size:0.78rem;color:var(--sec-muted);max-width:250px;overflow:hidden;text-overflow:ellipsis;">${l.detalhes || '-'}</td>
  </tr>`;
  try {
    const params = new URLSearchParams();
    if (filters.texto) params.set('texto', filters.texto);
    if (filters.tipo && filters.tipo !== 'TODOS') params.set('tipo', filters.tipo);
    params.set('limit', '500');
    const res = await request('/auditoria?' + params.toString());
    const logs = res.data || [];

    const tbody = document.getElementById('lista-auditoria');
    const pagContainer = document.getElementById('paginacao-auditoria');
    if (!logs.length) {
      const empty = document.getElementById('auditoria-empty');
      if (tbody) tbody.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      if (pagContainer) pagContainer.innerHTML = '';
      return;
    }
    const auditEmpty = document.getElementById('auditoria-empty');
    if (auditEmpty) auditEmpty.classList.add('hidden');
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: document.getElementById('auditoria-empty'),
      dados: logs,
      renderizarItem: renderRow,
    });
  } catch {
    // Fallback: load from localStorage
    const logs = JSON.parse(localStorage.getItem('sige-audit') || '[]');
    let f = [...logs];
    const t = (filters.texto || '').toLowerCase();
    if (t) f = f.filter(l => (l.usuario || '').toLowerCase().includes(t) || (l.acao || '').toLowerCase().includes(t) || (l.detalhes || '').toLowerCase().includes(t));
    if (filters.tipo && filters.tipo !== 'TODOS') f = f.filter(l => l.tipo === filters.tipo);
    const tbody = document.getElementById('lista-auditoria');
    const pagContainer = document.getElementById('paginacao-auditoria');
    if (!f.length) {
      const empty = document.getElementById('auditoria-empty');
      if (tbody) tbody.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      if (pagContainer) pagContainer.innerHTML = '';
      return;
    }
    const auditEmpty = document.getElementById('auditoria-empty');
    if (auditEmpty) auditEmpty.classList.add('hidden');
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: document.getElementById('auditoria-empty'),
      dados: f,
      renderizarItem: renderRow,
    });
  }
}

document.getElementById('btn-filtrar-auditoria')?.addEventListener('click', () => {
  loadAuditoria({
    texto: document.getElementById('filtro-auditoria-texto')?.value || '',
    tipo: document.getElementById('filtro-auditoria-tipo')?.value || 'TODOS',
  });
});
document.querySelectorAll('#filtro-auditoria-texto, #filtro-auditoria-tipo').forEach(el => {
  if (el) { el.addEventListener('input', () => document.getElementById('btn-filtrar-auditoria')?.click()); el.addEventListener('change', () => document.getElementById('btn-filtrar-auditoria')?.click()); }
});

// Export auditoria CSV
document.getElementById('btn-exportar-auditoria-csv')?.addEventListener('click', async () => {
  try {
    const res = await request('/auditoria?limit=5000');
    const logs = res.data || [];
    if (!logs.length) { notyf.error('Nenhum registro para exportar.'); return; }
    const rows = [['Data/Hora', 'Usuário', 'Ação', 'Tipo', 'Detalhes']];
    logs.forEach(l => rows.push([new Date(l.timestamp).toLocaleString('pt-BR'), l.usuario, l.acao, l.tipo || '', l.detalhes || '']));
    const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `auditoria_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    notyf.success('CSV exportado!');
  } catch {
    // Fallback to localStorage
    const logs = JSON.parse(localStorage.getItem('sige-audit') || '[]');
    if (!logs.length) { notyf.error('Nenhum registro para exportar.'); return; }
    const rows = [['Data/Hora', 'Usuário', 'Ação', 'Tipo', 'Detalhes']];
    logs.forEach(l => rows.push([new Date(l.timestamp).toLocaleString('pt-BR'), l.usuario, l.acao, l.tipo || '', l.detalhes || '']));
    const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `auditoria_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }
});
document.addEventListener('DOMContentLoaded', async () => {
  // Ensure authentication
  if (typeof requireAuth === 'function') {
    __auth = requireAuth('ROLE_ADMIN');
    if (!__auth) return;
  }
  const ativo = await checkPortalAtivo('secretaria');
  if (!ativo) return;
  filterSidebarByPerms();
  filterCreateFormsByPerms();
  populateSidebarUser();
  initSettings();
  setupTableSort();
  initFilters();

  // Preload all data in background
  loadDashboard();
  loadInscricoes(getFiltros());
  loadCursos();
  loadUnidades();
  loadCargos();
  loadUsuarios();
  loadEditais();
  loadAlunos();

  // Try to restore saved state from URL hash
  const restored = restoreState();

  // Preenche filtros de curso no dashboard e relatorio, then start polling
  setTimeout(() => {
    const cursos = state.cursos;
    ['dash-curso-filtro', 'rel-curso-filtro', 'dash-aluno-curso-filtro'].forEach(id => {
      const sel = document.getElementById(id);
      if (sel && cursos.length) {
        sel.innerHTML = '<option value="TODOS">Todos os cursos</option>' +
          cursos.map(c => `<option value="${c.id}">${c.nome_curso}</option>`).join('');
      }
    });
    loadRelatorio(getRelFiltros());
    loadRelatorioAlunos();
    loadDashboardAlunos();
    loadTurmas();
    loadCargos();
    loadPermissoesCheckboxes();
    loadReclamacoesStandalone();
    loadAuditoria();
    startPolling();
  }, 500);
});

// ==============================================
// DISCIPLINAS MODULE
// ==============================================
async function loadDisciplinas() {
  try {
    const data = await request('/disciplinas');
    state.disciplinas = data;
    const tbody = document.getElementById('lista-disciplinas');
    const pagContainer = document.getElementById('paginacao-disciplinas');
    const discData = filterEditDeleteButtonsByPerms('disciplina', data);
    if (discData.length === 0) { if (pagContainer) pagContainer.innerHTML = ''; tbody.innerHTML = ''; return; }
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: null,
      dados: discData,
      renderizarItem: d => `<tr>
        <td><strong>${d.nome || '-'}</strong></td>
        <td>${d.codigo || '-'}</td>
        <td>${d.carga_horaria || 0}h</td>
        <td>${d.id_curso?.nome_curso || '-'}</td>
        <td>${d.editBtn} ${d.delBtn}</td>
      </tr>`,
    });
    const selCurso = document.getElementById('disciplina-curso');
    if (state.cursos && selCurso) {
      selCurso.innerHTML = '<option value="">Nenhum</option>' + state.cursos.map(c => `<option value="${c.id}">${c.nome_curso}</option>`).join('');
    }
    populateDisciplinaDropdowns();
  } catch (e) { notyf.error('Erro ao carregar disciplinas: ' + (e.message || '')); }
}

async function loadAtribuicoes() {
  try {
    const data = await request('/disciplinas/atribuicoes');
    state.atribuicoes = data;
    const tbody = document.getElementById('lista-atribuicoes');
    const pagContainer = document.getElementById('paginacao-atribuicoes');
    const permDel = hasPerm('disciplina.excluir');
    if (data.length === 0) { if (pagContainer) pagContainer.innerHTML = ''; tbody.innerHTML = ''; return; }
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: null,
      dados: data,
      renderizarItem: a => `<tr>
        <td>${a.id_disciplina?.nome || '-'}</td>
        <td>${a.id_turma?.nome || '-'}</td>
        <td>${a.id_professor?.nome_completo || '-'}</td>
        <td>${permDel ? `<button class="btn btn-danger btn-sm" data-atribuicao-del="${a.id}">Excluir</button>` : ''}</td>
      </tr>`,
    });
  } catch (e) { notyf.error('Erro ao carregar atribuicoes: ' + (e.message || '')); }
}

async function populateDisciplinaDropdowns() {
  const selDisciplina = document.getElementById('atribuir-disciplina');
  const selTurma = document.getElementById('atribuir-turma');
  const selProfessor = document.getElementById('atribuir-professor');
  if (selDisciplina && state.disciplinas) {
    selDisciplina.innerHTML = '<option value="">Selecione...</option>' + state.disciplinas.map(d => `<option value="${d.id}">${d.nome}</option>`).join('');
  }
  if (selTurma && state.turmas) {
    selTurma.innerHTML = '<option value="">Selecione...</option>' + state.turmas.filter(t => t.status === 'ATIVO').map(t => `<option value="${t.id}">${t.nome}</option>`).join('');
  }
  if (selProfessor) {
    try {
      const users = await request('/usuarios?cargo=4');
      selProfessor.innerHTML = '<option value="">Nenhum</option>' + users.map(u => `<option value="${u.id}">${u.nomeCompleto || u.nome_completo}</option>`).join('');
    } catch { selProfessor.innerHTML = '<option value="">Nenhum</option>'; }
  }
}

document.getElementById('form-disciplina')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('disciplina-id')?.value;
  const body = {
    nome: document.getElementById('disciplina-nome').value,
    codigo: document.getElementById('disciplina-codigo').value || null,
    carga_horaria: parseInt(document.getElementById('disciplina-carga').value) || 0,
    id_curso: parseInt(document.getElementById('disciplina-curso').value) || null,
    semestre: parseInt(document.getElementById('disciplina-semestre').value) || 1
  };
  try {
    if (id) {
      await request('/disciplinas/' + id, { method: 'PUT', body: JSON.stringify(body) });
      notyf.success('Disciplina atualizada');
    } else {
      await request('/disciplinas', { method: 'POST', body: JSON.stringify(body) });
      notyf.success('Disciplina criada');
    }
    document.getElementById('form-disciplina').reset();
    document.getElementById('disciplina-id').value = '';
    await loadDisciplinas();
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
});

document.getElementById('cancelar-disciplina')?.addEventListener('click', () => {
  document.getElementById('form-disciplina').reset();
  document.getElementById('disciplina-id').value = '';
});

document.getElementById('form-atribuir-disciplina')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const disciplinaId = document.getElementById('atribuir-disciplina').value;
  const turmaId = document.getElementById('atribuir-turma').value;
  const professorId = document.getElementById('atribuir-professor').value;
  if (!disciplinaId || !turmaId) { notyf.error('Selecione disciplina e turma'); return; }
  try {
    await request('/disciplinas/' + disciplinaId + '/atribuir', {
      method: 'POST',
      body: JSON.stringify({ id_turma: parseInt(turmaId), id_professor: professorId ? parseInt(professorId) : null })
    });
    notyf.success('Disciplina atribuida a turma');
    await loadAtribuicoes();
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
});

document.addEventListener('click', async (e) => {
  const delBtn = e.target.closest('[data-disciplina-del]');
  if (delBtn) {
    const id = delBtn.dataset.disciplinaDel;
    if (!await confirmAction('Excluir esta disciplina?')) return;
    try {
      await request('/disciplinas/' + id, { method: 'DELETE' });
      notyf.success('Disciplina excluida');
      await loadDisciplinas();
    } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
  }
  const editBtn = e.target.closest('[data-disciplina-edit]');
  if (editBtn) {
    const id = editBtn.dataset.disciplinaEdit;
    const d = state.disciplinas.find(x => x.id == id);
    if (!d) return;
    document.getElementById('disciplina-id').value = d.id;
    document.getElementById('disciplina-nome').value = d.nome || '';
    document.getElementById('disciplina-codigo').value = d.codigo || '';
    document.getElementById('disciplina-carga').value = d.carga_horaria || 0;
    document.getElementById('disciplina-curso').value = d.id_curso?.id || '';
    document.getElementById('disciplina-semestre').value = d.semestre || 1;
    document.getElementById('modulo-disciplinas').scrollIntoView({ behavior: 'smooth' });
  }
  const delAtribBtn = e.target.closest('[data-atribuicao-del]');
  if (delAtribBtn) {
    const id = delAtribBtn.dataset.atribuicaoDel;
    if (!await confirmAction('Remover esta atribuicao?')) return;
    try {
      await request('/disciplinas/atribuicoes/' + id, { method: 'DELETE' });
      notyf.success('Atribuicao removida');
      await loadAtribuicoes();
    } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
  }
});

// ==============================================
// PROFESSOR MODULE
// ==============================================
async function loadDashboardProfessor() {
  try {
    const professores = await request('/usuarios?cargo=4');
    const atribuicoes = await request('/disciplinas/atribuicoes');
    document.getElementById('kpi-total-professores').textContent = professores.length;
    const profComTurmas = new Set(atribuicoes.filter(a => a.id_professor).map(a => a.id_professor.id));
    document.getElementById('kpi-professores-com-turmas').textContent = profComTurmas.size;
    document.getElementById('kpi-professores-sem-turmas').textContent = professores.length - profComTurmas.size;
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
}

async function loadProfessores() {
  try {
    const professores = await request('/usuarios?cargo=4');
    const atribuicoes = await request('/disciplinas/atribuicoes');
    if (!state.disciplinas || !state.disciplinas.length) await loadDisciplinas();
    // Populate dropdowns
    const selProf = document.getElementById('prof-tab-professor');
    const selTurma = document.getElementById('prof-tab-turma');
    const selDisc = document.getElementById('prof-tab-disciplina');
    if (selProf) selProf.innerHTML = professores.map(p => `<option value="${p.id}">${p.nomeCompleto}</option>`).join('');
    if (selTurma && state.turmas) selTurma.innerHTML = state.turmas.filter(t => t.status === 'ATIVO').map(t => `<option value="${t.id}">${t.nome}</option>`).join('');
    if (selDisc && state.disciplinas) selDisc.innerHTML = state.disciplinas.map(d => `<option value="${d.id}">${d.nome}</option>`).join('');

    const texto = (document.getElementById('filtro-professor-texto')?.value || '').toLowerCase();
    const tbody = document.getElementById('lista-professores');
    const pagContainer = document.getElementById('paginacao-professores');
    const filteredProf = professores
      .filter(p => !texto || p.nomeCompleto.toLowerCase().includes(texto) || (p.email || '').toLowerCase().includes(texto));
    if (filteredProf.length === 0) { if (pagContainer) pagContainer.innerHTML = ''; tbody.innerHTML = ''; return; }
    new Paginacao({
      container: pagContainer,
      containerTabela: tbody,
      containerVazio: null,
      dados: filteredProf,
      renderizarItem: p => {
        const profAtrib = atribuicoes.filter(a => a.id_professor?.id === p.id);
        const turmas = [...new Set(profAtrib.map(a => a.id_turma?.nome).filter(Boolean))].join(', ');
        const disciplinas = profAtrib.map(a => a.id_disciplina?.nome).filter(Boolean).join(', ');
        return `<tr>
          <td><strong>${p.nomeCompleto}</strong></td>
          <td>${p.email || '-'}</td>
          <td>${turmas || '-'}</td>
          <td>${disciplinas || '-'}</td>
        </tr>`;
      },
    });
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
}

document.getElementById('filtro-professor-texto')?.addEventListener('input', () => loadProfessores());

document.getElementById('form-atribuir-professor-tab')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const profId = document.getElementById('prof-tab-professor').value;
  const turmaId = document.getElementById('prof-tab-turma').value;
  const discId = document.getElementById('prof-tab-disciplina').value;
  if (!profId || !turmaId || !discId) { notyf.error('Preencha todos os campos'); return; }
  try {
    await request('/disciplinas/' + discId + '/atribuir', {
      method: 'POST',
      body: JSON.stringify({ id_turma: parseInt(turmaId), id_professor: parseInt(profId) })
    });
    notyf.success('Professor atribuido a turma');
    await loadProfessores();
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
});

// =============================================
// PORTAIS
// =============================================
async function loadPortais() {
  try {
    const data = await request('/portais');
    const list = document.getElementById('portais-list');
    if (!list) return;
    list.innerHTML = data.map(p => `
      <div class="config-row" style="padding:16px 0;border-bottom:1px solid var(--sec-border);">
        <div class="config-info">
          <h3>${p.nome}</h3>
          <p>${p.descricao || ''}</p>
          ${p.motivo ? `<p style="color:var(--sec-muted);font-style:italic;font-size:0.82rem;margin-top:4px;">${p.motivo}</p>` : ''}
          ${p.reativar_em ? `<p style="color:var(--sec-muted);font-size:0.78rem;margin-top:2px;">Reativacao automatica em: <strong>${new Date(p.reativar_em).toLocaleString('pt-BR')}</strong></p>` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <label class="config-switch" style="margin:0;">
            <input type="checkbox" ${p.ativo ? 'checked' : ''} onchange="togglePortal('${p.codigo}', this.checked)">
            <span class="config-slider"></span>
          </label>
          <span style="font-size:0.82rem;font-weight:600;min-width:50px;${p.ativo ? 'color:var(--sec-accent)' : 'color:var(--sec-danger)'}">${p.ativo ? 'ATIVO' : 'INATIVO'}</span>
        </div>
      </div>
    `).join('');
  } catch (e) { notyf.error('Erro ao carregar portais: ' + (e.message || '')); }
}

async function togglePortal(codigo, ativo) {
  try {
    const motivoInput = prompt(
      ativo
        ? `Reativar portal "${codigo}"? Confirme para reativar.`
        : `Desativar portal "${codigo}"? Informe o motivo da desativacao (ou deixe em branco):`
    );
    if (motivoInput === null) { await loadPortais(); return; }
    const body = { ativo };
    if (!ativo && motivoInput.trim()) body.motivo = motivoInput.trim();
    if (!ativo) {
      const reativarInput = prompt('Data/hora de reativacao automatica (opcional, formato DD/MM/AAAA HH:MM):');
      if (reativarInput && reativarInput.trim()) {
        const partes = reativarInput.trim().match(/(\d{2})\/(\d{2})\/(\d{4})[\s]*(\d{1,2}):(\d{2})?/);
        if (partes) {
          const d = new Date(parseInt(partes[3]), parseInt(partes[2]) - 1, parseInt(partes[1]), parseInt(partes[4] || '0'), parseInt(partes[5] || '0'));
          body.reativar_em = d.toISOString();
        }
      }
    }
    await request(`/portais/${codigo}`, { method: 'PUT', body: JSON.stringify(body) });
    notyf.success(ativo ? 'Portal reativado' : 'Portal desativado');
    await loadPortais();
  } catch (e) { notyf.error('Erro: ' + (e.message || '')); }
}

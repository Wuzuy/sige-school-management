// ======================================
// PORTAL SECRETARIA - UX ENHANCED
// ======================================

// --- Helper: notyf ---
window.notyf = window.notyf || new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

// --- Badge helper ---
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
    'true': 'badge-success',
    'false': 'badge-danger',
  };
  return `<span class="badge ${map[status] || 'badge-neutral'}">${status || '-'}</span>`;
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

// --- Confirmation dialog ---
function confirmAction(msg) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.innerHTML = `<div style="background:#fff;border-radius:12px;padding:24px;max-width:400px;width:100%;box-shadow:0 4px 20px rgba(0,0,0,0.15);">
      <h3 style="margin:0 0 8px;color:#0f172a;font-size:1rem;">Confirmar</h3>
      <p style="margin:0 0 20px;color:#64748b;font-size:0.85rem;">${msg}</p>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button id="confirm-no" style="padding:8px 16px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;">Cancelar</button>
        <button id="confirm-yes" style="padding:8px 16px;border:none;border-radius:6px;background:#ef4444;color:#fff;cursor:pointer;font-weight:600;">Confirmar</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirm-yes').onclick = () => { document.body.removeChild(overlay); resolve(true); };
    overlay.querySelector('#confirm-no').onclick = () => { document.body.removeChild(overlay); resolve(false); };
    overlay.onclick = (e) => { if (e.target === overlay) { document.body.removeChild(overlay); resolve(false); } };
  });
}

// --- Module switching ---
document.querySelectorAll('[data-module-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.module-tabs .btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.module-panel').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(btn.dataset.moduleTarget);
    if (target) target.classList.remove('hidden');
  });
});

// --- Logout ---
document.querySelectorAll('[data-logout]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof clearAuth === 'function') clearAuth();
    window.location.href = '../portal-escolar/login.html';
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
};

// ======================================
// DASHBOARD
// ======================================
async function loadDashboard() {
  try {
    const data = await request('/inscricoes?todos=true');
    const total = data.length;
    const aprovadas = data.filter(i => i.status_aprovacao === 'APROVADA').length;
    const analise = data.filter(i => i.status_aprovacao === 'EM_ANALISE').length;
    const reprovadas = data.filter(i => i.status_aprovacao === 'REPROVADA').length;
    document.getElementById('stat-total-inscricoes').textContent = total;
    document.getElementById('stat-aprovadas').textContent = aprovadas;
    document.getElementById('stat-em-analise').textContent = analise;
    document.getElementById('stat-reprovadas').textContent = reprovadas;
  } catch {}
}

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
    if (filtered.length === 0) {
      showEmpty('inscricoes', 'Nenhuma inscricao encontrada com esses filtros.');
      return;
    }
    showTable('inscricoes');
    tbody.innerHTML = filtered.sort((a, b) => new Date(b.data_inscricao || 0) - new Date(a.data_inscricao || 0))
      .map(i => `<tr>
        <td><strong>${i.id_usuario?.nome_completo || i.nome_completo_inscricao || '-'}</strong></td>
        <td>${i.id_curso?.nome_curso || '-'}</td>
        <td>${i.data_inscricao ? new Date(i.data_inscricao).toLocaleDateString('pt-BR') : '-'}</td>
        <td>${badge(i.status_aprovacao)}</td>
        <td><button class="btn btn-soft btn-sm" data-inscricao-view="${i.id}">Detalhes</button></td>
      </tr>`).join('');
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
    document.getElementById('modulo-inscricoes').classList.add('hidden');
    document.getElementById('modulo-inscricoes-detalhes').classList.remove('hidden');
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
    document.getElementById('modulo-inscricoes-detalhes').classList.add('hidden');
    document.getElementById('modulo-inscricoes').classList.remove('hidden');
    await loadInscricoes(getFiltros());
  } catch (e) { notyf.error('Falha ao atualizar: ' + (e.message || '')); }
});

// --- voltar ---
document.getElementById('voltar-lista-inscricoes')?.addEventListener('click', () => {
  document.getElementById('modulo-inscricoes-detalhes').classList.add('hidden');
  document.getElementById('modulo-inscricoes').classList.remove('hidden');
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
    if (filtered.length === 0) { showEmpty('cursos', 'Nenhum curso encontrado.'); return; }
    showTable('cursos');
    tbody.innerHTML = filtered.map(c => `<tr>
      <td><strong>${c.nome_curso || '-'}</strong></td>
      <td>${c.id_unidade?.nome || '-'}</td>
      <td>${c.turno || '-'}</td>
      <td>${badge(c.status)}</td>
      <td>
        <button class="btn btn-soft btn-sm" data-curso-edit="${c.id}">Editar</button>
        <button class="btn btn-danger btn-sm" data-curso-del="${c.id}">Excluir</button>
      </td>
    </tr>`).join('');
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
    if (f.length === 0) { showEmpty('unidades', 'Nenhuma unidade encontrada.'); return; }
    showTable('unidades');
    tbody.innerHTML = f.map(u => `<tr>
      <td><strong>${u.nome || '-'}</strong></td>
      <td>${u.cnpj || '-'}</td>
      <td>${u.cidade || '-'}/${u.estado || '-'}</td>
      <td>
        <button class="btn btn-soft btn-sm" data-unidade-edit="${u.id}">Editar</button>
        <button class="btn btn-danger btn-sm" data-unidade-del="${u.id}">Excluir</button>
      </td>
    </tr>`).join('');
  } catch { showEmpty('unidades', 'Erro ao carregar unidades.'); }
}

async function loadUsuarios(filters = {}) {
  showSkeleton('usuarios');
  try {
    const data = await request('/usuarios');
    state.usuarios = data;
    let f = [...data];
    if (filters.texto) { const t = filters.texto.toLowerCase(); f = f.filter(u => u.nome_completo?.toLowerCase().includes(t) || u.email?.toLowerCase().includes(t)); }
    if (filters.role && filters.role !== 'TODOS') { f = f.filter(u => u.role === filters.role); }
    const tbody = document.getElementById('lista-usuarios');
    if (f.length === 0) { showEmpty('usuarios', 'Nenhum usuario encontrado.'); return; }
    showTable('usuarios');
    tbody.innerHTML = f.map(u => `<tr>
      <td><strong>${u.nome_completo || '-'}</strong></td>
      <td>${u.email || '-'}</td>
      <td>${badge(u.role)}</td>
      <td>
        <button class="btn btn-soft btn-sm" data-usuario-edit="${u.id}">Editar</button>
        <button class="btn btn-danger btn-sm" data-usuario-del="${u.id}">Excluir</button>
      </td>
    </tr>`).join('');
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
    if (f.length === 0) { showEmpty('editais', 'Nenhum edital encontrado.'); return; }
    showTable('editais');
    tbody.innerHTML = f.map(e => `<tr>
      <td><strong>${e.titulo || '-'}</strong></td>
      <td><a href="${e.url || '#'}" target="_blank" style="color:var(--sec-accent)">Abrir</a></td>
      <td>${badge(e.ativo ? 'ATIVO' : 'INATIVO')}</td>
      <td>
        <button class="btn btn-soft btn-sm" data-edital-edit="${e.id}">Editar</button>
        <button class="btn btn-danger btn-sm" data-edital-del="${e.id}">Excluir</button>
      </td>
    </tr>`).join('');
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
    if (f.length === 0) { showEmpty('alunos', 'Nenhum aluno encontrado.'); return; }
    showTable('alunos');
    tbody.innerHTML = f.map(a => {
      const m = a.matriculas?.[0] || {};
      return `<tr>
        <td><strong>${a.nome_completo || '-'}</strong></td>
        <td>${a.email || '-'}</td>
        <td>${m.id_curso?.nome_curso || '-'}</td>
        <td>${m.id_turma?.nome || '-'}</td>
        <td>${badge(m.status)}</td>
        <td><button class="btn btn-soft btn-sm" data-aluno-view="${a.id}">Detalhes</button></td>
      </tr>`;
    }).join('');
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
  document.getElementById('modulo-aluno-detalhes').classList.add('hidden');
  document.getElementById('modulo-alunos').classList.remove('hidden');
});

// ======================================
// RELATORIOS
// ======================================
async function loadRelatorios() {
  try {
    const data = await request('/inscricoes?todos=true');

    // Por curso
    const porCurso = {};
    data.forEach(i => {
      const nome = i.id_curso?.nome_curso || 'Sem curso';
      if (!porCurso[nome]) porCurso[nome] = { total: 0, aprovadas: 0, analise: 0, reprovadas: 0 };
      porCurso[nome].total++;
      if (i.status_aprovacao === 'APROVADA') porCurso[nome].aprovadas++;
      else if (i.status_aprovacao === 'EM_ANALISE') porCurso[nome].analise++;
      else if (i.status_aprovacao === 'REPROVADA') porCurso[nome].reprovadas++;
    });
    document.getElementById('relatorio-por-curso').innerHTML = Object.entries(porCurso).map(([nome, v]) =>
      `<tr><td><strong>${nome}</strong></td><td>${v.total}</td><td class="stat-ok" style="font-weight:600">${v.aprovadas}</td><td class="stat-info" style="font-weight:600">${v.analise}</td><td class="stat-danger" style="font-weight:600">${v.reprovadas}</td></tr>`
    ).join('') || '<tr><td colspan="5" style="text-align:center;color:#999">Nenhum dado</td></tr>';

    // Recentes
    const recentes = [...data].sort((a, b) => new Date(b.data_inscricao || 0) - new Date(a.data_inscricao || 0)).slice(0, 20);
    document.getElementById('relatorio-recentes').innerHTML = recentes.map(i => `<tr>
      <td>${i.data_inscricao ? new Date(i.data_inscricao).toLocaleDateString('pt-BR') : '-'}</td>
      <td>${i.id_usuario?.nome_completo || i.nome_completo_inscricao || '-'}</td>
      <td>${i.id_curso?.nome_curso || '-'}</td>
      <td>${badge(i.status_aprovacao)}</td>
    </tr>`).join('') || '<tr><td colspan="4" style="text-align:center;color:#999">Nenhuma inscricao</td></tr>';
  } catch {}
}

// ======================================
// EVENT DELEGATION
// ======================================
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-inscricao-view]');
  if (btn) { e.preventDefault(); showInscricaoDetail(btn.dataset.inscricaoView); }

  const btnAluno = e.target.closest('[data-aluno-view]');
  if (btnAluno) { e.preventDefault(); showAlunoDetail(btnAluno.dataset.alunoView); }

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
// FILTER LISTENERS (generic)
// ======================================
['cursos', 'unidades', 'usuarios', 'editais', 'alunos'].forEach(prefix => {
  document.querySelectorAll(`#filtro-${prefix}-texto, #filtro-${prefix}-status, #filtro-${prefix}-estado, #filtro-${prefix}-curso, #filtro-${prefix}-unidade, #filtro-${prefix}-role, #filtro-${prefix}-status-matricula`).forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => {
      const fn = { cursos: loadCursos, unidades: loadUnidades, usuarios: loadUsuarios, editais: loadEditais, alunos: loadAlunos }[prefix];
      if (fn) {
        const filtros = {};
        document.querySelectorAll(`#filtro-${prefix}-texto, #filtro-${prefix}-status, #filtro-${prefix}-estado, #filtro-${prefix}-curso, #filtro-${prefix}-unidade, #filtro-${prefix}-role, #filtro-${prefix}-status-matricula`).forEach(f => {
          if (f.id) filtros[f.id.replace(`filtro-${prefix}-`, '')] = f.value;
        });
        fn(filtros);
      }
    });
  });
});

// ======================================
// ADD EMPTY/SKELETON NODES (for tables that don't have them)
// ======================================
['cursos', 'unidades', 'usuarios', 'editais', 'alunos'].forEach(id => {
  const wrapper = document.querySelector(`#modulo-${id === 'cursos' ? 'cursos' : id === 'unidades' ? 'unidades' : id === 'usuarios' ? 'usuarios' : id === 'editais' ? 'editais' : 'alunos'} .table-wrapper`);
  if (!wrapper) return;

  // Add empty state if not exists
  if (!document.getElementById(`${id}-empty`)) {
    const empty = document.createElement('div');
    empty.id = `${id}-empty`;
    empty.className = 'empty-state hidden';
    empty.innerHTML = `<div class="empty-icon">&#128196;</div><h3>Nenhum registro encontrado</h3><p>Tente ajustar os filtros.</p>`;
    wrapper.parentNode.insertBefore(empty, wrapper.nextSibling);
  }
  // Add skeleton if not exists
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
// INIT
// ======================================
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  loadInscricoes(getFiltros());
  loadCursos();
  loadUnidades();
  loadUsuarios();
  loadEditais();
  loadAlunos();
  loadRelatorios();
});

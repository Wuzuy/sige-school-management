const API_BASE = 'http://localhost:8080/api';

function getAuth() {
  const raw = localStorage.getItem('auth');
  return raw ? JSON.parse(raw) : null;
}

function setAuth(auth) {
  localStorage.setItem('auth', JSON.stringify(auth));
}

function clearAuth() {
  localStorage.removeItem('auth');
}

function authHeaders(isJson = true) {
  const auth = getAuth();
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;
  return headers;
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR');
}

function getCurrentFileName() {
  const path = window.location.pathname;
  return path.split('/').pop() || 'index.html';
}

function updateUserNameLabels() {
  const userNameEl = document.querySelectorAll('[data-user-name]');
  const name = getAuth()?.usuario?.nomeCompleto || 'Visitante';
  userNameEl.forEach((el) => {
    el.textContent = name;
  });
}

function setupLogoutButtons() {
  document.querySelectorAll('[data-logout]').forEach((button) => {
    button.addEventListener('click', () => {
      clearAuth();
      window.location.href = 'login.html';
    });
  });
}

function setupTopNav(auth) {
  const isAdmin = auth?.usuario?.role === 'ROLE_ADMIN';

  document.querySelectorAll('[data-admin-only]').forEach((element) => {
    element.classList.toggle('visible', isAdmin);
  });

  const currentFile = getCurrentFileName();
  document.querySelectorAll('.nav a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('nav-link-active', href === currentFile);
  });
}

function requireAuth(requiredRole) {
  const auth = getAuth();
  if (!auth?.token || !auth?.usuario) {
    window.location.href = 'login.html';
    return null;
  }

  if (requiredRole && auth.usuario.role !== requiredRole) {
    window.location.href = 'index.html';
    return null;
  }

  setupTopNav(auth);
  return auth;
}

function setupProtectedPage(auth) {
  setupTopNav(auth);
  updateUserNameLabels();
  setupLogoutButtons();
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(raw || 'Falha na requisição');
  }

  if (response.status === 204) return null;
  return response.json();
}

function renderEditais(container, editais) {
  if (!container) return;

  container.innerHTML = '';

  if (!Array.isArray(editais) || editais.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'Nenhum edital publicado no momento.';
    container.appendChild(empty);
    return;
  }

  editais.forEach((edital) => {
    const link = document.createElement('a');
    link.href = edital.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'btn btn-soft';
    link.textContent = edital.titulo;
    container.appendChild(link);
  });
}

async function initEditaisLogin() {
  const container = document.querySelector('#editais-list');
  if (!container) return;

  try {
    const editais = await request('/editais');
    renderEditais(container, editais.filter((item) => item.ativo));
  } catch (_) {
    renderEditais(container, []);
  }
}

function initLoginPage() {
  const loginForm = document.querySelector('#form-login');
  const registerForm = document.querySelector('#form-register');
  const btnLogin = document.querySelector('#switch-login');
  const btnRegister = document.querySelector('#switch-register');

  const activate = (mode) => {
    const register = mode === 'register';
    btnLogin.classList.toggle('active', !register);
    btnRegister.classList.toggle('active', register);
    loginForm.classList.toggle('hidden', register);
    registerForm.classList.toggle('hidden', !register);
  };

  btnLogin?.addEventListener('click', () => activate('login'));
  btnRegister?.addEventListener('click', () => activate('register'));

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#login-email').value.trim();
    const senha = document.querySelector('#login-senha').value.trim();

    try {
      const data = await request('/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const token = data.token;
      const usuario = data.usuario;

      if (!token || !usuario) throw new Error('Resposta de login inválida.');

      setAuth({ token, usuario });
      window.location.href = usuario.role === 'ROLE_ADMIN' ? 'portal-secretaria.html' : 'index.html';
    } catch (error) {
      alert(`Não foi possível logar: ${error.message}`);
    }
  });

  registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nomeCompleto = document.querySelector('#register-nome').value.trim();
    const email = document.querySelector('#register-email').value.trim();
    const senha = document.querySelector('#register-senha').value.trim();
    const confirmar = document.querySelector('#register-confirmar').value.trim();

    if (senha !== confirmar) {
      alert('As senhas não conferem.');
      return;
    }

    try {
      await request('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeCompleto, email, senha }),
      });

      alert('Cadastro realizado. Faça o login para continuar.');
      registerForm.reset();
      activate('login');
    } catch (error) {
      alert(`Falha no cadastro: ${error.message}`);
    }
  });

  initEditaisLogin();
}

function fillCourseDetailsPanel(course, selectors) {
  document.querySelector(selectors.name).textContent = course?.nome_curso || '-';
  document.querySelector(selectors.type).textContent = course?.tipo || '-';
  document.querySelector(selectors.shift).textContent = course?.turno || '-';
  document.querySelector(selectors.unit).textContent = course?.id_unidade?.nome || '-';
  document.querySelector(selectors.start).textContent = formatDate(course?.data_inicio);
  document.querySelector(selectors.duration).textContent = `${course?.duracao_meses || '-'} meses`;
  document.querySelector(selectors.status).textContent = course?.status || '-';
}

async function initHomePage() {
  const auth = requireAuth();
  if (!auth) return;
  setupProtectedPage(auth);

  const body = document.querySelector('#courses-body');

  try {
    const cursos = await request('/cursos', { headers: authHeaders(false) });

    body.innerHTML = '';

    cursos.forEach((curso) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${curso?.id_unidade?.nome || '-'}</td>
        <td>${curso.nome_curso}</td>
        <td>${curso.turno}</td>
        <td>${formatDate(curso.data_inicio)}</td>
        <td>${curso.duracao_meses} meses</td>
        <td><button class="btn btn-primary" data-inscrever="${curso.id}">Inscrever-se</button></td>
      `;
      body.appendChild(tr);
    });

    body.querySelectorAll('[data-inscrever]').forEach((button) => {
      button.addEventListener('click', () => {
        window.location.href = `inscricao.html?cursoId=${button.getAttribute('data-inscrever')}`;
      });
    });
  } catch (error) {
    alert(`Não foi possível carregar cursos: ${error.message}`);
  }
}

async function initInscricaoPage() {
  const auth = requireAuth();
  if (!auth) return;
  setupProtectedPage(auth);

  const form = document.querySelector('#form-inscricao');
  const params = new URLSearchParams(window.location.search);
  const cursoId = params.get('cursoId');
  const detailsAlert = document.querySelector('#curso-detalhes');

  if (cursoId) {
    try {
      const curso = await request(`/cursos/${cursoId}`, { headers: authHeaders(false) });

      document.querySelector('#curso-info').textContent = `${curso.nome_curso} - ${curso.turno}`;
      document.querySelector('#unidade-info').textContent = curso?.id_unidade?.nome || '-';

      if (detailsAlert) {
        detailsAlert.classList.remove('hidden');
        detailsAlert.textContent = `Tipo: ${curso?.tipo || '-'} | Início: ${formatDate(curso?.data_inicio)} | Duração: ${curso?.duracao_meses || '-'} meses | Status: ${curso?.status || '-'}`;
      }
    } catch (error) {
      alert(`Falha ao carregar curso: ${error.message}`);
    }
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const escolaridade = document.querySelector('#escolaridade').value.trim();
    const unidadeManual = document.querySelector('#id-unidade-manual').value.trim();

    if (!cursoId) {
      alert('Selecione um curso antes de finalizar a inscrição.');
      return;
    }

    const payload = {
      id_usuario: { id: auth.usuario.id },
      id_curso: { id: Number(cursoId) },
      id_unidade: unidadeManual || 'Não informado',
      data_inscricao: new Date().toISOString().slice(0, 10),
      status_aprovacao: 'EM_ANALISE',
      escolaridade_declarada: escolaridade,
    };

    try {
      await request('/inscricoes', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      alert('Inscrição enviada com sucesso.');
      window.location.href = 'status.html';
    } catch (error) {
      alert(`Não foi possível concluir: ${error.message}`);
    }
  });
}

async function initStatusPage() {
  const auth = requireAuth();
  if (!auth) return;
  setupProtectedPage(auth);

  const statusText = document.querySelector('#status-atual');
  const body = document.querySelector('#status-body');
  const detailsCard = document.querySelector('#curso-detalhes-card');

  try {
    const inscricoes = await request('/inscricoes', { headers: authHeaders(false) });

    const minhas = inscricoes.filter((item) => item?.id_usuario?.id === auth.usuario.id);
    if (minhas.length === 0) {
      statusText.textContent = 'Sem inscrições enviadas.';
      body.innerHTML = '<tr><td colspan="5">Nenhuma inscrição encontrada.</td></tr>';
      return;
    }

    statusText.textContent = minhas[0].status_aprovacao;
    body.innerHTML = '';

    minhas.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item?.id_curso?.nome_curso || '-'}</td>
        <td>${item.id_unidade}</td>
        <td>${formatDate(item.data_inscricao)}</td>
        <td><span class="status">${item.status_aprovacao}</span></td>
        <td><button class="btn btn-soft" data-detalhes-curso="${item?.id_curso?.id || ''}">Ver detalhes</button></td>
      `;
      body.appendChild(tr);
    });

    body.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-detalhes-curso]');
      if (!button) return;

      const id = button.getAttribute('data-detalhes-curso');
      if (!id) {
        alert('Curso não encontrado para esta inscrição.');
        return;
      }

      try {
        const course = await request(`/cursos/${id}`, { headers: authHeaders(false) });
        fillCourseDetailsPanel(course, {
          name: '#detalhe-curso-nome',
          type: '#detalhe-curso-tipo',
          shift: '#detalhe-curso-turno',
          unit: '#detalhe-curso-unidade',
          start: '#detalhe-curso-inicio',
          duration: '#detalhe-curso-duracao',
          status: '#detalhe-curso-status',
        });
        detailsCard?.classList.remove('hidden');
      } catch (error) {
        alert(`Não foi possível carregar os detalhes: ${error.message}`);
      }
    });
  } catch (error) {
    alert(`Falha ao carregar status: ${error.message}`);
  }
}

function toDateInputValue(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

async function initPortalAlunoPage() {
  const auth = requireAuth();
  if (!auth) return;
  setupProtectedPage(auth);

  const form = document.querySelector('#form-perfil');

  try {
    const usuario = await request('/usuarios/me', { headers: authHeaders(false) });

    document.querySelector('#aluno-nome').textContent = usuario.nomeCompleto;
    document.querySelector('#aluno-email').textContent = usuario.email;
    document.querySelector('#aluno-cpf').textContent = usuario.cpf || '-';
    document.querySelector('#aluno-data-nascimento').textContent = formatDate(usuario.dataNascimento);

    document.querySelector('#perfil-nome').value = usuario.nomeCompleto || '';
    document.querySelector('#telefone').value = usuario.telefone || '';
    document.querySelector('#perfil-data-nascimento').value = toDateInputValue(usuario.dataNascimento);
  } catch (error) {
    alert(`Erro ao carregar seus dados: ${error.message}`);
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      nomeCompleto: document.querySelector('#perfil-nome').value.trim(),
      telefone: document.querySelector('#telefone').value.trim(),
      dataNascimento: document.querySelector('#perfil-data-nascimento').value || null,
    };

    try {
      const updated = await request('/usuarios/me', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const current = getAuth();
      setAuth({
        ...current,
        usuario: {
          ...current.usuario,
          nomeCompleto: updated.nomeCompleto,
          telefone: updated.telefone,
          dataNascimento: updated.dataNascimento,
        },
      });

      document.querySelector('#aluno-nome').textContent = updated.nomeCompleto;
      document.querySelector('#aluno-data-nascimento').textContent = formatDate(updated.dataNascimento);
      updateUserNameLabels();
      alert('Dados atualizados com sucesso.');
    } catch (error) {
      alert(`Não foi possível atualizar: ${error.message}`);
    }
  });
}

function setupSecretariaModuleTabs() {
  const buttons = Array.from(document.querySelectorAll('[data-module-target]'));
  const panels = Array.from(document.querySelectorAll('.module-panel'));

  const showModule = (moduleId) => {
    const visibleIds = new Set([moduleId, `${moduleId}-lista`]);

    panels.forEach((panel) => {
      panel.classList.toggle('hidden', !visibleIds.has(panel.id));
    });

    buttons.forEach((button) => {
      button.classList.toggle('active', button.getAttribute('data-module-target') === moduleId);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      showModule(button.getAttribute('data-module-target'));
    });
  });

  showModule('modulo-unidades');
}

function filterByQuery(items, query, mapper) {
  const normalized = normalizeText(query);
  if (!normalized) return items;
  return items.filter((item) => normalizeText(mapper(item)).includes(normalized));
}

async function initPortalSecretariaPage() {
  const auth = requireAuth('ROLE_ADMIN');
  if (!auth) return;
  setupProtectedPage(auth);
  setupSecretariaModuleTabs();

  const state = {
    unidades: [],
    cursos: [],
    usuarios: [],
    editais: [],
  };

  const unidadeForm = document.querySelector('#form-unidade');
  const cursoForm = document.querySelector('#form-curso');
  const usuarioForm = document.querySelector('#form-admin-user');
  const editalForm = document.querySelector('#form-edital');

  const unidadeIdInput = document.querySelector('#unidade-id');
  const cursoIdInput = document.querySelector('#curso-id');
  const usuarioIdInput = document.querySelector('#admin-user-id');
  const editalIdInput = document.querySelector('#edital-id');

  const usuarioSenhaInput = document.querySelector('#admin-user-senha');

  const renderUnidades = () => {
    const body = document.querySelector('#lista-unidades');
    const query = document.querySelector('#filtro-unidade-texto').value.trim();
    const stateFilter = normalizeText(document.querySelector('#filtro-unidade-estado').value.trim());

    let data = filterByQuery(state.unidades, query, (item) => `${item.nome} ${item.cnpj} ${item.cidade} ${item.estado}`);
    if (stateFilter) data = data.filter((item) => normalizeText(item.estado).includes(stateFilter));

    body.innerHTML = data
      .map(
        (item) => `
          <tr>
            <td>${item.nome}</td>
            <td>${item.cnpj || '-'}</td>
            <td>${item.cidade}/${item.estado}</td>
            <td>
              <div class="actions">
                <button class="btn btn-soft" data-unidade-edit="${item.id}">Editar</button>
                <button class="btn btn-danger" data-unidade-delete="${item.id}">Excluir</button>
              </div>
            </td>
          </tr>
        `
      )
      .join('');

    if (!body.innerHTML) body.innerHTML = '<tr><td colspan="4">Nenhuma unidade encontrada.</td></tr>';
  };

  const renderCursos = () => {
    const body = document.querySelector('#lista-cursos');
    const query = document.querySelector('#filtro-curso-texto').value.trim();
    const statusFilter = document.querySelector('#filtro-curso-status').value;

    let data = filterByQuery(state.cursos, query, (item) => `${item.nome_curso} ${item.tipo} ${item.turno} ${item?.id_unidade?.nome || ''}`);
    if (statusFilter !== 'TODOS') data = data.filter((item) => item.status === statusFilter);

    body.innerHTML = data
      .map(
        (item) => `
          <tr>
            <td>${item.nome_curso}</td>
            <td>${item?.id_unidade?.nome || '-'}</td>
            <td>${item.turno}</td>
            <td>${item.status}</td>
            <td>
              <div class="actions">
                <button class="btn btn-soft" data-curso-edit="${item.id}">Editar</button>
                <button class="btn btn-danger" data-curso-delete="${item.id}">Excluir</button>
              </div>
            </td>
          </tr>
        `
      )
      .join('');

    if (!body.innerHTML) body.innerHTML = '<tr><td colspan="5">Nenhum curso encontrado.</td></tr>';
  };

  const renderUsuarios = () => {
    const body = document.querySelector('#lista-usuarios');
    const query = document.querySelector('#filtro-usuario-texto').value.trim();
    const roleFilter = document.querySelector('#filtro-usuario-role').value;

    let data = filterByQuery(state.usuarios, query, (item) => `${item.nomeCompleto} ${item.email} ${item.cpf || ''} ${item.telefone || ''}`);
    if (roleFilter !== 'TODOS') data = data.filter((item) => item.role === roleFilter);

    body.innerHTML = data
      .map(
        (item) => `
          <tr>
            <td>${item.nomeCompleto}</td>
            <td>${item.email}</td>
            <td>${item.role}</td>
            <td>
              <div class="actions">
                <button class="btn btn-soft" data-usuario-edit="${item.id}">Editar</button>
                <button class="btn btn-danger" data-usuario-delete="${item.id}">Excluir</button>
              </div>
            </td>
          </tr>
        `
      )
      .join('');

    if (!body.innerHTML) body.innerHTML = '<tr><td colspan="4">Nenhum usuário encontrado.</td></tr>';
  };

  const renderEditais = () => {
    const body = document.querySelector('#lista-editais');
    const query = document.querySelector('#filtro-edital-texto').value.trim();
    const statusFilter = document.querySelector('#filtro-edital-status').value;

    let data = filterByQuery(state.editais, query, (item) => `${item.titulo} ${item.url}`);
    if (statusFilter !== 'TODOS') data = data.filter((item) => (item.ativo ? 'ATIVO' : 'INATIVO') === statusFilter);

    body.innerHTML = data
      .map(
        (item) => `
          <tr>
            <td>${item.titulo}</td>
            <td><a href="${item.url}" target="_blank" rel="noopener noreferrer">Abrir link</a></td>
            <td>${item.ativo ? 'ATIVO' : 'INATIVO'}</td>
            <td>
              <div class="actions">
                <button class="btn btn-soft" data-edital-edit="${item.id}">Editar</button>
                <button class="btn btn-danger" data-edital-delete="${item.id}">Excluir</button>
              </div>
            </td>
          </tr>
        `
      )
      .join('');

    if (!body.innerHTML) body.innerHTML = '<tr><td colspan="4">Nenhum edital encontrado.</td></tr>';
  };

  const renderAll = () => {
    renderUnidades();
    renderCursos();
    renderUsuarios();
    renderEditais();
  };

  const resetUnidadeForm = () => {
    unidadeForm.reset();
    unidadeIdInput.value = '';
  };

  const resetCursoForm = () => {
    cursoForm.reset();
    cursoIdInput.value = '';
  };

  const resetUsuarioForm = () => {
    usuarioForm.reset();
    usuarioIdInput.value = '';
    usuarioSenhaInput.required = true;
    usuarioSenhaInput.disabled = false;
    usuarioSenhaInput.placeholder = '';
  };

  const resetEditalForm = () => {
    editalForm.reset();
    editalIdInput.value = '';
    document.querySelector('#edital-ativo').value = 'true';
  };

  const reloadData = async () => {
    const [unidades, cursos, usuarios, editais] = await Promise.all([
      request('/unidades', { headers: authHeaders(false) }),
      request('/cursos', { headers: authHeaders(false) }),
      request('/usuarios', { headers: authHeaders(false) }),
      request('/editais', { headers: authHeaders(false) }),
    ]);

    state.unidades = unidades;
    state.cursos = cursos;
    state.usuarios = usuarios;
    state.editais = editais;

    const unidadeSelect = document.querySelector('#curso-unidade');
    unidadeSelect.innerHTML = '';
    state.unidades.forEach((unidade) => {
      const option = document.createElement('option');
      option.value = unidade.id;
      option.textContent = `${unidade.nome} (${unidade.cidade}/${unidade.estado})`;
      unidadeSelect.appendChild(option);
    });

    renderAll();
  };

  try {
    await reloadData();
  } catch (error) {
    alert(`Erro ao carregar dados administrativos: ${error.message}`);
  }

  document.querySelectorAll(
    '#filtro-unidade-texto, #filtro-unidade-estado, #filtro-curso-texto, #filtro-curso-status, #filtro-usuario-texto, #filtro-usuario-role, #filtro-edital-texto, #filtro-edital-status'
  ).forEach((field) => {
    field.addEventListener('input', renderAll);
    field.addEventListener('change', renderAll);
  });

  unidadeForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = unidadeIdInput.value.trim();
    const payload = {
      nome: document.querySelector('#unidade-nome').value.trim(),
      cnpj: document.querySelector('#unidade-cnpj').value.trim(),
      estado: document.querySelector('#unidade-estado').value.trim(),
      cidade: document.querySelector('#unidade-cidade').value.trim(),
    };

    try {
      await request(id ? `/unidades/${id}` : '/unidades', {
        method: id ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      resetUnidadeForm();
      await reloadData();
    } catch (error) {
      alert(`Falha ao salvar unidade: ${error.message}`);
    }
  });

  cursoForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = cursoIdInput.value.trim();
    const payload = {
      id_unidade: { id: Number(document.querySelector('#curso-unidade').value) },
      nome_curso: document.querySelector('#curso-nome').value.trim(),
      tipo: document.querySelector('#curso-tipo').value.trim(),
      turno: document.querySelector('#curso-turno').value,
      data_inicio: document.querySelector('#curso-data').value,
      duracao_meses: Number(document.querySelector('#curso-duracao').value),
      status: document.querySelector('#curso-status').value,
    };

    try {
      await request(id ? `/cursos/${id}` : '/cursos', {
        method: id ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      resetCursoForm();
      await reloadData();
    } catch (error) {
      alert(`Falha ao salvar curso: ${error.message}`);
    }
  });

  usuarioForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = usuarioIdInput.value.trim();

    const createPayload = {
      nomeCompleto: document.querySelector('#admin-user-nome').value.trim(),
      email: document.querySelector('#admin-user-email').value.trim(),
      senha: document.querySelector('#admin-user-senha').value.trim(),
      cpf: document.querySelector('#admin-user-cpf').value.trim(),
      telefone: document.querySelector('#admin-user-telefone').value.trim(),
      dataNascimento: document.querySelector('#admin-user-data-nascimento').value || null,
      role: document.querySelector('#admin-user-role').value,
    };

    const updatePayload = {
      nomeCompleto: createPayload.nomeCompleto,
      email: createPayload.email,
      cpf: createPayload.cpf,
      telefone: createPayload.telefone,
      dataNascimento: createPayload.dataNascimento,
      role: createPayload.role,
    };

    try {
      await request(id ? `/usuarios/${id}` : '/usuarios/admin', {
        method: id ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(id ? updatePayload : createPayload),
      });

      resetUsuarioForm();
      await reloadData();
    } catch (error) {
      alert(`Falha ao salvar usuário: ${error.message}`);
    }
  });

  editalForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = editalIdInput.value.trim();
    const payload = {
      titulo: document.querySelector('#edital-titulo').value.trim(),
      url: document.querySelector('#edital-url').value.trim(),
      ativo: document.querySelector('#edital-ativo').value === 'true',
    };

    try {
      await request(id ? `/editais/${id}` : '/editais', {
        method: id ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      resetEditalForm();
      await reloadData();
    } catch (error) {
      alert(`Falha ao salvar edital: ${error.message}`);
    }
  });

  document.querySelector('#cancelar-unidade')?.addEventListener('click', resetUnidadeForm);
  document.querySelector('#cancelar-curso')?.addEventListener('click', resetCursoForm);
  document.querySelector('#cancelar-usuario')?.addEventListener('click', resetUsuarioForm);
  document.querySelector('#cancelar-edital')?.addEventListener('click', resetEditalForm);

  document.querySelector('#lista-unidades')?.addEventListener('click', async (event) => {
    const editBtn = event.target.closest('[data-unidade-edit]');
    const deleteBtn = event.target.closest('[data-unidade-delete]');

    if (editBtn) {
      const id = Number(editBtn.getAttribute('data-unidade-edit'));
      const unidade = state.unidades.find((item) => item.id === id);
      if (!unidade) return;

      unidadeIdInput.value = unidade.id;
      document.querySelector('#unidade-nome').value = unidade.nome || '';
      document.querySelector('#unidade-cnpj').value = unidade.cnpj || '';
      document.querySelector('#unidade-estado').value = unidade.estado || '';
      document.querySelector('#unidade-cidade').value = unidade.cidade || '';
      return;
    }

    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-unidade-delete');
      if (!confirm('Deseja excluir esta unidade?')) return;

      try {
        await request(`/unidades/${id}`, { method: 'DELETE', headers: authHeaders(false) });
        await reloadData();
      } catch (error) {
        alert(`Falha ao excluir unidade: ${error.message}`);
      }
    }
  });

  document.querySelector('#lista-cursos')?.addEventListener('click', async (event) => {
    const editBtn = event.target.closest('[data-curso-edit]');
    const deleteBtn = event.target.closest('[data-curso-delete]');

    if (editBtn) {
      const id = Number(editBtn.getAttribute('data-curso-edit'));
      const curso = state.cursos.find((item) => item.id === id);
      if (!curso) return;

      cursoIdInput.value = curso.id;
      document.querySelector('#curso-unidade').value = String(curso?.id_unidade?.id || '');
      document.querySelector('#curso-nome').value = curso.nome_curso || '';
      document.querySelector('#curso-tipo').value = curso.tipo || '';
      document.querySelector('#curso-turno').value = curso.turno || 'Manhã';
      document.querySelector('#curso-data').value = toDateInputValue(curso.data_inicio);
      document.querySelector('#curso-duracao').value = curso.duracao_meses || 1;
      document.querySelector('#curso-status').value = curso.status || 'ATIVO';
      return;
    }

    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-curso-delete');
      if (!confirm('Deseja excluir este curso?')) return;

      try {
        await request(`/cursos/${id}`, { method: 'DELETE', headers: authHeaders(false) });
        await reloadData();
      } catch (error) {
        alert(`Falha ao excluir curso: ${error.message}`);
      }
    }
  });

  document.querySelector('#lista-usuarios')?.addEventListener('click', async (event) => {
    const editBtn = event.target.closest('[data-usuario-edit]');
    const deleteBtn = event.target.closest('[data-usuario-delete]');

    if (editBtn) {
      const id = Number(editBtn.getAttribute('data-usuario-edit'));
      const usuario = state.usuarios.find((item) => item.id === id);
      if (!usuario) return;

      usuarioIdInput.value = usuario.id;
      document.querySelector('#admin-user-nome').value = usuario.nomeCompleto || '';
      document.querySelector('#admin-user-email').value = usuario.email || '';
      document.querySelector('#admin-user-cpf').value = usuario.cpf || '';
      document.querySelector('#admin-user-telefone').value = usuario.telefone || '';
      document.querySelector('#admin-user-data-nascimento').value = toDateInputValue(usuario.dataNascimento);
      document.querySelector('#admin-user-role').value = usuario.role || 'ROLE_USER';

      usuarioSenhaInput.required = false;
      usuarioSenhaInput.disabled = true;
      usuarioSenhaInput.placeholder = 'Senha não é alterada nesta edição';
      usuarioSenhaInput.value = '';
      return;
    }

    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-usuario-delete');
      if (!confirm('Deseja excluir este usuário?')) return;

      try {
        await request(`/usuarios/${id}`, { method: 'DELETE', headers: authHeaders(false) });
        await reloadData();
      } catch (error) {
        alert(`Falha ao excluir usuário: ${error.message}`);
      }
    }
  });

  document.querySelector('#lista-editais')?.addEventListener('click', async (event) => {
    const editBtn = event.target.closest('[data-edital-edit]');
    const deleteBtn = event.target.closest('[data-edital-delete]');

    if (editBtn) {
      const id = Number(editBtn.getAttribute('data-edital-edit'));
      const edital = state.editais.find((item) => item.id === id);
      if (!edital) return;

      editalIdInput.value = edital.id;
      document.querySelector('#edital-titulo').value = edital.titulo || '';
      document.querySelector('#edital-url').value = edital.url || '';
      document.querySelector('#edital-ativo').value = edital.ativo ? 'true' : 'false';
      return;
    }

    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-edital-delete');
      if (!confirm('Deseja excluir este edital?')) return;

      try {
        await request(`/editais/${id}`, { method: 'DELETE', headers: authHeaders(false) });
        await reloadData();
      } catch (error) {
        alert(`Falha ao excluir edital: ${error.message}`);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  if (page === 'login') initLoginPage();
  if (page === 'home') initHomePage();
  if (page === 'inscricao') initInscricaoPage();
  if (page === 'status') initStatusPage();
  if (page === 'portal-aluno') initPortalAlunoPage();
  if (page === 'portal-secretaria') initPortalSecretariaPage();
});

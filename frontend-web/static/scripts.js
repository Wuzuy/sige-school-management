const API_BASE = 'http://localhost:8080/api';

// ========== SISTEMA DE NOTIFICAÇÕES TOAST (NOTYF) ==========

// Inicializar Notyf com configurações customizadas
let notyf;

function initNotyf() {
  if (typeof Notyf === 'undefined') {
    console.warn('Notyf não está carregado. Verifique se o CDN está acessível.');
    return;
  }

  notyf = new Notyf({
    duration: 5000,
    position: { x: 'right', y: 'top' },
    dismissible: true,
    ripple: true,
    types: [
      {
        type: 'success',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        icon: {
          className: 'notyf__icon--success',
          tagName: 'span',
          text: '✓'
        }
      },
      {
        type: 'error',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        icon: {
          className: 'notyf__icon--error',
          tagName: 'span',
          text: '✕'
        }
      },
      {
        type: 'warning',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        icon: {
          className: 'notyf__icon--warning',
          tagName: 'span',
          text: '⚠'
        }
      },
      {
        type: 'info',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        icon: {
          className: 'notyf__icon--info',
          tagName: 'span',
          text: 'ℹ'
        }
      }
    ]
  });
}

/**
 * Mostra uma notificação toast usando Notyf
 * @param {string} message - Mensagem principal
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duração em ms (padrão: 5000)
 */
function showNotification(message, type = 'info', duration = 5000) {
  if (!notyf) initNotyf();
  if (!notyf) {
    // Fallback se Notyf não estiver disponível
    console.log(`[${type.toUpperCase()}] ${message}`);
    return;
  }

  // Parsear mensagem se for erro (pode vir como JSON)
  const cleanMessage = type === 'error' ? parseErrorMessage(message) : message;

  notyf.open({
    type: type,
    message: cleanMessage,
    duration: duration
  });
}

// Atalhos para tipos comuns
function showSuccess(message) {
  showNotification(message, 'success', 5000);
}

function showError(message) {
  showNotification(message, 'error', 7000);
}

function showWarning(message) {
  showNotification(message, 'warning', 6000);
}

function showInfo(message) {
  showNotification(message, 'info', 5000);
}

// ========== FUNÇÕES DE SEGURANÇA ==========

/**
 * Sanitiza string para prevenir XSS
 */
function sanitizeHTML(str) {
  if (!str) return '';
  const temp = document.createElement('div');
  temp.textContent = String(str);
  return temp.innerHTML;
}

/**
 * Parseia mensagens de erro que podem vir como JSON
 * @param {string} errorMessage - Mensagem de erro bruta
 * @returns {string} - Mensagem limpa e legível
 */
function parseErrorMessage(errorMessage) {
  if (!errorMessage) return 'Ocorreu um erro desconhecido.';
  
  // Converte para string se não for
  const msgStr = String(errorMessage);
  
  // Tenta detectar se é um JSON (começa com { ou [)
  if (msgStr.trim().startsWith('{') || msgStr.trim().startsWith('[')) {
    try {
      const jsonObj = JSON.parse(msgStr);
      // Procura por campos comuns de erro
      return jsonObj.erro || jsonObj.error || jsonObj.message || jsonObj.msg || 'Erro ao processar solicitação.';
    } catch (e) {
      // Se não conseguir parsear, tenta extrair texto entre aspas
      const match = msgStr.match(/["']erro["']\s*:\s*["']([^"']+)["']/);
      if (match) return match[1];
      
      const match2 = msgStr.match(/["']error["']\s*:\s*["']([^"']+)["']/);
      if (match2) return match2[1];
      
      const match3 = msgStr.match(/["']message["']\s*:\s*["']([^"']+)["']/);
      if (match3) return match3[1];
    }
  }
  
  // Remove caracteres técnicos comuns
  let cleaned = msgStr
    .replace(/^[{\[]/, '') // Remove { ou [ do início
    .replace(/[}\]]$/, '') // Remove } ou ] do final
    .replace(/["']/g, '') // Remove aspas
    .replace(/erro:|error:|message:/gi, '') // Remove prefixos
    .trim();
  
  // Se ficou muito curto ou vazio, retorna mensagem genérica
  if (cleaned.length < 5) {
    return 'Ocorreu um erro ao processar sua solicitação.';
  }
  
  // Limita tamanho para evitar mensagens gigantes
  if (cleaned.length > 200) {
    cleaned = cleaned.substring(0, 200) + '...';
  }
  
  return cleaned;
}

/**
 * Valida email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && emailRegex.test(email);
}

/**
 * Valida CPF (formato básico)
 */
function isValidCPF(cpf) {
  if (!cpf) return false;
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  return cleanCPF.length === 11;
}

/**
 * Valida senha forte
 */
function isStrongPassword(password) {
  if (!password || password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[@#$%^&+=!]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
}

/**
 * Mensagem de requisitos de senha
 */
function getPasswordRequirements() {
  return 'A senha deve conter no mínimo 8 caracteres, incluindo: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (@#$%^&+=!)';
}

/**
 * Valida e sanitiza input de texto
 */
function sanitizeInput(value) {
  if (!value) return '';
  return String(value).trim().slice(0, 500); // Limita tamanho
}

/**
 * Valida token JWT
 */
function isValidToken(token) {
  if (!token || typeof token !== 'string') return false;
  // JWT tem 3 partes separadas por pontos
  const parts = token.split('.');
  return parts.length === 3;
}

// ========== FUNÇÕES DE AUTENTICAÇÃO ==========

function getAuth() {
  const raw = localStorage.getItem('auth');
  if (!raw) return null;
  try {
    const auth = JSON.parse(raw);
    // Valida estrutura do auth
    if (!auth || !auth.token || !auth.usuario) {
      clearAuth();
      return null;
    }
    // Valida token
    if (!isValidToken(auth.token)) {
      clearAuth();
      return null;
    }
    return auth;
  } catch (e) {
    clearAuth();
    return null;
  }
}

function setAuth(auth) {
  if (!auth || !auth.token || !auth.usuario) {
    console.error('Tentativa de salvar auth inválido');
    return;
  }
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

// ========== FUNÇÕES AUXILIARES ==========

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
  const name = sanitizeHTML(getAuth()?.usuario?.nomeCompleto) || 'Visitante';
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

function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.nav-overlay');

  if (!menuToggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    const isOpen = nav.classList.toggle('open');
    if (overlay) overlay.classList.toggle('visible', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Fechar ao clicar em um link
  nav.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('click', closeMenu);
  });

  // Fechar ao clicar no overlay
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Fechar ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
    }
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

  // Verificar se estamos na página de login para usar estilo especial
  const isLoginPage = document.body.dataset.page === 'login';

  editais.forEach((edital) => {
    const link = document.createElement('a');
    link.href = edital.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = isLoginPage ? 'btn btn-edital' : 'btn btn-soft';
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
      showError(`Não foi possível logar: ${error.message}`);
    }
  });

  registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nomeCompleto = sanitizeInput(document.querySelector('#register-nome').value);
    const email = sanitizeInput(document.querySelector('#register-email').value);
    const senha = document.querySelector('#register-senha').value.trim();
    const confirmar = document.querySelector('#register-confirmar').value.trim();

    // Validações de segurança
    if (!nomeCompleto || nomeCompleto.length < 3) {
      showWarning('Nome completo deve ter pelo menos 3 caracteres.');
      return;
    }

    if (!isValidEmail(email)) {
      showWarning('Por favor, insira um email válido.');
      return;
    }

    if (!isStrongPassword(senha)) {
      showWarning(getPasswordRequirements(), 'Senha Inválida');
      return;
    }

    if (senha !== confirmar) {
      showWarning('As senhas não conferem.');
      return;
    }

    try {
      await request('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeCompleto, email, senha }),
      });

      showSuccess('Cadastro realizado com sucesso! Faça o login para continuar.', 'Bem-vindo!');
      registerForm.reset();
      activate('login');
    } catch (error) {
      showError(`Falha no cadastro: ${error.message}`);
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
    const [cursos, inscricoes] = await Promise.all([
      request('/cursos', { headers: authHeaders(false) }),
      request('/inscricoes', { headers: authHeaders(false) })
    ]);

    // Filtrar apenas cursos ativos
    const cursosAtivos = cursos.filter(curso => curso.status === 'ATIVO');

    // IDs dos cursos em que o usuário já está inscrito
    const cursosInscritos = new Set(
      inscricoes
        .filter(insc => insc?.id_usuario?.id === auth.usuario.id)
        .map(insc => insc?.id_curso?.id)
    );

    body.innerHTML = '';

    cursosAtivos.forEach((curso) => {
      const jaInscrito = cursosInscritos.has(curso.id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${curso?.id_unidade?.nome || '-'}</td>
        <td>${curso.nome_curso}</td>
        <td>${curso.turno}</td>
        <td>${formatDate(curso.data_inicio)}</td>
        <td>${curso.duracao_meses} meses</td>
        <td>
          ${jaInscrito 
            ? '<span class="status" style="background: #d1fae5; color: #065f46;">Já inscrito</span>' 
            : `<button class="btn btn-primary" data-inscrever="${curso.id}">Inscrever-se</button>`
          }
        </td>
      `;
      body.appendChild(tr);
    });

    if (cursosAtivos.length === 0) {
      body.innerHTML = '<tr><td colspan="6">Nenhum curso ativo disponível no momento.</td></tr>';
    }

    body.querySelectorAll('[data-inscrever]').forEach((button) => {
      button.addEventListener('click', () => {
        window.location.href = `inscricao.html?cursoId=${button.getAttribute('data-inscrever')}`;
      });
    });
  } catch (error) {
    showError(`Não foi possível carregar cursos: ${error.message}`);
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

  // Redirecionar se não há curso selecionado
  if (!cursoId) {
    showWarning('Por favor, selecione um curso antes de preencher a inscrição.');
    setTimeout(() => window.location.href = 'index.html', 2000);
    return;
  }

  try {
    // Carregar dados do curso e do usuário em paralelo
    const [curso, usuario] = await Promise.all([
      request(`/cursos/${cursoId}`, { headers: authHeaders(false) }),
      request('/usuarios/me', { headers: authHeaders(false) })
    ]);

    // Preencher informações do curso
    document.querySelector('#curso-info').textContent = `${curso.nome_curso} - ${curso.turno}`;
    document.querySelector('#unidade-info').textContent = curso?.id_unidade?.nome || '-';

    if (detailsAlert) {
      detailsAlert.classList.remove('hidden');
      detailsAlert.textContent = `Tipo: ${curso?.tipo || '-'} | Início: ${formatDate(curso?.data_inicio)} | Duração: ${curso?.duracao_meses || '-'} meses | Status: ${curso?.status || '-'}`;
    }

    // Preencher formulário com dados do usuário
    document.querySelector('#nome-completo').value = usuario.nomeCompleto || '';
    document.querySelector('#cpf').value = usuario.cpf || '';
    document.querySelector('#telefone-contato').value = usuario.telefone || '';
    document.querySelector('#email-contato').value = usuario.email || '';
    document.querySelector('#data-nascimento').value = toDateInputValue(usuario.dataNascimento);

    // RG não está no modelo atual, deixar vazio
    document.querySelector('#rg').value = '';
  } catch (error) {
    showError(`Falha ao carregar dados: ${error.message}`);
    setTimeout(() => window.location.href = 'index.html', 2000);
    return;
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nomeCompleto = document.querySelector('#nome-completo').value.trim();
    const rg = document.querySelector('#rg').value.trim();
    const cpf = document.querySelector('#cpf').value.trim();
    const telefone = document.querySelector('#telefone-contato').value.trim();
    const email = document.querySelector('#email-contato').value.trim();
    const dataNascimento = document.querySelector('#data-nascimento').value;
    const escolaridade = document.querySelector('#escolaridade').value.trim();

    if (!cursoId) {
      showError('Erro: curso não identificado.');
      return;
    }

    const payload = {
      id_usuario: { id: auth.usuario.id },
      id_curso: { id: Number(cursoId) },
      id_unidade: '', // Será definido pelo curso
      data_inscricao: new Date().toISOString().slice(0, 10),
      status_aprovacao: 'EM_ANALISE',
      escolaridade_declarada: escolaridade,
      // Campos adicionais (precisaremos ajustar o backend para aceitar)
      nome_completo_inscricao: nomeCompleto,
      rg_inscricao: rg,
      cpf_inscricao: cpf,
      telefone_inscricao: telefone,
      email_inscricao: email,
      data_nascimento_inscricao: dataNascimento
    };

    try {
      await request('/inscricoes', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      showSuccess('Inscrição enviada com sucesso! Acompanhe o status na aba Status.', 'Enviado!');
      setTimeout(() => window.location.href = 'status.html', 2000);
    } catch (error) {
      showError(`Não foi possível concluir a inscrição: ${error.message}`);
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
  const etapasCard = document.querySelector('#etapas-card');
  const timeline = document.querySelector('#timeline-etapas');

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
      
      // Verificar se há matrícula disponível para aceite
      const btnMatricula = item.status_matricula === 'AGUARDANDO_ACEITE' 
        ? `<a href="matricula.html?inscricaoId=${item.id}" class="btn btn-primary" style="margin-left: 8px; font-size: 0.85rem;">Aceitar Matrícula</a>`
        : '';
      
      tr.innerHTML = `
        <td>${item?.id_curso?.nome_curso || '-'}</td>
        <td>${item.id_unidade}</td>
        <td>${formatDate(item.data_inscricao)}</td>
        <td><span class="status">${item.status_aprovacao}</span></td>
        <td>
          <button class="btn btn-soft" data-detalhes-inscricao="${item.id}">Ver detalhes</button>
          ${btnMatricula}
        </td>
      `;
      body.appendChild(tr);
    });

    body.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-detalhes-inscricao]');
      if (!button) return;

      const idInscricao = button.getAttribute('data-detalhes-inscricao');
      const inscricao = minhas.find(i => i.id === Number(idInscricao));
      
      if (!inscricao) {
        showWarning('Inscrição não encontrada.');
        return;
      }

      const cursoId = inscricao?.id_curso?.id;
      if (!cursoId) {
        showWarning('Curso não identificado para esta inscrição.');
        return;
      }

      try {
        const course = await request(`/cursos/${cursoId}`, { headers: authHeaders(false) });
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

        // Renderizar timeline de etapas
        renderTimelineEtapas(timeline, inscricao);
        etapasCard?.classList.remove('hidden');

        // Scroll suave até os detalhes
        etapasCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (error) {
        showError(`Não foi possível carregar os detalhes: ${error.message}`);
      }
    });
  } catch (error) {
    showError(`Falha ao carregar status: ${error.message}`);
  }
}

function renderTimelineEtapas(container, inscricao) {
  if (!container) return;

  const etapas = [
    {
      numero: 1,
      titulo: 'Inscrição Realizada',
      descricao: `Sua inscrição foi enviada em ${formatDate(inscricao.data_inscricao)}`,
      data: formatDate(inscricao.data_inscricao),
      status: 'concluida'
    },
    {
      numero: 2,
      titulo: 'Análise de Inscrição',
      descricao: `Status: ${inscricao.status_aprovacao}`,
      data: inscricao.status_aprovacao === 'APROVADA' ? 'Aprovada' : 'Em análise',
      status: inscricao.status_aprovacao === 'APROVADA' ? 'concluida' : 
              inscricao.status_aprovacao === 'REPROVADA' ? 'pendente' : 'em-andamento'
    }
  ];

  // Adicionar etapa de prova se estiver definida
  if (inscricao.realiza_prova === 'SIM' && inscricao.data_prova) {
    etapas.push({
      numero: 3,
      titulo: 'Prova do Processo Seletivo',
      descricao: inscricao.situacao_aprovacao_prova 
        ? `Resultado: ${inscricao.situacao_aprovacao_prova}` 
        : 'Aguardando realização da prova',
      data: `Data: ${formatDate(inscricao.data_prova)}`,
      status: inscricao.situacao_aprovacao_prova === 'APROVADO' ? 'concluida' :
              inscricao.situacao_aprovacao_prova === 'REPROVADO' ? 'pendente' :
              new Date(inscricao.data_prova) < new Date() ? 'em-andamento' : 'pendente'
    });
  } else if (inscricao.realiza_prova === 'NAO') {
    etapas.push({
      numero: 3,
      titulo: 'Prova do Processo Seletivo',
      descricao: 'Não há prova para este curso',
      data: '',
      status: 'concluida'
    });
  }

  // Adicionar etapa de lista de espera se aplicável
  if (inscricao.lista_espera === 'SIM') {
    etapas.push({
      numero: etapas.length + 1,
      titulo: 'Lista de Espera',
      descricao: 'Você está na lista de espera. Aguarde convocação.',
      data: '',
      status: 'em-andamento'
    });
  }

  // Adicionar etapa de matrícula
  if (inscricao.status_matricula) {
    const statusMatricula = inscricao.status_matricula;
    etapas.push({
      numero: etapas.length + 1,
      titulo: 'Matrícula',
      descricao: `Status: ${statusMatricula}`,
      data: inscricao.data_aceite_matricula ? `Aceita em: ${formatDate(inscricao.data_aceite_matricula)}` : '',
      status: statusMatricula === 'CONCLUIDA' ? 'concluida' :
              statusMatricula === 'RECUSADA' ? 'pendente' : 'em-andamento'
    });
  }

  container.innerHTML = etapas.map(etapa => `
    <div class="etapa-item ${etapa.status}">
      <div class="etapa-icon">${etapa.numero}</div>
      <div class="etapa-content">
        <div class="etapa-titulo">${etapa.titulo}</div>
        <div class="etapa-descricao">${etapa.descricao}</div>
        ${etapa.data ? `<div class="etapa-data">${etapa.data}</div>` : ''}
      </div>
    </div>
  `).join('');
}

function toDateInputValue(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

async function initMatriculaPage() {
  const auth = requireAuth();
  if (!auth) return;
  setupProtectedPage(auth);

  const params = new URLSearchParams(window.location.search);
  const inscricaoId = params.get('inscricaoId');

  if (!inscricaoId) {
    showWarning('Inscrição não identificada. Redirecionando...');
    setTimeout(() => window.location.href = 'status.html', 2000);
    return;
  }

  try {
    // Buscar dados da inscrição
    const inscricao = await request(`/inscricoes/${inscricaoId}`, { headers: authHeaders(false) });

    // Verificar se a inscrição pertence ao usuário logado
    if (inscricao.id_usuario.id !== auth.usuario.id) {
      showError('Acesso não autorizado a esta matrícula.');
      setTimeout(() => window.location.href = 'status.html', 2000);
      return;
    }

    // Verificar se o status permite matrícula
    if (inscricao.status_matricula !== 'AGUARDANDO_ACEITE') {
      showWarning('Esta matrícula não está disponível para aceite.');
      setTimeout(() => window.location.href = 'status.html', 2000);
      return;
    }

    // Popular dados do aluno
    document.querySelector('#mat-aluno-nome').textContent = inscricao.nome_completo_inscricao || auth.usuario.nomeCompleto;
    document.querySelector('#mat-aluno-cpf').textContent = inscricao.cpf_inscricao || auth.usuario.cpf || '-';
    document.querySelector('#mat-aluno-email').textContent = inscricao.email_inscricao || auth.usuario.email;

    // Popular dados do curso
    document.querySelector('#curso-matricula-nome').textContent = inscricao.id_curso.nome_curso;
    document.querySelector('#mat-curso-nome').textContent = inscricao.id_curso.nome_curso;
    document.querySelector('#mat-curso-turno').textContent = inscricao.id_curso.turno;
    document.querySelector('#mat-curso-inicio').textContent = formatDate(inscricao.id_curso.data_inicio);

    // Popular dados do contrato
    document.querySelector('#contrato-aluno').textContent = inscricao.nome_completo_inscricao || auth.usuario.nomeCompleto;
    document.querySelector('#contrato-cpf').textContent = inscricao.cpf_inscricao || auth.usuario.cpf || '-';
    document.querySelector('#contrato-curso').textContent = inscricao.id_curso.nome_curso;
    document.querySelector('#contrato-turno').textContent = inscricao.id_curso.turno;
    document.querySelector('#contrato-duracao').textContent = inscricao.id_curso.duracao_meses || '-';
    document.querySelector('#contrato-data').textContent = new Date().toLocaleDateString('pt-BR');

    // Armazenar ID da inscrição no campo hidden
    document.querySelector('#inscricao-id-matricula').value = inscricaoId;

    // Handler de aceite de matrícula
    document.querySelector('#form-aceite-matricula')?.addEventListener('submit', async (event) => {
      event.preventDefault();

      const aceiteTermos = document.querySelector('#aceite-termos').checked;
      const aceiteVeracidade = document.querySelector('#aceite-veracidade').checked;

      if (!aceiteTermos || !aceiteVeracidade) {
        showWarning('Você precisa concordar com os termos para continuar.');
        return;
      }

      try {
        await request(`/inscricoes/${inscricaoId}/matricula`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({
            status_matricula: 'ACEITA',
            data_aceite_matricula: new Date().toISOString().slice(0, 10)
          })
        });

        // Mostrar mensagem de sucesso e ocultar formulário
        document.querySelector('.card').classList.add('hidden');
        document.querySelector('#mensagem-sucesso').classList.remove('hidden');
      } catch (error) {
        showError(`Erro ao aceitar matrícula: ${error.message}`);
      }
    });

    // Handler de recusa de matrícula
    document.querySelector('#recusar-matricula')?.addEventListener('click', async () => {
      if (!confirm('Tem certeza que deseja recusar esta matrícula? Esta ação não pode ser desfeita.')) {
        return;
      }

      try {
        await request(`/inscricoes/${inscricaoId}/matricula`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({
            status_matricula: 'RECUSADA',
            data_aceite_matricula: new Date().toISOString().slice(0, 10)
          })
        });

        showInfo('Matrícula recusada.');
        setTimeout(() => window.location.href = 'status.html', 2000);
      } catch (error) {
        showError(`Erro ao recusar matrícula: ${error.message}`);
      }
    });

  } catch (error) {
    showError(`Falha ao carregar dados da matrícula: ${error.message}`);
    setTimeout(() => window.location.href = 'status.html', 2000);
  }
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
    showError(`Erro ao carregar seus dados: ${error.message}`);
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
      showSuccess('Dados atualizados com sucesso.');
    } catch (error) {
      showError(`Não foi possível atualizar: ${error.message}`);
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
    inscricoes: [],
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
    const unidadeFilter = document.querySelector('#filtro-curso-unidade')?.value || 'TODAS';

    let data = filterByQuery(state.cursos, query, (item) => `${item.nome_curso} ${item.tipo} ${item.turno}`);
    if (statusFilter !== 'TODOS') data = data.filter((item) => item.status === statusFilter);
    if (unidadeFilter !== 'TODAS' && unidadeFilter) {
      data = data.filter((item) => String(item?.id_unidade?.id) === String(unidadeFilter));
    }

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

  const renderInscricoes = () => {
    const body = document.querySelector('#lista-inscricoes');
    if (!body) return; // Se não existir o elemento, sai da função
    
    const query = document.querySelector('#filtro-inscricao-texto')?.value.trim() || '';
    const statusFilter = document.querySelector('#filtro-inscricao-status')?.value || 'TODOS';
    const cursoFilter = document.querySelector('#filtro-inscricao-curso')?.value || 'TODOS';

    let data = filterByQuery(state.inscricoes, query, (item) => 
      `${item?.id_usuario?.nomeCompleto || ''} ${item?.id_usuario?.cpf || ''}`
    );
    
    if (statusFilter !== 'TODOS') {
      data = data.filter((item) => item.status_aprovacao === statusFilter);
    }

    if (cursoFilter !== 'TODOS' && cursoFilter) {
      data = data.filter((item) => String(item?.id_curso?.id) === String(cursoFilter));
    }

    body.innerHTML = data
      .map((item) => {
        const aluno = item?.id_usuario?.nomeCompleto || 'N/A';
        const curso = item?.id_curso?.nome_curso || 'N/A';
        const dataInscricao = item?.data_inscricao ? new Date(item.data_inscricao).toLocaleDateString('pt-BR') : '-';
        const status = item?.status_aprovacao || 'EM_ANALISE';
        
        // Classes CSS para status
        let statusClass = 'status';
        if (status === 'APROVADA') statusClass += ' alert-ok';
        else if (status === 'REPROVADA') statusClass += ' alert-danger';
        else statusClass += ' alert-info';

        return `
          <tr>
            <td>${aluno}</td>
            <td>${curso}</td>
            <td>${dataInscricao}</td>
            <td><span class="${statusClass}">${status}</span></td>
            <td>
              <div class="actions">
                <button class="btn btn-soft" data-inscricao-view="${item.id}">Ver Detalhes</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    if (!body.innerHTML) {
      body.innerHTML = '<tr><td colspan="5">Nenhuma inscrição encontrada.</td></tr>';
    }
  };

  const renderRelatorios = () => {
    // Estatísticas gerais
    const totalInscricoes = state.inscricoes.length;
    const aprovadas = state.inscricoes.filter(i => i.status_aprovacao === 'APROVADA').length;
    const emAnalise = state.inscricoes.filter(i => i.status_aprovacao === 'EM_ANALISE').length;
    const reprovadas = state.inscricoes.filter(i => i.status_aprovacao === 'REPROVADA').length;

    // Atualizar cards de estatísticas
    const statTotal = document.querySelector('#stat-total-inscricoes');
    const statAprovadas = document.querySelector('#stat-aprovadas');
    const statEmAnalise = document.querySelector('#stat-em-analise');
    const statReprovadas = document.querySelector('#stat-reprovadas');

    if (statTotal) statTotal.textContent = totalInscricoes;
    if (statAprovadas) statAprovadas.textContent = aprovadas;
    if (statEmAnalise) statEmAnalise.textContent = emAnalise;
    if (statReprovadas) statReprovadas.textContent = reprovadas;

    // Relatório por curso
    const relatorioPorCurso = document.querySelector('#relatorio-por-curso');
    if (relatorioPorCurso) {
      const cursoStats = {};
      
      state.inscricoes.forEach(inscricao => {
        const cursoNome = inscricao?.id_curso?.nome_curso || 'Sem curso';
        if (!cursoStats[cursoNome]) {
          cursoStats[cursoNome] = { total: 0, aprovadas: 0, emAnalise: 0, reprovadas: 0 };
        }
        cursoStats[cursoNome].total++;
        if (inscricao.status_aprovacao === 'APROVADA') cursoStats[cursoNome].aprovadas++;
        else if (inscricao.status_aprovacao === 'EM_ANALISE') cursoStats[cursoNome].emAnalise++;
        else if (inscricao.status_aprovacao === 'REPROVADA') cursoStats[cursoNome].reprovadas++;
      });

      relatorioPorCurso.innerHTML = Object.entries(cursoStats)
        .sort((a, b) => b[1].total - a[1].total) // Ordenar por total decrescente
        .map(([curso, stats]) => `
          <tr>
            <td><strong>${curso}</strong></td>
            <td>${stats.total}</td>
            <td style="color: #10b981; font-weight: 600;">${stats.aprovadas}</td>
            <td style="color: #f59e0b; font-weight: 600;">${stats.emAnalise}</td>
            <td style="color: #ef4444; font-weight: 600;">${stats.reprovadas}</td>
          </tr>
        `)
        .join('');

      if (!relatorioPorCurso.innerHTML) {
        relatorioPorCurso.innerHTML = '<tr><td colspan="5">Nenhuma inscrição registrada.</td></tr>';
      }
    }

    // Inscrições recentes (últimas 10)
    const relatorioRecentes = document.querySelector('#relatorio-recentes');
    if (relatorioRecentes) {
      const inscricoesRecentes = [...state.inscricoes]
        .sort((a, b) => new Date(b.data_inscricao) - new Date(a.data_inscricao))
        .slice(0, 10);

      relatorioRecentes.innerHTML = inscricoesRecentes
        .map(inscricao => {
          const data = inscricao?.data_inscricao ? new Date(inscricao.data_inscricao).toLocaleDateString('pt-BR') : '-';
          const aluno = inscricao?.id_usuario?.nomeCompleto || 'N/A';
          const curso = inscricao?.id_curso?.nome_curso || 'N/A';
          const status = inscricao?.status_aprovacao || 'EM_ANALISE';

          let statusClass = '';
          if (status === 'APROVADA') statusClass = 'alert-ok';
          else if (status === 'REPROVADA') statusClass = 'alert-danger';
          else statusClass = 'alert-info';

          return `
            <tr>
              <td>${data}</td>
              <td>${aluno}</td>
              <td>${curso}</td>
              <td><span class="${statusClass}">${status}</span></td>
            </tr>
          `;
        })
        .join('');

      if (!relatorioRecentes.innerHTML) {
        relatorioRecentes.innerHTML = '<tr><td colspan="4">Nenhuma inscrição recente.</td></tr>';
      }
    }
  };

  const renderAll = () => {
    renderUnidades();
    renderCursos();
    renderUsuarios();
    renderEditais();
    renderInscricoes();
    renderRelatorios();
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
    const [unidades, cursos, usuarios, editais, inscricoes] = await Promise.all([
      request('/unidades', { headers: authHeaders(false) }),
      request('/cursos', { headers: authHeaders(false) }),
      request('/usuarios', { headers: authHeaders(false) }),
      request('/editais', { headers: authHeaders(false) }),
      request('/inscricoes', { headers: authHeaders(false) }),
    ]);

    state.unidades = unidades;
    state.cursos = cursos;
    state.usuarios = usuarios;
    state.editais = editais;
    state.inscricoes = inscricoes;

    // Popular select de unidade no formulário de curso
    const unidadeSelect = document.querySelector('#curso-unidade');
    unidadeSelect.innerHTML = '';
    state.unidades.forEach((unidade) => {
      const option = document.createElement('option');
      option.value = unidade.id;
      option.textContent = `${unidade.nome} (${unidade.cidade}/${unidade.estado})`;
      unidadeSelect.appendChild(option);
    });

    // Popular select de unidade no filtro de cursos
    const filtroUnidadeSelect = document.querySelector('#filtro-curso-unidade');
    if (filtroUnidadeSelect) {
      filtroUnidadeSelect.innerHTML = '<option value="TODAS">Todas as unidades</option>';
      state.unidades.forEach((unidade) => {
        const option = document.createElement('option');
        option.value = unidade.id;
        option.textContent = `${unidade.nome} (${unidade.cidade}/${unidade.estado})`;
        filtroUnidadeSelect.appendChild(option);
      });
    }

    // Popular select de curso no filtro de inscrições
    const filtroCursoSelect = document.querySelector('#filtro-inscricao-curso');
    if (filtroCursoSelect) {
      filtroCursoSelect.innerHTML = '<option value="TODOS">Todos os cursos</option>';
      state.cursos.forEach((curso) => {
        const option = document.createElement('option');
        option.value = curso.id;
        option.textContent = `${curso.nome_curso} - ${curso?.id_unidade?.nome || 'Sem unidade'}`;
        filtroCursoSelect.appendChild(option);
      });
    }

    renderAll();
  };

  try {
    await reloadData();
  } catch (error) {
    showError(`Erro ao carregar dados administrativos: ${error.message}`);
  }

  document.querySelectorAll(
    '#filtro-unidade-texto, #filtro-unidade-estado, #filtro-curso-texto, #filtro-curso-unidade, #filtro-curso-status, #filtro-usuario-texto, #filtro-usuario-role, #filtro-edital-texto, #filtro-edital-status, #filtro-inscricao-texto, #filtro-inscricao-curso, #filtro-inscricao-status'
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
      showError(`Falha ao salvar unidade: ${error.message}`);
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
      showError(`Falha ao salvar curso: ${error.message}`);
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
      showError(`Falha ao salvar usuário: ${error.message}`);
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
      showError(`Falha ao salvar edital: ${error.message}`);
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
        showError(`Falha ao excluir unidade: ${error.message}`);
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
        showError(`Falha ao excluir curso: ${error.message}`);
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
        showError(`Falha ao excluir usuário: ${error.message}`);
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
        showError(`Falha ao excluir edital: ${error.message}`);
      }
    }
  });

  // Event listener para lista de inscrições - Ver detalhes
  document.querySelector('#lista-inscricoes')?.addEventListener('click', async (event) => {
    const viewBtn = event.target.closest('[data-inscricao-view]');
    
    if (viewBtn) {
      const id = Number(viewBtn.getAttribute('data-inscricao-view'));
      const inscricao = state.inscricoes.find((item) => item.id === id);
      if (!inscricao) return;

      // Preencher detalhes da inscrição
      document.querySelector('#det-aluno').textContent = inscricao?.id_usuario?.nomeCompleto || '-';
      document.querySelector('#det-email').textContent = inscricao?.id_usuario?.email || '-';
      document.querySelector('#det-telefone').textContent = inscricao?.id_usuario?.telefone || '-';
      document.querySelector('#det-cpf').textContent = inscricao?.id_usuario?.cpf || '-';
      document.querySelector('#det-rg').textContent = inscricao?.rg_inscricao || '-';
      document.querySelector('#det-curso').textContent = inscricao?.id_curso?.nome_curso || '-';
      document.querySelector('#det-data-inscricao').textContent = inscricao?.data_inscricao 
        ? new Date(inscricao.data_inscricao).toLocaleDateString('pt-BR') 
        : '-';
      document.querySelector('#det-escolaridade').textContent = inscricao?.escolaridade_declarada || '-';
      document.querySelector('#det-data-nascimento').textContent = inscricao?.id_usuario?.dataNascimento
        ? new Date(inscricao.id_usuario.dataNascimento).toLocaleDateString('pt-BR')
        : '-';

      // Preencher formulário de gerenciamento
      document.querySelector('#inscricao-id-edicao').value = inscricao.id;
      document.querySelector('#inscricao-status-aprovacao').value = inscricao?.status_aprovacao || 'EM_ANALISE';
      document.querySelector('#inscricao-realiza-prova').value = inscricao?.realiza_prova || '';
      document.querySelector('#inscricao-data-prova').value = inscricao?.data_prova || '';
      document.querySelector('#inscricao-situacao-prova').value = inscricao?.situacao_aprovacao_prova || '';
      document.querySelector('#inscricao-lista-espera').value = inscricao?.lista_espera || '';
      document.querySelector('#inscricao-status-matricula').value = inscricao?.status_matricula || '';
      document.querySelector('#inscricao-observacoes').value = inscricao?.observacoes || '';

      // Mostrar painel de detalhes e esconder lista
      document.querySelector('#modulo-inscricoes').classList.add('hidden');
      document.querySelector('#modulo-inscricoes-detalhes').classList.remove('hidden');
    }
  });

  // Formulário de gerenciar inscrição
  document.querySelector('#form-gerenciar-inscricao')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.querySelector('#inscricao-id-edicao').value;
    if (!id) return;

    const payload = {
      status_aprovacao: document.querySelector('#inscricao-status-aprovacao').value,
      realiza_prova: document.querySelector('#inscricao-realiza-prova').value || null,
      data_prova: document.querySelector('#inscricao-data-prova').value || null,
      situacao_aprovacao_prova: document.querySelector('#inscricao-situacao-prova').value || null,
      lista_espera: document.querySelector('#inscricao-lista-espera').value || null,
      status_matricula: document.querySelector('#inscricao-status-matricula').value || null,
      observacoes: document.querySelector('#inscricao-observacoes').value || null,
    };

    try {
      await request(`/inscricoes/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      showSuccess('Inscrição atualizada com sucesso!');
      
      // Voltar para lista
      document.querySelector('#modulo-inscricoes-detalhes').classList.add('hidden');
      document.querySelector('#modulo-inscricoes').classList.remove('hidden');
      
      await reloadData();
    } catch (error) {
      showError(`Falha ao atualizar inscrição: ${error.message}`);
    }
  });

  // Botão voltar para lista de inscrições
  document.querySelector('#voltar-lista-inscricoes')?.addEventListener('click', () => {
    document.querySelector('#modulo-inscricoes-detalhes').classList.add('hidden');
    document.querySelector('#modulo-inscricoes').classList.remove('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  
  const page = document.body.dataset.page;

  if (page === 'login') initLoginPage();
  if (page === 'home') initHomePage();
  if (page === 'inscricao') initInscricaoPage();
  if (page === 'status') initStatusPage();
  if (page === 'matricula') initMatriculaPage();
  if (page === 'portal-aluno') initPortalAlunoPage();
  if (page === 'portal-secretaria') initPortalSecretariaPage();
});

// ========== CONFIGURAÇÃO INTELIGENTE DA API ==========

// Sistema de configuração de API com detecção automática de ambiente
function getApiBaseUrl() {
  // 1. Prioridade: LocalStorage (configurado pelo usuário)
  const savedUrl = localStorage.getItem('API_BASE_URL');
  if (savedUrl) {
    console.log('<i class="fas fa-check-circle"></i> API configurada pelo usuário:', savedUrl);
    return savedUrl;
  }
  
  // 2. Variável de ambiente (Vercel/Render)
  if (window.ENV?.API_BASE_URL) {
    console.log('<i class="fas fa-check-circle"></i> API via ENV:', window.ENV.API_BASE_URL);
    return window.ENV.API_BASE_URL;
  }
  
  // 3. Window global (para desenvolvimento)
  if (window.API_BASE_URL) {
    console.log('<i class="fas fa-check-circle"></i> API via window.API_BASE_URL:', window.API_BASE_URL);
    return window.API_BASE_URL;
  }
  
  // 4. Detectar ambiente Vercel
  if (window.location.hostname.includes('vercel.app')) {
    console.info('<i class="fas fa-exclamation-triangle"></i> Rodando no Vercel sem API configurada; usando fallback para localhost.');
  }
  
  // 5. Fallback: localhost (desenvolvimento local)
  console.log('<i class="fas fa-check-circle"></i> API Fallback: localhost:8080');
  return 'http://localhost:8080/api';
}

// Inicializa API_BASE
let API_BASE = getApiBaseUrl();

// Função para atualizar URL da API
function updateApiBaseUrl(newUrl) {
  if (newUrl && newUrl.trim()) {
    // Remove barra final se houver
    const cleanUrl = newUrl.trim().replace(/\/$/, '');
    localStorage.setItem('API_BASE_URL', cleanUrl);
    API_BASE = cleanUrl;
    console.log('<i class="fas fa-check-circle"></i> API atualizada para:', cleanUrl);
    
    // Esconde modal se estiver aberto
    const modal = document.getElementById('api-config-modal');
    if (modal) modal.style.display = 'none';
    
    // Atualiza indicador de status
    updateApiStatus('testing');
    
    // Testa conexão
    testApiConnection();
    
    return true;
  }
  return false;
}

// Modal de configuração da API
function showApiConfigModal() {
  // Verifica se modal já existe
  let modal = document.getElementById('api-config-modal');
  if (!modal) {
    // Cria modal
    modal = document.createElement('div');
    modal.id = 'api-config-modal';
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div style="background: white; padding: 30px; border-radius: 12px; max-width: 600px; width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
          <h2 style="margin: 0 0 15px 0; color: #667eea; font-size: 24px;"><i class="fas fa-cog"></i> Configurar API Backend</h2>
          <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
            Para acessar o backend, você precisa configurar a URL da <strong>API Render</strong>.<br>
            Siga os passos:
          </p>
          <ol style="margin: 0 0 20px 0; padding-left: 20px; color: #555; line-height: 1.8;">
            <li>O backend está hospedado no Render (ex: <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">https://sige-api.onrender.com</code>)</li>
            <li>Ou use localhost para desenvolvimento: <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">http://localhost:8080/api</code></li>
            <li>Cole abaixo e clique em <strong>Salvar e Testar</strong></li>
          </ol>
          <input type="text" id="api-url-input" placeholder="https://seu-tunnel.trycloudflare.com" 
                 style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; margin-bottom: 15px; box-sizing: border-box;">
          <div style="display: flex; gap: 10px;">
            <button onclick="saveAndTestApi()" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">
              <i class="fas fa-save"></i> Salvar e Testar
            </button>
            <button onclick="closeApiModal()" style="padding: 12px 20px; background: #e5e7eb; color: #555; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
              Cancelar
            </button>
          </div>
          <div id="api-test-result" style="margin-top: 15px; padding: 12px; border-radius: 8px; display: none;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.style.display = 'flex';
}

// Salvar e testar API
window.saveAndTestApi = function() {
  const input = document.getElementById('api-url-input');
  const resultDiv = document.getElementById('api-test-result');
  const url = input.value.trim();
  
  if (!url) {
    resultDiv.style.display = 'block';
    resultDiv.style.background = '#fee';
    resultDiv.style.color = '#c00';
    resultDiv.innerHTML = '<i class="fas fa-times-circle"></i> Por favor, insira uma URL válida';
    return;
  }
  
  // Valida formato básico
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    resultDiv.style.display = 'block';
    resultDiv.style.background = '#fee';
    resultDiv.style.color = '#c00';
    resultDiv.innerHTML = '<i class="fas fa-times-circle"></i> URL deve começar com http:// ou https://';
    return;
  }
  
  resultDiv.style.display = 'block';
  resultDiv.style.background = '#fef9e7';
  resultDiv.style.color = '#856404';
  resultDiv.innerHTML = '<i class="fas fa-hourglass-half"></i> Testando conexão...';
  
  // Atualiza URL
  updateApiBaseUrl(url);
};

// Fechar modal
window.closeApiModal = function() {
  const modal = document.getElementById('api-config-modal');
  if (modal) modal.style.display = 'none';
};

// Testar conexão com API
function testApiConnection() {
  if (!API_BASE) {
    updateApiStatus('offline');
    return;
  }
  
  const resultDiv = document.getElementById('api-test-result');
  
  fetch(`${API_BASE}/usuarios/count`, { method: 'GET' })
    .then(response => {
      if (response.ok) {
        updateApiStatus('online');
        if (resultDiv) {
          resultDiv.style.display = 'block';
          resultDiv.style.background = '#d4edda';
          resultDiv.style.color = '#155724';
          resultDiv.innerHTML = '<i class="fas fa-check-circle"></i> Conexão bem-sucedida! API funcionando.';
          setTimeout(() => {
            closeApiModal();
          }, 2000);
        }
      } else {
        throw new Error('Resposta não OK');
      }
    })
    .catch(error => {
      updateApiStatus('offline');
      if (resultDiv) {
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#fee';
        resultDiv.style.color = '#c00';
        resultDiv.innerHTML = '<i class="fas fa-times-circle"></i> Falha ao conectar. Verifique se o backend está rodando e a URL está correta.';
      }
      console.error('Erro ao testar API:', error);
    });
}

// Indicador de status da API
function createApiStatusIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'api-status-indicator';
  indicator.innerHTML = `
    <div style="position: fixed; top: 10px; right: 10px; z-index: 9999; background: white; padding: 8px 12px; border-radius: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 8px; font-size: 12px; cursor: pointer;" onclick="showApiConfigModal()">
      <span id="api-status-dot" style="width: 8px; height: 8px; border-radius: 50%; background: #999;"></span>
      <span id="api-status-text">API</span>
      <span style="font-size: 10px; opacity: 0.6;"><i class="fas fa-cog"></i></span>
    </div>
  `;
  document.body.appendChild(indicator);
}

// Atualizar status visual
function updateApiStatus(status) {
  const dot = document.getElementById('api-status-dot');
  const text = document.getElementById('api-status-text');
  
  if (!dot || !text) return;
  
  switch(status) {
    case 'online':
      dot.style.background = '#10b981';
      text.textContent = 'API Online';
      break;
    case 'offline':
      dot.style.background = '#ef4444';
      text.textContent = 'API Offline';
      break;
    case 'testing':
      dot.style.background = '#f59e0b';
      text.textContent = 'Testando...';
      break;
    default:
      dot.style.background = '#999';
      text.textContent = 'API';
  }
}

// Inicializar na carga da página
document.addEventListener('DOMContentLoaded', () => {
  if (API_BASE) {
    updateApiStatus('testing');
    testApiConnection();
  } else {
    updateApiStatus('offline');
  }
});

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
          className: 'notyf__icon--success fas fa-check',
          tagName: 'i'
        }
      },
      {
        type: 'error',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        icon: {
          className: 'notyf__icon--error fas fa-times',
          tagName: 'i'
        }
      },
      {
        type: 'warning',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        icon: {
          className: 'notyf__icon--warning fas fa-exclamation-triangle',
          tagName: 'i'
        }
      },
      {
        type: 'info',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        icon: {
          className: 'notyf__icon--info fas fa-info-circle',
          tagName: 'i'
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

function createFakeToken(email = 'visitante@local') {
  const payload = btoa(JSON.stringify({ email, iat: Math.floor(Date.now() / 1000) }));
  return `fake.${payload}.${Math.floor(Math.random() * 1000000)}`;
}

function createFakeAuth({ email = 'visitante@local', nomeCompleto = 'Visitante', role = 'ROLE_USER' } = {}) {
  return {
    token: createFakeToken(email),
    usuario: {
      id: -1,
      email,
      nomeCompleto,
      role,
    },
  };
}

function loginAsVisitor() {
  const auth = createFakeAuth();
  setAuth(auth);
  showInfo('Entrando como visitante de visualização.');
  window.location.href = 'index.html';
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
      window.location.href = getLoginPageUrl();
    });
  });
}

function setupMobileMenu() {
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.nav-overlay');

  if (!nav) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
  };

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
  const permissoes = auth?.permissoes || [];
  const isAdmin = auth?.usuario?.role === 'ROLE_ADMIN';
  const hasPortalSecretaria = permissoes.includes('portal.secretaria') || isAdmin;

  document.querySelectorAll('[data-admin-only]').forEach((element) => {
    element.classList.toggle('visible', hasPortalSecretaria);
  });

  const currentFile = getCurrentFileName();
  document.querySelectorAll('.nav a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('nav-link-active', href === currentFile);
  });

  // Injeta botoes de logout + acessibilidade agrupados fora do .nav
  // para ficarem visiveis no mobile tambem
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    if (!topbar.querySelector(':scope > .topbar-actions')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'topbar-actions';

      const acessBtn = document.createElement('button');
      acessBtn.className = 'btn-acessibilidade';
      acessBtn.id = 'btnAcessibilidade';
      acessBtn.title = 'Acessibilidade';
      acessBtn.setAttribute('aria-label', 'Acessibilidade');
      acessBtn.innerHTML = '<i class="fas fa-cog"></i>';
      wrapper.appendChild(acessBtn);

      const logoutBtn = document.createElement('button');
      logoutBtn.setAttribute('data-logout', '');
      logoutBtn.type = 'button';
      logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
      wrapper.appendChild(logoutBtn);

      topbar.appendChild(wrapper);
      setupLogoutButtons();
    }
  }
}

function getLoginPageUrl() {
  const path = window.location.pathname;
  if (path.includes('/portal-inscricao/')) return 'login.html';
  return '../portal-inscricao/login.html';
}

function requireAuth(requiredRole) {
  const auth = getAuth();
  if (!auth?.token || !auth?.usuario) {
    window.location.href = getLoginPageUrl();
    return null;
  }

  const role = auth.usuario.role;
  const permissoes = auth.permissoes || [];

  // Portal-Secretaria check
  if (requiredRole === 'ROLE_ADMIN') {
    if (permissoes.includes('portal.secretaria') || role === 'ROLE_ADMIN') {
      setupProtectedPage(auth);
      return auth;
    }
    window.location.href = getLoginPageUrl();
    return null;
  }

  if (requiredRole && role !== requiredRole) {
    window.location.href = 'index.html';
    return null;
  }

  if (!requiredRole) {
    // Portal-Escolar: check portal.escolar permission
    if (permissoes.includes('portal.escolar')) {
      setupTopNav(auth);
      return auth;
    }
    if (role === 'ROLE_STUDENT') {
      setupTopNav(auth);
      return auth;
    }
    if (role === 'ROLE_USER') {
      window.location.href = '../portal-inscricao/index.html';
      return null;
    }
    if (role === 'ROLE_TEACHER') {
      window.location.href = '../portal-professor/portal-professor.html';
      return null;
    }
    if (role === 'ROLE_ADMIN') {
      window.location.href = '../portal-secretaria/portal-secretaria.html';
      return null;
    }
  }

  setupTopNav(auth);
  return auth;
}

function setupProtectedPage(auth) {
  setupTopNav(auth);
  updateUserNameLabels();
  setupLogoutButtons();
}

// Verifica se um portal esta ativo (feature flag)
// Exibe overlay de manutencao e retorna false se inativo
async function checkPortalAtivo(codigo) {
  try {
    const auth = getAuth();
    if (!auth?.token) return true;
    const res = await fetch(`${API_BASE}/portais/${codigo}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    if (!res.ok) return true;
    const portal = await res.json();
    if (portal && portal.ativo === false) {
      const motivo = portal.motivo || 'Em manutencao';
      const reativar = portal.reativar_em
        ? new Date(portal.reativar_em).toLocaleString('pt-BR')
        : null;
      const overlay = document.createElement('div');
      overlay.id = 'portal-maintenance-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:var(--sec-bg,#f5f6fa);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;text-align:center;';
      overlay.innerHTML = `
        <div style="font-size:4rem;margin-bottom:16px;"><i class="fas fa-exclamation-triangle"></i></div>
        <h2 style="margin:0 0 8px;color:var(--sec-danger,#e74c3c);">Portal Indispon&iacute;vel</h2>
        <p style="max-width:480px;color:var(--sec-text,#555);margin:0 0 16px;font-size:1rem;">${motivo}</p>
        ${reativar ? `<p style="color:var(--sec-muted,#888);font-size:0.85rem;">Previs&atilde;o de reativa&ccedil;&atilde;o: <strong>${reativar}</strong></p>` : ''}
        <button onclick="window.location.href='../portal-escolar/index.html'" style="margin-top:12px;padding:10px 24px;border:none;border-radius:6px;background:var(--sec-accent,#10b981);color:#fff;cursor:pointer;font-size:0.9rem;">Voltar ao In&iacute;cio</button>
      `;
      document.body.appendChild(overlay);
      return false;
    }
    return true;
  } catch (e) {
    return true;
  }
}

async function request(path, options = {}) {
  const auth = getAuth();
  const headers = { ...(options.headers || {}) };
  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }
  if (!headers['Content-Type'] && options.method && options.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }
  options.headers = headers;
  const response = await fetch(`${API_BASE}${path}`, options);

  if (!response.ok) {
    const raw = await response.text();
    if (response.status === 401) {
      const authData = getAuth();
      if (!authData?.token?.startsWith('fake.')) {
        clearAuth();
        window.location.href = getLoginPageUrl();
      }
    }
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

  const btnGuestLogin = document.querySelector('#btn-guest-login');
  btnGuestLogin?.addEventListener('click', () => loginAsVisitor());

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

      const permissoes = data.permissoes || [];
      setAuth({ token, usuario, permissoes });
      if (permissoes.includes('portal.secretaria')) {
        window.location.href = '../portal-secretaria/portal-secretaria.html';
      } else if (permissoes.includes('portal.professor')) {
        window.location.href = '../portal-professor/portal-professor.html';
      } else if (permissoes.includes('portal.escolar')) {
        window.location.href = 'index.html';
      } else {
        window.location.href = '../portal-inscricao/index.html';
      }
    } catch (error) {
      showError(`Não foi possível logar: ${error.message}`);
      showInfo('Se o backend não estiver disponível, use o botão de visualização como visitante.');
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

  // Esta pagina espera #courses-body (pagina de cursos)
  // Se nao existir, apenas retorna (ex: dashboard index.html)
  const body = document.querySelector('#courses-body');
  if (!body) return;

  try {
    const [cursos, inscricoes] = await Promise.all([
      request('/cursos', { headers: authHeaders(false) }),
      request('/inscricoes', { headers: authHeaders(false) })
    ]);

    const cursosAtivos = cursos.filter(curso => curso.status === 'ATIVO');

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
    alunos: [],
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

  const renderAlunos = () => {
    const body = document.querySelector('#lista-alunos');
    if (!body) return;
    const query = document.querySelector('#filtro-aluno-texto')?.value.trim() || '';
    const cursoFilter = document.querySelector('#filtro-aluno-curso')?.value || 'TODOS';
    const statusFilter = document.querySelector('#filtro-aluno-status-matricula')?.value || 'TODOS';

    let data = filterByQuery(state.alunos, query, (item) => `${item.nome_completo} ${item.email} ${item.cpf}`);
    if (cursoFilter !== 'TODOS') {
      data = data.filter((a) => (a.matriculas || []).some((m) => String(m.id_curso?.id) === cursoFilter));
    }
    if (statusFilter !== 'TODOS') {
      data = data.filter((a) => (a.matriculas || []).some((m) => m.status === statusFilter));
    }

    body.innerHTML = data
      .map(
        (aluno) => {
          const matricula = (aluno.matriculas || [])[0] || {};
          return `
            <tr>
              <td>${aluno.nome_completo}</td>
              <td>${aluno.email}</td>
              <td>${matricula.id_curso?.nome_curso || '-'}</td>
              <td>${matricula.id_turma?.nome || '-'}</td>
              <td><span class="badge badge-${matricula.status === 'ATIVO' ? 'success' : matricula.status === 'TRANCADO' ? 'warning' : 'info'}">${matricula.status || 'SEM MATRICULA'}</span></td>
              <td>
                <div class="actions">
                  <button class="btn btn-soft" data-aluno-view="${aluno.id}">Detalhes</button>
                  ${matricula.id ? `<button class="btn btn-soft" data-aluno-matricula="${matricula.id}" data-aluno-status="${matricula.status || ''}">Alterar Status</button>` : ''}
                </div>
              </td>
            </tr>
          `;
        }
      )
      .join('');

    if (!body.innerHTML) body.innerHTML = '<tr><td colspan="6">Nenhum aluno encontrado.</td></tr>';
  };

  const renderAll = () => {
    renderUnidades();
    renderCursos();
    renderUsuarios();
    renderEditais();
    renderInscricoes();
    renderAlunos();
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
    const [unidades, cursos, usuarios, editais, inscricoes, alunos] = await Promise.all([
      request('/unidades', { headers: authHeaders(false) }),
      request('/cursos?todos=true', { headers: authHeaders(false) }),
      request('/usuarios', { headers: authHeaders(false) }),
      request('/editais', { headers: authHeaders(false) }),
      request('/inscricoes', { headers: authHeaders(false) }),
      request('/alunos', { headers: authHeaders(false) }),
    ]);

    state.unidades = unidades;
    state.cursos = cursos;
    state.usuarios = usuarios;
    state.editais = editais;
    state.inscricoes = inscricoes;
    state.alunos = alunos || [];

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
    '#filtro-unidade-texto, #filtro-unidade-estado, #filtro-curso-texto, #filtro-curso-unidade, #filtro-curso-status, #filtro-usuario-texto, #filtro-usuario-role, #filtro-edital-texto, #filtro-edital-status, #filtro-inscricao-texto, #filtro-inscricao-curso, #filtro-inscricao-status, #filtro-aluno-texto, #filtro-aluno-curso, #filtro-aluno-status-matricula'
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

  // Event listener para lista de alunos - Ver detalhes
  document.querySelector('#lista-alunos')?.addEventListener('click', async (event) => {
    const viewBtn = event.target.closest('[data-aluno-view]');
    const matBtn = event.target.closest('[data-aluno-matricula]');

    if (viewBtn) {
      const id = viewBtn.getAttribute('data-aluno-view');
      document.querySelector('#modulo-alunos').classList.add('hidden');
      document.querySelector('#modulo-aluno-detalhes').classList.remove('hidden');

      const content = document.querySelector('#aluno-detalhes-content');
      content.innerHTML = '<p class="muted">Carregando detalhes...</p>';

      try {
        const aluno = await request(`/alunos/${id}`, { headers: authHeaders(false) });
        const matricula = (aluno.matriculas || [])[0] || {};

        content.innerHTML = `
          <div class="detail-section">
            <h3>Dados Pessoais</h3>
            <div class="detail-grid">
              <div class="detail-item"><span class="detail-label">Nome</span><span class="detail-value">${aluno.nome_completo || '-'}</span></div>
              <div class="detail-item"><span class="detail-label">E-mail</span><span class="detail-value">${aluno.email || '-'}</span></div>
              <div class="detail-item"><span class="detail-label">CPF</span><span class="detail-value">${aluno.cpf || '-'}</span></div>
              <div class="detail-item"><span class="detail-label">Telefone</span><span class="detail-value">${aluno.telefone || '-'}</span></div>
              <div class="detail-item"><span class="detail-label">Data Nasc.</span><span class="detail-value">${aluno.data_nascimento ? new Date(aluno.data_nascimento).toLocaleDateString('pt-BR') : '-'}</span></div>
              <div class="detail-item"><span class="detail-label">Role</span><span class="detail-value">${aluno.role || '-'}</span></div>
            </div>
          </div>
          <div class="detail-section">
            <h3>Matrícula</h3>
            <div class="detail-grid">
              <div class="detail-item"><span class="detail-label">Número</span><span class="detail-value">${matricula.numero_matricula || '-'}</span></div>
              <div class="detail-item"><span class="detail-label">Curso</span><span class="detail-value">${matricula.id_curso?.nome_curso || '-'}</span></div>
              <div class="detail-item"><span class="detail-label">Turma</span><span class="detail-value">${matricula.id_turma?.nome || '-'}</span></div>
              <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value">${matricula.status || '-'}</span></div>
              <div class="detail-item"><span class="detail-label">Data Matrícula</span><span class="detail-value">${matricula.data_matricula ? new Date(matricula.data_matricula).toLocaleDateString('pt-BR') : '-'}</span></div>
              <div class="detail-item"><span class="detail-label">Data Conclusão</span><span class="detail-value">${matricula.data_conclusao ? new Date(matricula.data_conclusao).toLocaleDateString('pt-BR') : '-'}</span></div>
            </div>
            ${matricula.id ? `
              <div class="field" style="margin-top: 12px;">
                <label for="aluno-matricula-status">Alterar Status da Matrícula</label>
                <div style="display:flex;gap:8px;">
                  <select id="aluno-matricula-status" class="field">
                    <option value="ATIVO" ${matricula.status === 'ATIVO' ? 'selected' : ''}>Ativo</option>
                    <option value="TRANCADO" ${matricula.status === 'TRANCADO' ? 'selected' : ''}>Trancado</option>
                    <option value="CONCLUIDO" ${matricula.status === 'CONCLUIDO' ? 'selected' : ''}>Concluído</option>
                  </select>
                  <button class="btn btn-primary" id="salvar-status-matricula" data-matricula-id="${matricula.id}">Salvar</button>
                </div>
              </div>
            ` : ''}
          </div>
          <div class="two-col" style="margin-top: 16px;">
            <div class="detail-section">
              <h3>Histórico (${(aluno.historico || []).length})</h3>
              <div class="table-wrapper">
                <table>
                  <thead><tr><th>Disciplina</th><th>Nota</th><th>Freq.</th><th>Status</th></tr></thead>
                  <tbody>${(aluno.historico || []).map(h => `
                    <tr>
                      <td>${h.id_disciplina?.nome || '-'}</td>
                      <td>${h.nota_final || '-'}</td>
                      <td>${h.frequencia_percentual || '-'}%</td>
                      <td>${h.status || '-'}</td>
                    </tr>
                  `).join('') || '<tr><td colspan="4">Sem histórico.</td></tr>'}</tbody>
                </table>
              </div>
            </div>
            <div>
              <div class="detail-section">
                <h3>Documentos (${(aluno.documentos || []).length})</h3>
                <div class="table-wrapper">
                  <table>
                    <thead><tr><th>Nome</th><th>Tipo</th><th>Status</th></tr></thead>
                    <tbody>${(aluno.documentos || []).map(d => `
                      <tr>
                        <td>${d.nome || '-'}</td>
                        <td>${d.tipo || '-'}</td>
                        <td>${d.status || '-'}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="3">Sem documentos.</td></tr>'}</tbody>
                  </table>
                </div>
              </div>
              <div class="detail-section" style="margin-top: 12px;">
                <h3>Reclamações (${(aluno.reclamacoes || []).length})</h3>
                <div class="table-wrapper">
                  <table>
                    <thead><tr><th>Protocolo</th><th>Assunto</th><th>Status</th></tr></thead>
                    <tbody>${(aluno.reclamacoes || []).map(r => `
                      <tr>
                        <td>${r.protocolo || '-'}</td>
                        <td>${r.assunto || '-'}</td>
                        <td>${r.status || '-'}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="3">Sem reclamações.</td></tr>'}</tbody>
                  </table>
                </div>
              </div>
              <div class="detail-section" style="margin-top: 12px;">
                <h3>Atendimentos (${(aluno.atendimentos || []).length})</h3>
                <div class="table-wrapper">
                  <table>
                    <thead><tr><th>Tipo</th><th>Data</th><th>Status</th></tr></thead>
                    <tbody>${(aluno.atendimentos || []).map(a => `
                      <tr>
                        <td>${a.tipo || '-'}</td>
                        <td>${a.data_atendimento ? new Date(a.data_atendimento).toLocaleDateString('pt-BR') : '-'}</td>
                        <td>${a.status || '-'}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="3">Sem atendimentos.</td></tr>'}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;

        // Evento do botao salvar status matricula
        document.querySelector('#salvar-status-matricula')?.addEventListener('click', async () => {
          const matId = document.querySelector('#salvar-status-matricula').getAttribute('data-matricula-id');
          const status = document.querySelector('#aluno-matricula-status').value;
          try {
            await request(`/alunos/${matId}/matricula`, {
              method: 'PUT',
              headers: authHeaders(),
              body: JSON.stringify({ status }),
            });
            showSuccess('Status da matrícula atualizado!');
            // Reabrir detalhes
            document.querySelector('#aluno-detalhes-content').innerHTML = '<p class="muted">Carregando...</p>';
            await reloadData();
            viewBtn.click();
          } catch (e) {
            showError('Erro ao atualizar status');
          }
        });
      } catch (e) {
        content.innerHTML = '<p style="color:#dc2626;">Erro ao carregar detalhes do aluno.</p>';
      }
    }

    if (matBtn) {
      const matId = matBtn.getAttribute('data-aluno-matricula');
      const currentStatus = matBtn.getAttribute('data-aluno-status');
      const newStatus = prompt(`Status atual: ${currentStatus}\nNovo status (ATIVO, TRANCADO, CONCLUIDO):`, currentStatus);
      if (!newStatus || newStatus === currentStatus) return;
      try {
        await request(`/alunos/${matId}/matricula`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({ status: newStatus }),
        });
        showSuccess('Status alterado!');
        await reloadData();
      } catch (e) {
        showError('Erro ao alterar status');
      }
    }
  });

  // Botao voltar lista alunos
  document.querySelector('#voltar-lista-alunos')?.addEventListener('click', () => {
    document.querySelector('#modulo-aluno-detalhes').classList.add('hidden');
    document.querySelector('#modulo-alunos').classList.remove('hidden');
  });

  // Preencher select de cursos no filtro de alunos
  const filtroAlunoCurso = document.querySelector('#filtro-aluno-curso');
  if (filtroAlunoCurso) {
    const observer = new MutationObserver(() => {
      if (state.cursos.length > 0) {
        filtroAlunoCurso.innerHTML = '<option value="TODOS">Todos os cursos</option>';
        state.cursos.forEach((curso) => {
          const opt = document.createElement('option');
          opt.value = curso.id;
          opt.textContent = curso.nome_curso;
          filtroAlunoCurso.appendChild(opt);
        });
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

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
      document.querySelector('#inscricao-status-matricula').value = inscricao?.status_matricula || '';

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
      status_matricula: document.querySelector('#inscricao-status-matricula').value || null,
    };

    // Aceitar matricula: registrar data
    if (payload.status_matricula === 'ACEITA') {
      payload.data_aceite_matricula = new Date().toISOString().slice(0, 10);
    }

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

// ============================================
// INIT FUNCTIONS - PAGINAS DO ALUNO
// ============================================

async function initHistoricoPage() {
  const auth = requireAuth();
  if (!auth) return;
  setupProtectedPage(auth);

  const body = document.querySelector('#historico-body');
  if (!body) return;

  try {
    const data = await request('/aluno/historico', { headers: authHeaders(false) });
    body.innerHTML = data.length
      ? data.map((h) => `
        <tr>
          <td>${h.id_disciplina?.nome || '-'}</td>
          <td>${h.id_professor?.nome_completo || '-'}</td>
          <td>${h.nota_final != null ? h.nota_final.toFixed(1) : '-'}</td>
          <td>${h.frequencia_percentual != null ? h.frequencia_percentual.toFixed(0) + '%' : '-'}</td>
          <td><span class="status ${h.status === 'APROVADO' ? 'alert-ok' : h.status === 'REPROVADO' ? 'alert-danger' : 'alert-info'}">${h.status || 'CURSANDO'}</span></td>
        </tr>`).join('')
      : '<tr><td colspan="5">Nenhum historico encontrado.</td></tr>';
  } catch (error) {
    showError('Erro ao carregar historico: ' + error.message);
    body.innerHTML = '<tr><td colspan="5">Erro ao carregar dados.</td></tr>';
  }
}

async function initDocumentosPage() {
  const auth = requireAuth();
  if (!auth) return;
  setupProtectedPage(auth);

  const body = document.querySelector('#documentos-body');
  if (!body) return;

  try {
    const data = await request('/aluno/documentos', { headers: authHeaders(false) });
    body.innerHTML = data.length
      ? data.map((d) => `
        <tr>
          <td>${d.nome}</td>
          <td>${d.data_envio ? new Date(d.data_envio).toLocaleDateString('pt-BR') : '-'}</td>
          <td><span class="status ${d.status === 'APROVADO' ? 'alert-ok' : d.status === 'RECUSADO' ? 'alert-danger' : 'alert-info'}">${d.status || 'PENDENTE'}</span></td>
          <td>${d.arquivo_url ? `<a href="${d.arquivo_url}" target="_blank" class="btn btn-soft">Download</a>` : '-'}</td>
        </tr>`).join('')
      : '<tr><td colspan="4">Nenhum documento encontrado.</td></tr>';
  } catch (error) {
    showError('Erro ao carregar documentos: ' + error.message);
    body.innerHTML = '<tr><td colspan="4">Erro ao carregar dados.</td></tr>';
  }
}

async function initFrequenciaPage() {
  const auth = requireAuth();
  if (!auth) return;
  setupProtectedPage(auth);

  const body = document.querySelector('#frequencia-body');
  if (!body) return;

  try {
    const data = await request('/aluno/frequencia', { headers: authHeaders(false) });
    body.innerHTML = data.length
      ? data.map((f) => `
        <tr>
          <td>${f.disciplina}</td>
          <td>${f.totalAulas}</td>
          <td>${f.presencas}</td>
          <td>${f.faltas}</td>
          <td>${f.frequenciaPercentual}%</td>
        </tr>`).join('')
      : '<tr><td colspan="5">Nenhum registro de frequencia encontrado.</td></tr>';
  } catch (error) {
    showError('Erro ao carregar frequencia: ' + error.message);
    body.innerHTML = '<tr><td colspan="5">Erro ao carregar dados.</td></tr>';
  }
}

async function initAgendaPage() {
  const auth = requireAuth();
  if (!auth) return;
  setupProtectedPage(auth);

  const container = document.querySelector('#agenda-events');
  if (!container) return;

  try {
    const data = await request('/aluno/agenda', { headers: authHeaders(false) });

    if (!data.length) {
      container.innerHTML = '<p class="muted">Nenhum evento agendado.</p>';
      return;
    }

    container.innerHTML = data.map((e) => `
      <div class="card" style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <h3 style="margin: 0 0 4px;">${e.titulo}</h3>
            <p class="muted" style="margin: 0;">${e.descricao || ''}</p>
          </div>
          <span class="status ${e.tipo === 'PROVA' ? 'alert-danger' : e.tipo === 'FERIADO' ? 'alert-ok' : 'alert-info'}">${e.tipo || 'EVENTO'}</span>
        </div>
        <p style="margin: 8px 0 0; font-size: 0.85rem; color: var(--muted);">
          ${new Date(e.data_inicio).toLocaleDateString('pt-BR')}
          ${e.data_fim && e.data_fim !== e.data_inicio ? ' a ' + new Date(e.data_fim).toLocaleDateString('pt-BR') : ''}
        </p>
      </div>`).join('');
  } catch (error) {
    showError('Erro ao carregar agenda: ' + error.message);
    container.innerHTML = '<p class="muted">Erro ao carregar agenda.</p>';
  }
}

async function initCalendarioPage() {
  const auth = requireAuth();
  if (!auth) return;
  setupProtectedPage(auth);

  const body = document.querySelector('#calendario-body');
  if (!body) return;

  try {
    const data = await request('/aluno/calendario', { headers: authHeaders(false) });
    body.innerHTML = data.length
      ? data.map((e) => `
        <tr>
          <td>${e.titulo}</td>
          <td>${new Date(e.data_inicio).toLocaleDateString('pt-BR')}</td>
          <td>${e.descricao || ''}</td>
        </tr>`).join('')
      : '<tr><td colspan="3">Nenhum evento encontrado.</td></tr>';
  } catch (error) {
    showError('Erro ao carregar calendario: ' + error.message);
    body.innerHTML = '<tr><td colspan="3">Erro ao carregar dados.</td></tr>';
  }
}

async function initQuadroHorariosPage() {
  const auth = requireAuth();
  if (!auth) return;
  setupProtectedPage(auth);

  const body = document.querySelector('#horarios-body');
  if (!body) return;

  const dias = ['Domingo', 'Segunda-feira', 'Terca-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'];

  try {
    const data = await request('/aluno/horarios', { headers: authHeaders(false) });
    body.innerHTML = data.length
      ? data.map((h) => `
        <tr>
          <td>${dias[h.dia_semana] || h.dia_semana}</td>
          <td>${h.hora_inicio?.slice(0, 5) || ''} - ${h.hora_fim?.slice(0, 5) || ''}</td>
          <td>${h.id_disciplina?.nome || '-'}</td>
          <td>${h.id_professor?.nome_completo || '-'}</td>
          <td>${h.local || '-'}</td>
        </tr>`).join('')
      : '<tr><td colspan="5">Nenhum horario cadastrado.</td></tr>';
  } catch (error) {
    showError('Erro ao carregar horarios: ' + error.message);
    body.innerHTML = '<tr><td colspan="5">Erro ao carregar dados.</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  setupMobileMenu();
  
  const page = document.body.dataset.page;

  if (page === 'login') { initLoginPage(); return; }
  // Verifica se o portal escolar esta ativo (exceto na pagina de login)
  const ativo = await checkPortalAtivo('escolar');
  if (!ativo) return;

  if (page === 'home') initHomePage();
  if (page === 'inscricao') initInscricaoPage();
  if (page === 'status') initStatusPage();
  if (page === 'matricula') initMatriculaPage();
  if (page === 'portal-secretaria') initPortalSecretariaPage();
  if (page === 'historico') initHistoricoPage();
  if (page === 'documentos') initDocumentosPage();
  if (page === 'frequencia') initFrequenciaPage();
  if (page === 'agenda') initAgendaPage();
  if (page === 'calendario') initCalendarioPage();
  if (page === 'horarios') initQuadroHorariosPage();
});

//FUNÇÃO DA SIDEBAR
let isSidebarOpen = false;

function sidebarOpen() {
	const sidebarVar = document.getElementById('sidebar');
	if (!sidebarVar) return;

	let overlay = document.getElementById('sidebar-overlay');
	if (!overlay) {
		overlay = document.createElement('div');
		overlay.id = 'sidebar-overlay';
		overlay.className = 'sidebar-overlay';
		document.body.appendChild(overlay);
		overlay.addEventListener('click', closeSidebar);
	}

	const interfaceVar = document.querySelector('.interface');
	const isOpen = !sidebarVar.classList.contains('asideAberto');

	sidebarVar.classList.toggle('asideAberto', isOpen);
	overlay.classList.toggle('visible', isOpen);

	if (interfaceVar) {
		const offset = window.innerWidth > 768 ? '280px' : '0px';
		interfaceVar.style.setProperty('margin-left', isOpen ? offset : '0px');
	}

	isSidebarOpen = isOpen;
}

function closeSidebar() {
	const sidebarVar = document.getElementById('sidebar');
	const overlay = document.getElementById('sidebar-overlay');
	const interfaceVar = document.querySelector('.interface');

	if (!sidebarVar || !sidebarVar.classList.contains('asideAberto')) return;

	sidebarVar.classList.remove('asideAberto');
	if (overlay) overlay.classList.remove('visible');
	if (interfaceVar) interfaceVar.style.setProperty('margin-left', '0px');
	isSidebarOpen = false;
}

//FAZ COM QUE A PADDING DA SIDEBAR FIQUE DO TAMANHO DO HEADER
(function ajustarPaddingSidebar() {
  const headerEl = document.getElementById('headerID');
  const sidebarVar = document.getElementById('sidebar');
  if (!headerEl || !sidebarVar) return;
  const headerAltura = headerEl.offsetHeight;
  sidebarVar.style.paddingTop = headerAltura + 'px';
})();
  
//conclusao de card aaa
function alternarConcluido(elemento) {
            // O toggle adiciona a classe se ela não existir, e remove se já existir
            elemento.classList.toggle('concluido');
        }

// ========== ACESSIBILIDADE (modo escuro + fonte) ==========
(function initAcessibilidade() {
  const STORAGE_THEME = 'sige-theme';
  const STORAGE_FONT = 'sige-font-size';

  // Cria overlay + popup
  const overlay = document.createElement('div');
  overlay.className = 'acessibilidade-overlay';
  overlay.id = 'acessibilidadeOverlay';
  document.body.appendChild(overlay);

  const popup = document.createElement('div');
  popup.className = 'acessibilidade-popup';
  popup.id = 'acessibilidadePopup';
  popup.innerHTML = `
    <button class="close-btn" id="fecharAcessibilidade">&times;</button>
    <h3><i class="fas fa-cog"></i> Acessibilidade</h3>
    <div class="acessibilidade-item">
      <label>Modo Escuro</label>
      <button id="toggleDarkModeBtn">${document.documentElement.getAttribute('data-theme') === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>'}</button>
    </div>
    <div class="acessibilidade-item">
      <label>Tamanho da Fonte</label>
      <div class="font-size-controls">
        <button data-font-size-action="decrease" title="Diminuir fonte">A-</button>
        <span class="current-size" id="currentFontSize">M</span>
        <button data-font-size-action="increase" title="Aumentar fonte">A+</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // Abrir popup
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#btnAcessibilidade');
    if (btn) {
      overlay.classList.add('open');
      popup.classList.add('open');
    }
  });

  // Fechar popup
  const closePopup = () => {
    overlay.classList.remove('open');
    popup.classList.remove('open');
  };
  document.getElementById('fecharAcessibilidade')?.addEventListener('click', closePopup);
  overlay.addEventListener('click', closePopup);

  // Dark mode toggle
  const darkBtn = document.getElementById('toggleDarkModeBtn');
  if (darkBtn) {
    darkBtn.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      html.setAttribute('data-theme', isDark ? '' : 'dark');
      darkBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      localStorage.setItem(STORAGE_THEME, isDark ? '' : 'dark');
    });
  }

  // Font size
  const fontSizes = ['sm', 'md', 'lg'];
  const fontLabels = { sm: 'P', md: 'M', lg: 'G' };
  let currentFontIdx = fontSizes.indexOf(localStorage.getItem(STORAGE_FONT)) || 1;

  const updateFontDisplay = () => {
    const label = document.getElementById('currentFontSize');
    if (label) label.textContent = fontLabels[fontSizes[currentFontIdx]];
    document.documentElement.setAttribute('data-font-size', fontSizes[currentFontIdx]);
    localStorage.setItem(STORAGE_FONT, fontSizes[currentFontIdx]);
  };

  document.querySelectorAll('[data-font-size-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.fontSizeAction === 'increase') {
        currentFontIdx = Math.min(currentFontIdx + 1, fontSizes.length - 1);
      } else {
        currentFontIdx = Math.max(currentFontIdx - 1, 0);
      }
      updateFontDisplay();
    });
  });

  // Restore saved preferences (supports old keys for migration)
  let savedTheme = localStorage.getItem(STORAGE_THEME);
  if (savedTheme === null) savedTheme = localStorage.getItem('esc-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (darkBtn) darkBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  }
  let savedFont = localStorage.getItem(STORAGE_FONT);
  if (savedFont === null) savedFont = localStorage.getItem('esc-font-size');
  if (savedFont) {
    currentFontIdx = fontSizes.indexOf(savedFont);
    if (currentFontIdx < 0) currentFontIdx = 1;
    updateFontDisplay();
  }
})();
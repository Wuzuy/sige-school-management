/**
 * Navegação da Sidebar - Sistema de Navegação Inteligente
 * Define todas as páginas e categorias do portal
 */

const SIDEBAR_NAVIGATION = {
  sections: [
    {
      title: 'Navegação',
      icon: '<i class="fas fa-home"></i>',
      items: [
        { label: 'Página Inicial', icon: '<i class="fas fa-home"></i>', href: 'index.html' },
        { label: 'Portal da Secretaria', icon: '<i class="fas fa-building"></i>', href: '../portal-secretaria/portal-secretaria.html', perm: 'portal.secretaria' },
        { label: 'Portal de Inscrição', icon: '<i class="fas fa-pen-alt"></i>', href: '../portal-inscricao/index.html', perm: 'portal.inscricao' },
      ]
    },
    {
      title: 'Académico',
      icon: '<i class="fas fa-book-open"></i>',
      roles: ['student'],
      items: [
        { label: 'Consulta de Frequência', icon: '<i class="fas fa-check"></i>', href: 'consulta-freq.html' },
        { label: 'Histórico Escolar', icon: '<i class="fas fa-chart-bar"></i>', href: 'historico-escolar.html' },
        { label: 'Estrutura Curricular', icon: '<i class="fas fa-book"></i>', href: 'estrutura-curricular.html' },
        { label: 'Quadro de Horários', icon: '<i class="fas fa-clock"></i>', href: 'quadro-horarios.html' },
      ]
    },
    {
      title: 'Calendário e Agenda',
      icon: '<i class="fas fa-calendar-alt"></i>',
      roles: ['student'],
      items: [
        { label: 'Agenda Escolar', icon: '<i class="fas fa-calendar-week"></i>', href: 'agenda-escolar.html' },
      ]
    },
    {
      title: 'Comunicação',
      icon: '<i class="fas fa-comment-dots"></i>',
      items: [
        { label: 'Reclamações', icon: '<i class="fas fa-exclamation-triangle"></i>', href: 'reclamacoes.html' },
        { label: 'Atendimento Agendado', icon: '<i class="fas fa-phone"></i>', href: 'atendimento-agendado.html' },
        { label: 'Apelação', icon: '<i class="fas fa-gavel"></i>', href: 'ouvidoria.html' },
      ]
    },
    {
      title: 'Documentos',
      icon: '<i class="fas fa-file-alt"></i>',
      roles: ['student'],
      items: [
        { label: 'Meus Documentos', icon: '<i class="fas fa-bookmark"></i>', href: 'meus-documentos.html' },
      ]
    },
    {
      title: 'Financeiro',
      icon: '<i class="fas fa-credit-card"></i>',
      roles: ['student'],
      items: [
        { label: 'Financeiro', icon: '<i class="fas fa-credit-card"></i>', href: 'financeiro.html' },
      ]
    },
    {
      title: 'Conta',
      icon: '<i class="fas fa-user"></i>',
      items: [
        { label: 'Meu Perfil', icon: '<i class="fas fa-wrench"></i>', href: 'conta.html' },
      ]
    }
  ]
};

/**
 * Constrói a sidebar com navegação inteligente
 */
function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) {
    console.warn('Sidebar não encontrada no DOM');
    return;
  }

  // Obtém role e permissoes do usuário logado
  const auth = (() => { try { return JSON.parse(localStorage.getItem('auth')); } catch { return null; } })();
  const role = auth?.usuario?.role || '';
  const permissoes = auth?.permissoes || [];

  const hasPerm = (codigo) => permissoes.includes(codigo);

  // Limpa o conteúdo existente (apenas a navegação)
  const navContent = sidebar.querySelector('nav') || sidebar;
  
  if (!sidebar.querySelector('nav')) {
    const nav = document.createElement('nav');
    nav.id = 'sidebar-nav';
    sidebar.innerHTML = '';
    sidebar.appendChild(nav);
  }

  const nav = sidebar.querySelector('nav');
  nav.innerHTML = '';

  // Adiciona cada seção de navegação, filtrando por role
  SIDEBAR_NAVIGATION.sections.forEach((section) => {
    // Se a seção tem perm definida, só mostra se o usuário tiver a permissao
    if (section.perm && !hasPerm(section.perm)) {
      return;
    }
    // Se a seção tem roles definidas, só mostra se o usuário tiver uma delas
    if (section.roles && !section.roles.includes(role.toLowerCase().replace('role_', ''))) {
      return;
    }

    const sectionEl = document.createElement('div');
    sectionEl.className = 'nav-section';

    // Título da seção
    const titleEl = document.createElement('div');
    titleEl.className = 'nav-section-title';
    titleEl.textContent = section.title;
    sectionEl.appendChild(titleEl);

    // Items da seção
    section.items.forEach((item) => {
      // Se o item tem perm definida, só mostra se o usuário tiver a permissao
      if (item.perm && !hasPerm(item.perm)) {
        return;
      }
      const itemEl = document.createElement('a');
      itemEl.href = item.href;
      itemEl.className = 'nav-item';

      const currentPage = getCurrentFileName();
      if (item.href === currentPage) {
        itemEl.classList.add('active');
      }

      itemEl.innerHTML = `
        <span class="nav-item-icon">${item.icon}</span>
        <span class="nav-item-text">${item.label}</span>
      `;

      itemEl.addEventListener('click', () => {
        closeSidebar();
        highlightCurrentPage();
      });

      sectionEl.appendChild(itemEl);
    });

    nav.appendChild(sectionEl);
  });

  // Adiciona botão de logout no final
  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'logout-btn';
  logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair da Conta';
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Tem certeza que deseja sair?')) {
      clearAuth();
      window.location.href = 'login.html';
    }
  });
  
  // Cria um container para o botão se não existir
  if (!sidebar.querySelector('.sidebar-footer')) {
    const footer = document.createElement('div');
    footer.className = 'sidebar-footer';
    footer.style.position = 'relative';
    footer.style.height = '80px';
    footer.appendChild(logoutBtn);
    sidebar.appendChild(footer);
  } else {
    sidebar.querySelector('.sidebar-footer').appendChild(logoutBtn);
  }
}

/**
 * Obtém o nome do arquivo atual
 */
function getCurrentFileName() {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  return filename;
}

/**
 * Destaca a página atual na sidebar
 */
function highlightCurrentPage() {
  const currentPage = getCurrentFileName();
  document.querySelectorAll('#sidebar .nav-item').forEach((item) => {
    const href = item.getAttribute('href');
    if (href === currentPage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function setOverlay(visible) {
  const overlay = document.querySelector('.nav-overlay');
  if (overlay) {
    overlay.classList.toggle('visible', visible);
  }
}

/**
 * Abre a sidebar
 */
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.add('asideAberto');
    setOverlay(true);
  }
}

/**
 * Fecha a sidebar
 */
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.remove('asideAberto');
    setOverlay(false);
  }
}

/**
 * Alterna a sidebar (abre/fecha)
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    const isOpen = sidebar.classList.toggle('asideAberto');
    setOverlay(isOpen);
  }
}

/**
 * Inicializa a sidebar ao carregar a página
 */
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  highlightCurrentPage();

  // Conecta o botão de menu à sidebar
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });
  }

  // Compatibilidade: também escuta botões com a classe antiga `botaoMiniHeader`
  const miniButtons = document.querySelectorAll('.botaoMiniHeader');
  if (miniButtons && miniButtons.length) {
    miniButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
      });
    });
  }

  // Fecha sidebar ao clicar fora dela
  const navOverlay = document.querySelector('.sidebar-overlay') || document.querySelector('.nav-overlay');
  if (navOverlay) {
    navOverlay.addEventListener('click', closeSidebar);
  }

  // Fecha sidebar ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
    }
  });
});

// Exporta para uso global
window.sidebarOpen = openSidebar;
window.sidebarClose = closeSidebar;
window.sidebarToggle = toggleSidebar;

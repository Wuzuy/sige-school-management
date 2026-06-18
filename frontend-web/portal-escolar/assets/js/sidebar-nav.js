/**
 * Navegação da Sidebar - Sistema de Navegação Inteligente
 * Define todas as páginas e categorias do portal
 */

const SIDEBAR_NAVIGATION = {
  sections: [
    {
      title: 'Navegação',
      icon: '🏠',
      items: [
        { label: 'Página Inicial', icon: '🏠', href: 'index.html' },
      ]
    },
    {
      title: 'Académico',
      icon: '📚',
      items: [
        { label: 'Consulta de Frequência', icon: '✓', href: 'consulta-freq.html' },
        { label: 'Histórico Escolar', icon: '📊', href: 'historico-escolar.html' },
        { label: 'Estrutura Curricular', icon: '📖', href: 'estrutura-curricular.html' },
        { label: 'Quadro de Horários', icon: '🕐', href: 'quadro-horarios.html' },
      ]
    },
    {
      title: 'Calendário e Agenda',
      icon: '📅',
      items: [
        { label: 'Agenda Escolar', icon: '📆', href: 'agenda-escolar.html' },
      ]
    },
    {
      title: 'Comunicação',
      icon: '💬',
      items: [
        { label: 'Reclamações', icon: '⚠️', href: 'reclamacoes.html' },
        { label: 'Ouvidoria', icon: '🎤', href: 'ouvidoria.html' },
        { label: 'Atendimento Agendado', icon: '📞', href: 'atendimento-agendado.html' },
      ]
    },
    {
      title: 'Documentação',
      icon: '📄',
      items: [
        { label: 'Meus Documentos', icon: '📑', href: 'meus-documentos.html' },
      ]
    },
    {
      title: 'Conta',
      icon: '👤',
      items: [
        { label: 'Meu Perfil', icon: '🔧', href: 'conta.html' },
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

  // Adiciona cada seção de navegação
  SIDEBAR_NAVIGATION.sections.forEach((section) => {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'nav-section';

    // Título da seção
    const titleEl = document.createElement('div');
    titleEl.className = 'nav-section-title';
    titleEl.textContent = section.title;
    sectionEl.appendChild(titleEl);

    // Items da seção
    section.items.forEach((item) => {
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
  logoutBtn.innerHTML = '🚪 Sair da Conta';
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

/**
 * Abre a sidebar
 */
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.add('asideAberto');
  }
}

/**
 * Fecha a sidebar
 */
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.remove('asideAberto');
  }
}

/**
 * Alterna a sidebar (abre/fecha)
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('asideAberto');
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

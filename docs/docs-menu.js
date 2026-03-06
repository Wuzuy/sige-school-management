/**
 * Controle do menu hambúrguer para documentação (mobile)
 */
(function() {
  'use strict';

  function setupDocsMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const overlay = document.querySelector('.menu-overlay');

    if (!menuToggle || !menu) return;

    const closeMenu = () => {
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '☰';
      // Permitir scroll do body
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      menu.classList.add('open');
      if (overlay) overlay.classList.add('visible');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.innerHTML = '✕';
      // Prevenir scroll do body em mobile
      if (window.innerWidth <= 640) {
        document.body.style.overflow = 'hidden';
      }
    };

    const toggleMenu = () => {
      if (menu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    // Clicar no botão
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Fechar ao clicar em um link do menu
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Fechar ao clicar no overlay
    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Fechar ao redimensionar para desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 640 && menu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // Inicializar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDocsMenu);
  } else {
    setupDocsMenu();
  }
})();

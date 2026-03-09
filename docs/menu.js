// Menu hambúrguer para documentação SEJA SENAI
(function() {
  'use strict';

  // Espera o DOM carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    setupMobileMenu();
  }

  function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const overlay = document.querySelector('.menu-overlay');

    if (!menuToggle || !menu) return;

    // Função para fechar o menu
    const closeMenu = () => {
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '☰';
    };

    // Função para abrir/fechar menu
    const toggleMenu = () => {
      const isOpen = menu.classList.toggle('open');
      if (overlay) overlay.classList.toggle('visible', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggle.innerHTML = isOpen ? '✕' : '☰';
    };

    // Click no botão hambúrguer
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Click nos links do menu (fecha o menu)
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Click no overlay (fecha o menu)
    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Fechar menu ao redimensionar para desktop
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 640 && menu.classList.contains('open')) {
          closeMenu();
        }
      }, 250);
    });
  }
})();

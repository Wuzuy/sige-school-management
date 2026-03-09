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

    if (!menuToggle || !menu) {
      console.error('Menu elements not found!', { menuToggle, menu });
      return;
    }

    console.log('Menu setup - elementos encontrados');

    // Função para fechar o menu
    const closeMenu = () => {
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '☰';
      document.body.style.overflow = '';
    };

    // Função para abrir/fechar menu
    const toggleMenu = () => {
      const isOpen = menu.classList.toggle('open');
      if (overlay) overlay.classList.toggle('visible', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggle.innerHTML = isOpen ? '✕' : '☰';
      document.body.style.overflow = isOpen ? 'hidden' : '';
      console.log('Menu toggled:', isOpen ? 'ABERTO' : 'FECHADO');
    };

    // iOS Safari fix - prevenir comportamento padrão
    const handleToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      console.log('Botão clicado/tocado - tipo:', e.type);
      toggleMenu();
      return false;
    };
    
    // Múltiplos event listeners para iOS Safari
    menuToggle.addEventListener('click', handleToggle, { passive: false });
    menuToggle.addEventListener('touchend', handleToggle, { passive: false });
    
    // iOS Safari - prevenir zoom ao dar double tap
    let lastTouchEnd = 0;
    menuToggle.addEventListener('touchstart', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });

    // Click/Touch nos links do menu (fecha o menu)
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        setTimeout(closeMenu, 100);
      });
      link.addEventListener('touchend', (e) => {
        setTimeout(closeMenu, 100);
      }, { passive: true });
    });

    // Click/Touch no overlay (fecha o menu)
    if (overlay) {
      const handleOverlayClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      };
      overlay.addEventListener('click', handleOverlayClick);
      overlay.addEventListener('touchend', handleOverlayClick, { passive: false });
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

(function () {
  'use strict';

  function initHamburger() {
    var hamburger = document.querySelector('.hamburger');
    var sidebar = document.querySelector('.sidebar');
    var overlay = document.querySelector('.sidebar-overlay');

    if (!hamburger || !sidebar) return;

    function closeSidebar() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    }

    function openSidebar() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('active');
    }

    hamburger.addEventListener('click', function () {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });
  }

  function initActivePage() {
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.sidebar-nav a');
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === currentPath) {
        a.classList.add('active');
      }
    });
  }

  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var target = e.target;
      while (target && target.tagName !== 'A') target = target.parentNode;
      if (!target) return;
      var href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        var el = document.getElementById(href.substring(1));
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  function initDarkMode() {
    var toggle = document.querySelector('.theme-toggle');
    var stored = localStorage.getItem('sige-docs-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (toggle) toggle.textContent = '\u2600\uFE0F';
      } else {
        document.documentElement.removeAttribute('data-theme');
        if (toggle) toggle.textContent = '\uD83C\uDF19';
      }
    }

    var initialTheme = stored || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    if (toggle) {
      toggle.addEventListener('click', function () {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        var newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('sige-docs-theme', newTheme);
        applyTheme(newTheme);
      });
    }
  }

  function initCopyButtons() {
    var pres = document.querySelectorAll('pre');
    pres.forEach(function (pre) {
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copiar';
      pre.style.position = 'relative';
      pre.appendChild(btn);

      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.textContent : pre.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            btn.textContent = 'Copiado!';
            btn.classList.add('copied');
            setTimeout(function () {
              btn.textContent = 'Copiar';
              btn.classList.remove('copied');
            }, 2000);
          });
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          btn.textContent = 'Copiado!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'Copiar';
            btn.classList.remove('copied');
          }, 2000);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHamburger();
    initActivePage();
    initSmoothScroll();
    initDarkMode();
    initCopyButtons();
  });
})();

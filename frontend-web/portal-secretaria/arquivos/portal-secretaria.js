function fixLogoutPaths() {
  document.querySelectorAll('[data-logout]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (typeof clearAuth === 'function') clearAuth();
      window.location.href = '../portal-escolar/login.html';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fixLogoutPaths();
});

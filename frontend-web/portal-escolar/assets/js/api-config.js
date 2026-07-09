// Configuracao automatica de ambiente
// Local: usa localhost:8080 | Producao: usa Render
(function() {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    console.log('API: modo local (localhost:8080)');
    return;
  }
  if (host.includes('vercel.app')) {
    // Substitua pela URL do seu backend no Render
    window.API_BASE_URL = '/api';
    console.log('API: modo producao ->', window.API_BASE_URL);
  }
})();

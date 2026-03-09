// Configuracao automatica - 09/03/2026 15:25:00
(function() {
  const API_URL = 'https://mid-sci-timber-sku.trycloudflare.com';
  localStorage.setItem('API_BASE_URL', API_URL);
  window.API_BASE_URL = API_URL;
  console.log('API configurada:', API_URL);
})();
// Configuracao automatica - 09/03/2026 15:20:13
(function() {
  const API_URL = 'https://hay-students-hopefully-kijiji.trycloudflare.com';
  localStorage.setItem('API_BASE_URL', API_URL);
  window.API_BASE_URL = API_URL;
  console.log('API configurada:', API_URL);
})();
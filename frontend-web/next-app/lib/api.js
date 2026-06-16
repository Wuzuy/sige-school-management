export function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    // Para Server-Side Rendering
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
  }

  // 1. Prioridade: LocalStorage (configurado pelo usuário)
  const savedUrl = localStorage.getItem('API_BASE_URL');
  if (savedUrl) {
    return savedUrl;
  }
  
  // 2. Variável de ambiente (Next.js env)
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // 3. Fallback: localhost (desenvolvimento local)
  return 'http://localhost:8080/api';
}

export function updateApiBaseUrl(newUrl) {
  if (typeof window !== 'undefined' && newUrl && newUrl.trim()) {
    const cleanUrl = newUrl.trim().replace(/\/$/, '');
    localStorage.setItem('API_BASE_URL', cleanUrl);
    return cleanUrl;
  }
  return null;
}

export function authHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  
  if (typeof window !== 'undefined') {
    const rawAuth = localStorage.getItem('auth');
    if (rawAuth) {
      try {
        const auth = JSON.parse(rawAuth);
        if (auth?.token) {
          headers.Authorization = `Bearer ${auth.token}`;
        }
      } catch (e) {
        console.error("Error parsing auth headers", e);
      }
    }
  }
  return headers;
}

export async function request(path, options = {}) {
  const API_BASE = getApiBaseUrl();
  const url = `${API_BASE}${path}`;
  
  // Mergear cabeçalhos de auth se não forem explicitamente fornecidos e não for publico (opcional)
  if (!options.headers) {
    options.headers = authHeaders();
  } else if (!options.headers['Content-Type']) {
    // preserve content-type se existir
    options.headers = { ...authHeaders(true), ...options.headers };
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const raw = await response.text();
    let message = raw;
    try {
      const json = JSON.parse(raw);
      message = json.erro || json.error || json.message || json.msg || raw;
    } catch(e) {}
    throw new Error(message || 'Falha na requisição');
  }

  if (response.status === 204) return null;
  
  // Tentar ler json, mas dar fallback para texto se não houver conteúdo
  const text = await response.text();
  if (!text) return null;
  
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

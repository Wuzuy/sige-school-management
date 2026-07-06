import { Platform } from 'react-native';
import Constants from 'expo-constants';

const RENDER_API = 'https://sige-1gqx.onrender.com/api';

// Armazenamento em memoria (funciona no React Native e Web)
let _apiBase: string | null = null;
let _auth: { token: string; usuario: any } | null = null;

function getDefaultBase(): string {
  const envUrl = Constants.expoConfig?.extra?.API_BASE_URL;
  if (envUrl) return envUrl;
  return RENDER_API;
}

export function getApiBase(): string {
  return _apiBase || getDefaultBase();
}

export function setApiBase(url: string) {
  _apiBase = url.replace(/\/$/, '');
}

export function resetApiBase() {
  _apiBase = null;
}

export function getAuth(): { token: string; usuario: any } | null {
  return _auth;
}

export function setAuth(data: { token: string; usuario: any }) {
  _auth = data;
}

export function clearAuth() {
  _auth = null;
}

export async function request(path: string, options: RequestInit = {}) {
  const base = getApiBase();
  const headers: Record<string, string> = { ...(options.headers as any) };
  if (_auth?.token) {
    headers.Authorization = `Bearer ${_auth.token}`;
  }
  if (!headers['Content-Type'] && options.method && options.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${base}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401 && !_auth?.token?.startsWith('fake.')) {
      clearAuth();
    }
    throw new Error(text || 'Falha na requisicao');
  }
  if (res.status === 204) return null;
  return res.json();
}

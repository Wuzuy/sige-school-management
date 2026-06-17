import { Platform } from 'react-native';
import Constants from 'expo-constants';

const RENDER_API = 'https://sige-1gqx.onrender.com/api';

function getDefaultBase(): string {
  const envUrl = Constants.expoConfig?.extra?.API_BASE_URL;
  if (envUrl) return envUrl;
  return RENDER_API;
}

function getStoredBase(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem('API_BASE_URL');
  } catch {
    return null;
  }
}

function setStoredBase(url: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('API_BASE_URL', url);
  }
}

export function getApiBase(): string {
  return getStoredBase() || getDefaultBase();
}

export function setApiBase(url: string) {
  setStoredBase(url);
}

export function resetApiBase() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('API_BASE_URL');
  }
}

export function getAuth(): { token: string; usuario: any } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(data: { token: string; usuario: any }) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('auth', JSON.stringify(data));
  }
}

export function clearAuth() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('auth');
  }
}

export async function request(path: string, options: RequestInit = {}) {
  const base = getApiBase();
  const auth = getAuth();
  const headers: Record<string, string> = { ...(options.headers as any) };
  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }
  if (!headers['Content-Type'] && options.method && options.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${base}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401) {
      clearAuth();
    }
    throw new Error(text || 'Falha na requisicao');
  }
  if (res.status === 204) return null;
  return res.json();
}

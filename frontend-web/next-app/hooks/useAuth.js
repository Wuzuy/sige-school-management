'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

function getStorageAuth() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return null;
    const auth = JSON.parse(raw);
    if (!auth?.token || !auth?.usuario) return null;
    return auth;
  } catch {
    return null;
  }
}

function setStorageAuth(auth) {
  if (!auth?.token || !auth?.usuario) return;
  localStorage.setItem('auth', JSON.stringify(auth));
}

function clearStorageAuth() {
  localStorage.removeItem('auth');
}

function createFakeToken(email) {
  const payload = btoa(JSON.stringify({ email, iat: Math.floor(Date.now() / 1000) }));
  return `fake.${payload}.${Math.floor(Math.random() * 1000000)}`;
}

function createFakeAuth(overrides) {
  const { email = 'visitante@local', nomeCompleto = 'Visitante', role = 'ROLE_USER' } = overrides || {};
  return {
    token: createFakeToken(email),
    usuario: { id: -1, email, nomeCompleto, role },
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getStorageAuth();
    if (auth) setUser(auth.usuario);
    setLoading(false);
  }, []);

  const login = useCallback((auth) => {
    setStorageAuth(auth);
    setUser(auth.usuario);
  }, []);

  const loginAsVisitor = useCallback((overrides) => {
    const auth = createFakeAuth(overrides);
    setStorageAuth(auth);
    setUser(auth.usuario);
    return auth;
  }, []);

  const logout = useCallback(() => {
    clearStorageAuth();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    const raw = localStorage.getItem('auth');
    if (!raw) return;
    try {
      const auth = JSON.parse(raw);
      auth.usuario = { ...auth.usuario, ...updates };
      setStorageAuth(auth);
      setUser(auth.usuario);
    } catch {}
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ROLE_ADMIN',
    login,
    loginAsVisitor,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useAuthGuard(requiredRole) {
  const { user, loading, isAuthenticated } = useAuth();
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      setRedirectTo('/portal-escolar/login');
      return;
    }
    if (requiredRole && user?.role !== requiredRole) {
      setRedirectTo('/portal-escolar');
      return;
    }
    setRedirectTo(null);
  }, [user, loading, isAuthenticated, requiredRole]);

  return { user, loading, isAuthenticated, redirectTo };
}

// Utility functions
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password) {
  if (!password || password.length < 8) return false;
  return /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[@#$%^&+=!]/.test(password);
}

export function sanitize(str) {
  if (!str) return '';
  return String(str).trim().slice(0, 500);
}

export function formatDate(value) {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR');
}

export function toDateInputValue(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

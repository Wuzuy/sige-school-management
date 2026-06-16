'use client';

import { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const NotyfContext = createContext(null);

export function NotyfProvider({ children }) {
  const notyfRef = useRef(null);

  useEffect(() => {
    notyfRef.current = new Notyf({
      duration: 5000,
      position: { x: 'right', y: 'top' },
      dismissible: true,
      ripple: true,
      types: [
        { type: 'success', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', icon: { className: 'notyf__icon--success', tagName: 'span', text: '✓' } },
        { type: 'error', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', icon: { className: 'notyf__icon--error', tagName: 'span', text: '✕' } },
        { type: 'warning', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', icon: { className: 'notyf__icon--warning', tagName: 'span', text: '⚠' } },
        { type: 'info', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', icon: { className: 'notyf__icon--info', tagName: 'span', text: 'ℹ' } },
      ],
    });
  }, []);

  const notify = useCallback((message, type = 'info', duration = 5000) => {
    if (!notyfRef.current) {
      console.log(`[${type.toUpperCase()}] ${message}`);
      return;
    }
    notyfRef.current.open({ type, message, duration });
  }, []);

  const success = useCallback((msg) => notify(msg, 'success'), [notify]);
  const error = useCallback((msg) => notify(msg, 'error', 7000), [notify]);
  const warning = useCallback((msg) => notify(msg, 'warning', 6000), [notify]);
  const info = useCallback((msg) => notify(msg, 'info'), [notify]);

  return (
    <NotyfContext.Provider value={{ notify, success, error, warning, info }}>
      {children}
    </NotyfContext.Provider>
  );
}

export function useNotyf() {
  const ctx = useContext(NotyfContext);
  if (!ctx) throw new Error('useNotyf must be used within NotyfProvider');
  return ctx;
}

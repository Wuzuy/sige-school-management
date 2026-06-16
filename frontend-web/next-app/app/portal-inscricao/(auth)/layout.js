'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNotyf } from '@/components/NotyfProvider';
import HeaderInscricao from '@/components/HeaderInscricao';
import SidebarInscricao from '@/components/SidebarInscricao';

function AuthGuard({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { warning } = useNotyf();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      warning('Faça login para acessar esta página');
      router.replace('/portal-inscricao/login');
    }
  }, [user, loading, isAuthenticated, router, warning]);

  if (loading) return <div className="container"><p>Carregando...</p></div>;
  if (!isAuthenticated) return null;
  return children;
}

export default function PortalInscricaoLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <HeaderInscricao
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />
      <SidebarInscricao
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="container interface">
        {children}
      </main>
    </AuthGuard>
  );
}

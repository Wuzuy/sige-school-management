'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function HeaderInscricao({ onToggleSidebar }) {
  const pathname = usePathname();
  const { isAdmin, logout } = useAuth();

  const isActive = (href) => pathname.startsWith(href);

  return (
    <>
      <header className="topbar">
        <button className="menu-toggle" type="button" aria-label="Abrir menu" onClick={onToggleSidebar}>
          <span>☰</span>
        </button>

        <div className="brand">
          <img src="/assets/images/sige.png" alt="SIGE" width={40} height={40} />
          <span>Portal de Inscrição</span>
        </div>

        <nav className="nav">
          <Link href="/portal-inscricao" className={isActive('/portal-inscricao') && pathname === '/portal-inscricao' ? 'nav-link-active' : ''}>
            Cursos
          </Link>
          <Link href="/portal-inscricao/inscricao" className={isActive('/portal-inscricao/inscricao') ? 'nav-link-active' : ''}>
            Inscrição
          </Link>
          <Link href="/portal-inscricao/status" className={isActive('/portal-inscricao/status') ? 'nav-link-active' : ''}>
            Status
          </Link>
          {isAdmin && (
            <Link href="/portal-escolar/portal-secretaria" className={isActive('/portal-escolar/portal-secretaria') ? 'nav-link-active' : ''}>
              Secretaria
            </Link>
          )}
          <button onClick={logout} type="button">Sair</button>
        </nav>
      </header>
      <div className="nav-overlay" />
    </>
  );
}

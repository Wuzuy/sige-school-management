'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Header({ onToggleSidebar, brandText = 'Portal Escolar' }) {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  const isActive = (href) => pathname.startsWith(href);

  return (
    <>
      <header className="topbar">
        <button className="menu-toggle" type="button" aria-label="Abrir menu" onClick={onToggleSidebar}>
          <span>☰</span>
        </button>

        <div className="brand">
          <img src="/assets/images/sige.png" alt="SIGE" width={40} height={40} />
          <span>{brandText}</span>
        </div>

        <nav className="nav">
          <Link href="/portal-escolar/portal-aluno" className={isActive('/portal-escolar/portal-aluno') ? 'nav-link-active' : ''}>
            Aluno
          </Link>
          <Link href="/portal-escolar/agenda-escolar" className={isActive('/portal-escolar/agenda-escolar') ? 'nav-link-active' : ''}>
            Agenda
          </Link>
          <Link href="/portal-escolar/calendario-escolar" className={isActive('/portal-escolar/calendario-escolar') ? 'nav-link-active' : ''}>
            Calendário
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

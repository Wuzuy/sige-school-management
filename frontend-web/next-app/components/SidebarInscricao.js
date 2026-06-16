'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const NAVIGATION = [
  {
    title: 'Inscrição',
    items: [
      { label: 'Cursos', icon: '📚', href: '/portal-inscricao' },
      { label: 'Nova Inscrição', icon: '📝', href: '/portal-inscricao/inscricao' },
      { label: 'Status', icon: '📋', href: '/portal-inscricao/status' },
    ],
  },
  {
    title: 'Matrícula',
    items: [
      { label: 'Aceitar Matrícula', icon: '✅', href: '/portal-inscricao/matricula' },
    ],
  },
];

export default function SidebarInscricao({ isOpen, onClose }) {
  const pathname = usePathname();
  const { isAdmin, logout } = useAuth();

  const isActive = (href) => pathname === href;

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />
      <aside id="sidebar" className={isOpen ? 'asideAberto' : ''}>
        <nav id="sidebar-nav">
          {NAVIGATION.map((section) => (
            <div key={section.title} className="nav-section">
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span className="nav-item-text">{item.label}</span>
                </Link>
              ))}
            </div>
          ))}

          {isAdmin && (
            <div className="nav-section">
              <div className="nav-section-title">Admin</div>
              <Link
                href="/portal-escolar/portal-secretaria"
                className={`nav-item ${isActive('/portal-escolar/portal-secretaria') ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-item-icon">🔐</span>
                <span className="nav-item-text">Portal Secretaria</span>
              </Link>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              onClose();
            }}
          >
            🚪 Sair
          </button>
        </div>
      </aside>
    </>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const NAVIGATION = [
  {
    title: 'Académico',
    items: [
      { label: 'Consulta de Frequência', icon: '✓', href: '/portal-escolar/consulta-freq' },
      { label: 'Histórico Escolar', icon: '📊', href: '/portal-escolar/historico-escolar' },
      { label: 'Estrutura Curricular', icon: '📖', href: '/portal-escolar/estrutura-curricular' },
      { label: 'Quadro de Horários', icon: '🕐', href: '/portal-escolar/quadro-horarios' },
    ],
  },
  {
    title: 'Calendário e Agenda',
    items: [
      { label: 'Agenda Escolar', icon: '📆', href: '/portal-escolar/agenda-escolar' },
      { label: 'Calendário Escolar', icon: '📅', href: '/portal-escolar/calendario-escolar' },
    ],
  },
  {
    title: 'Comunicação',
    items: [
      { label: 'Reclamações', icon: '⚠️', href: '/portal-escolar/reclamacoes' },
      { label: 'Ouvidoria', icon: '🎤', href: '/portal-escolar/ouvidoria' },
      { label: 'Atendimento Agendado', icon: '📞', href: '/portal-escolar/atendimento-agendado' },
    ],
  },
  {
    title: 'Documentação',
    items: [
      { label: 'Meus Documentos', icon: '📑', href: '/portal-escolar/meus-documentos' },
    ],
  },
  {
    title: 'Conta',
    items: [
      { label: 'Portal do Aluno', icon: '👤', href: '/portal-escolar/portal-aluno' },
      { label: 'Credenciais', icon: '🔧', href: '/portal-escolar/conta' },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { logout, isAdmin } = useAuth();

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

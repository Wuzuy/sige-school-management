'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function PortalEscolarDashboard() {
  const { isAdmin } = useAuth();

  return (
    <section>
      <section className="hero">
        <h1>Bem-vindo ao Portal Escolar</h1>
        <p>Gerencie seus dados e acompanhe informações escolares</p>
      </section>

      <section className="grid">
        <article className="card card-6">
          <h2>📅 Agenda Escolar</h2>
          <p className="muted" style={{ marginBottom: '12px' }}>Confira eventos e atividades</p>
          <Link href="/portal-escolar/agenda-escolar" className="btn btn-primary">Ver Agenda</Link>
        </article>

        <article className="card card-6">
          <h2>📆 Calendário</h2>
          <p className="muted" style={{ marginBottom: '12px' }}>Datas importantes do ano letivo</p>
          <Link href="/portal-escolar/calendario-escolar" className="btn btn-primary">Ver Calendário</Link>
        </article>

        <article className="card card-6">
          <h2>👤 Meu Perfil</h2>
          <p className="muted" style={{ marginBottom: '12px' }}>Dados pessoais e acadêmicos</p>
          <Link href="/portal-escolar/portal-aluno" className="btn btn-primary">Acessar Perfil</Link>
        </article>

        <article className="card card-6">
          <h2>📊 Histórico</h2>
          <p className="muted" style={{ marginBottom: '12px' }}>Seu histórico escolar</p>
          <Link href="/portal-escolar/historico-escolar" className="btn btn-primary">Ver Histórico</Link>
        </article>

        {isAdmin && (
          <article className="card" style={{ gridColumn: 'span 12' }}>
            <h2>🔐 Área Administrativa</h2>
            <p className="muted" style={{ marginBottom: '12px' }}>Acesso restrito a secretaria</p>
            <Link href="/portal-escolar/portal-secretaria" className="btn btn-edital">Ir para Portal da Secretaria</Link>
          </article>
        )}
      </section>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { request, authHeaders } from '@/lib/api';
import { useNotyf } from '@/components/NotyfProvider';
import { formatDate } from '@/hooks/useAuth';

export default function AtendimentoPage() {
  const { error } = useNotyf();
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/atendimentos', { headers: authHeaders(false) })
      .then((data) => setAtendimentos(Array.isArray(data) ? data : []))
      .catch((err) => error(`Erro: ${err.message}`))
      .finally(() => setLoading(false));
  }, [error]);

  const pendentes = atendimentos.filter((a) => a.status === 'AGENDADO' || a.status === 'PENDENTE');
  const concluidos = atendimentos.filter((a) => a.status === 'REALIZADO' || a.status === 'CONCLUIDO');

  return (
    <section>
      <section className="hero">
        <h1>Atendimento Agendado</h1>
        <p>Agende e acompanhe seus atendimentos</p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Próximos Atendimentos</h2>
            <button className="btn btn-primary" onClick={() => alert('Funcionalidade de agendamento - integrar com backend.')}>+ Novo Agendamento</button>
          </div>

          <div className="containerCardsAA">
            {loading ? (
              <p>Carregando...</p>
            ) : pendentes.length === 0 ? (
              <p className="muted">Nenhum atendimento agendado.</p>
            ) : (
              pendentes.map((a, i) => (
                <div key={i} className="cardAA">
                  <div>
                    <strong>{a.titulo || a.motivo || 'Atendimento'}</strong>
                    <span className="status">{a.status}</span>
                  </div>
                  <p>Data: {formatDate(a.data)}</p>
                  <p>Horário: {a.horario || '-'}</p>
                  <p>Local: {a.local || 'Online'}</p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="card" style={{ gridColumn: 'span 5', alignSelf: 'start' }}>
          <h2>Resumo</h2>
          <div className="contadorReunioes">
            <div className="reuniao">
              <h1>{pendentes.length}</h1>
              <p>Agendados</p>
            </div>
            <div className="reuniao">
              <h1>{concluidos.length}</h1>
              <p>Realizados</p>
            </div>
          </div>

          {concluidos.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Últimos Realizados</h3>
              {concluidos.slice(0, 3).map((a, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <p><strong>{a.titulo || a.motivo}</strong></p>
                  <p className="muted">{formatDate(a.data)}</p>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </section>
  );
}

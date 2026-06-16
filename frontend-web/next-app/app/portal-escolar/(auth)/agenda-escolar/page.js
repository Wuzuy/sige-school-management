'use client';

import { useState, useEffect } from 'react';
import { request, authHeaders } from '@/lib/api';
import { useNotyf } from '@/components/NotyfProvider';
import { formatDate } from '@/hooks/useAuth';

export default function AgendaPage() {
  const { error } = useNotyf();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/agenda', { headers: authHeaders(false) })
      .then((data) => setEventos(Array.isArray(data) ? data : []))
      .catch((err) => error(`Erro ao carregar agenda: ${err.message}`))
      .finally(() => setLoading(false));
  }, [error]);

  return (
    <section>
      <section className="hero">
        <h1>Agenda Escolar</h1>
        <p>Confira os eventos e atividades programadas</p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Próximos Eventos</h2>
          <div id="agenda-events" style={{ lineHeight: 1.8 }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Carregando agenda...</p>
            ) : eventos.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Nenhum evento programado.</p>
            ) : (
              eventos.map((e, i) => (
                <div key={i} style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                  <strong>{e.titulo || e.nome || 'Evento'}</strong>
                  {e.data && <span style={{ color: '#6b7280', marginLeft: '12px' }}>{formatDate(e.data)}</span>}
                  {e.descricao && <p style={{ marginTop: '4px', color: '#4b5563' }}>{e.descricao}</p>}
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </section>
  );
}

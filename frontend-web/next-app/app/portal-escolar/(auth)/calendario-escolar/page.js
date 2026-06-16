'use client';

import { useState, useEffect } from 'react';
import { request, authHeaders } from '@/lib/api';
import { useNotyf } from '@/components/NotyfProvider';
import { formatDate } from '@/hooks/useAuth';

export default function CalendarioPage() {
  const { error } = useNotyf();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/calendario', { headers: authHeaders(false) })
      .then((data) => setEventos(Array.isArray(data) ? data : []))
      .catch((err) => error(`Erro ao carregar calendário: ${err.message}`))
      .finally(() => setLoading(false));
  }, [error]);

  return (
    <section>
      <section className="hero">
        <h1>Calendário Escolar</h1>
        <p>Datas importantes do ano letivo</p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Datas Comemorativas e Eventos</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Data</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>Carregando...</td></tr>
                ) : eventos.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>Nenhum evento cadastrado.</td></tr>
                ) : (
                  eventos.map((e, i) => (
                    <tr key={i}>
                      <td>{e.evento || e.titulo || e.nome || '-'}</td>
                      <td>{formatDate(e.data)}</td>
                      <td>{e.descricao || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </section>
  );
}

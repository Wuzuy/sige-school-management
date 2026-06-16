'use client';

import { useState, useEffect } from 'react';
import { request, authHeaders } from '@/lib/api';
import { useNotyf } from '@/components/NotyfProvider';

export default function HistoricoPage() {
  const { error } = useNotyf();
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/historico', { headers: authHeaders(false) })
      .then((data) => setDisciplinas(Array.isArray(data) ? data : []))
      .catch((err) => error(`Erro ao carregar histórico: ${err.message}`))
      .finally(() => setLoading(false));
  }, [error]);

  return (
    <section>
      <section className="hero">
        <h1>Histórico Escolar</h1>
        <p>Visualize seu histórico acadêmico</p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Disciplinas e Notas</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Disciplina</th>
                  <th>Professor</th>
                  <th>Nota Final</th>
                  <th>Frequência</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Carregando histórico...</td></tr>
                ) : disciplinas.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Nenhum registro encontrado.</td></tr>
                ) : (
                  disciplinas.map((d, i) => (
                    <tr key={i}>
                      <td>{d.disciplina || d.nome || '-'}</td>
                      <td>{d.professor || '-'}</td>
                      <td>{d.notaFinal ?? d.nota ?? '-'}</td>
                      <td>{d.frequencia ? `${d.frequencia}%` : '-'}</td>
                      <td>
                        <span className={`status ${(d.status === 'APROVADO' || d.status === 'APROVADA') ? 'alert-ok' : ''}`}>
                          {d.status || '-'}
                        </span>
                      </td>
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

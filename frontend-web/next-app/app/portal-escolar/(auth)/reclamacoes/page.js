'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { request, authHeaders } from '@/lib/api';
import { useNotyf } from '@/components/NotyfProvider';
import { formatDate } from '@/hooks/useAuth';

export default function ReclamacoesPage() {
  const { error } = useNotyf();
  const [reclamacoes, setReclamacoes] = useState([]);
  const [stats, setStats] = useState({ pendentes: 0, andamento: 0, resolvidas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/reclamacoes', { headers: authHeaders(false) })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setReclamacoes(list);
        setStats({
          pendentes: list.filter((r) => r.status === 'PENDENTE').length,
          andamento: list.filter((r) => r.status === 'EM_ANDAMENTO').length,
          resolvidas: list.filter((r) => r.status === 'RESOLVIDA').length,
        });
      })
      .catch((err) => error(`Erro: ${err.message}`))
      .finally(() => setLoading(false));
  }, [error]);

  return (
    <section>
      <section className="hero">
        <h1>Reclamações</h1>
        <p>Acompanhe suas reclamações e solicitações</p>
      </section>

      <section className="grid">
        <div className="containerCardR" style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="cardR">
            <div><h1>Pendentes</h1></div>
            <h1>{stats.pendentes}</h1>
            <p>Aguardando análise</p>
          </div>
          <div className="cardR">
            <div><h1>Em Andamento</h1></div>
            <h1>{stats.andamento}</h1>
            <p>Em análise</p>
          </div>
          <div className="cardR">
            <div><h1>Resolvidas</h1></div>
            <h1>{stats.resolvidas}</h1>
            <p>Finalizadas</p>
          </div>
        </div>

        <article className="card" style={{ gridColumn: 'span 12' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Lista de Reclamações</h2>
            <Link href="/portal-escolar/ouvidoria" className="btn btn-primary">Nova Reclamação</Link>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Protocolo</th>
                  <th>Título</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Carregando...</td></tr>
                ) : reclamacoes.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Nenhuma reclamação encontrada.</td></tr>
                ) : (
                  reclamacoes.map((r, i) => (
                    <tr key={i}>
                      <td>{r.protocolo || r.id || '-'}</td>
                      <td>{r.titulo || r.assunto || '-'}</td>
                      <td>{formatDate(r.data)}</td>
                      <td><span className="status">{r.status || '-'}</span></td>
                      <td>
                        <Link href={`/portal-escolar/detalhes-reclamacao?id=${r.id}`} className="btn btn-soft">Ver</Link>
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

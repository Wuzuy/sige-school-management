'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useNotyf } from '@/components/NotyfProvider';
import { request, authHeaders } from '@/lib/api';
import { formatDate } from '@/hooks/useAuth';

export default function StatusPage() {
  const { user } = useAuth();
  const { error: showError } = useNotyf();
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/inscricoes', { headers: authHeaders(false) })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setInscricoes(list.filter((i) => i?.id_usuario?.id === user?.id));
      })
      .catch((err) => showError(`Erro: ${err.message}`))
      .finally(() => setLoading(false));
  }, [user, showError]);

  return (
    <section>
      <section className="hero">
        <h1>Status da Inscrição</h1>
        <p>Acompanhe o andamento das suas inscrições</p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 12' }}>
          <p>
            <strong>Status atual:</strong>{' '}
            {loading ? 'Carregando...' : (inscricoes[0]?.status_aprovacao || 'Sem inscrições')}
          </p>
        </article>

        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Minhas Inscrições</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Unidade</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5">Carregando...</td></tr>
                ) : inscricoes.length === 0 ? (
                  <tr><td colSpan="5">Nenhuma inscrição encontrada.</td></tr>
                ) : (
                  inscricoes.map((i) => (
                    <tr key={i.id}>
                      <td>{i?.id_curso?.nome_curso || '-'}</td>
                      <td>{i.id_unidade || '-'}</td>
                      <td>{formatDate(i.data_inscricao)}</td>
                      <td><span className="status">{i.status_aprovacao}</span></td>
                      <td>
                        {i.status_matricula === 'AGUARDANDO_ACEITE' && (
                          <Link href={`/portal-inscricao/matricula?inscricaoId=${i.id}`} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                            Aceitar Matrícula
                          </Link>
                        )}
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

'use client';

import { useState, useEffect } from 'react';
import { request, authHeaders } from '@/lib/api';
import { useNotyf } from '@/components/NotyfProvider';
import { formatDate } from '@/hooks/useAuth';

export default function DocumentosPage() {
  const { error, success } = useNotyf();
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/documentos', { headers: authHeaders(false) })
      .then((data) => setDocumentos(Array.isArray(data) ? data : []))
      .catch((err) => error(`Erro ao carregar documentos: ${err.message}`))
      .finally(() => setLoading(false));
  }, [error]);

  const handleDownload = async (id) => {
    try {
      const blob = await request(`/documentos/${id}/download`, { headers: authHeaders(false) });
      success('Download iniciado (simulado).');
    } catch (err) {
      error(`Erro ao baixar: ${err.message}`);
    }
  };

  return (
    <section>
      <section className="hero">
        <h1>Meus Documentos</h1>
        <p>Acesse e baixe seus documentos acadêmicos</p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Documentos Disponíveis</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Data de Emissão</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Carregando...</td></tr>
                ) : documentos.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Nenhum documento disponível.</td></tr>
                ) : (
                  documentos.map((d, i) => (
                    <tr key={i}>
                      <td>{d.nome || d.titulo || '-'}</td>
                      <td>{formatDate(d.dataEmissao || d.data)}</td>
                      <td><span className="status">{d.status || '-'}</span></td>
                      <td>
                        <button className="btn btn-soft" onClick={() => handleDownload(d.id)}>📥 Baixar</button>
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

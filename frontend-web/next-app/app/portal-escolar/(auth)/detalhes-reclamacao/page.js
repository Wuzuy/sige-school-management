'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { request, authHeaders } from '@/lib/api';
import { useNotyf } from '@/components/NotyfProvider';
import { formatDate } from '@/hooks/useAuth';

function DetalhesReclamacaoContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { error } = useNotyf();
  const [reclamacao, setReclamacao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    request(`/reclamacoes/${id}`, { headers: authHeaders(false) })
      .then((data) => setReclamacao(data))
      .catch((err) => error(`Erro: ${err.message}`))
      .finally(() => setLoading(false));
  }, [id, error]);

  if (!id) return <p>ID da reclamação não informado.</p>;
  if (loading) return <p>Carregando...</p>;
  if (!reclamacao) return <p>Reclamação não encontrada.</p>;

  return (
    <section>
      <section className="hero">
        <h1>Detalhes da Reclamação</h1>
        <Link href="/portal-escolar/reclamacoes" className="btn btn-soft">← Voltar</Link>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 12' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Protocolo: {reclamacao.protocolo || reclamacao.id}</h2>
            <span className="status">{reclamacao.status}</span>
          </div>

          <h3>{reclamacao.titulo || reclamacao.assunto}</h3>
          <p style={{ margin: '12px 0', lineHeight: 1.6 }}>{reclamacao.descricao}</p>
          <p className="muted">Aberta em: {formatDate(reclamacao.data)}</p>

          {reclamacao.resposta && (
            <div style={{ marginTop: '24px', padding: '16px', background: '#f8fbff', borderRadius: '8px' }}>
              <h4>Resposta</h4>
              <p style={{ marginTop: '8px' }}>{reclamacao.resposta}</p>
              {reclamacao.dataResposta && <p className="muted" style={{ marginTop: '8px' }}>Respondida em: {formatDate(reclamacao.dataResposta)}</p>}
            </div>
          )}
        </article>
      </section>
    </section>
  );
}

export default function DetalhesReclamacaoPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <DetalhesReclamacaoContent />
    </Suspense>
  );
}

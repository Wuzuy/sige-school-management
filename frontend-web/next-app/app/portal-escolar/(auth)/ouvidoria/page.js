'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { request, authHeaders } from '@/lib/api';
import { useNotyf } from '@/components/NotyfProvider';
import { sanitize } from '@/hooks/useAuth';

export default function OuvidoriaPage() {
  const { success, error, warning } = useNotyf();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const titulo = sanitize(e.target.titulo.value);
    const descricao = sanitize(e.target.descricao.value);

    if (!titulo || titulo.length < 5) return warning('O título deve ter pelo menos 5 caracteres.');
    if (!descricao || descricao.length < 10) return warning('A descrição deve ter pelo menos 10 caracteres.');

    setLoading(true);
    try {
      await request('/reclamacoes', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ titulo, descricao }),
      });
      success('Reclamação enviada com sucesso!');
      router.push('/portal-escolar/reclamacoes');
    } catch (err) {
      error(`Erro ao enviar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <section className="hero">
        <h1>Ouvidoria</h1>
        <p>Registre sua reclamação, sugestão ou solicitação</p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 8' }}>
          <h2>Formulário</h2>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="titulo">Título</label>
              <input id="titulo" name="titulo" required placeholder="Resumo da sua solicitação" />
            </div>
            <div className="field">
              <label htmlFor="descricao">Descrição</label>
              <textarea id="descricao" name="descricao" rows="5" required placeholder="Descreva detalhadamente sua reclamação ou sugestão..." />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </article>

        <article className="card" style={{ gridColumn: 'span 4', alignSelf: 'start' }}>
          <h2>Informações</h2>
          <p className="muted" style={{ marginBottom: '12px' }}>
            Sua reclamação será analisada pela equipe administrativa. Acompanhe o status pela página de reclamações.
          </p>
          <p className="muted">📧 contato@sige.edu.br</p>
          <p className="muted">📞 (11) 3000-0000</p>
        </article>
      </section>
    </section>
  );
}

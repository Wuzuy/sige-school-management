'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNotyf } from '@/components/NotyfProvider';
import { request, authHeaders } from '@/lib/api';
import { formatDate } from '@/hooks/useAuth';

function MatriculaContent() {
  const { user } = useAuth();
  const { success, error: showError, warning, info } = useNotyf();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inscricaoId = searchParams.get('inscricaoId');
  const [inscricao, setInscricao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aceita, setAceita] = useState(false);

  useEffect(() => {
    if (!inscricaoId) {
      warning('Inscrição não identificada.');
      router.push('/portal-inscricao/status');
      return;
    }

    async function load() {
      try {
        const data = await request(`/inscricoes/${inscricaoId}`, { headers: authHeaders(false) });
        if (data.id_usuario.id !== user.id) {
          showError('Acesso não autorizado.');
          router.push('/portal-inscricao/status');
          return;
        }
        if (data.status_matricula !== 'AGUARDANDO_ACEITE') {
          warning('Matrícula não disponível para aceite.');
          router.push('/portal-inscricao/status');
          return;
        }
        setInscricao(data);
      } catch (err) {
        showError(`Erro: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [inscricaoId, user, router, warning, showError]);

  const handleAccept = async (e) => {
    e.preventDefault();
    try {
      await request(`/inscricoes/${inscricaoId}/matricula`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status_matricula: 'ACEITA', data_aceite_matricula: new Date().toISOString().slice(0, 10) }),
      });
      setAceita(true);
      success('Matrícula aceita com sucesso!');
    } catch (err) {
      showError(`Erro: ${err.message}`);
    }
  };

  const handleRefuse = async () => {
    if (!confirm('Tem certeza que deseja recusar esta matrícula?')) return;
    try {
      await request(`/inscricoes/${inscricaoId}/matricula`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status_matricula: 'RECUSADA', data_aceite_matricula: new Date().toISOString().slice(0, 10) }),
      });
      info('Matrícula recusada.');
      setTimeout(() => router.push('/portal-inscricao/status'), 2000);
    } catch (err) {
      showError(`Erro: ${err.message}`);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!inscricao) return <p>Inscrição não encontrada.</p>;
  if (aceita) {
    return (
      <div className="container" id="mensagem-sucesso" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1>✅ Matrícula Confirmada!</h1>
        <p>Sua matrícula foi aceita com sucesso.</p>
      </div>
    );
  }

  return (
    <section>
      <section className="hero">
        <h1>Matrícula</h1>
        <p>Confirme sua matrícula no curso</p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Dados do Aluno</h2>
          <p><strong>Nome:</strong> {inscricao.nome_completo_inscricao || inscricao?.id_usuario?.nomeCompleto}</p>
          <p><strong>CPF:</strong> {inscricao.cpf_inscricao || '-'}</p>
          <p><strong>Email:</strong> {inscricao.email_inscricao || inscricao?.id_usuario?.email}</p>
        </article>

        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Curso</h2>
          <p><strong>Curso:</strong> {inscricao?.id_curso?.nome_curso}</p>
          <p><strong>Turno:</strong> {inscricao?.id_curso?.turno}</p>
          <p><strong>Início:</strong> {formatDate(inscricao?.id_curso?.data_inicio)}</p>
          <p><strong>Duração:</strong> {inscricao?.id_curso?.duracao_meses} meses</p>
        </article>

        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Contrato de Matrícula</h2>
          <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '16px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '16px', background: '#f9fafb', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <h3>TERMO DE MATRÍCULA</h3>
            <p>Eu, <strong>{inscricao.nome_completo_inscricao || inscricao?.id_usuario?.nomeCompleto}</strong>, portador do CPF <strong>{inscricao.cpf_inscricao || '-'}</strong>, declaro estar ciente e de acordo com as condições do curso <strong>{inscricao?.id_curso?.nome_curso}</strong>, turno <strong>{inscricao?.id_curso?.turno}</strong>, com início previsto para {formatDate(inscricao?.id_curso?.data_inicio)} e duração de {inscricao?.id_curso?.duracao_meses} meses.</p>
            <p style={{ marginTop: '12px' }}>Declaro que as informações fornecidas são verdadeiras e assumo a responsabilidade pelas mesmas. Estou ciente das normas e regulamentos da instituição.</p>
            <p style={{ marginTop: '12px' }}>Data: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <form id="form-aceite-matricula" onSubmit={handleAccept}>
            <div className="field">
              <label>
                <input type="checkbox" id="aceite-termos" required /> Li e aceito os termos do contrato
              </label>
            </div>
            <div className="field">
              <label>
                <input type="checkbox" id="aceite-veracidade" required /> Declaro que as informações são verdadeiras
              </label>
            </div>
            <div className="actions">
              <button className="btn btn-primary" type="submit">Aceitar Matrícula</button>
              <button className="btn btn-danger" type="button" onClick={handleRefuse}>Recusar Matrícula</button>
            </div>
          </form>
        </article>
      </section>
    </section>
  );
}

export default function MatriculaPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <MatriculaContent />
    </Suspense>
  );
}

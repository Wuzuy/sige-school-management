'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNotyf } from '@/components/NotyfProvider';
import { request, authHeaders } from '@/lib/api';
import { formatDate, toDateInputValue } from '@/hooks/useAuth';

function InscricaoContent() {
  const { user } = useAuth();
  const { success, error: showError, warning } = useNotyf();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cursoId = searchParams.get('cursoId');
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cursoId) {
      warning('Selecione um curso primeiro.');
      router.push('/portal-inscricao');
      return;
    }

    async function load() {
      try {
        const [cursoData, usuario] = await Promise.all([
          request(`/cursos/${cursoId}`, { headers: authHeaders(false) }),
          request('/usuarios/me', { headers: authHeaders(false) }),
        ]);
        setCurso({ ...cursoData, usuario });
      } catch (err) {
        showError(`Falha ao carregar dados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [cursoId, router, warning, showError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      await request('/inscricoes', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          id_usuario: { id: user.id },
          id_curso: { id: Number(cursoId) },
          data_inscricao: new Date().toISOString().slice(0, 10),
          status_aprovacao: 'EM_ANALISE',
          escolaridade_declarada: form.escolaridade.value.trim(),
          nome_completo_inscricao: form.nome.value.trim(),
          rg_inscricao: form.rg.value.trim(),
          cpf_inscricao: form.cpf.value.trim(),
          telefone_inscricao: form.telefone.value.trim(),
          email_inscricao: form.email.value.trim(),
          data_nascimento_inscricao: form.dataNascimento.value,
        }),
      });
      success('Inscrição enviada com sucesso!');
      setTimeout(() => router.push('/portal-inscricao/status'), 2000);
    } catch (err) {
      showError(`Erro: ${err.message}`);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!curso) return <p>Curso não encontrado.</p>;

  return (
    <section>
      <section className="hero">
        <h1>Inscrição</h1>
        <p>Preencha os dados para se inscrever no curso</p>
      </section>

      {curso && (
        <div className="alert alert-info" id="curso-detalhes">
          <strong>{curso.nome_curso}</strong> — {curso.turno} | Tipo: {curso.tipo || '-'} |
          Início: {formatDate(curso.data_inicio)} | Duração: {curso.duracao_meses || '-'} meses | Status: {curso.status}
        </div>
      )}

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Dados do Candidato</h2>
          <form id="form-inscricao" onSubmit={handleSubmit}>
            <div className="two-col">
              <div className="field">
                <label>Nome Completo</label>
                <input name="nome" defaultValue={curso?.usuario?.nomeCompleto || ''} required />
              </div>
              <div className="field">
                <label>RG</label>
                <input name="rg" />
              </div>
              <div className="field">
                <label>CPF</label>
                <input name="cpf" defaultValue={curso?.usuario?.cpf || ''} required />
              </div>
              <div className="field">
                <label>Data de Nascimento</label>
                <input name="dataNascimento" type="date" defaultValue={toDateInputValue(curso?.usuario?.dataNascimento)} required />
              </div>
              <div className="field">
                <label>Escolaridade</label>
                <select name="escolaridade" required>
                  <option value="">Selecione...</option>
                  <option value="FUNDAMENTAL">Ensino Fundamental</option>
                  <option value="MEDIO">Ensino Médio</option>
                  <option value="SUPERIOR">Ensino Superior</option>
                  <option value="POS_GRADUACAO">Pós-graduação</option>
                </select>
              </div>
              <div className="field">
                <label>Telefone</label>
                <input name="telefone" defaultValue={curso?.usuario?.telefone || ''} required />
              </div>
              <div className="field" style={{ gridColumn: 'span 2' }}>
                <label>Email</label>
                <input name="email" type="email" defaultValue={curso?.usuario?.email || ''} required />
              </div>
            </div>
            <button className="btn btn-primary" type="submit">Enviar Inscrição</button>
          </form>
        </article>
      </section>
    </section>
  );
}

export default function InscricaoPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <InscricaoContent />
    </Suspense>
  );
}

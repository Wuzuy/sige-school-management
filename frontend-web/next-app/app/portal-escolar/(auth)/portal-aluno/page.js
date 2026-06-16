'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useNotyf } from '@/components/NotyfProvider';
import { request, authHeaders } from '@/lib/api';
import { formatDate, toDateInputValue } from '@/hooks/useAuth';

export default function PortalAlunoPage() {
  const { user, updateUser } = useAuth();
  const { success, error } = useNotyf();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await request('/usuarios/me', { headers: authHeaders(false) });
        setUsuario(data);
      } catch (err) {
        error(`Erro ao carregar seus dados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nomeCompleto: e.target.nome.value.trim(),
      telefone: e.target.telefone.value.trim(),
      dataNascimento: e.target.dataNascimento.value || null,
    };

    try {
      const updated = await request('/usuarios/me', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      setUsuario(updated);
      updateUser(updated);
      success('Dados atualizados com sucesso.');
    } catch (err) {
      error(`Não foi possível atualizar: ${err.message}`);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <section>
      <section className="hero">
        <h1>Meu Perfil</h1>
        <p>Atualize seus dados e acompanhe sua vida escolar</p>
      </section>

      <section className="grid">
        <article className="card card-6">
          <h2>Dados Pessoais</h2>
          <p><strong>Nome:</strong> <span id="aluno-nome">{usuario?.nomeCompleto || 'Carregando...'}</span></p>
          <p><strong>Email:</strong> {usuario?.email || '-'}</p>
          <p><strong>CPF:</strong> {usuario?.cpf || '-'}</p>
          <p><strong>Data de Nascimento:</strong> {formatDate(usuario?.dataNascimento)}</p>
          <p><strong>Telefone:</strong> {usuario?.telefone || '-'}</p>
        </article>

        <article className="card card-6">
          <h2>Informações Acadêmicas</h2>
          <p><strong>Matrícula:</strong> {usuario?.matricula || '-'}</p>
          <p><strong>Série:</strong> {usuario?.serie || '-'}</p>
          <p><strong>Turno:</strong> {usuario?.turno || '-'}</p>
          <p><strong>Status:</strong> {usuario?.status || '-'}</p>
        </article>

        <article className="card" style={{ gridColumn: 'span 6' }}>
          <h2>Editar Dados</h2>
          <form id="form-perfil" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="perfil-nome">Nome</label>
              <input id="perfil-nome" name="nome" defaultValue={usuario?.nomeCompleto || ''} required />
            </div>
            <div className="field">
              <label htmlFor="telefone">Telefone</label>
              <input id="telefone" name="telefone" defaultValue={usuario?.telefone || ''} />
            </div>
            <div className="field">
              <label htmlFor="perfil-data-nascimento">Data de Nascimento</label>
              <input id="perfil-data-nascimento" name="dataNascimento" type="date" defaultValue={toDateInputValue(usuario?.dataNascimento)} />
            </div>
            <button className="btn btn-primary" type="submit">Salvar</button>
          </form>
        </article>

        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Atalhos Rápidos</h2>
          <div className="actions">
            <Link href="/portal-escolar/historico-escolar" className="btn btn-primary">📊 Histórico Escolar</Link>
            <Link href="/portal-escolar/meus-documentos" className="btn btn-primary">📄 Meus Documentos</Link>
            <Link href="/portal-escolar/consulta-freq" className="btn btn-primary">✓ Frequência</Link>
            <Link href="/portal-escolar/agenda-escolar" className="btn btn-primary">📅 Agenda</Link>
          </div>
        </article>
      </section>
    </section>
  );
}

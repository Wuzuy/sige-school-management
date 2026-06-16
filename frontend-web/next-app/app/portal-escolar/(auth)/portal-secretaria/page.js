'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotyf } from '@/components/NotyfProvider';
import { request, authHeaders } from '@/lib/api';
import { formatDate } from '@/hooks/useAuth';

export default function PortalSecretariaPage() {
  const { isAdmin } = useAuth();
  const { success, error: showError, warning } = useNotyf();
  const [activeTab, setActiveTab] = useState('modulo-unidades');
  const [data, setData] = useState({ unidades: [], cursos: [], usuarios: [], editais: [], inscricoes: [] });

  const loadAll = useCallback(async () => {
    try {
      const [unidades, cursos, usuarios, editais, inscricoes] = await Promise.all([
        request('/unidades', { headers: authHeaders(false) }).catch(() => []),
        request('/cursos', { headers: authHeaders(false) }).catch(() => []),
        request('/usuarios', { headers: authHeaders(false) }).catch(() => []),
        request('/editais', { headers: authHeaders(false) }).catch(() => []),
        request('/inscricoes', { headers: authHeaders(false) }).catch(() => []),
      ]);
      setData({ unidades, cursos, usuarios, editais, inscricoes });
    } catch (err) {
      showError(`Erro ao carregar dados: ${err.message}`);
    }
  }, [showError]);

  useEffect(() => { loadAll(); }, [loadAll]);

  if (!isAdmin) return <p>Acesso restrito a administradores.</p>;

  const TabButton = ({ target, label }) => (
    <button className={activeTab === target ? 'active' : ''} data-module-target={target} onClick={() => setActiveTab(target)}>
      {label}
    </button>
  );

  return (
    <section>
      <section className="hero">
        <h1>Portal da Secretaria</h1>
        <p>Acesso restrito ao pessoal administrativo</p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 12' }}>
          <div className="module-tabs">
            <TabButton target="modulo-unidades" label="Unidades" />
            <TabButton target="modulo-cursos" label="Cursos" />
            <TabButton target="modulo-usuarios" label="Usuários" />
            <TabButton target="modulo-editais" label="Editais" />
            <TabButton target="modulo-inscricoes" label="Inscrições" />
          </div>
        </article>

        {/* Unidades */}
        {activeTab === 'modulo-unidades' && (
          <article className="card" style={{ gridColumn: 'span 12' }}>
            <h2>Unidades</h2>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Nome</th><th>CNPJ</th><th>Cidade/Estado</th></tr></thead>
                <tbody>
                  {data.unidades.length === 0 ? (
                    <tr><td colSpan="3">Nenhuma unidade encontrada.</td></tr>
                  ) : (
                    data.unidades.map((u) => (
                      <tr key={u.id}>
                        <td>{u.nome}</td>
                        <td>{u.cnpj || '-'}</td>
                        <td>{u.cidade}/{u.estado}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>
        )}

        {/* Cursos */}
        {activeTab === 'modulo-cursos' && (
          <article className="card" style={{ gridColumn: 'span 12' }}>
            <h2>Cursos</h2>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Nome</th><th>Unidade</th><th>Turno</th><th>Status</th></tr></thead>
                <tbody>
                  {data.cursos.length === 0 ? (
                    <tr><td colSpan="4">Nenhum curso encontrado.</td></tr>
                  ) : (
                    data.cursos.map((c) => (
                      <tr key={c.id}>
                        <td>{c.nome_curso}</td>
                        <td>{c?.id_unidade?.nome || '-'}</td>
                        <td>{c.turno}</td>
                        <td><span className="status">{c.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>
        )}

        {/* Usuários */}
        {activeTab === 'modulo-usuarios' && (
          <article className="card" style={{ gridColumn: 'span 12' }}>
            <h2>Usuários</h2>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Nome</th><th>Email</th><th>Role</th></tr></thead>
                <tbody>
                  {data.usuarios.length === 0 ? (
                    <tr><td colSpan="3">Nenhum usuário encontrado.</td></tr>
                  ) : (
                    data.usuarios.map((u) => (
                      <tr key={u.id}>
                        <td>{u.nomeCompleto}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>
        )}

        {/* Editais */}
        {activeTab === 'modulo-editais' && (
          <article className="card" style={{ gridColumn: 'span 12' }}>
            <h2>Editais</h2>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Título</th><th>Link</th><th>Ativo</th></tr></thead>
                <tbody>
                  {data.editais.length === 0 ? (
                    <tr><td colSpan="3">Nenhum edital encontrado.</td></tr>
                  ) : (
                    data.editais.map((e) => (
                      <tr key={e.id}>
                        <td>{e.titulo}</td>
                        <td><a href={e.url} target="_blank" rel="noopener noreferrer">Abrir</a></td>
                        <td>{e.ativo ? 'ATIVO' : 'INATIVO'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>
        )}

        {/* Inscrições */}
        {activeTab === 'modulo-inscricoes' && (
          <article className="card" style={{ gridColumn: 'span 12' }}>
            <h2>Inscrições</h2>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Aluno</th><th>Curso</th><th>Data</th><th>Status</th></tr></thead>
                <tbody>
                  {data.inscricoes.length === 0 ? (
                    <tr><td colSpan="4">Nenhuma inscrição encontrada.</td></tr>
                  ) : (
                    data.inscricoes.map((i) => (
                      <tr key={i.id}>
                        <td>{i?.id_usuario?.nomeCompleto || 'N/A'}</td>
                        <td>{i?.id_curso?.nome_curso || 'N/A'}</td>
                        <td>{i.data_inscricao ? new Date(i.data_inscricao).toLocaleDateString('pt-BR') : '-'}</td>
                        <td><span className="status">{i.status_aprovacao}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>
        )}
      </section>
    </section>
  );
}

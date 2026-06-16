'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNotyf } from '@/components/NotyfProvider';
import { request, authHeaders } from '@/lib/api';
import { formatDate } from '@/hooks/useAuth';

export default function CursosPage() {
  const { user } = useAuth();
  const { error } = useNotyf();
  const router = useRouter();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cursosData, inscricoes] = await Promise.all([
          request('/cursos', { headers: authHeaders(false) }),
          request('/inscricoes', { headers: authHeaders(false) }),
        ]);

        const cursosAtivos = cursosData.filter((c) => c.status === 'ATIVO');
        const cursosInscritos = new Set(
          (inscricoes || [])
            .filter((i) => i?.id_usuario?.id === user?.id)
            .map((i) => i?.id_curso?.id)
        );

        setCursos(cursosAtivos.map((curso) => ({
          ...curso,
          inscrito: cursosInscritos.has(curso.id),
        })));
      } catch (err) {
        error(`Não foi possível carregar cursos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, error]);

  return (
    <section>
      <section className="hero">
        <h1>Cursos Disponíveis</h1>
        <p>Selecione um curso para realizar sua inscrição</p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Cursos</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Unidade</th>
                  <th>Curso</th>
                  <th>Turno</th>
                  <th>Data Início</th>
                  <th>Duração</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6">Carregando...</td></tr>
                ) : cursos.length === 0 ? (
                  <tr><td colSpan="6">Nenhum curso ativo disponível no momento.</td></tr>
                ) : (
                  cursos.map((curso) => (
                    <tr key={curso.id}>
                      <td>{curso?.id_unidade?.nome || '-'}</td>
                      <td>{curso.nome_curso}</td>
                      <td>{curso.turno}</td>
                      <td>{formatDate(curso.data_inicio)}</td>
                      <td>{curso.duracao_meses} meses</td>
                      <td>
                        {curso.inscrito ? (
                          <span className="status" style={{ background: '#d1fae5', color: '#065f46' }}>Já inscrito</span>
                        ) : (
                          <button className="btn btn-primary" onClick={() => router.push(`/portal-inscricao/inscricao?cursoId=${curso.id}`)}>
                            Inscrever-se
                          </button>
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

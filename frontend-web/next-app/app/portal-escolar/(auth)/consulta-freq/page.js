'use client';

import { useState, useEffect } from 'react';
import { request, authHeaders } from '@/lib/api';
import { useNotyf } from '@/components/NotyfProvider';

export default function FrequenciaPage() {
  const { error } = useNotyf();
  const [frequencias, setFrequencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/frequencias', { headers: authHeaders(false) })
      .then((data) => setFrequencias(Array.isArray(data) ? data : []))
      .catch((err) => error(`Erro ao carregar frequência: ${err.message}`))
      .finally(() => setLoading(false));
  }, [error]);

  return (
    <section>
      <section className="hero">
        <h1>Consulta de Frequência</h1>
        <p>Verifique sua frequência por disciplina</p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Frequência por Disciplina</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Disciplina</th>
                  <th>Total de Aulas</th>
                  <th>Presenças</th>
                  <th>Faltas</th>
                  <th>Frequência (%)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Carregando frequência...</td></tr>
                ) : frequencias.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Nenhum registro encontrado.</td></tr>
                ) : (
                  frequencias.map((f, i) => (
                    <tr key={i}>
                      <td>{f.disciplina || f.nome || '-'}</td>
                      <td>{f.totalAulas ?? f.total ?? '-'}</td>
                      <td>{f.presencas ?? f.presenca ?? '-'}</td>
                      <td>{f.faltas ?? '-'}</td>
                      <td>{f.frequencia ? `${f.frequencia}%` : '-'}</td>
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

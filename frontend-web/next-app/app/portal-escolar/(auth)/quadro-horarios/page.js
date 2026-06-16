'use client';

import { useState, useEffect } from 'react';
import { request, authHeaders } from '@/lib/api';
import { useNotyf } from '@/components/NotyfProvider';

const FALLBACK_HORARIOS = [
  { dia: 'Segunda-feira', horario: '08:00 - 09:30', disciplina: 'Cálculo I', professor: 'Prof. João Silva', local: 'Sala 101' },
  { dia: 'Segunda-feira', horario: '09:45 - 11:15', disciplina: 'Álgebra Linear', professor: 'Prof. Maria Santos', local: 'Sala 102' },
  { dia: 'Terça-feira', horario: '08:00 - 09:30', disciplina: 'Física I', professor: 'Prof. Carlos Costa', local: 'Lab. de Física' },
  { dia: 'Terça-feira', horario: '14:00 - 15:30', disciplina: 'Programação', professor: 'Prof. Ana Pereira', local: 'Lab. de Informática' },
  { dia: 'Quarta-feira', horario: '08:00 - 09:30', disciplina: 'Química', professor: 'Prof. Lucas Oliveira', local: 'Lab. de Química' },
  { dia: 'Quarta-feira', horario: '10:00 - 11:30', disciplina: 'Inglês', professor: 'Prof. Rebecca Jones', local: 'Sala 201' },
  { dia: 'Quinta-feira', horario: '08:00 - 09:30', disciplina: 'História', professor: 'Prof. Roberto Lima', local: 'Sala 103' },
  { dia: 'Quinta-feira', horario: '14:00 - 15:30', disciplina: 'Educação Física', professor: 'Prof. Marcos Souza', local: 'Ginásio' },
  { dia: 'Sexta-feira', horario: '08:00 - 10:00', disciplina: 'Laboratório', professor: 'Prof. Ana Pereira', local: 'Lab. de Informática' },
  { dia: 'Sexta-feira', horario: '14:00 - 15:30', disciplina: 'Seminário', professor: 'Diversos', local: 'Auditório' },
];

export default function QuadroHorariosPage() {
  const { error } = useNotyf();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/horarios', { headers: authHeaders(false) })
      .then((data) => setHorarios(Array.isArray(data) ? data : FALLBACK_HORARIOS))
      .catch(() => setHorarios(FALLBACK_HORARIOS))
      .finally(() => setLoading(false));
  }, [error]);

  return (
    <section>
      <section className="hero">
        <h1>Quadro de Horários</h1>
        <p>Confira seus horários de aula e eventos</p>
      </section>

      <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Dia</th>
                <th>Horário</th>
                <th>Disciplina</th>
                <th>Professor</th>
                <th>Local</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Carregando...</td></tr>
              ) : (
                horarios.map((h, i) => (
                  <tr key={i}>
                    <td>{h.dia}</td>
                    <td>{h.horario}</td>
                    <td>{h.disciplina}</td>
                    <td>{h.professor}</td>
                    <td>{h.local}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '24px', background: '#f0f9ff', borderLeft: '4px solid #3b82f6', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '8px' }}>ℹ️ Informações Importantes</h3>
        <p style={{ color: '#1e40af', margin: 0, fontSize: '0.9rem' }}>
          Os horários podem estar sujeitos a alterações. Verifique regularmente para atualizações.
          Para reportar conflitos de horários ou dúvidas, entre em contato com a secretaria.
        </p>
      </div>
    </section>
  );
}

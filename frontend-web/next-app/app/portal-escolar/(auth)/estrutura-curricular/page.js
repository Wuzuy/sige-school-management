'use client';

import { useState, useEffect } from 'react';
import { request, authHeaders } from '@/lib/api';
import { useNotyf } from '@/components/NotyfProvider';

const FALLBACK_SEMESTRES = [
  {
    numero: 1, titulo: '1st Semester',
    disciplinas: [
      { codigo: 'CS101', nome: 'Calculus I', creditos: 4, tipo: 'Mandatory' },
      { codigo: 'MATH101', nome: 'English Composition', creditos: 3, tipo: 'Mandatory' },
      { codigo: 'CS102', nome: 'Digital Logic Design', creditos: 4, tipo: 'Mandatory' },
      { codigo: 'PHY101', nome: 'Physics I', creditos: 3, tipo: 'Mandatory' },
      { codigo: 'ENG101', nome: 'Introduction to CS', creditos: 4, tipo: 'Elective' },
    ],
  },
  {
    numero: 2, titulo: '2nd Semester',
    disciplinas: [
      { codigo: 'CS201', nome: 'Data Structures', creditos: 4, tipo: 'Mandatory' },
      { codigo: 'MATH201', nome: 'Linear Algebra', creditos: 3, tipo: 'Mandatory' },
      { codigo: 'CS202', nome: 'Computer Architecture', creditos: 4, tipo: 'Mandatory' },
      { codigo: 'PHY201', nome: 'Physics II', creditos: 3, tipo: 'Mandatory' },
    ],
  },
];

export default function EstruturaCurricularPage() {
  const { error } = useNotyf();
  const [semestres, setSemestres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/estrutura-curricular', { headers: authHeaders(false) })
      .then((data) => setSemestres(Array.isArray(data) ? data : FALLBACK_SEMESTRES))
      .catch(() => setSemestres(FALLBACK_SEMESTRES))
      .finally(() => setLoading(false));
  }, [error]);

  return (
    <section>
      <section className="hero">
        <h1>Estrutura Curricular</h1>
        <p>Disciplinas organizadas por semestre</p>
      </section>

      <div className="containerCurricular">
        <div id="containerSemestres">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            semestres.map((semestre) => (
              <div key={semestre.numero}>
                <div className="headerCC">
                  <div className="headerCC2">
                    <div className="numeroCard"><h1>{semestre.numero}</h1></div>
                    <div>
                      <h3>{semestre.titulo}</h3>
                      <p style={{ color: '#737373' }}>
                        {semestre.disciplinas?.length || 0} courses • {semestre.disciplinas?.reduce((a, d) => a + (d.creditos || 0), 0)} credits
                      </p>
                    </div>
                  </div>
                  <button>Export PDF</button>
                </div>
                <div>
                  {(semestre.disciplinas || []).map((d, i) => (
                    <div key={i} className="cardC">
                      <p><strong>{d.codigo}</strong></p>
                      <p>{d.nome}</p>
                      <p>{d.creditos} credits • {d.tipo}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="containerCINFO">
          <h3>Informações do Curso</h3>
          <div className="containerProgresso">
            <div><h1>Progresso</h1><span>0%</span></div>
            <progress value="0" max="100"></progress>
          </div>
          <div className="statusFalta">
            <h1>Status</h1>
            <p>Matriculado</p>
          </div>
          <div className="statRapido">
            <p>Disciplinas cursadas</p>
            <p>0</p>
          </div>
          <div className="statRapido">
            <p>Créditos obtidos</p>
            <p>0</p>
          </div>
        </div>
      </div>
    </section>
  );
}

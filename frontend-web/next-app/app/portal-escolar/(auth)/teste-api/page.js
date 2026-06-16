'use client';

import { useState } from 'react';
import { request, authHeaders, getApiBaseUrl } from '@/lib/api';

export default function TesteApiPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (method, path, body = null) => {
    setLoading(true);
    setResult(`> ${method} ${getApiBaseUrl()}${path}\n`);
    try {
      const opts = { method, headers: authHeaders(method !== 'GET' || body) };
      if (body) opts.body = JSON.stringify(body);
      const data = await request(path, opts);
      setResult((prev) => prev + JSON.stringify(data, null, 2));
    } catch (err) {
      setResult((prev) => prev + `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <section className="hero">
        <h1>Teste de API</h1>
        <p>Ferramenta de desenvolvimento para testar endpoints</p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: 'span 4' }}>
          <h2>Endpoints</h2>
          <div className="actions" style={{ flexDirection: 'column' }}>
            <button className="btn btn-soft" onClick={() => testEndpoint('GET', '/editais')}>GET /editais</button>
            <button className="btn btn-soft" onClick={() => testEndpoint('GET', '/cursos')}>GET /cursos</button>
            <button className="btn btn-soft" onClick={() => testEndpoint('GET', '/usuarios/count')}>GET /usuarios/count</button>
            <button className="btn btn-soft" onClick={() => testEndpoint('GET', '/unidades')}>GET /unidades</button>
            <button className="btn btn-soft" onClick={() => testEndpoint('GET', '/inscricoes')}>GET /inscricoes</button>
          </div>
        </article>

        <article className="card" style={{ gridColumn: 'span 8' }}>
          <h2>Resultado</h2>
          <pre style={{
            background: '#1e1e1e', color: '#d4d4d4', padding: '16px',
            borderRadius: '8px', overflow: 'auto', maxHeight: '500px',
            fontSize: '0.85rem', lineHeight: 1.5, whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
          }}>
            {loading ? 'Carregando...' : (result || 'Clique em um endpoint para testar.')}
          </pre>
        </article>
      </section>
    </section>
  );
}

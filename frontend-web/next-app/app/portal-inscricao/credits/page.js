import Link from 'next/link';

export default function CreditsPage() {
  return (
    <div>
      <header className="topbar">
        <div className="topbar__inner">
          <div className="brand">
            <img src="/assets/images/sige.png" alt="SIGE" width={40} height={40} />
            <span>Sistema de Inscrição e Gestão</span>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h1>Créditos</h1>
          <p>Saiba mais sobre o SIGE</p>
        </section>

        <section className="grid">
          <article className="card" style={{ gridColumn: 'span 12' }}>
            <h2>Sistema de Inscrição e Gestão Escolar (SIGE)</h2>
            <p>O SIGE é uma plataforma web moderna desenvolvida para centralizar os processos de inscrição e gestão escolar.</p>

            <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Tecnologias Utilizadas</h3>
            <ul style={{ marginLeft: '20px', lineHeight: 1.8 }}>
              <li><strong>Frontend:</strong> Next.js, React, Tailwind CSS</li>
              <li><strong>Backend:</strong> Spring Boot 3.2 com Java 21</li>
              <li><strong>Banco de Dados:</strong> PostgreSQL</li>
              <li><strong>APIs:</strong> RESTful com autenticação JWT</li>
            </ul>

            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
              <Link href="/portal-inscricao/login" className="btn btn-primary">Voltar ao Login</Link>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

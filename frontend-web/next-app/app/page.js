import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Bem-vindo ao SIGE</h1>
        <p>Sistema Integrado de Gestão Escolar</p>
      </section>

      <section className="grid">
        <article className="card card-6">
          <h2>🏫 Portal Escolar</h2>
          <p className="muted" style={{ marginBottom: '12px' }}>Acesso para alunos e secretaria</p>
          <Link href="/portal-escolar/login" className="btn btn-primary">Acessar Portal Escolar</Link>
        </article>

        <article className="card card-6">
          <h2>📝 Portal de Inscrição</h2>
          <p className="muted" style={{ marginBottom: '12px' }}>Processo seletivo e matrícula</p>
          <Link href="/portal-inscricao/login" className="btn btn-primary">Acessar Inscrição</Link>
        </article>
      </section>
    </main>
  );
}

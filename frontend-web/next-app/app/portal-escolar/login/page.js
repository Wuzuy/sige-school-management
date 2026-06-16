'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useNotyf } from '@/components/NotyfProvider';
import { isValidEmail, isStrongPassword, sanitize } from '@/hooks/useAuth';
import { request } from '@/lib/api';

export default function LoginPage() {
  const { user, login, loginAsVisitor } = useAuth();
  const { success, error, warning, info } = useNotyf();
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [editais, setEditais] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/portal-escolar/portal-aluno');
      return;
    }
    request('/editais')
      .then((data) => setEditais(Array.isArray(data) ? data.filter((e) => e.ativo) : []))
      .catch(() => setEditais([]));
  }, [user, router]);

  if (user) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value.trim();
    const senha = e.target.senha.value.trim();

    try {
      const data = await request('/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      if (!data?.token || !data?.usuario) throw new Error('Resposta de login inválida');
      login({ token: data.token, usuario: data.usuario });
      success('Login realizado com sucesso!');
      router.push(data.usuario.role === 'ROLE_ADMIN' ? '/portal-escolar/portal-secretaria' : '/portal-escolar/portal-aluno');
    } catch (err) {
      error(`Não foi possível logar: ${err.message}`);
      info('Se o backend não estiver disponível, use o botão de visitante.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const nomeCompleto = sanitize(e.target.nome.value);
    const email = sanitize(e.target.email.value);
    const senha = e.target.senha.value.trim();
    const confirmar = e.target.confirmar.value.trim();

    if (nomeCompleto.length < 3) return warning('Nome completo deve ter pelo menos 3 caracteres.');
    if (!isValidEmail(email)) return warning('Insira um email válido.');
    if (!isStrongPassword(senha)) return warning('A senha deve conter no mínimo 8 caracteres, incluindo: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (@#$%^&+=!)');
    if (senha !== confirmar) return warning('As senhas não conferem.');

    setLoading(true);
    try {
      await request('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeCompleto, email, senha }),
      });
      success('Cadastro realizado com sucesso! Faça o login para continuar.');
      e.target.reset();
      setMode('login');
    } catch (err) {
      error(`Falha no cadastro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsVisitor();
    info('Entrando como visitante de visualização.');
    router.push('/portal-escolar/portal-aluno');
  };

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
      <div className="nav-overlay"></div>

      <main className="container">
        <section className="hero">
          <h1>Acesso ao SIGE</h1>
          <p>Plataforma unificada para alunos e secretaria.</p>
        </section>

        <section className="grid">
          <article className="card card-6">
            <h2>Entrar ou Criar Conta</h2>
            <div className="auth-switch">
              <button className={mode === 'login' ? 'active' : ''} type="button" onClick={() => setMode('login')}>Login</button>
              <button className={mode === 'register' ? 'active' : ''} type="button" onClick={() => setMode('register')}>Cadastro</button>
            </div>

            <form id="form-login" onSubmit={handleLogin} className={mode !== 'login' ? 'hidden' : ''}>
              <div className="field">
                <label htmlFor="login-email">Email</label>
                <input id="login-email" name="email" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="login-senha">Senha</label>
                <input id="login-senha" name="senha" type="password" required />
              </div>
              <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '12px' }}>
                <Link href="/portal-escolar/forgot-password" style={{ fontSize: '13px', color: '#003366' }}>Esqueci minha senha</Link>
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
              <button type="button" style={{ marginTop: '12px', width: '100%', background: '#f3f4f6', color: '#222', border: '1px solid #cbd5e1' }} onClick={handleGuestLogin}>
                Entrar como Visitante
              </button>
            </form>

            <form id="form-register" onSubmit={handleRegister} className={mode !== 'register' ? 'hidden' : ''}>
              <div className="field">
                <label htmlFor="register-nome">Nome completo</label>
                <input id="register-nome" name="nome" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="register-email">Email</label>
                <input id="register-email" name="email" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="register-senha">Senha</label>
                <input id="register-senha" name="senha" type="password" required />
              </div>
              <div className="field">
                <label htmlFor="register-confirmar">Confirmar senha</label>
                <input id="register-confirmar" name="confirmar" type="password" required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>
          </article>

          <article className="card card-6">
            <h2>Editais Publicados</h2>
            <p className="muted" style={{ marginBottom: '12px' }}>Confira os editais ativos para processos seletivos:</p>
            <div className="actions">
              {editais.length === 0 ? (
                <p className="muted">Nenhum edital publicado no momento.</p>
              ) : (
                editais.map((edital) => (
                  <a key={edital.id} href={edital.url} target="_blank" rel="noopener noreferrer" className="btn btn-edital">
                    {edital.titulo}
                  </a>
                ))
              )}
            </div>
          </article>

          <div className="card">
            <Link href="/portal-escolar/credits"><h2>Créditos</h2></Link>
          </div>
        </section>
      </main>
    </div>
  );
}

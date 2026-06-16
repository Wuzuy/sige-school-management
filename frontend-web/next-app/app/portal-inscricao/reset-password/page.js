'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useNotyf } from '@/components/NotyfProvider';
import { isStrongPassword } from '@/hooks/useAuth';
import { request } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { success, error, warning } = useNotyf();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      warning('Token de recuperação não encontrado.');
    }
  }, [token, warning]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const senha = e.target.senha.value.trim();
    const confirmar = e.target.confirmar.value.trim();

    if (!isStrongPassword(senha)) return warning('A senha deve conter no mínimo 8 caracteres, incluindo: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (@#$%^&+=!)');
    if (senha !== confirmar) return warning('As senhas não conferem.');

    setLoading(true);
    try {
      await request('/usuarios/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, senha }),
      });
      success('Senha redefinida com sucesso!');
      setTimeout(() => router.push('/portal-inscricao/login'), 2000);
    } catch (err) {
      error(`Erro ao redefinir senha: ${err.message}`);
    } finally {
      setLoading(false);
    }
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

      <div className="recovery-container">
        <div className="recovery-header">
          <h1>🔑 Redefinir Senha</h1>
          <p>Digite sua nova senha.</p>
        </div>

        {!token ? (
          <p style={{ color: '#c00', textAlign: 'center' }}>Link inválido ou expirado.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="senha">Nova senha</label>
              <input type="password" id="senha" name="senha" required placeholder="Mínimo 8 caracteres" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmar">Confirmar senha</label>
              <input type="password" id="confirmar" name="confirmar" required />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </form>
        )}

        <div className="back-link">
          <Link href="/portal-inscricao/login">← Voltar ao Login</Link>
        </div>
      </div>

      <style jsx>{`
        .recovery-container { max-width: 450px; margin: 80px auto; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .recovery-header { text-align: center; margin-bottom: 30px; }
        .recovery-header h1 { color: #003366; font-size: 28px; margin-bottom: 10px; }
        .recovery-header p { color: #666; font-size: 14px; }
        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; margin-bottom: 8px; color: #333; font-weight: 600; font-size: 14px; }
        .form-group input { width: 100%; padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
        .form-group input:focus { outline: none; border-color: #003366; }
        .btn-submit { width: 100%; padding: 14px; background: linear-gradient(135deg, #003366 0%, #0066cc 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,51,102,0.3); }
        .btn-submit:disabled { background: #ccc; cursor: not-allowed; }
        .back-link { text-align: center; margin-top: 20px; }
        .back-link a { color: #003366; text-decoration: none; font-size: 14px; }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="container"><p>Carregando...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

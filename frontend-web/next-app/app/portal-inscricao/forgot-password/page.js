'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNotyf } from '@/components/NotyfProvider';
import { isValidEmail } from '@/hooks/useAuth';
import { request } from '@/lib/api';

export default function ForgotPasswordPage() {
  const { success, error, warning } = useNotyf();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    if (!isValidEmail(email)) return warning('Insira um email válido.');

    setLoading(true);
    try {
      await request('/usuarios/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      success('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (err) {
      error(`Erro ao enviar recuperação: ${err.message}`);
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
          <h1>🔐 Recuperar Senha</h1>
          <p>Digite seu email cadastrado e enviaremos um link para redefinir sua senha.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="recovery-email">Email</label>
            <input type="email" id="recovery-email" name="email" placeholder="seu@email.com" required />
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <div className="back-link">
          <Link href="/portal-inscricao/login">← Voltar ao Login</Link>
        </div>
      </div>

      <style jsx>{`
        .recovery-container { max-width: 450px; margin: 80px auto; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .recovery-header { text-align: center; margin-bottom: 30px; }
        .recovery-header h1 { color: #003366; font-size: 28px; margin-bottom: 10px; }
        .recovery-header p { color: #666; font-size: 14px; line-height: 1.6; }
        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; margin-bottom: 8px; color: #333; font-weight: 600; font-size: 14px; }
        .form-group input { width: 100%; padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
        .form-group input:focus { outline: none; border-color: #003366; }
        .btn-submit { width: 100%; padding: 14px; background: linear-gradient(135deg, #003366 0%, #0066cc 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,51,102,0.3); }
        .btn-submit:disabled { background: #ccc; cursor: not-allowed; }
        .back-link { text-align: center; margin-top: 20px; }
        .back-link a { color: #003366; text-decoration: none; font-size: 14px; font-weight: 500; }
        .back-link a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

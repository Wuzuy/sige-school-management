'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotyf } from '@/components/NotyfProvider';
import { request, authHeaders } from '@/lib/api';
import { formatDate, toDateInputValue, isStrongPassword } from '@/hooks/useAuth';

export default function ContaPage() {
  const { user, updateUser } = useAuth();
  const { success, error, warning } = useNotyf();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/usuarios/me', { headers: authHeaders(false) })
      .then((data) => setUsuario(data))
      .catch((err) => error(`Erro ao carregar dados: ${err.message}`))
      .finally(() => setLoading(false));
  }, [error]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const payload = {
      nomeCompleto: e.target.nome.value.trim(),
      telefone: e.target.telefone.value.trim(),
      dataNascimento: e.target.dataNascimento.value || null,
    };
    try {
      const updated = await request('/usuarios/me', { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
      setUsuario(updated); updateUser(updated);
      success('Perfil atualizado!');
    } catch (err) { error(`Erro: ${err.message}`); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const senhaAtual = e.target.senhaAtual.value.trim();
    const novaSenha = e.target.novaSenha.value.trim();
    const confirmar = e.target.confirmar.value.trim();

    if (!isStrongPassword(novaSenha)) return warning('Senha deve ter 8+ caracteres, maiúscula, minúscula, número e caractere especial.');
    if (novaSenha !== confirmar) return warning('Senhas não conferem.');

    try {
      await request('/usuarios/me/senha', { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ senhaAtual, novaSenha }) });
      success('Senha alterada!');
      e.target.reset();
    } catch (err) { error(`Erro: ${err.message}`); }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <section>
      <section className="hero">
        <h1>Minha Conta</h1>
        <p>Gerencie suas informações pessoais e segurança</p>
      </section>

      <section className="grid">
        <article className="card card-6">
          <div style={{ textAlign: 'center' }}>
            <img src="/assets/images/placeholderCircular.png" alt="Avatar" className="imagemCircular" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '50%', margin: '0 auto 12px' }} />
            <h2>{usuario?.nomeCompleto || user?.nomeCompleto}</h2>
            <p className="muted">{usuario?.role || user?.role}</p>
            <p className="muted">{usuario?.email || user?.email}</p>
          </div>
        </article>

        <article className="card card-6">
          <h2>Informações Pessoais</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="field">
              <label>Nome</label>
              <input name="nome" defaultValue={usuario?.nomeCompleto || ''} required />
            </div>
            <div className="field">
              <label>Telefone</label>
              <input name="telefone" defaultValue={usuario?.telefone || ''} />
            </div>
            <div className="field">
              <label>Data de Nascimento</label>
              <input name="dataNascimento" type="date" defaultValue={toDateInputValue(usuario?.dataNascimento)} />
            </div>
            <button className="btn btn-primary" type="submit">Salvar</button>
          </form>
        </article>

        <article className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Alterar Senha</h2>
          <form onSubmit={handleChangePassword} style={{ maxWidth: '400px' }}>
            <div className="field">
              <label>Senha Atual</label>
              <input name="senhaAtual" type="password" required />
            </div>
            <div className="field">
              <label>Nova Senha</label>
              <input name="novaSenha" type="password" required />
            </div>
            <div className="field">
              <label>Confirmar Nova Senha</label>
              <input name="confirmar" type="password" required />
            </div>
            <button className="btn btn-primary" type="submit">Alterar Senha</button>
          </form>
        </article>
      </section>
    </section>
  );
}

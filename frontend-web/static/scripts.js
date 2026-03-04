// SCRIPT QUE FAZ A ALTURA DO HEADER NÃO QUEBRAR O SITE INTEIRO
//NÃO APAGAR


//SCRIPT QUE FAZ A SENHA FICAR VISÍVEL OU INVISÍVEL
const botoesVisao = document.querySelectorAll('.botaoVisao');
botoesVisao.forEach(function(botao) {
    botao.addEventListener('click', function() {
        const inputSenha = this.parentElement.querySelector('input');
        if (inputSenha.type === 'password') {
            inputSenha.type = 'text';
        } else {
            inputSenha.type = 'password';
        }
    });
});
//
function init() {
    // estado do modo: true = cadastro, false = login
    let isCadastroTrue = false;

    const botao = document.querySelectorAll('.botaoLogin');
    const login = document.querySelector('.login');
    const cadastro = document.querySelector('.cadastro');
    const botaoPrincipal = document.querySelector('.botaoPrincipal');
    const BASE_URL = 'http://localhost:8080/api/usuarios';

    // configurar os botões de toggle
    botao.forEach(function(parametroBotao) {
        parametroBotao.addEventListener('click', function() {
            // Remove a classe "ativo" de todos os botões
            botao.forEach(function(parametroRemocao) {
                parametroRemocao.classList.remove('ativo')
            });
            // Adiciona a classe "ativo" para o botão que disparou
            this.classList.add('ativo');

            // determina modo usando data-mode quando disponível, senão fallback para texto
            const attr = this.getAttribute('data-mode');
            const modoCadastro = attr ? (attr.toLowerCase() === 'cadastro') : (this.textContent.trim().toLowerCase() === 'cadastro');

            if (modoCadastro) {
                login.classList.remove('visivel');
                cadastro.classList.add('visivel');
            } else {
                cadastro.classList.remove('visivel');
                login.classList.add('visivel');
            }

            // definir explicitamente o estado
            isCadastroTrue = modoCadastro;
        });
    });

    // handler do botão principal (login/cadastro)
    if (botaoPrincipal) {
        botaoPrincipal.addEventListener('click', async function(event) {
            event.preventDefault();

            if (isCadastroTrue) {
                // Cadastro
                const caixaCadastro = document.querySelector('.cadastro');
                const inputs = caixaCadastro.querySelectorAll('.escrever');
                const nome = (inputs[0] && inputs[0].value) ? inputs[0].value.trim() : '';
                const email = (inputs[1] && inputs[1].value) ? inputs[1].value.trim() : '';
                const senha = (inputs[2] && inputs[2].value) ? inputs[2].value.trim() : '';

                const confirmarSenhaCampo = document.getElementById('senhaInputConfirmar');
                const confirmarSenha = confirmarSenhaCampo ? confirmarSenhaCampo.value.trim() : '';

                if (!nome || !email || !senha || !confirmarSenha) {
                    alert('Por favor, preencha todos os campos para realizar o cadastro.');
                    return;
                }
                if (senha !== confirmarSenha) {
                    alert('As senhas não coincidem. Tente novamente.');
                    return; // Interrompe a execução, não envia para o backend
                }
                const payload = { nomeCompleto: nome, email: email, senha: senha };

                try {
                    const resp = await fetch(BASE_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (resp.ok) {
                        const data = await resp.json();
                        alert('Cadastro realizado com sucesso.');
                        // opcional: limpar campos
                        inputs.forEach(i => i.value = '');
                    } else {
                        const text = await resp.text();
                        alert('Erro ao cadastrar: ' + text);
                    }
                } catch (err) {
                    alert('Erro de conexão: ' + err.message);
                }

                // após cadastro, manter no modo cadastro e limpar campos (ou alternar para login se preferir)
                atualizarTextoBotao();

            } else {
                // Login
                const caixaLogin = document.querySelector('.login');
                const inputs = caixaLogin.querySelectorAll('.escrever');
                const email = (inputs[0] && inputs[0].value) ? inputs[0].value.trim() : '';
                const senha = (inputs[1] && inputs[1].value) ? inputs[1].value.trim() : '';

                if (!email || !senha) {
                    alert('Por favor, preencha todos os campos para realizar o login.');
                    return;
                }

                const payload = { email: email, senha: senha };

                try {
                    const resp = await fetch(BASE_URL + '/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (resp.ok) {
                        const usuario = await resp.json();
                        localStorage.setItem('usuario', JSON.stringify(usuario));
                        alert('Login bem-sucedido.');
                        // redirecionar para a página principal (ajuste conforme necessário)
                        window.location.href = '/';
                    } else if (resp.status === 401) {
                        const text = await resp.text();
                        alert(text);
                    } else {
                        const text = await resp.text();
                        alert('Erro no login: ' + text);
                    }
                } catch (err) {
                    alert('Erro de conexão: ' + err.message);
                }
            }
        });
    }
}

// rodar init() imediatamente se o DOM já estiver pronto, senão aguardar o evento
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

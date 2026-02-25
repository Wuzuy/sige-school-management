 

 //FUNÇÃO QUE FAZ APENAS O BOTÃO APERTADO FICAR ACESO E QUE FAZ A PARTE DE LOGIN APARECER
    // Busca, no HTML, todos os elementos que têm a classe '.botaoLogin'
    // O querySelectorAll devolve uma lista com TODOS esses elementos
    // Depois, ele taca tudo para a variável botao
    isCadastroTrue = false;
    const botao = document.querySelectorAll('.botaoLogin');
    const visivel = document.querySelectorAll('.caixa');
    const login = document.querySelector('.login');
    const cadastro = document.querySelector('.cadastro');
    // Cria uma função que funciona independentemente para cada botão
    botao.forEach(function(parametroBotao) {
        // Adiciona um ouvinte de click no botão
        parametroBotao.addEventListener('click', function() {
            // Remove a classe "ativo" de todos os botões
            botao.forEach(function(parametroRemocao) {
                parametroRemocao.classList.remove('ativo')
            });
            // Adiciona a classe "ativo" para o botão que disparou, sendo indicado pelo "this"
            this.classList.add('ativo');
            //Faz a caixa de login ficar invisível e a de cadastro invisível
        if (this.textContent.trim() === 'Cadastro' ) {
            login.classList.remove('visivel');
            cadastro.classList.add('visivel');
            isCadastroTrue = !isCadastroTrue;
        }
        //Faz a operação inversa
        else {
            cadastro.classList.remove('visivel');
            login.classList.add('visivel');
            isCadastroTrue = !isCadastroTrue;
        }
        });
    });

// Função para enviar login ou cadastro ao backend
const BASE_URL = 'http://localhost:8080/api/usuarios';
const botaoPrincipal = document.querySelector('.botaoPrincipal');

botaoPrincipal.addEventListener('click', async function(event) {
    event.preventDefault();

    if (isCadastroTrue) {
        // Cadastro
        const caixaCadastro = document.querySelector('.cadastro');
        const inputs = caixaCadastro.querySelectorAll('.escrever');
        const nome = (inputs[0] && inputs[0].value) ? inputs[0].value.trim() : '';
        const email = (inputs[1] && inputs[1].value) ? inputs[1].value.trim() : '';
        const senha = (inputs[2] && inputs[2].value) ? inputs[2].value.trim() : '';

        const payload = { nome: nome, email: email, senha: senha };

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

    } else {
        // Login
        const caixaLogin = document.querySelector('.login');
        const inputs = caixaLogin.querySelectorAll('.escrever');
        const email = (inputs[0] && inputs[0].value) ? inputs[0].value.trim() : '';
        const senha = (inputs[1] && inputs[1].value) ? inputs[1].value.trim() : '';

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
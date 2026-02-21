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
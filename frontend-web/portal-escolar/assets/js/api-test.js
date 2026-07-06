/**
 * Teste de Rotas da API SIGE
 * Este arquivo contém funções para testar todas as rotas disponíveis
 * 
 * Como usar:
 * 1. Abra o navegador console (F12 ou Ctrl+Shift+I)
 * 2. Cole cada função abaixo
 * 3. Chame a função desejada
 * 
 * Exemplo: testarLogin()
 */

const API_BASE = 'http://localhost:8080/api';

/**
 * Função auxiliar para fazer requisições
 */
async function fazerRequisicao(metodo, endpoint, dados = null, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: metodo,
    headers: headers
  };

  if (dados) {
    config.body = JSON.stringify(dados);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();
    
    console.log(`<i class="fas fa-check-circle"></i> ${metodo} ${endpoint}`);
    console.log('Status:', response.status);
    console.log('Resposta:', data);
    
    return { status: response.status, data };
  } catch (error) {
    console.error(`<i class="fas fa-times-circle"></i> Erro em ${metodo} ${endpoint}`);
    console.error('Erro:', error.message);
    return { error: error.message };
  }
}

/**
 * 1. TESTE DE REGISTRO DE NOVO USUÁRIO
 */
async function testarRegistro() {
  console.log('<i class="fas fa-pen-alt"></i> TESTANDO REGISTRO DE NOVO USUÁRIO...');
  const dados = {
    nomeCompleto: 'João Silva Teste',
    email: 'joao.teste@example.com',
    senha: 'SenhaForte123@'
  };
  
  return await fazerRequisicao('POST', '/usuarios', dados);
}

/**
 * 2. TESTE DE LOGIN
 */
async function testarLogin() {
  console.log('<i class="fas fa-lock"></i> TESTANDO LOGIN...');
  const dados = {
    email: 'joao.teste@example.com',
    senha: 'SenhaForte123@'
  };
  
  const resultado = await fazerRequisicao('POST', '/usuarios/login', dados);
  
  if (resultado.data && resultado.data.token) {
    // Salva o token para usar em outras requisições
    window.testToken = resultado.data.token;
    console.log('<i class="fas fa-check-circle"></i> Token salvo em window.testToken');
  }
  
  return resultado;
}

/**
 * 3. TESTE DE OBTER DADOS DO USUÁRIO AUTENTICADO
 */
async function testarObterUsuarioAtual() {
  console.log('<i class="fas fa-user"></i> TESTANDO OBTER USUÁRIO AUTENTICADO...');
  
  if (!window.testToken) {
    console.error('<i class="fas fa-times-circle"></i> Token não definido. Execute testarLogin() primeiro.');
    return;
  }
  
  return await fazerRequisicao('GET', '/usuarios/me', null, window.testToken);
}

/**
 * 4. TESTE DE ATUALIZAR PERFIL
 */
async function testarAtualizarPerfil() {
  console.log('✏️ TESTANDO ATUALIZAÇÃO DE PERFIL...');
  
  if (!window.testToken) {
    console.error('<i class="fas fa-times-circle"></i> Token não definido. Execute testarLogin() primeiro.');
    return;
  }
  
  const dados = {
    nomeCompleto: 'João Silva Teste - Atualizado',
    telefone: '11999999999',
    dataNascimento: '1990-01-15'
  };
  
  return await fazerRequisicao('PUT', '/usuarios/me', dados, window.testToken);
}

/**
 * 5. TESTE DE LISTAR CURSOS
 */
async function testarListarCursos() {
  console.log('<i class="fas fa-book-open"></i> TESTANDO LISTAGEM DE CURSOS...');
  return await fazerRequisicao('GET', '/cursos');
}

/**
 * 6. TESTE DE LISTAR INSCRIÇÕES
 */
async function testarListarInscricoes() {
  console.log('<i class="fas fa-clipboard"></i> TESTANDO LISTAGEM DE INSCRIÇÕES...');
  
  if (!window.testToken) {
    console.error('<i class="fas fa-times-circle"></i> Token não definido. Execute testarLogin() primeiro.');
    return;
  }
  
  return await fazerRequisicao('GET', '/inscricoes', null, window.testToken);
}

/**
 * 7. TESTE DE CRIAR INSCRIÇÃO
 */
async function testarCriarInscricao() {
  console.log('<i class="fas fa-pen-alt"></i> TESTANDO CRIAÇÃO DE INSCRIÇÃO...');
  
  if (!window.testToken) {
    console.error('<i class="fas fa-times-circle"></i> Token não definido. Execute testarLogin() primeiro.');
    return;
  }
  
  const dados = {
    id_usuario: { id: 1 },
    id_curso: { id: 1 },
    data_inscricao: new Date().toISOString(),
    status_aprovacao: 'PENDENTE',
    escolaridade_declarada: 'ENSINO_MEDIO',
    nome_completo_inscricao: 'João Silva Teste',
    rg_inscricao: '123456789',
    cpf_inscricao: '12345678901',
    telefone_inscricao: '11999999999',
    email_inscricao: 'joao.teste@example.com',
    data_nascimento_inscricao: '1990-01-15'
  };
  
  return await fazerRequisicao('POST', '/inscricoes', dados, window.testToken);
}

/**
 * TESTE COMPLETO (sequencial)
 */
async function testarTudo() {
  console.log('<i class="fas fa-rocket"></i> INICIANDO TESTE COMPLETO DA API...\n');
  
  console.log('--- PASSO 1: Registrar novo usuário ---');
  await testarRegistro();
  console.log('\n--- PASSO 2: Fazer login ---');
  await testarLogin();
  console.log('\n--- PASSO 3: Obter dados do usuário ---');
  await testarObterUsuarioAtual();
  console.log('\n--- PASSO 4: Listar cursos ---');
  await testarListarCursos();
  console.log('\n--- PASSO 5: Listar inscrições ---');
  await testarListarInscricoes();
  console.log('\n--- PASSO 6: Criar inscrição ---');
  // await testarCriarInscricao(); // Comentado para não criar dados desnecessários
  
  console.log('\n<i class="fas fa-check-circle"></i> TESTES CONCLUÍDOS!');
}

// Exibe instruções no console
console.log(`
╔════════════════════════════════════════════════════════════╗
║          TESTE DE ROTAS DA API SIGE                      ║
╚════════════════════════════════════════════════════════════╝

Funções disponíveis:
  1. testarRegistro()            - Registrar novo usuário
  2. testarLogin()               - Fazer login
  3. testarObterUsuarioAtual()   - Obter dados do usuário
  4. testarAtualizarPerfil()     - Atualizar perfil
  5. testarListarCursos()        - Listar cursos
  6. testarListarInscricoes()    - Listar inscrições
  7. testarCriarInscricao()      - Criar inscrição
  8. testarTudo()                - Executar todos os testes

Exemplos de uso:
  testarRegistro()
  testarLogin()
  testarTudo()

💡 Dica: Após fazer login com testarLogin(), o token 
    será armazenado em window.testToken automaticamente
    para usar em outras requisições.

🔗 URL da API: ${API_BASE}
`);

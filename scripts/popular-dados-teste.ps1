# ==========================================
# SEJA SENAI - Script de Dados de Teste (PowerShell)
# ==========================================

$ErrorActionPreference = "Continue"  # Mudado para Continue para ver erros
$BASE_URL = "http://localhost:8080/api"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "SEJA SENAI - Popular Dados de Teste" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Funcao para fazer requisicao POST
function Invoke-PostRequest {
    param(
        [string]$Url,
        [string]$Body,
        [string]$Token = ""
    )
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method Post -Body $Body -Headers $headers
        return @{ Success = $true; Data = $response }
    }
    catch {
        $errorMessage = $_.Exception.Message
        $errorDetails = ""
        if ($_.ErrorDetails.Message) {
            try {
                $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
                if ($errorJson.erro) {
                    $errorDetails = $errorJson.erro
                } elseif ($errorJson.message) {
                    $errorDetails = $errorJson.message
                }
            } catch {
                $errorDetails = $_.ErrorDetails.Message
            }
        }
        return @{ Success = $false; Error = $errorMessage; Details = $errorDetails }
    }
}

Write-Host "[1/8] Criando usuario administrador..." -ForegroundColor Yellow
$adminUser = @{
    nomeCompleto = "Administrador Sistema"
    email = "admin@senai.com"
    cpf = "11111111111"
    telefone = "11999999999"
    dataNascimento = "1990-01-01"
    senha = "Admin@123"
} | ConvertTo-Json

$adminResult = Invoke-PostRequest -Url "$BASE_URL/usuarios/setup-admin" -Body $adminUser
if ($adminResult.Success) {
    Write-Host "[OK] Usuario admin criado com sucesso!" -ForegroundColor Green
    Write-Host "  Email: admin@senai.com | Senha: Admin@123" -ForegroundColor Gray
} else {
    Write-Host "[ERRO] Falha ao criar admin:" -ForegroundColor Red
    Write-Host "  $($adminResult.Error)" -ForegroundColor Red
    if ($adminResult.Details) {
        Write-Host "  Detalhes: $($adminResult.Details)" -ForegroundColor Yellow
    }
    Write-Host "[IMPORTANTE] Backend pode nao estar rodando! Verifique e tente novamente." -ForegroundColor Yellow
    Write-Host "Pressione qualquer tecla para sair..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}
Start-Sleep -Seconds 1

Write-Host ""
Write-Host "[2/8] Criando usuarios comuns..." -ForegroundColor Yellow

$user1 = @{
    nomeCompleto = "Joao Silva"
    email = "joao@teste.com"
    cpf = "12345678901"
    telefone = "11987654321"
    dataNascimento = "2000-05-15"
    senha = "Senha@123"
} | ConvertTo-Json

$result1 = Invoke-PostRequest -Url "$BASE_URL/usuarios" -Body $user1
if ($result1.Success) {
    Write-Host "[OK] Joao Silva criado" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Joao Silva - $($result1.Details)" -ForegroundColor Red
}

$user2 = @{
    nomeCompleto = "Maria Santos"
    email = "maria@teste.com"
    cpf = "98765432109"
    telefone = "11912345678"
    dataNascimento = "1998-08-20"
    senha = "Senha@456"
} | ConvertTo-Json

$result2 = Invoke-PostRequest -Url "$BASE_URL/usuarios" -Body $user2
if ($result2.Success) {
    Write-Host "[OK] Maria Santos criada" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Maria Santos - $($result2.Details)" -ForegroundColor Red
}

$user3 = @{
    nomeCompleto = "Pedro Oliveira"
    email = "pedro@teste.com"
    cpf = "55566677788"
    telefone = "11955556666"
    dataNascimento = "2002-12-10"
    senha = "Senha@789"
} | ConvertTo-Json

$result3 = Invoke-PostRequest -Url "$BASE_URL/usuarios" -Body $user3
if ($result3.Success) {
    Write-Host "[OK] Pedro Oliveira criado" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Pedro Oliveira - $($result3.Details)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "[3/8] Fazendo login como admin..." -ForegroundColor Yellow

$loginBody = @{
    email = "admin@senai.com"
    senha = "Admin@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/usuarios/login" -Method Post -Body $loginBody -ContentType "application/json"
    $ADMIN_TOKEN = $loginResponse.token
    Write-Host "[OK] Login realizado com sucesso!" -ForegroundColor Green
    Write-Host "Token: $($ADMIN_TOKEN.Substring(0, 20))..." -ForegroundColor Gray
}
catch {
    Write-Host "[ERRO] Erro ao fazer login:" -ForegroundColor Red
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "  Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    Write-Host "[IMPORTANTE] Nao sera possivel criar unidades/cursos/editais sem autenticacao" -ForegroundColor Yellow
    Write-Host "Pressione qualquer tecla para sair..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Start-Sleep -Seconds 1

Write-Host ""
Write-Host "[4/8] Criando Unidades SENAI..." -ForegroundColor Yellow

$unidade1 = @{
    nome = "SENAI Bras"
    cnpj = "03785858000601"
    estado = "SP"
    cidade = "Sao Paulo"
} | ConvertTo-Json

$r1 = Invoke-PostRequest -Url "$BASE_URL/unidades" -Body $unidade1 -Token $ADMIN_TOKEN
if ($r1.Success) {
    Write-Host "[OK] SENAI Bras criada (ID: $($r1.Data.id))" -ForegroundColor Green
    $unidade1Id = $r1.Data.id
} else {
    Write-Host "[ERRO] SENAI Bras - $($r1.Error) - $($r1.Details)" -ForegroundColor Red
}

$unidade2 = @{
    nome = "SENAI Vila Alpina"
    cnpj = "03785858000702"
    estado = "SP"
    cidade = "Sao Paulo"
} | ConvertTo-Json

$r2 = Invoke-PostRequest -Url "$BASE_URL/unidades" -Body $unidade2 -Token $ADMIN_TOKEN
if ($r2.Success) {
    Write-Host "[OK] SENAI Vila Alpina criada (ID: $($r2.Data.id))" -ForegroundColor Green
} else {
    Write-Host "[ERRO] SENAI Vila Alpina - $($r2.Error) - $($r2.Details)" -ForegroundColor Red
}

$unidade3 = @{
    nome = "SENAI Ipiranga"
    cnpj = "03785858000803"
    estado = "SP"
    cidade = "Sao Paulo"
} | ConvertTo-Json

$r3 = Invoke-PostRequest -Url "$BASE_URL/unidades" -Body $unidade3 -Token $ADMIN_TOKEN
if ($r3.Success) {
    Write-Host "[OK] SENAI Ipiranga criada (ID: $($r3.Data.id))" -ForegroundColor Green
} else {
    Write-Host "[ERRO] SENAI Ipiranga - $($r3.Error) - $($r3.Details)" -ForegroundColor Red
}

$unidade4 = @{
    nome = "SENAI Santo Amaro"
    cnpj = "03785858000904"
    estado = "SP"
    cidade = "Sao Paulo"
} | ConvertTo-Json

$r4 = Invoke-PostRequest -Url "$BASE_URL/unidades" -Body $unidade4 -Token $ADMIN_TOKEN
if ($r4.Success) {
    Write-Host "[OK] SENAI Santo Amaro criada (ID: $($r4.Data.id))" -ForegroundColor Green
} else {
    Write-Host "[ERRO] SENAI Santo Amaro - $($r4.Error) - $($r4.Details)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

Write-Host ""
Write-Host "[5/8] Criando Cursos..." -ForegroundColor Yellow

# Verificar se alguma unidade foi criada
if (-not $unidade1Id) {
    Write-Host "[AVISO] Nenhuma unidade foi criada. Pulando criacao de cursos." -ForegroundColor Yellow
    $unidade1Id = 1 # Tentar com ID 1 como fallback
}

$curso1 = @{
    id_unidade = @{ id = $unidade1Id }
    nome_curso = "Tecnico em Informatica"
    tipo = "Tecnico"
    turno = "Matutino"
    data_inicio = "2026-04-01"
    duracao_meses = 24
    status = "ATIVO"
} | ConvertTo-Json -Depth 3

$c1 = Invoke-PostRequest -Url "$BASE_URL/cursos" -Body $curso1 -Token $ADMIN_TOKEN
if ($c1.Success) {
    Write-Host "[OK] Tecnico em Informatica criado (ID: $($c1.Data.id))" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Tecnico em Informatica - $($c1.Error) - $($c1.Details)" -ForegroundColor Red
}

$curso2 = @{
    id_unidade = @{ id = $unidade1Id }
    nome_curso = "Tecnico em Mecanica"
    tipo = "Tecnico"
    turno = "Vespertino"
    data_inicio = "2026-04-01"
    duracao_meses = 24
    status = "ATIVO"
} | ConvertTo-Json -Depth 3

$c2 = Invoke-PostRequest -Url "$BASE_URL/cursos" -Body $curso2 -Token $ADMIN_TOKEN
if ($c2.Success) {
    Write-Host "[OK] Tecnico em Mecanica criado (ID: $($c2.Data.id))" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Tecnico em Mecanica - $($c2.Error) - $($c2.Details)" -ForegroundColor Red
}

$curso3 = @{
    id_unidade = @{ id = $unidade1Id }
    nome_curso = "Tecnico em Eletroeletronica"
    tipo = "Tecnico"
    turno = "Noturno"
    data_inicio = "2026-04-01"
    duracao_meses = 24
    status = "ATIVO"
} | ConvertTo-Json -Depth 3

$c3 = Invoke-PostRequest -Url "$BASE_URL/cursos" -Body $curso3 -Token $ADMIN_TOKEN
if ($c3.Success) {
    Write-Host "[OK] Tecnico em Eletroeletronica criado (ID: $($c3.Data.id))" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Tecnico em Eletroeletronica - $($c3.Error) - $($c3.Details)" -ForegroundColor Red
}

$curso4 = @{
    id_unidade = @{ id = $unidade1Id }
    nome_curso = "Programacao Web"
    tipo = "Qualificacao"
    turno = "Matutino"
    data_inicio = "2026-05-01"
    duracao_meses = 6
    status = "ATIVO"
} | ConvertTo-Json -Depth 3

$c4 = Invoke-PostRequest -Url "$BASE_URL/cursos" -Body $curso4 -Token $ADMIN_TOKEN
if ($c4.Success) {
    Write-Host "[OK] Programacao Web criado (ID: $($c4.Data.id))" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Programacao Web - $($c4.Error) - $($c4.Details)" -ForegroundColor Red
}

$curso5 = @{
    id_unidade = @{ id = $unidade1Id }
    nome_curso = "Tecnico em Automacao Industrial"
    tipo = "Tecnico"
    turno = "Noturno"
    data_inicio = "2026-04-15"
    duracao_meses = 24
    status = "ATIVO"
} | ConvertTo-Json -Depth 3

$c5 = Invoke-PostRequest -Url "$BASE_URL/cursos" -Body $curso5 -Token $ADMIN_TOKEN
if ($c5.Success) {
    Write-Host "[OK] Tecnico em Automacao Industrial criado (ID: $($c5.Data.id))" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Tecnico em Automacao Industrial - $($c5.Error) - $($c5.Details)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

Write-Host ""
Write-Host "[6/8] Criando Editais..." -ForegroundColor Yellow

$edital1 = @{
    titulo = "Processo Seletivo 2026.1 - Cursos Tecnicos"
    url = "https://senai.sp.gov.br/editais/2026-1"
    ativo = $true
} | ConvertTo-Json

$e1 = Invoke-PostRequest -Url "$BASE_URL/editais" -Body $edital1 -Token $ADMIN_TOKEN
if ($e1.Success) {
    Write-Host "[OK] Processo Seletivo 2026.1 criado (ID: $($e1.Data.id))" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Processo Seletivo 2026.1 - $($e1.Error) - $($e1.Details)" -ForegroundColor Red
}

$edital2 = @{
    titulo = "Qualificacao Profissional 2026"
    url = "https://senai.sp.gov.br/editais/qualificacao-2026"
    ativo = $true
} | ConvertTo-Json

$e2 = Invoke-PostRequest -Url "$BASE_URL/editais" -Body $edital2 -Token $ADMIN_TOKEN
if ($e2.Success) {
    Write-Host "[OK] Qualificacao Profissional 2026 criado (ID: $($e2.Data.id))" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Qualificacao Profissional 2026 - $($e2.Error) - $($e2.Details)" -ForegroundColor Red
}

$edital3 = @{
    titulo = "Processo Seletivo 2026.2 - Segundo Semestre"
    url = "https://senai.sp.gov.br/editais/2026-2"
    ativo = $false
} | ConvertTo-Json

$e3 = Invoke-PostRequest -Url "$BASE_URL/editais" -Body $edital3 -Token $ADMIN_TOKEN
if ($e3.Success) {
    Write-Host "[OK] Processo Seletivo 2026.2 criado (ID: $($e3.Data.id))" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Processo Seletivo 2026.2 - $($e3.Error) - $($e3.Details)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

Write-Host ""
Write-Host "[7/8] Promovendo admin para ROLE_ADMIN..." -ForegroundColor Yellow
Write-Host "(Admin ja foi criado com ROLE_ADMIN via /setup-admin)" -ForegroundColor Gray

Start-Sleep -Seconds 1

Write-Host ""
Write-Host "[8/8] Resumo dos dados criados:" -ForegroundColor Yellow
Write-Host "  - 4 usuarios (1 admin, 3 comuns)" -ForegroundColor White
Write-Host "  - 4 unidades SENAI" -ForegroundColor White
Write-Host "  - 5 cursos tecnicos" -ForegroundColor White
Write-Host "  - 3 editais de processo seletivo" -ForegroundColor White

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Script concluido!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Verifique os dados no H2 Console: http://localhost:8080/h2-console" -ForegroundColor White
Write-Host "   JDBC URL: jdbc:h2:mem:testdb" -ForegroundColor Gray
Write-Host "   Username: sa" -ForegroundColor Gray
Write-Host "   Password: (deixe em branco)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Faca login na aplicacao:" -ForegroundColor White
Write-Host "   Admin: admin@senai.com / Admin@123" -ForegroundColor Gray
Write-Host "   Usuario: joao@teste.com / Senha@123" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Teste as funcionalidades de inscricao e gerenciamento" -ForegroundColor White
Write-Host ""

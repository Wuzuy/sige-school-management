# ==========================================
# SIGE - Limpar e Recriar Banco Supabase
# ==========================================

$ErrorActionPreference = "Continue"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "SIGE - Recriar Dados de Demonstracao" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Este script vai:" -ForegroundColor Yellow
Write-Host "1. Parar o backend (se estiver rodando)" -ForegroundColor White
Write-Host "2. Executar o script SQL no Supabase" -ForegroundColor White
Write-Host "3. Reiniciar o backend" -ForegroundColor White
Write-Host "4. Executar o script de populacao Node.js" -ForegroundColor White
Write-Host ""

Write-Host "Senha padrao de todos os usuarios: 123Sige@" -ForegroundColor Green
Write-Host ""

Write-Host "Deseja continuar? (S/N)" -ForegroundColor Yellow
$resposta = Read-Host

if ($resposta -ne "S" -and $resposta -ne "s") {
    Write-Host "Operacao cancelada." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "=== Etapa 1: Parando backend ===" -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "[OK] Backend parado" -ForegroundColor Green

Write-Host ""
Write-Host "=== Etapa 2: Executando SQL no Supabase ===" -ForegroundColor Cyan
Write-Host "[ATENCAO] Execute o conteudo do arquivo abaixo no SQL Editor do Supabase:" -ForegroundColor Yellow
Write-Host "  database\supabase-aluno-tables.sql" -ForegroundColor White
Write-Host ""
Write-Host "Depois de executar, pressione ENTER para continuar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "=== Etapa 3: Iniciando backend ===" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -NoExit -Command", "cd '$PWD\backend'; node server.js"
Start-Sleep -Seconds 5
Write-Host "[OK] Backend iniciado" -ForegroundColor Green

Write-Host ""
Write-Host "=== Etapa 4: Populando dados para todos os usuarios ===" -ForegroundColor Cyan
$env:NODE_PATH = "$PWD\backend\node_modules"
node "$PWD\scripts\popular-todos-usuarios.js"
Write-Host "[OK] Dados populados" -ForegroundColor Green

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "RECRIACAO CONCLUIDA!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Usuarios disponiveis:" -ForegroundColor Yellow
Write-Host "  admin@senai.com / 123Sige@ (Administrador)" -ForegroundColor White
Write-Host "  joao@email.com / 123Sige@ (Aluno)" -ForegroundColor White
Write-Host "  maria@email.com / 123Sige@ (Aluna)" -ForegroundColor White
Write-Host "  carlos@email.com / 123Sige@ (Professor)" -ForegroundColor White
Write-Host "  pedro@email.com / 123Sige@ (Usuario)" -ForegroundColor White
Write-Host ""
Write-Host "Acesse: http://localhost:5500/portal-escolar/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

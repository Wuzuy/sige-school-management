# ==========================================
# SIGE - Limpar Banco de Dados
# ==========================================

$ErrorActionPreference = "Continue"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "SIGE - Limpar Banco de Dados" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Ler perfil ativo do application.properties
$propertiesFile = "backend\src\main\resources\application.properties"
if (Test-Path $propertiesFile) {
    $content = Get-Content $propertiesFile
    $profileLine = $content | Where-Object { $_ -match "spring.profiles.active=" }
    if ($profileLine) {
        $profile = ($profileLine -split "=")[1].Trim()
        Write-Host "Perfil detectado: $profile" -ForegroundColor Yellow
        Write-Host ""
    } else {
        $profile = "h2"
        Write-Host "Perfil nao encontrado, assumindo: h2" -ForegroundColor Yellow
        Write-Host ""
    }
} else {
    Write-Host "[ERRO] Arquivo application.properties nao encontrado!" -ForegroundColor Red
    Write-Host "Execute este script na raiz do projeto seja-senai" -ForegroundColor Yellow
    exit 1
}

# Processar conforme o perfil
if ($profile -eq "h2") {
    Write-Host "=== BANCO H2 (Em Memoria) ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "O banco H2 e automaticamente zerado ao reiniciar o backend" -ForegroundColor Green
    Write-Host "devido a configuracao: spring.jpa.hibernate.ddl-auto=create-drop" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Para zerar o banco H2:" -ForegroundColor Yellow
    Write-Host "1. Pare o backend" -ForegroundColor White
    Write-Host "2. Inicie novamente" -ForegroundColor White
    Write-Host ""
    Write-Host "Deseja parar e reiniciar o backend agora? (S/N)" -ForegroundColor Yellow
    $resposta = Read-Host
    
    if ($resposta -eq "S" -or $resposta -eq "s") {
        Write-Host ""
        Write-Host "[1/3] Parando sistema..." -ForegroundColor Yellow
        
        # Parar processos Java e Python/Node
        Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
        Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
        
        Start-Sleep -Seconds 2
        Write-Host "[OK] Sistema parado" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "[2/3] Iniciando backend..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\backend\mvnw.cmd spring-boot:run"
        
        Write-Host "[OK] Backend iniciando..." -ForegroundColor Green
        Write-Host "Aguardando inicializacao (30 segundos)..." -ForegroundColor Gray
        Start-Sleep -Seconds 30
        
        Write-Host ""
        Write-Host "[3/3] Populando banco com dados de teste..." -ForegroundColor Yellow
        Write-Host "Deseja popular o banco agora? (S/N)" -ForegroundColor Yellow
        $popular = Read-Host
        
        if ($popular -eq "S" -or $popular -eq "s") {
            .\popular-dados-teste.ps1
        }
        
        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Cyan
        Write-Host "Banco H2 zerado e backend reiniciado!" -ForegroundColor Green
        Write-Host "==========================================" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "Operacao cancelada." -ForegroundColor Yellow
        Write-Host "Para zerar manualmente: execute .\parar-sistema.bat e depois .\iniciar-backend.bat" -ForegroundColor Gray
    }
    
} elseif ($profile -eq "mysql") {
    Write-Host "=== BANCO MYSQL (Persistente) ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "[AVISO] O banco MySQL NAO e zerado automaticamente!" -ForegroundColor Yellow
    Write-Host "spring.jpa.hibernate.ddl-auto=update mantem os dados entre reinicializacoes" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Para zerar o banco MySQL, voce tem 2 opcoes:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OPCAO 1 - Dropar e Recriar Banco (Recomendado)" -ForegroundColor Cyan
    Write-Host "1. Abra MySQL Workbench ou terminal MySQL" -ForegroundColor White
    Write-Host "2. Execute os comandos:" -ForegroundColor White
    Write-Host "   DROP DATABASE sige_db;" -ForegroundColor Gray
    Write-Host "   CREATE DATABASE sige_db;" -ForegroundColor Gray
    Write-Host "3. Reinicie o backend" -ForegroundColor White
    Write-Host ""
    Write-Host "OPCAO 2 - Deletar Todas as Tabelas" -ForegroundColor Cyan
    Write-Host "1. Abra MySQL Workbench ou terminal MySQL" -ForegroundColor White
    Write-Host "2. Execute os comandos:" -ForegroundColor White
    Write-Host "   USE sige_db;" -ForegroundColor Gray
    Write-Host "   SET FOREIGN_KEY_CHECKS = 0;" -ForegroundColor Gray
    Write-Host "   DROP TABLE IF EXISTS inscricao, edital, curso, unidade, password_reset_tokens, usuario;" -ForegroundColor Gray
    Write-Host "   SET FOREIGN_KEY_CHECKS = 1;" -ForegroundColor Gray
    Write-Host "3. Reinicie o backend (tabelas serao recriadas)" -ForegroundColor White
    Write-Host ""
    Write-Host "Deseja tentar dropar e recriar o banco automaticamente? (S/N)" -ForegroundColor Yellow
    Write-Host "[AVISO] Isso requer MySQL CLI (mysql.exe) no PATH" -ForegroundColor Red
    $resposta = Read-Host
    
    if ($resposta -eq "S" -or $resposta -eq "s") {
        Write-Host ""
        Write-Host "Digite a senha do MySQL root:" -ForegroundColor Yellow
        $senha = Read-Host -AsSecureString
        $senhaPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($senha))
        
        Write-Host ""
        Write-Host "Executando comandos MySQL..." -ForegroundColor Yellow
        
        $sqlCommands = @"
DROP DATABASE IF EXISTS sige_db;
CREATE DATABASE sige_db;
"@
        
        try {
            $sqlCommands | mysql -u root -p"$senhaPlain" 2>&1
            Write-Host "[OK] Banco sige_db dropado e recriado!" -ForegroundColor Green
            
            Write-Host ""
            Write-Host "Reiniciando backend..." -ForegroundColor Yellow
            
            # Parar processos
            Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
            Start-Sleep -Seconds 2
            
            # Iniciar backend
            Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\backend\mvnw.cmd spring-boot:run"
            
            Write-Host "[OK] Backend iniciando..." -ForegroundColor Green
            Write-Host "Aguardando inicializacao (30 segundos)..." -ForegroundColor Gray
            Start-Sleep -Seconds 30
            
            Write-Host ""
            Write-Host "Deseja popular o banco com dados de teste? (S/N)" -ForegroundColor Yellow
            $popular = Read-Host
            
            if ($popular -eq "S" -or $popular -eq "s") {
                .\popular-dados-teste.ps1
            }
            
            Write-Host ""
            Write-Host "==========================================" -ForegroundColor Cyan
            Write-Host "Banco MySQL zerado e backend reiniciado!" -ForegroundColor Green
            Write-Host "==========================================" -ForegroundColor Cyan
            
        } catch {
            Write-Host "[ERRO] Falha ao executar comandos MySQL:" -ForegroundColor Red
            Write-Host $_.Exception.Message -ForegroundColor Red
            Write-Host ""
            Write-Host "Execute manualmente no MySQL Workbench:" -ForegroundColor Yellow
            Write-Host "DROP DATABASE sige_db;" -ForegroundColor Gray
            Write-Host "CREATE DATABASE sige_db;" -ForegroundColor Gray
        }
    } else {
        Write-Host ""
        Write-Host "Operacao cancelada." -ForegroundColor Yellow
        Write-Host "Execute os comandos SQL manualmente no MySQL Workbench" -ForegroundColor Gray
    }
    
} else {
    Write-Host "[ERRO] Perfil desconhecido: $profile" -ForegroundColor Red
    Write-Host "Perfis validos: h2 ou mysql" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

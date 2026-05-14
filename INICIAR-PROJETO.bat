@echo off
chcp 65001 >nul
set "ROOT=%~dp0"

echo.
echo =============================================
echo   SIGE - Inicialização do Projeto
echo =============================================
echo.

REM Verificar se está na pasta correta
if not exist "%ROOT%backend\pom.xml" (
    echo [ERRO] Execute este arquivo na raiz do projeto!
    pause
    exit /b 1
)

echo [1/2] Iniciando Backend (porta 8080)...
echo.
start "SIGE - Backend" cmd /k "pushd \"%ROOT%backend\" && mvnw.cmd spring-boot:run"
if errorlevel 1 (
    echo [ERRO] Nao foi possivel iniciar o backend.
    pause
    exit /b 1
)

echo [OK] Backend iniciando em outra janela...
echo.
timeout /t 3 /nobreak >nul

echo [2/2] Iniciando Frontend (porta 5500)...
echo.
if exist "%ROOT%frontend-web\static\index.html" (
    cd /d "%ROOT%frontend-web\static"
    python --version >nul 2>&1
    if %errorlevel% equ 0 (
        start "SIGE - Frontend" cmd /k "pushd \"%ROOT%frontend-web\static\" && python -m http.server 5500"
        goto frontend_started
    )

    node --version >nul 2>&1
    if %errorlevel% equ 0 (
        start "SIGE - Frontend" cmd /k "pushd \"%ROOT%frontend-web\static\" && npx http-server -p 5500"
        goto frontend_started
    )

    echo [AVISO] Python e Node.js nao encontrados. O frontend nao pode ser iniciado automaticamente.
    echo.
    echo Abra manualmente o arquivo: %ROOT%frontend-web\static\index.html
    echo ou instale Python/Node.js para poder iniciar em http://localhost:5500.
    pause
    exit /b 1
) else (
    echo [ERRO] Pasta frontend-web\static nao encontrada.
    pause
    exit /b 1
)

:frontend_started

echo [OK] Frontend iniciado em nova janela.
echo.
echo =============================================
echo   URLs:
echo =============================================
echo   Backend:  http://localhost:8080/api
echo   Frontend: http://localhost:5500

echo.
echo Pressione qualquer tecla para sair...
pause >nul

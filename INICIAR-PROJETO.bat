@echo off
chcp 65001 >nul
echo.
echo =============================================
echo   SIGE - Inicialização do Projeto
echo =============================================
echo.

REM Verificar se está na pasta correta
if not exist "backend\pom.xml" (
    echo [ERRO] Execute este arquivo na raiz do projeto!
    pause
    exit /b 1
)

echo [1/2] Iniciando Backend (porta 8080)...
echo.
cd backend
start "SIGE - Backend" cmd /k "mvnw.cmd spring-boot:run"
cd ..

echo [OK] Backend iniciando em outra janela...
echo.
timeout /t 3 /nobreak >nul

echo [2/2] Frontend (porta 5500)...
echo.
echo =============================================
echo   COMO ABRIR O FRONTEND:
echo =============================================
echo.
echo   OPCAO 1: Live Server (VS Code)
echo   1. Abra a pasta: frontend-web/static
echo   2. Clique com botao direito em index.html
echo   3. Selecione "Open with Live Server"
echo   4. Automaticamente abrira na porta 5500
echo.
echo   OPCAO 2: Manual
echo   1. Abra: frontend-web/static/index.html
echo   2. Diretamente no navegador
echo.
echo =============================================
echo   URLs:
echo =============================================
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:5500 (Live Server)
echo            ou abra index.html manualmente
echo.
echo =============================================
echo.
echo Pressione qualquer tecla para sair...
pause >nul

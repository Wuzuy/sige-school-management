@echo off
REM Inicia o servidor backend SIGE
REM Este arquivo deve ser executado a partir do diretório backend

cd /d %~dp0
echo.
echo ========================================
echo  INICIANDO SERVIDOR SIGE BACKEND
echo ========================================
echo.

REM Verifica se node_modules existe
if not exist node_modules (
    echo Instalando dependências...
    call npm install
)

echo.
echo Iniciando npm run dev...
echo Servidor rodará em http://localhost:8080
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

call npm run dev

@echo off
chcp 65001 >nul
title SEJA SENAI - Iniciar Sistema Completo
echo ==========================================
echo SEJA SENAI - Iniciar Sistema Completo
echo ==========================================
echo.
echo Este script ira:
echo 1. Iniciar o Backend (Spring Boot)
echo 2. Aguardar inicializacao
echo 3. Iniciar o Frontend (Servidor HTTP)
echo 4. Popular banco de dados com dados de teste
echo.
pause

echo.
echo [1/4] Iniciando Backend...
cd backend
start "SEJA SENAI Backend" cmd /k "mvnw.cmd spring-boot:run"
cd ..

echo Backend iniciando... Aguardando 30 segundos para garantir inicializacao completa...
timeout /t 30 /nobreak >nul

echo.
echo [2/4] Iniciando Frontend...
start "SEJA SENAI Frontend" cmd /k "cd frontend-web\static && python -m http.server 5500"

echo Frontend iniciando... Aguardando 5 segundos...
timeout /t 5 /nobreak >nul

echo.
echo [3/4] Populando banco de dados...
powershell -ExecutionPolicy Bypass -File "popular-dados-teste.ps1"

echo.
echo [4/4] Sistema iniciado!
echo.
echo ==========================================
echo Sistema SEJA SENAI em Execucao
echo ==========================================
echo.
echo Frontend: http://localhost:5500
echo Backend API: http://localhost:8080/api
echo H2 Console: http://localhost:8080/h2-console
echo.
echo Credenciais de Teste:
echo   Admin: admin@senai.com / Admin@123
echo   Usuario: joao@teste.com / Senha@123
echo.
echo Para parar o sistema, feche as janelas do Backend e Frontend
echo ou execute: parar-sistema.bat
echo.
pause

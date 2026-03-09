@echo off
chcp 65001 >nul
title SEJA SENAI - Backend + Ngrok

echo ==========================================
echo SEJA SENAI - Iniciar Backend + Ngrok
echo ==========================================
echo.

echo [1/3] Iniciando Backend Spring Boot...
cd backend
start "Backend Spring Boot" cmd /k "mvnw spring-boot:run"
cd ..

echo [2/3] Aguardando backend inicializar (20 segundos)...
timeout /t 20 /nobreak >nul

echo [3/3] Iniciando Ngrok para expor backend...
echo.
echo ==========================================
echo ATENCAO: Copie a URL gerada pelo Ngrok!
echo Exemplo: https://abc123.ngrok.io
echo ==========================================
echo.
echo Use essa URL no frontend (Cloudflare Pages):
echo - Configure em Environment Variables
echo - OU atualize scripts.js manualmente
echo.
echo Dashboard do Ngrok: http://127.0.0.1:4040
echo ==========================================
echo.

ngrok http 8080

pause

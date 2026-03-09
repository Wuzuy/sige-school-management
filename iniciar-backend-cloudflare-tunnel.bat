@echo off
chcp 65001 >nul
title SEJA SENAI - Backend + Cloudflare Tunnel

echo ==========================================
echo SEJA SENAI - Cloudflare Tunnel (Melhor que Ngrok!)
echo ==========================================
echo.

echo [1/3] Verificando Cloudflared...
where cloudflared >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Cloudflared nao encontrado!
    echo.
    echo Instale com:
    echo   choco install cloudflared
    echo.
    echo Ou baixe em: https://github.com/cloudflare/cloudflared/releases
    echo.
    pause
    exit /b 1
)

echo [2/3] Iniciando Backend Spring Boot...
cd backend
start "Backend Spring Boot" cmd /k "mvnw spring-boot:run"
cd ..

echo [3/3] Aguardando backend inicializar (20 segundos)...
timeout /t 20 /nobreak >nul

echo.
echo ==========================================
echo Iniciando Cloudflare Tunnel...
echo ==========================================
echo.
echo VANTAGENS sobre Ngrok:
echo  - Menos bloqueios por operadoras
echo  - Melhor performance
echo  - Integracao nativa com Cloudflare
echo.
echo Copie a URL gerada e configure no frontend!
echo ==========================================
echo.

cloudflared tunnel --url http://localhost:8080

pause

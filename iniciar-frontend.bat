@echo off
chcp 65001 >nul
title SEJA SENAI - Frontend
echo ==========================================
echo SEJA SENAI - Iniciar Frontend
echo ==========================================
echo.

cd frontend-web\static

echo Verificando se Python esta instalado...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python encontrado! Iniciando servidor...
    echo.
    echo Frontend estara disponivel em: http://localhost:5500
    echo.
    echo Pressione Ctrl+C para parar o servidor
    echo.
    python -m http.server 5500
) else (
    echo Python nao encontrado. Tentando Node.js...
    node --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo Node.js encontrado! Instalando http-server...
        call npx http-server -p 5500
    ) else (
        echo.
        echo ERRO: Python e Node.js nao encontrados!
        echo.
        echo Opcoes:
        echo 1. Instale Python: https://www.python.org/downloads/
        echo 2. Instale Node.js: https://nodejs.org/
        echo 3. Abra index.html diretamente no navegador
        echo.
        pause
        exit /b 1
    )
)

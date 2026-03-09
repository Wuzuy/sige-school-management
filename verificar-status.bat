@echo off
chcp 65001 >nul
title SEJA SENAI - Verificar Status
echo ==========================================
echo SEJA SENAI - Verificar Status do Sistema
echo ==========================================
echo.

echo Verificando Backend (porta 8080)...
netstat -ano | findstr ":8080" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend esta rodando na porta 8080
) else (
    echo [X] Backend NAO esta rodando
)

echo.
echo Verificando Frontend (porta 5500)...
netstat -ano | findstr ":5500" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend esta rodando na porta 5500
) else (
    echo [X] Frontend NAO esta rodando
)

echo.
echo Testando conexao com Backend API...
curl -s http://localhost:8080/api/editais >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend API respondendo
) else (
    echo [X] Backend API nao respondeu
)

echo.
echo ==========================================
echo.
echo URLs do Sistema:
echo   Frontend: http://localhost:5500
echo   Backend: http://localhost:8080/api
echo   H2 Console: http://localhost:8080/h2-console
echo.
pause

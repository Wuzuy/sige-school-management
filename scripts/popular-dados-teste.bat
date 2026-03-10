@echo off
chcp 65001 >nul
title SIGE - Popular Dados de Teste
echo ==========================================
echo SIGE - Popular Dados de Teste
echo ==========================================
echo.
echo Este script ira popular o banco de dados com dados de teste.
echo.
echo Certifique-se de que o BACKEND esta rodando!
echo Backend deve estar em: http://localhost:8080
echo.
pause

echo.
echo Executando script PowerShell...
echo.

powershell -ExecutionPolicy Bypass -File "popular-dados-teste.ps1"

echo.
echo.
echo Script concluido!
echo.
pause

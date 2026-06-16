@echo off
chcp 65001 >nul
title SIGE - Parar Sistema
echo ==========================================
echo SIGE - Parar Sistema
echo ==========================================
echo.
echo Este script ira parar todos os processos do sistema.
echo.
pause

echo.
echo Parando Backend (Node.js)...
taskkill /FI "WindowTitle eq SIGE Backend*" /F >nul 2>&1
taskkill /FI "IMAGENAME eq node.exe" /F >nul 2>&1

echo Parando Frontend (Servidor HTTP)...
taskkill /FI "WindowTitle eq SIGE Frontend*" /F >nul 2>&1

echo.
echo Sistema parado!
echo.
pause

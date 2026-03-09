@echo off
chcp 65001 >nul
title SEJA SENAI - Parar Sistema
echo ==========================================
echo SEJA SENAI - Parar Sistema
echo ==========================================
echo.
echo Este script ira parar todos os processos do sistema.
echo.
pause

echo.
echo Parando Backend (Spring Boot)...
taskkill /FI "WindowTitle eq SEJA SENAI Backend*" /F >nul 2>&1
taskkill /FI "IMAGENAME eq java.exe" /F >nul 2>&1

echo Parando Frontend (Servidor HTTP)...
taskkill /FI "WindowTitle eq SEJA SENAI Frontend*" /F >nul 2>&1

echo.
echo Sistema parado!
echo.
pause

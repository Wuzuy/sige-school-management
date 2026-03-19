@echo off
chcp 65001 >nul
title SEJA SENAI - Backend
echo ==========================================
echo SEJA SENAI - Iniciar Backend
echo ==========================================
echo.
echo Iniciando backend Spring Boot...
echo Sera usado o perfil configurado em application.properties
echo.

cd backend
start "SEJA SENAI Backend" cmd /k "mvnw.cmd spring-boot:run"

echo.
echo Backend iniciando em nova janela...
echo Aguarde ate ver: "Started SejaSenaiApplication"
echo.
echo Backend estara disponivel em: http://localhost:8080/api
echo H2 Console (se H2 ativo): http://localhost:8080/h2-console
echo.
pause

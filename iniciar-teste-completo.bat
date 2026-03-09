@echo off
chcp 65001 >nul
echo ==========================================
echo SEJA SENAI - Iniciar Backend com H2 e Popular Dados
echo ==========================================
echo.

echo [1/3] Configurando para usar H2...
cd backend
copy /Y src\main\resources\application.properties src\main\resources\application.properties.backup >nul 2>&1

echo [2/3] Iniciando backend com H2 (aguarde 15 segundos)...
start /B cmd /c "mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=h2 > ..\backend-log.txt 2>&1"

echo Backend iniciando... Aguarde 15 segundos para garantir que está pronto
timeout /t 15 /nobreak >nul

cd ..

echo.
echo [3/3] Executando script de popular dados...
powershell -ExecutionPolicy Bypass -File "popular-dados-teste.ps1"

echo.
echo ==========================================
echo Backend rodando em: http://localhost:8080
echo H2 Console: http://localhost:8080/h2-console
echo ==========================================
echo.
echo Pressione qualquer tecla para parar o backend...
pause >nul

echo.
echo Parando backend...
taskkill /F /FI "WINDOWTITLE eq Administrator:*mvnw.cmd*" >nul 2>&1
taskkill /F /FI "CommandLine eq *spring-boot:run*" >nul 2>&1

echo Backend parado!
pause

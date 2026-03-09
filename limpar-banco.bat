@echo off
chcp 65001 > nul
title SEJA SENAI - Limpar Banco de Dados

powershell -ExecutionPolicy Bypass -File "%~dp0limpar-banco.ps1"

pause

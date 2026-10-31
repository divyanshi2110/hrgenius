@echo off
title HRGenius Frontend (Angular 21)
echo ========================================================
echo   Starting HRGenius Corporate Frontend on Port 4200
echo ========================================================
cd /d "%~dp0hrgenius-frontend"
call npm start
pause

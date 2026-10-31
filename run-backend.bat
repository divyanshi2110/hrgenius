@echo off
title HRGenius Backend (Spring Boot 3.3.4)
echo ========================================================
echo   Starting HRGenius Enterprise Backend on Port 8081
echo ========================================================
cd /d "%~dp0hrgenius-backend"

set MAVEN_CMD="C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2021.1.2\plugins\maven\lib\maven3\bin\mvn.cmd"

if exist %MAVEN_CMD% (
    call %MAVEN_CMD% spring-boot:run
) else (
    call mvn spring-boot:run
)
pause

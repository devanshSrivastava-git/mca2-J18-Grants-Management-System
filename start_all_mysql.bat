@echo off
title Grants Management System Launcher (MySQL Profile)
echo ============================================================================
echo   GRANTS MANAGEMENT SYSTEM (Spring Boot + MySQL + Angular 21)
echo ============================================================================
echo.
echo Make sure MySQL Workbench has executed:
echo   %~dp0database\grants_management_mysql.sql
echo.
echo [1/2] Starting Spring Boot Backend with MySQL Profile on Port 8088...
start "GMS Backend (MySQL Profile)" cmd /k "cd /d ""%~dp0backend"" && .\mvnw.bat spring-boot:run -Dspring-boot.run.profiles=mysql"

echo Waiting 6 seconds for backend initialization...
timeout /t 6 /nobreak >nul

echo.
echo [2/2] Starting Angular 21 Frontend on Port 4200...
start "GMS Frontend (Angular 21)" cmd /k "cd /d ""%~dp0frontend"" && npm start"

echo.
echo ============================================================================
echo Application is starting!
echo * Frontend UI:  http://localhost:4200
echo * Backend REST: http://localhost:8088/api/programs
echo ============================================================================
pause

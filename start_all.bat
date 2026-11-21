@echo off
title Grants Management System Launcher
echo ============================================================================
echo         GRANTS MANAGEMENT SYSTEM (Government of India Public Sector)
echo             Full Stack Application Launcher (Java 17 + Angular 21)
echo ============================================================================
echo.
echo [1/2] Starting Spring Boot Backend API Server on Port 8088...
start "GMS Backend (Spring Boot 3.3.5)" cmd /k "cd /d ""%~dp0backend"" && .\mvnw.bat spring-boot:run"

echo Waiting 5 seconds for backend to start initialization...
timeout /t 5 /nobreak >nul

echo.
echo [2/2] Starting Angular 21 Frontend on Port 4200...
start "GMS Frontend (Angular 21)" cmd /k "cd /d ""%~dp0frontend"" && npm start"

echo.
echo ============================================================================
echo Application is starting!
echo * Frontend UI:     http://localhost:4200
echo * Backend REST:    http://localhost:8088/api/programs
echo * Database Script: %~dp0database\grants_management_mysql.sql
echo ============================================================================
pause

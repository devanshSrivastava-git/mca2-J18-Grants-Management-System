@echo off
echo ============================================================================
echo   GRANTS MANAGEMENT SYSTEM - SPRING BOOT (MYSQL PROFILE)
echo ============================================================================
echo Connecting to MySQL Workbench Schema: grants_db on 127.0.0.1:3306
echo Make sure MySQL Server is running and you executed:
echo   database\grants_management_mysql.sql
echo.
cd /d "%~dp0backend"
call .\mvnw.bat spring-boot:run -Dspring-boot.run.profiles=mysql
pause

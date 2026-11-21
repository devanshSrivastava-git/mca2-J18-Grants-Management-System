@echo off
echo ============================================================================
echo   GRANTS MANAGEMENT SYSTEM - ANGULAR 21 FRONTEND
echo ============================================================================
echo Starting frontend server on http://localhost:4200 (proxies /api to 8088)...
echo.
cd /d "%~dp0frontend"
npm start
pause

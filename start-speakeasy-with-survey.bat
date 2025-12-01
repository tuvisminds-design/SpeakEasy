@echo off
echo ========================================
echo   Speakeasy Pre-Assessment Survey
echo ========================================
echo.
echo Starting pre-assessment survey...
echo.

python mico_survey_bot.py

echo.
echo Survey completed. Starting Speakeasy application...
echo.

REM Check if npm start is needed (if not already running)
timeout /t 2 /nobreak >nul
start "" npm start

echo.
echo Speakeasy is starting. It will open in your browser shortly.
echo.
pause


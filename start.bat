@echo off
echo Starting Task Manager Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo Application is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8000
echo.
echo Press any key to exit this window...
pause > nul

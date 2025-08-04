@echo off
echo Starting FinSight Development Environment...

echo.
echo Starting Django Backend...
start "Django Backend" cmd /k "cd /d c:\Users\TRANAV\OneDrive\Desktop\Quest\finsight_backend && python manage.py runserver 8000"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting React Frontend...
start "React Frontend" cmd /k "cd /d c:\Users\TRANAV\OneDrive\Desktop\Quest\finsight-nextjs && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
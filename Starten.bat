@echo off
rem Startet die App auf diesem Rechner. Fenster offen lassen, solange die App genutzt wird.
cd /d "%~dp0"
title 3D-Druck Buehnen
echo.
echo  3D-Druck Buehnen wird gestartet ...
echo.
call npx prisma migrate deploy >nul
call npm run build
if errorlevel 1 (
  echo.
  echo  Der Start ist fehlgeschlagen. Meldung oben pruefen.
  pause
  exit /b 1
)
echo.
echo  Am Rechner:  http://localhost:3000
echo  Am Handy im selben WLAN:  http://[eine der Adressen unten]:3000
ipconfig | findstr /c:"IPv4"
echo.
echo  Zum Beenden dieses Fenster schliessen.
echo.
start "" http://localhost:3000
call npm run start
pause

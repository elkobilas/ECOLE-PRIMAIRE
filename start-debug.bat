@echo off
echo ========================================
echo    DEMARRAGE DE L'APPLICATION ECOLE
echo ========================================
echo.
echo Demarrage du serveur local sur le port 8080...
echo.
echo Pour arreter le serveur, appuyez sur Ctrl+C
echo.
echo Votre application sera accessible sur:
echo http://localhost:8080
echo.
echo ========================================
echo.

python -m http.server 8080

pause


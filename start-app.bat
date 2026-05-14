@echo off
title Application de Gestion Scolaire
color 0A

echo.
echo ========================================
echo    APPLICATION DE GESTION SCOLAIRE
echo ========================================
echo.
echo 🚀 Démarrage de l'application...
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé
    echo 💡 Téléchargez Node.js depuis: https://nodejs.org/
    echo.
    echo 🔄 Tentative avec Python...
    echo.
    python --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Python n'est pas installé non plus
        echo 💡 Installez Node.js ou Python pour lancer l'application
        pause
        exit /b 1
    ) else (
        echo ✅ Python détecté, démarrage du serveur...
        echo.
        echo 🌐 Votre application sera accessible sur: http://localhost:8080
        echo 🛑 Pour arrêter, appuyez sur Ctrl+C
        echo.
        python -m http.server 8080
    )
) else (
    echo ✅ Node.js détecté, démarrage du serveur optimisé...
    echo.
    echo 🌐 Votre application sera accessible sur: http://localhost:8080
    echo 🛑 Pour arrêter, appuyez sur Ctrl+C
    echo.
    node server.js
)

pause


@echo off
echo.
echo ===============================================
echo         DRAMA BOX STREAMING APP
echo ===============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js tidak terinstall.
    echo.
    echo Silakan install Node.js dari: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js ditemukan. Memulai server dengan API Proxy...
echo.
echo ✅ CORS Issues Fixed - Menggunakan API Proxy lokal
echo ✅ Server akan berjalan di: http://localhost:3000
echo.
echo 📺 Buka browser dan akses: http://localhost:3000
echo.
echo Tekan Ctrl+C untuk menghentikan server
echo.

node server.js

pause

@echo off
echo ==========================================
echo   Building DramaBox for Android
echo ==========================================

echo 1. Building Web App...
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo 2. Syncing Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Android platform not added. Adding now...
    call npx cap add android
    call npx cap sync android
)

echo 3. Building APK (Debug)...
cd android
call gradlew assembleDebug

echo ==========================================
echo   Build Complete!
echo   APK Location: android\app\build\outputs\apk\debug\app-debug.apk
echo ==========================================
cd ..
pause

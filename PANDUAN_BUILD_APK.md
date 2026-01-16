# Panduan Build APK & Hosting Server DramaBox

Agar aplikasi Anda berjalan sempurna di HP dengan database yang sinkron, ikuti langkah-langkah berikut:

## 1. Hosting Backend (Server SSH/VPS)
**Wajib** dilakukan agar APK bisa mengakses database dari mana saja.

1. Upload seluruh folder proyek ke server SSH/VPS Anda.
2. Install Node.js di server tersebut.
3. Jalankan server dengan perintah: `node server.js`
   (Saran: Gunakan `pm2` agar server tetap jalan meskipun terminal ditutup: `pm2 start server.js`).
4. Pastikan port `3001` terbuka di firewall server Anda.

## 2. Hubungkan Frontend ke Server
Edit file `src/context/AppConfigContext.tsx` dan pastikan `API_BASE_URL` mengarah ke IP Server Anda:
```tsx
const API_BASE_URL = 'http://ALAMAT_IP_SERVER_ANDA:3001';
```
*(Ulangi hal yang sama di Login.tsx, SignUp.tsx, AuthContext.tsx, dan MemberManagement.tsx jika perlu)*.

## 3. Build APK secara Lokal
Ada masalah versi Java (Anda menggunakan Java 24 yang terlalu baru untuk Gradle saat ini).

**Langkah Perbaikan:**
1. **Download & Install Java JDK 17 atau 21** (Versi Long Term Support).
2. Set Environment Variable `JAVA_HOME` ke folder JDK 17 tersebut.
3. Jalankan perintah build:
   ```powershell
   npm run build
   npx cap sync android
   cd android
   ./gradlew assembleDebug
   ```
4. File APK akan berada di: `android/app/build/outputs/apk/debug/app-debug.apk`

## 4. Keamanan (Opsional tapi Disarankan)
Jika Anda menggunakan SSH, disarankan menggunakan **Nginx Reverse Proxy** agar API bisa diakses melalui `https://domainanda.com/api` bukannya port `3001`.

# DramaBox Streaming App

A high-performance React application for Web and Mobile (Android), built with Vite, TypeScript, and Capacitor.

## 🚀 Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **State Management:** TanStack Query (React Query)
- **Styling:** Vanilla CSS (Variables & Utilities)
- **Mobile:** Capacitor (Android)
- **PWA:** Vite PWA Plugin
- **Proxy:** Nginx

## 🛠 Project Structure

```
/src
 ├─ api/          # API Integration (Axios + Interceptors)
 ├─ components/   # Reusable UI Components
 ├─ layouts/      # App Layouts (MainLayout)
 ├─ pages/        # Page Components (Home, etc.)
 ├─ utils/        # Helper Functions
 ├─ App.tsx       # Main Router & Provider Setup
 └─ main.tsx      # Entry Point
```

## ⚡ Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`

## 📱 Mobile Development (Android)

1. **Setup Android Environment**
   Ensure Android Studio and SDK are installed.

2. **Run on Android Device**
   ```bash
   npm run build
   npx cap add android  # First time only
   npx cap sync
   npx cap open android
   ```
   Then run from Android Studio.

3. **Build APK**
   Run the included script:
   ```bash
   .\build-android.bat
   ```
   Or manually:
   ```bash
   npm run build
   npx cap sync
   cd android
   ./gradlew assembleDebug
   ```

## 🌐 Production Deployment (Web)

1. **Build Static Files**
   ```bash
   npm run build
   ```
   Output will be in `dist/`.

2. **Deploy with Nginx**
   Use the provided `nginx.conf`.
   - Copy `dist/` to `/var/www/dramabox/dist`
   - Configure Nginx sites-available/dramabox
   - Enable SSL with Certbot:
     ```bash
     sudo certbot --nginx -d your-domain.com
     ```

## 🔧 Configuration

- **API URL:** configured in `vite.config.ts` (dev) and `nginx.conf` (prod).
- **PWA:** Managed via `vite-plugin-pwa` in `vite.config.ts`.
- **Theme:** Edit variables in `src/index.css`.

## 📦 Performance Features

- **Split Chunking:** Vendor libs separated automatically.
- **Lazy Loading:** Route-based code splitting handled by React Router (optional implementation).
- **Asset Caching:** Long-term caching configured in Nginx.
- **Service Worker:** Offline capabilities enabled.

## 📝 License

Private.

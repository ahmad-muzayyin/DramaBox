import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.dramabox.app',
    appName: 'DramaBox',
    webDir: 'dist',
    server: {
        androidScheme: 'https',
        cleartext: true
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: "#ffffffff",
            showSpinner: false,
            splashFullScreen: true,
            splashImmersive: true,
        },
    },
};

export default config;

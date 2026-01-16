import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'DramaBox Streaming',
                short_name: 'DramaBox',
                description: 'Streaming Aplikasi Drama Terbaik',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: true, // Listen on all addresses
        port: 5173,
        watch: {
            usePolling: true
        },
        proxy: {
            // New Local Server Endpoints
            '/api/config': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false
            },
            '/api/members': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false
            },
            // Existing Remote API
            '/api': {
                target: 'https://dramabox.sansekai.my.id',
                changeOrigin: true,
                secure: false,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                }
            }
        }
    },
    build: {
        target: 'esnext',
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'query-vendor': ['@tanstack/react-query'],
                }
            }
        }
    }
});

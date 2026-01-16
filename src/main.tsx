import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { App as CapacitorApp } from '@capacitor/app';

// Handle Android Back Button
CapacitorApp.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
        CapacitorApp.exitApp();
    } else {
        window.history.back();
    }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

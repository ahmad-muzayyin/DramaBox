import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AppConfig {
    isFreeApp: boolean;
    enableAds: boolean;
    adProvider: 'google' | 'adsterra';
    adsterraKey: string;
    googleAdsClient: string;
    // Pricing Configuration
    weeklyPrice: number;
    monthlyPrice: number;
    yearlyPrice: number;
    // App Branding
    appName: string;
    appTagline: string;
    appLogo: string;
    // Admin Credentials
    adminUsername?: string;
    adminPassword?: string;
    adminDisplayName?: string;
}

const DEFAULT_CONFIG: AppConfig = {
    isFreeApp: false,
    enableAds: true,
    adProvider: 'adsterra',
    adsterraKey: '',
    googleAdsClient: '',
    // Default Prices
    weeklyPrice: 3000,
    monthlyPrice: 10000,
    yearlyPrice: 100000,
    // Default Branding
    appName: 'Drama Short',
    appTagline: 'By Amue Devs',
    appLogo: '/logo.png',
    // Default Admin
    adminUsername: 'admin',
    adminPassword: 'admin',
    adminDisplayName: 'Admin Premium'
};

interface AppConfigContextType {
    config: AppConfig;
    updateConfig: (newConfig: Partial<AppConfig>) => void;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

// For Production (APK/Live), change this to your live server IP/Domain
// e.g., 'https://your-domain.com' or 'http://123.123.123.123:3001'
const API_BASE_URL = 'http://35.193.10.17:3001';

export const AppConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

    useEffect(() => {
        // Fetch config from server
        fetch(`${API_BASE_URL}/api/config`)
            .then(res => res.json())
            .then(data => {
                // Ensure we merge with defaults to avoid missing keys
                setConfig(prev => ({ ...prev, ...data }));
            })
            .catch(err => console.error("Failed to load config", err));
    }, []);

    const updateConfig = async (newConfig: Partial<AppConfig>) => {
        const updated = { ...config, ...newConfig };
        setConfig(updated); // Optimistic update

        try {
            await fetch(`${API_BASE_URL}/api/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
        } catch (err) {
            console.error("Failed to save config", err);
            // Revert or alert user if needed
        }
    };

    return (
        <AppConfigContext.Provider value={{ config, updateConfig }}>
            {children}
        </AppConfigContext.Provider>
    );
};

export const useAppConfig = () => {
    const context = useContext(AppConfigContext);
    if (!context) {
        throw new Error("useAppConfig must be used within AppConfigProvider");
    }
    return context;
};

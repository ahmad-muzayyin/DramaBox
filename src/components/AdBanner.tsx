import React, { useEffect } from 'react';
import { useAppConfig } from '../context/AppConfigContext';
import { useSubscription } from '../hooks/useSubscription';

export const AdBanner: React.FC<{ position?: 'top' | 'bottom' | 'inline' }> = ({ position = 'bottom' }) => {
    const { config } = useAppConfig();
    const { isPremium } = useSubscription();

    // Debug: Log config changes
    useEffect(() => {
        console.log('AdBanner - Config updated:', {
            enableAds: config.enableAds,
            adProvider: config.adProvider,
            isPremium: isPremium
        });
    }, [config.enableAds, config.adProvider, isPremium]);

    // Don't show ads if disabled or user is premium
    if (!config.enableAds || isPremium) {
        console.log('AdBanner - Hidden (enableAds:', config.enableAds, ', isPremium:', isPremium, ')');
        return null;
    }

    console.log('AdBanner - Showing ad');

    return (
        <div style={{
            width: '100%',
            height: '60px',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            fontSize: '0.8rem',
            marginBottom: position === 'inline' ? '1rem' : 0,
            marginTop: position === 'inline' ? '1rem' : 0
        }}>
            {config.adProvider === 'google' ? (
                <span>Google Ads Space (Client: {config.googleAdsClient || 'Not Set'})</span>
            ) : (
                <span>Adsterra Banner (Key: {config.adsterraKey || 'Not Set'})</span>
            )}
        </div>
    );
};

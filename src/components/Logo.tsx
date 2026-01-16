import React from 'react';
import { useAppConfig } from '../context/AppConfigContext';

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
    const { config } = useAppConfig();

    const sizes = {
        small: { logo: '32px', text: '0.9rem', tagline: '0.65rem' },
        medium: { logo: '48px', text: '1.2rem', tagline: '0.75rem' },
        large: { logo: '80px', text: '1.8rem', tagline: '0.9rem' }
    };

    const currentSize = sizes[size];

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Logo Image */}
            <div style={{
                width: currentSize.logo,
                height: currentSize.logo,
                background: 'linear-gradient(135deg, #9333ea 0%, #f093fb 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: size === 'large' ? '2.5rem' : size === 'medium' ? '1.5rem' : '1rem',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
            }}>
                {config.appLogo && config.appLogo !== '/logo.png' ? (
                    <img
                        src={config.appLogo}
                        alt={config.appName}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            borderRadius: '12px'
                        }}
                    />
                ) : (
                    <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🎬</span>
                )}
            </div>

            {/* App Name & Tagline */}
            {showText && (
                <div>
                    <div style={{
                        fontWeight: 700,
                        fontSize: currentSize.text,
                        lineHeight: 1.2,
                        background: 'linear-gradient(135deg, #9333ea 0%, #f093fb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        {config.appName}
                    </div>
                    <div style={{
                        fontSize: currentSize.tagline,
                        color: 'hsl(var(--text-muted))',
                        fontStyle: 'italic',
                        marginTop: '2px'
                    }}>
                        {config.appTagline}
                    </div>
                </div>
            )}
        </div>
    );
};

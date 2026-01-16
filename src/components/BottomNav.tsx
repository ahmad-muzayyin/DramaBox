import React from 'react';
import { Home, Compass, Library, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const BottomNav: React.FC = () => {
    const navItemStyle = ({ isActive }: { isActive: boolean }) => ({
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        textDecoration: 'none',
        color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
        fontSize: '0.75rem',
        gap: '0.25rem'
    });

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 'var(--nav-height)',
            background: 'hsl(var(--bg-card))',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            zIndex: 50,
            paddingBottom: 'env(safe-area-inset-bottom)'
        }}>
            <NavLink to="/" style={navItemStyle}>
                <Home size={24} />
                <span>Home</span>
            </NavLink>
            <NavLink to="/explore" style={navItemStyle}>
                <Compass size={24} />
                <span>Explore</span>
            </NavLink>
            <NavLink to="/library" style={navItemStyle}>
                <Library size={24} />
                <span>Library</span>
            </NavLink>
            <NavLink to="/profile" style={navItemStyle}>
                <User size={24} />
                <span>Profile</span>
            </NavLink>
        </div>
    );
};

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';

export const MainLayout: React.FC = () => {
    return (
        <div style={{ paddingBottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom))' }}>
            <Navbar />
            <main className="container fade-in" style={{ paddingTop: '1rem' }}>
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};

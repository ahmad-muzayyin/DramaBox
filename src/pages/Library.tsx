import React from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { DramaList } from '../components/DramaList';
import { Heart, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Library: React.FC = () => {
    const { favorites } = useFavorites();
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ paddingBottom: '2rem', minHeight: '100vh', background: 'hsl(var(--bg-main))' }}>
            <div style={{
                padding: '1rem',
                position: 'sticky',
                top: 0,
                background: 'hsl(var(--bg-main))',
                zIndex: 10,
                borderBottom: '1px solid hsla(0,0%,100%,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Heart size={20} fill="hsl(var(--primary))" color="hsl(var(--primary))" />
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Favorit Saya</h1>
                </div>
                {user?.role === 'owner' && (
                    <button
                        onClick={() => navigate('/admin/settings')}
                        style={{ background: 'none', border: 'none', color: 'hsl(var(--text-muted))', cursor: 'pointer' }}
                    >
                        <Settings size={20} />
                    </button>
                )}
            </div>

            <div className="container" style={{ paddingTop: '1.5rem' }}>
                {favorites.length === 0 ? (
                    <div style={{
                        height: '60vh', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--text-muted))'
                    }}>
                        <div style={{ padding: '1.5rem', background: 'hsla(0,0%,100%,0.05)', borderRadius: '50%', marginBottom: '1rem' }}>
                            <Heart size={32} />
                        </div>
                        <p>Belum ada drama favorit</p>
                    </div>
                ) : (
                    <DramaList dramas={favorites} isLoading={false} />
                )}
            </div>
        </div>
    );
};

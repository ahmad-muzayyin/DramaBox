import React from 'react';
import { Drama } from '../api/dramas';
import { DramaCard } from './DramaCard';

interface DramaListProps {
    dramas?: Drama[];
    isLoading: boolean;
    emptyMessage?: string;
    columns?: 'auto' | 2 | 3;
}

export const DramaList: React.FC<DramaListProps> = ({ dramas, isLoading, emptyMessage = "Tidak ada drama ditemukan", columns = 'auto' }) => {
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: columns === 'auto' ? 'repeat(auto-fill, minmax(110px, 1fr))' : `repeat(${columns}, 1fr)`,
        gap: '0.75rem'
    };

    if (isLoading) {
        return (
            <div style={gridStyle}>
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 'var(--radius)' }} />
                ))}
            </div>
        );
    }

    if (!dramas || dramas.length === 0) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--text-muted))' }}>{emptyMessage}</div>;
    }

    return (
        <div style={gridStyle}>
            {dramas.map((drama) => (
                <DramaCard key={drama.bookId} drama={drama} />
            ))}
        </div>
    );
};

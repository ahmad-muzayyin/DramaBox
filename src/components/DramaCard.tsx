import React from 'react';
import { PlayCircle } from 'lucide-react';
import { Drama } from '../api/dramas';
import { Link } from 'react-router-dom';

interface DramaCardProps {
    drama: Drama;
    aspectRatio?: '2/3' | '16/9';
}

export const DramaCard: React.FC<DramaCardProps> = ({ drama, aspectRatio = '2/3' }) => {
    return (
        <Link to={`/drama/${drama.bookId}`} className="card card-hover" style={{
            padding: 0,
            position: 'relative',
            overflow: 'hidden',
            display: 'block',
            textDecoration: 'none',
            color: 'inherit'
        }}>
            <div style={{ position: 'relative', aspectRatio: aspectRatio }}>
                <img
                    src={drama.coverWap || (drama as any).cover || (drama as any).coverImage || 'https://via.placeholder.com/300x450?text=No+Image'}
                    alt={drama.bookName}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    height: '60%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    left: '0.5rem',
                    right: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                }}>
                    <PlayCircle size={12} fill="white" stroke="none" />
                    <span>{drama.playCount}</span>
                </div>
            </div>
            <div style={{ padding: '0.5rem 0.5rem 0.75rem' }}>
                <h3 style={{
                    fontSize: '0.9rem',
                    marginBottom: '0.25rem',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.2'
                }}>
                    {drama.bookName}
                </h3>
                {drama.tags && drama.tags.length > 0 && (
                    <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>
                        {drama.tags[0]}
                    </div>
                )}
            </div>
        </Link>
    );
};

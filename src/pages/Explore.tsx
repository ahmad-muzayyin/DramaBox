import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDubIndo, getTrending, getForYou, getRandomDrama } from '../api/dramas';
import { DramaList } from '../components/DramaList';
import { Flame, Languages, Sparkles, Dices } from 'lucide-react';

const Tabs = [
    { id: 'foryou', label: 'For You', icon: Sparkles, fetcher: getForYou },
    { id: 'trending', label: 'Trending', icon: Flame, fetcher: getTrending },
    { id: 'dub', label: 'Dub Indo', icon: Languages, fetcher: getDubIndo },
    { id: 'random', label: 'Random', icon: Dices, fetcher: getRandomDrama },
];

export const Explore: React.FC = () => {
    const [activeTab, setActiveTab] = useState(Tabs[0].id);

    const activeFetcher = Tabs.find(t => t.id === activeTab)?.fetcher;

    const { data, isLoading } = useQuery({
        queryKey: ['explore', activeTab],
        queryFn: activeFetcher!,
    });

    return (
        <div>
            {/* Header Tabs */}
            <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '1rem',
                padding: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid hsla(0,0%,100%,0.1)',
                position: 'sticky',
                top: 0,
                background: 'hsl(var(--bg-main))',
                zIndex: 10
            }}>
                {Tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.5rem 1rem',
                                background: isActive ? 'hsl(var(--primary))' : 'hsl(var(--bg-card))',
                                border: 'none',
                                borderRadius: 'var(--radius)',
                                color: isActive ? 'white' : 'hsl(var(--text-muted))',
                                minWidth: '80px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Content */}
            <div className="container" style={{ paddingTop: '1.5rem' }}>
                {/* Dynamic Content Rendering */}
                {(() => {
                    // Standard Home/Structure format
                    if (data?.columnVoList && data.columnVoList.length > 0) {
                        return data.columnVoList.map((col: any) => (
                            <div key={col.columnId} style={{ marginBottom: '2rem' }}>
                                {col.title && (
                                    <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderLeft: '3px solid hsl(var(--primary))', paddingLeft: '0.5rem' }}>
                                        {col.title}
                                    </h2>
                                )}
                                <DramaList dramas={col.bookList} isLoading={isLoading} />
                            </div>
                        ));
                    }

                    // Fallback: If it's a flat array or valid data object without columns
                    // E.g. Search results or Random might return different structure
                    const flatList = Array.isArray(data) ? data : ((data as any)?.data || (data as any)?.bookList || data);

                    if (Array.isArray(flatList) && flatList.length > 0) {
                        return (
                            <div style={{ marginBottom: '2rem' }}>
                                <DramaList dramas={flatList} isLoading={isLoading} />
                            </div>
                        );
                    }

                    // Loading State
                    if (isLoading) {
                        return <DramaList isLoading={true} />;
                    }

                    // Empty State
                    return <div className="text-center p-4 text-muted">Tidak ada konten tersedia.</div>;
                })()}
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchDramas, getPopularSearch } from '../api/dramas';
import { DramaList } from '../components/DramaList';
import { Search as SearchIcon, X, TrendingUp } from 'lucide-react';

export const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const [searchTrigger, setSearchTrigger] = useState('');
    // const navigate = useNavigate();

    // Fetch Popular searches
    const { data: popularSearches } = useQuery({
        queryKey: ['popularSearch'],
        queryFn: getPopularSearch,
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    // Fetch search results when searchTrigger changes
    const { data: searchResults, isLoading, isError } = useQuery({
        queryKey: ['search', searchTrigger],
        queryFn: () => searchDramas(searchTrigger),
        enabled: searchTrigger.length > 0,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setSearchTrigger(query);
        }
    };

    const handleKeywordClick = (keyword: string) => {
        setQuery(keyword);
        setSearchTrigger(keyword);
    };

    const clearSearch = () => {
        setQuery('');
        setSearchTrigger('');
    };

    return (
        <div style={{ paddingBottom: '2rem', minHeight: '100vh', background: 'hsl(var(--bg-main))', color: 'hsl(var(--text-main))' }}>
            <div style={{
                position: 'sticky', top: 0, zIndex: 40,
                backgroundColor: 'rgba(10, 10, 10, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '1rem',
                borderBottom: '1px solid hsla(0,0%,100%,0.05)'
            }}>
                <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                    <SearchIcon
                        size={20}
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'hsl(var(--text-muted))',
                            zIndex: 1
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Cari drama, genre, atau aktor..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'hsl(var(--bg-input))',
                            border: '1px solid hsla(0,0%,100%,0.1)',
                            borderRadius: '2rem',
                            padding: '0.8rem 1rem 0.8rem 3rem',
                            fontSize: '1rem',
                            color: 'white',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        autoFocus
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'hsl(var(--text-main))',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={14} />
                        </button>
                    )}
                </form>
            </div>

            <div className="container" style={{ paddingTop: '1.5rem' }}>
                {!searchTrigger ? (
                    <div>
                        <div className="flex items-center gap-2 mb-4" style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem', fontWeight: 600 }}>
                            <TrendingUp size={16} style={{ color: 'hsl(var(--primary))' }} />
                            <span>PENCARIAN POPULER</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {(Array.isArray(popularSearches) ? popularSearches : []).map((item: any, idx: number) => {
                                const keyword = typeof item === 'string' ? item : item.word || item.keyword || item.bookName || 'Drama';
                                if (typeof keyword !== 'string') return null; // Safety skip if still object
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleKeywordClick(keyword)}
                                        className="btn-ghost"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            fontSize: '0.9rem',
                                            borderRadius: '2rem',
                                            padding: '0.6rem 1.2rem',
                                            color: 'hsl(var(--text-main))',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {keyword}
                                    </button>
                                )
                            })}

                            {(!popularSearches || popularSearches.length === 0) && (
                                <div style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem', fontStyle: 'italic' }}>Tidak ada data populer.</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                Hasil untuk <span style={{ color: 'hsl(var(--primary))' }}>"{searchTrigger}"</span>
                            </h2>
                        </div>

                        {(() => {
                            if (isLoading) {
                                return <DramaList isLoading={true} />;
                            }

                            if (isError) {
                                return (
                                    <div className="text-center p-8">
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Terjadi Kesalahan</h3>
                                        <p style={{ color: 'hsl(var(--text-muted))' }}>Gagal memuat hasil pencarian.</p>
                                    </div>
                                );
                            }

                            // Defensive: fallback to explicit checks avoiding complex nested unsafe access
                            if (searchResults?.columnVoList && Array.isArray(searchResults.columnVoList) && searchResults.columnVoList.length > 0) {
                                return searchResults.columnVoList.map((col: any) => (
                                    <div key={col.columnId || Math.random()} style={{ marginBottom: '2rem' }}>
                                        {col.title && <h3 style={{ marginBottom: '0.5rem', opacity: 0.8 }}>{col.title}</h3>}
                                        <DramaList dramas={col.bookList} isLoading={isLoading} />
                                    </div>
                                ));
                            }

                            // Attempt to find any array list
                            const potentialList = Array.isArray(searchResults) ? searchResults :
                                (
                                    (searchResults as any)?.data
                                    || (searchResults as any)?.bookList
                                    || (searchResults as any)?.list
                                );

                            if (Array.isArray(potentialList) && potentialList.length > 0) {
                                return <DramaList dramas={potentialList} isLoading={false} />;
                            }

                            return (
                                <div className="text-center p-8">
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Tidak ditemukan</h3>
                                    <p style={{ color: 'hsl(var(--text-muted))' }}>Coba kata kunci lain atau periksa ejaanmu.</p>
                                </div>
                            );
                        })()}
                    </>
                )}
            </div>
        </div>
    );
};

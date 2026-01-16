import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHomeData, Drama } from '../api/dramas';
import { DramaList } from '../components/DramaList';
import { AdBanner } from '../components/AdBanner';

const DramaSection: React.FC<{ title: string; data?: Drama[]; isLoading: boolean }> = ({ title, data, isLoading }) => (
    <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{title}</h2>
        <DramaList dramas={data} isLoading={isLoading} />
    </section>
);

export const Home: React.FC = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['homeData'],
        queryFn: getHomeData,
        staleTime: 1000 * 60 * 10, // 10 minutes cache
    });

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center" style={{ minHeight: '50vh', textAlign: 'center' }}>
                <p style={{ color: 'hsl(var(--danger))', marginBottom: '1rem' }}>Gagal memuat data</p>
                <button className="btn" onClick={() => window.location.reload()}>Coba Lagi</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '1.5rem' }}>
            {isLoading ? (
                // Skeleton Initial Load
                <>
                    <DramaSection title="Memuat..." isLoading={true} />
                    <DramaSection title="Memuat..." isLoading={true} />
                </>
            ) : (
                data?.columnVoList.map((column, index) => (
                    <React.Fragment key={column.columnId}>
                        <DramaSection
                            title={column.title}
                            data={column.bookList}
                            isLoading={false}
                        />
                        {/* Insert AdBanner after the first section, or another suitable position */}
                        {index === 0 && <AdBanner position="inline" />}
                    </React.Fragment>
                ))
            )}
            <div style={{ height: '4rem' }} /> {/* Spacing for bottom nav */}
        </div>
    );
};

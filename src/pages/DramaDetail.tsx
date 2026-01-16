import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDramaDetail, getAllEpisodes } from '../api/dramas';
import { useFavorites } from '../hooks/useFavorites';
import { useSubscription } from '../hooks/useSubscription'; // Imported hook
import { useAppConfig } from '../context/AppConfigContext';
import { ArrowLeft, Play, Share2, Heart, Lock, Ticket } from 'lucide-react'; // Added Lock, Ticket

export const DramaDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [isFav, setIsFav] = useState(false);

    // Subscription Hook
    const { tickets, isUnlocked, unlockEpisode, isPremium } = useSubscription();
    const [showPaywall, setShowPaywall] = useState(false);

    const { config } = useAppConfig(); // Get app config

    // Sync favorite state
    useEffect(() => {
        if (id) setIsFav(isFavorite(id));
    }, [id, isFavorite]);

    const { data: detail, isLoading: loadingDetail } = useQuery({
        queryKey: ['dramaDetail', id],
        queryFn: () => getDramaDetail(id!),
        enabled: !!id,
    });

    const { data: episodesData, isLoading: loadingEpisodes } = useQuery({
        queryKey: ['dramaEpisodes', id],
        queryFn: () => getAllEpisodes(id!),
        enabled: !!id,
    });

    const drama = detail?.data || detail;

    let episodes: any[] = [];
    if (Array.isArray(episodesData)) {
        episodes = episodesData;
    } else if (episodesData?.data?.episodeList) {
        episodes = episodesData.data.episodeList;
    } else if (episodesData?.episodeList) {
        episodes = episodesData.episodeList;
    }

    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number | null>(null);
    const [showFullIntro, setShowFullIntro] = useState(false);

    const handleToggleFavorite = () => {
        if (drama) {
            const newState = toggleFavorite(drama);
            setIsFav(newState);
        }
    };

    const playEpisode = async (index: number) => {
        const episodeId = `${id}_${index}`;

        const isFreeMode = config?.isFreeApp === true;

        if (isFreeMode) {
            setCurrentEpisodeIndex(index);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (await unlockEpisode(episodeId)) {
            setCurrentEpisodeIndex(index);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setShowPaywall(true);
        }
    };

    const handleVideoEnded = async () => {
        if (currentEpisodeIndex !== null && currentEpisodeIndex < episodes.length - 1) {
            const nextIndex = currentEpisodeIndex + 1;
            const nextEpisodeId = `${id}_${nextIndex}`;

            // Auto unlock next if possible
            if (await unlockEpisode(nextEpisodeId)) {
                setCurrentEpisodeIndex(nextIndex);
            } else {
                setShowPaywall(true);
            }
        }
    };

    const currentEpisode = currentEpisodeIndex !== null ? episodes[currentEpisodeIndex] : null;

    // Get the best quality video URL (1080p -> 720p -> 540p)
    const getVideoUrl = (episode: any) => {
        if (!episode?.cdnList) return '';
        const defaultCdn = episode.cdnList.find((cdn: any) => cdn.isDefault === 1) || episode.cdnList[0];
        if (!defaultCdn?.videoPathList) return '';

        // Sort by quality descending (1080 -> 720 -> 540)
        const sorted = [...defaultCdn.videoPathList].sort((a: any, b: any) => b.quality - a.quality);
        return sorted[0]?.videoPath || '';
    };

    if (loadingDetail) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div className="skeleton" style={{ height: '40vh', width: '100%' }} />
                <div className="p-4" style={{ padding: '1rem' }}>
                    <div className="skeleton" style={{ height: '2rem', width: '70%', marginBottom: '1rem' }} />
                    <div className="skeleton" style={{ height: '1rem', width: '40%', marginBottom: '2rem' }} />
                    <div className="flex gap-2">
                        <div className="skeleton" style={{ height: '3rem', flex: 1 }} />
                        <div className="skeleton" style={{ height: '3rem', width: '3rem' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (!drama) return <div className="p-4 text-center">Drama tidak ditemukan</div>;

    return (
        <div style={{ paddingBottom: '5rem', minHeight: '100vh', background: 'hsl(var(--bg-main))' }}>

            {/* Player / Header Area */}
            <div style={{ position: 'relative', height: 'auto', minHeight: '40vh', background: 'black' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        position: 'absolute', top: '1rem', left: '1rem', zIndex: 20,
                        background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '0.5rem',
                        border: 'none', color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)'
                    }}
                >
                    <ArrowLeft size={24} />
                </button>

                {currentEpisode ? (
                    <div style={{ width: '100%', aspectRatio: '9/16', maxHeight: '80vh', margin: '0 auto' }}>
                        <video
                            key={currentEpisode.chapterId} // Force remount on change
                            controls
                            autoPlay
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onEnded={handleVideoEnded}
                            poster={drama.coverWap}
                        >
                            <source src={getVideoUrl(currentEpisode)} type="video/mp4" />
                            Browser Anda tidak mendukung tag video.
                        </video>
                    </div>
                ) : (
                    <>
                        <img
                            src={drama.coverWap}
                            alt={drama.bookName}
                            style={{ width: '100%', height: '40vh', objectFit: 'cover' }}
                        />
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            height: '100%',
                            background: 'linear-gradient(to bottom, transparent 40%, hsl(var(--bg-main)) 100%)'
                        }} />
                    </>
                )}
            </div>

            <div className="container" style={{ marginTop: currentEpisode ? '1rem' : '-4rem', position: 'relative', zIndex: 5 }}>
                <h1 style={{ fontSize: '1.75rem', lineHeight: 1.2, marginBottom: '0.5rem' }}>
                    {currentEpisode ? `${drama.bookName} - Eps ${currentEpisodeIndex! + 1} ` : drama.bookName}
                </h1>

                <div className="flex items-center gap-2 mb-4" style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                    {drama.score && <span style={{ color: 'hsl(var(--warning))' }}>★ {drama.score}</span>}
                    <span>• {drama.playCount} Views</span>
                    {drama.chapterCount && <span>• {drama.chapterCount} Eps</span>}
                </div>

                <div className="flex gap-2 mb-8">
                    <button className="btn" onClick={() => playEpisode(0)} style={{ flex: 1, gap: '0.5rem' }}>
                        <Play size={20} fill="currentColor" />
                        {currentEpisode ? 'Ulang dari Awal' : 'Mulai Nonton'}
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={handleToggleFavorite}
                        style={{
                            background: 'hsl(var(--bg-input))',
                            borderRadius: 'var(--radius)',
                            color: isFav ? 'hsl(var(--primary))' : 'inherit'
                        }}
                    >
                        <Heart size={20} fill={isFav ? "currentColor" : "none"} />
                    </button>
                    <button className="btn btn-ghost" style={{ background: 'hsl(var(--bg-input))', borderRadius: 'var(--radius)' }}>
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6" style={{ marginTop: '0.5rem' }}>
                    {drama.tags?.map((tag: string, i: number) => (
                        <span key={i} style={{
                            fontSize: '0.6rem',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.4rem'
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Introduction */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <p style={{
                        fontSize: '0.95rem',
                        color: 'hsl(var(--text-muted))',
                        lineHeight: 1.8,
                        display: showFullIntro ? 'block' : '-webkit-box',
                        WebkitLineClamp: showFullIntro ? 'unset' : 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {drama.introduction}
                    </p>
                    <button
                        onClick={() => setShowFullIntro(!showFullIntro)}
                        style={{ background: 'none', border: 'none', color: 'hsl(var(--primary))', fontSize: '0.85rem', marginTop: '0.5rem', cursor: 'pointer' }}
                    >
                        {showFullIntro ? 'Lebih Sedikit' : 'Selengkapnya'}
                    </button>
                </div>

                {/* Episodes Grid */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Episodes</h2>
                        {!config?.isFreeApp && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                background: 'hsl(var(--bg-input))', padding: '0.3rem 0.8rem', borderRadius: '2rem',
                                fontSize: '0.8rem', color: isPremium ? 'gold' : 'hsl(var(--primary))', fontWeight: 600
                            }}>
                                {isPremium ? (
                                    <><span>VIP</span></>
                                ) : (
                                    <><Ticket size={14} fill="currentColor" /><span>{tickets} Free</span></>
                                )}
                            </div>
                        )}
                    </div>

                    {loadingEpisodes ? (
                        <div className="flex justify-center p-4">Loading Episodes...</div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                            gap: '0.75rem'
                        }}>
                            {episodes.map((_: any, index: number) => {
                                const isCurrent = currentEpisodeIndex === index;
                                const episodeId = `${id}_${index}`;
                                const unlocked = isUnlocked(episodeId);
                                const isAccessible = (config?.isFreeApp === true) || isPremium || unlocked;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => playEpisode(index)}
                                        className="btn-ghost"
                                        style={{
                                            background: isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--bg-input))',
                                            color: isCurrent ? 'white' : 'hsl(var(--text-main))',
                                            aspectRatio: '1',
                                            borderRadius: 'var(--radius)',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            opacity: (!isAccessible && tickets === 0) ? 0.7 : 1
                                        }}
                                    >
                                        <span>{index + 1}</span>
                                        {!isAccessible && (
                                            <div style={{ position: 'absolute', top: 2, right: 2 }}>
                                                {tickets > 0 ? (
                                                    // Little dot to show available
                                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'hsl(var(--success))' }} />
                                                ) : (
                                                    <Lock size={10} style={{ opacity: 0.5 }} />
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            {/* Freemium Paywall Modal */}
            {showPaywall && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '2rem', backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: 'hsl(var(--bg-card))',
                        padding: '2rem',
                        borderRadius: '1rem',
                        width: '100%',
                        maxWidth: '320px',
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        border: '1px solid hsla(0,0%,100%,0.1)'
                    }}>
                        <div style={{
                            width: '3rem', height: '3rem', margin: '0 auto 1rem',
                            background: 'hsla(var(--primary), 0.2)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'hsl(var(--primary))'
                        }}>
                            <Lock size={24} />
                        </div>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Tiket Habis!</h3>
                        <p style={{ color: 'hsl(var(--text-muted))', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Kuota gratis harian Anda sudah habis. Tunggu besok untuk klaim 1 tiket gratis lagi, atau berlangganan untuk nonton sepuasnya.
                        </p>

                        <button className="btn" style={{ width: '100%', marginBottom: '0.75rem' }} onClick={() => alert("Redirect ke Payment Page (Mock)")}>
                            Langganan Premium
                        </button>

                        <button
                            className="btn-ghost"
                            onClick={() => setShowPaywall(false)}
                            style={{
                                width: '100%', padding: '0.75rem',
                                color: 'hsl(var(--text-muted))', fontSize: '0.9rem',
                                border: '1px solid hsla(0,0%,100%,0.1)', borderRadius: 'var(--radius)'
                            }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

import { useState, useEffect } from 'react';
import { Drama } from '../api/dramas';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Drama[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('dramabox_favorites');
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
    }, []);

    const saveFavorites = (newFavorites: Drama[]) => {
        setFavorites(newFavorites);
        localStorage.setItem('dramabox_favorites', JSON.stringify(newFavorites));
    };

    const addFavorite = (drama: Drama) => {
        if (!isFavorite(drama.bookId)) {
            const newFavs = [...favorites, drama];
            saveFavorites(newFavs);
        }
    };

    const removeFavorite = (bookId: string) => {
        const newFavs = favorites.filter(d => d.bookId !== bookId);
        saveFavorites(newFavs);
    };

    const isFavorite = (bookId: string) => {
        return favorites.some(d => d.bookId === bookId);
    };

    const toggleFavorite = (drama: Drama) => {
        if (isFavorite(drama.bookId)) {
            removeFavorite(drama.bookId);
            return false;
        } else {
            addFavorite(drama);
            return true;
        }
    };

    return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
};

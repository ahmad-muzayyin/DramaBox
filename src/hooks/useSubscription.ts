import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useSubscription = () => {
    const { user, updateUser } = useAuth();

    // Check for daily bonus (3 tickets)
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];

        if (user) {
            // Logged in user bonus
            if (user.lastDailyCheck !== today) {
                const currentTickets = user.tickets ?? 0;
                updateUser({
                    tickets: currentTickets + 3,
                    lastDailyCheck: today
                });
            }
        } else {
            // Guest bonus (stored in localStorage)
            const guestData = localStorage.getItem('dramabox_guest_sub');
            const data = guestData ? JSON.parse(guestData) : { tickets: 0, lastDailyCheck: null };

            if (data.lastDailyCheck !== today) {
                const newData = {
                    tickets: (data.tickets || 0) + 3,
                    lastDailyCheck: today
                };
                localStorage.setItem('dramabox_guest_sub', JSON.stringify(newData));
            }
        }
    }, [user, updateUser]);

    const getTickets = (): number => {
        if (user) return user.tickets ?? 0;
        const guestData = localStorage.getItem('dramabox_guest_sub');
        return guestData ? JSON.parse(guestData).tickets : 0;
    };

    const isVipValid = (): boolean => {
        if (user?.role === 'owner') return true;
        if (user?.role !== 'vip') return false;
        if (!user.expiryDate) return true;
        const expiry = new Date(user.expiryDate);
        return expiry > new Date();
    };

    const isPremium = isVipValid();
    const tickets = getTickets();

    const unlockEpisode = async (episodeId: string): Promise<boolean> => {
        if (user?.role === 'owner' || isPremium) return true;

        const key = user ? `unlocked_${user.username}` : 'unlocked_guest';
        const stored = localStorage.getItem(key);
        const unlockedList = stored ? JSON.parse(stored) : [];
        if (unlockedList.includes(episodeId)) return true;

        if (tickets > 0) {
            const newTickets = tickets - 1;
            if (user) {
                updateUser({ tickets: newTickets });
            } else {
                const guestData = JSON.parse(localStorage.getItem('dramabox_guest_sub') || '{}');
                guestData.tickets = newTickets;
                localStorage.setItem('dramabox_guest_sub', JSON.stringify(guestData));
            }

            const newList = [...unlockedList, episodeId];
            localStorage.setItem(key, JSON.stringify(newList));
            return true;
        }
        return false;
    };

    const isUnlocked = (episodeId: string): boolean => {
        if (user?.role === 'owner' || isPremium) return true;
        const key = user ? `unlocked_${user.username}` : 'unlocked_guest';
        const stored = localStorage.getItem(key);
        const unlockedList = stored ? JSON.parse(stored) : [];
        return unlockedList.includes(episodeId);
    };

    return {
        tickets,
        isPremium,
        isUnlocked,
        unlockEpisode,
        expiryDate: user?.expiryDate
    };
};

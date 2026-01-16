import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'guest' | 'member' | 'vip' | 'owner';

export interface User {
    id?: number;
    username: string;
    role: UserRole;
    tickets?: number;
    expiryDate?: string | null;
    lastDailyCheck?: string | null;
    email?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://35.193.10.17:3001';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('dramabox_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('dramabox_user', JSON.stringify(userData));
    };

    const updateUser = (data: Partial<User>) => {
        if (!user) return;
        const updated = { ...user, ...data };
        setUser(updated);
        localStorage.setItem('dramabox_user', JSON.stringify(updated));

        // If it's a member (not guest/owner), sync to backend if needed
        if (user.id && user.role !== 'owner') {
            fetch(`${API_BASE_URL}/api/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            }).catch(e => console.error("Auto-sync failed", e));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('dramabox_user');
    };

    const isAdmin = user?.role === 'owner';

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

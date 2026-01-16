import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useAppConfig } from '../context/AppConfigContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Shield, Crown, Ticket, ChevronRight, Settings, CreditCard, Clock } from 'lucide-react';

export const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const { isPremium, tickets } = useSubscription();
    const { config } = useAppConfig();
    const showFreeModeCard = config?.isFreeApp;
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[hsl(var(--bg-main))] px-4 text-center">
                <div style={{ width: '4rem', height: '4rem', background: 'hsl(var(--bg-input))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <UserIcon size={32} color="hsl(var(--text-muted))" />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Guest Mode</h2>
                <p style={{ color: 'hsl(var(--text-muted))', marginBottom: '2rem' }}>Sign in to sync your history and favorites.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="btn"
                    style={{ padding: '1rem 3rem', borderRadius: '2rem' }}
                >
                    Sign In
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 1.25rem', paddingBottom: '7rem', minHeight: '100vh', background: 'hsl(var(--bg-main))' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile</h1>
                <button style={{ padding: '0.5rem', borderRadius: '50%', background: 'hsla(0,0%,100%,0.05)', border: 'none', color: 'currentcolor' }}>
                    <Settings size={20} />
                </button>
            </div>

            {/* Profile Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                    width: '4.5rem', height: '4.5rem', borderRadius: '1.5rem',
                    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(280,100%,50%) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 20px -5px hsla(var(--primary), 0.5)',
                    fontSize: '1.5rem', fontWeight: 'bold', color: 'white'
                }}>
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{user.username}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                            fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '1rem',
                            background: 'hsla(0,0%,100%,0.1)', color: 'hsl(var(--text-muted))',
                            textTransform: 'capitalize'
                        }}>
                            {user.role}
                        </span>
                        {isPremium && (
                            <span style={{
                                fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '1rem',
                                background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)', color: 'black',
                                fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem'
                            }}>
                                <Crown size={10} fill="black" /> VIP
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Membership Card */}
            <div style={{
                background: isPremium
                    ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                    : 'linear-gradient(135deg, hsl(var(--bg-card)) 0%, hsla(0,0%,100%,0.05) 100%)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                color: isPremium ? 'black' : 'white',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden',
                border: isPremium ? 'none' : '1px solid hsla(0,0%,100%,0.1)'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Current Plan</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {isPremium ? `${config.appName} VIP` : (showFreeModeCard ? 'Unlimited Free' : 'Free Plan')}
                            </div>
                        </div>
                        {isPremium ? <Crown size={32} opacity={0.8} /> : (showFreeModeCard ? <Crown size={32} opacity={0.5} /> : <Ticket size={32} opacity={0.2} />)}
                    </div>

                    {isPremium ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem' }}>VIP Valid Until</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                                    {user?.expiryDate ? new Date(user.expiryDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Lifetime Access'}
                                </div>
                            </div>
                            {user?.tickets !== undefined && (
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user.tickets}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Bonus Tickets</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        !showFreeModeCard ? (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{tickets}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Daily Tickets</div>
                                </div>
                                <button
                                    onClick={() => navigate('/pricing')}
                                    style={{
                                        background: 'white', color: 'black', border: 'none',
                                        padding: '0.75rem 1.25rem', borderRadius: '2rem',
                                        fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'
                                    }}
                                >
                                    Upgrade Now
                                </button>
                            </div>
                        ) : (
                            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                Enjoy watching all dramas for free!
                            </div>
                        )
                    )}
                </div>
                {/* Decorative Circle */}
                <div style={{
                    position: 'absolute', right: '-20%', bottom: '-40%', width: '150px', height: '150px',
                    borderRadius: '50%', background: 'currentColor', opacity: 0.1
                }} />
            </div>

            {/* Menu Sections */}
            <div>
                <h3 style={{ fontSize: '1rem', color: 'hsl(var(--text-muted))', marginBottom: '1rem', paddingLeft: '0.5rem' }}>General</h3>

                <div style={{ background: 'hsl(var(--bg-card))', borderRadius: '1rem', overflow: 'hidden' }}>

                    {user.role === 'owner' && (
                        <>
                            <MenuItem icon={Settings} label="Admin Dashboard" onClick={() => navigate('/admin/settings')} />
                            <MenuItem icon={UserIcon} label="Manajemen Member" onClick={() => navigate('/admin/members')} />
                            <div style={{ height: '1px', background: 'hsla(0,0%,100%,0.05)', margin: '0 1rem' }} />
                        </>
                    )}

                    <MenuItem icon={CreditCard} label="Subscription Plans" onClick={() => navigate('/pricing')} />
                    <MenuItem icon={Clock} label="History" />
                    <MenuItem icon={Shield} label="Privacy Policy" />

                    <div style={{ height: '1px', background: 'hsla(0,0%,100%,0.05)', margin: '0 1rem' }} />

                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%', padding: '1.25rem',
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            background: 'none', border: 'none',
                            color: 'hsl(var(--danger))', textAlign: 'left',
                            fontSize: '1rem', cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        <div style={{
                            width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
                            background: 'hsla(var(--danger), 0.1)', color: 'hsl(var(--danger))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <LogOut size={20} />
                        </div>
                        <span style={{ fontWeight: 500 }}>Log Out</span>
                    </button>

                </div>
            </div>

        </div>
    );
};

// Helper Component for Menu Items
const MenuItem: React.FC<{ icon: React.ElementType, label: string, onClick?: () => void }> = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        style={{
            width: '100%', padding: '1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'none', border: 'none',
            color: 'white', textAlign: 'left',
            fontSize: '1rem', cursor: 'pointer',
            transition: 'background 0.2s'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
                width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
                background: 'hsla(0,0%,100%,0.05)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <Icon size={20} />
            </div>
            <span style={{ fontWeight: 500 }}>{label}</span>
        </div>
        <ChevronRight size={18} color="hsl(var(--text-muted))" />
    </button>
);

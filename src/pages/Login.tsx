import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppConfig } from '../context/AppConfigContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';

const API_BASE_URL = 'http://35.193.10.17:3001';

export const Login: React.FC = () => {
    const { login } = useAuth();
    const { config } = useAppConfig();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Fake delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));

            // 1. Check Admin Credentials from Config
            const adminUser = config.adminUsername || 'admin';
            const adminPass = config.adminPassword || 'admin';

            if (username === adminUser && password === adminPass) {
                login({
                    username: config.adminDisplayName || (config.appName + ' Admin'),
                    role: 'owner'
                });
                navigate('/profile');
                return;
            }

            // 2. Check Member Credentials from Backend
            const response = await fetch(`${API_BASE_URL}/api/members`);
            const members = await response.json();

            // Find member with matching username and password
            const validMember = members.find((m: any) =>
                m.username === username &&
                (m.password === password || (!m.password && password === 'user'))
            );

            if (validMember) {
                if (validMember.status === 'suspended') {
                    setError('Akun Anda ditangguhkan (Suspended)');
                } else {
                    login(validMember);
                    navigate('/profile');
                }
            } else {
                setError('Username atau Password salah!');
            }
        } catch (err) {
            setError('Gagal menghubungkan ke server');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'hsl(var(--bg-main))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '2rem'
        }}>

            <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                {/* Brand with Logo */}
                <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <div style={{ marginBottom: '2rem', display: 'inline-block' }}>
                        <Logo size="large" showText={true} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '0.5rem' }}>
                        Welcome<br />Back.
                    </h1>
                    <p style={{ color: 'hsl(var(--text-muted))', fontSize: '1.1rem' }}>
                        Sign in to continue watching.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            position: 'relative',
                            borderBottom: '1px solid hsla(0,0%,100%,0.1)',
                            transition: 'all 0.2s'
                        }}>
                            <User size={20} style={{ position: 'absolute', top: '1rem', left: 0, color: 'hsl(var(--text-muted))' }} />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    padding: '1rem 0 1rem 2.5rem',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{
                            position: 'relative',
                            borderBottom: '1px solid hsla(0,0%,100%,0.1)',
                            transition: 'all 0.2s'
                        }}>
                            <Lock size={20} style={{ position: 'absolute', top: '1rem', left: 0, color: 'hsl(var(--text-muted))' }} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    padding: '1rem 0 1rem 2.5rem',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            color: 'hsl(var(--danger))',
                            marginBottom: '2rem',
                            fontSize: '0.9rem',
                            padding: '1rem',
                            background: 'hsla(var(--danger), 0.1)',
                            borderRadius: '0.5rem',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            <span>•</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            background: 'hsl(var(--primary))',
                            color: 'white',
                            border: 'none',
                            padding: '1.25rem',
                            borderRadius: '1rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'transform 0.1s',
                            boxShadow: '0 4px 20px hsla(var(--primary), 0.3)'
                        }}
                    >
                        {isLoading ? 'Signing In...' : (
                            <>Sign In <ArrowRight size={20} /></>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Don't have an account? {' '}
                        <button
                            onClick={() => navigate('/signup')}
                            style={{ background: 'none', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                        >
                            Sign Up
                        </button>
                    </p>
                    <a
                        href="/"
                        style={{
                            color: 'hsl(var(--text-muted))',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            transition: 'color 0.2s'
                        }}
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

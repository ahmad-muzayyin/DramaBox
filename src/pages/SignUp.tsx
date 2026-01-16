import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';

const API_BASE_URL = 'http://35.193.10.17:3001';

export const SignUp: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Username and Password are required');
            return;
        }

        setIsLoading(true);

        try {
            // Check if username already exists
            const checkRes = await fetch(`${API_BASE_URL}/api/members`);
            const members = await checkRes.json();
            if (members.find((m: any) => m.username.toLowerCase() === username.toLowerCase())) {
                setError('Username already taken');
                setIsLoading(false);
                return;
            }

            const newMember = {
                id: 0, // Server will assign ID
                username,
                email,
                password,
                role: 'member',
                joinDate: new Date().toISOString().split('T')[0],
                expiryDate: null,
                status: 'active'
            };

            const response = await fetch(`${API_BASE_URL}/api/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMember)
            });

            if (response.ok) {
                const savedMember = await response.json();
                login(savedMember);
                navigate('/profile');
            } else {
                setError('Failed to create account');
            }
        } catch (err) {
            setError('Server connection failed');
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
                {/* Brand */}
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <div style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
                        <Logo size="large" showText={true} />
                    </div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                        Create Account
                    </h1>
                    <p style={{ color: 'hsl(var(--text-muted))', fontSize: '1rem' }}>
                        Join us and start watching.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ position: 'relative', borderBottom: '1px solid hsla(0,0%,100%,0.1)' }}>
                        <User size={18} style={{ position: 'absolute', top: '1rem', left: 0, color: 'hsl(var(--text-muted))' }} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', background: 'none', border: 'none', padding: '1rem 0 1rem 2.25rem', color: 'white', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ position: 'relative', borderBottom: '1px solid hsla(0,0%,100%,0.1)' }}>
                        <Mail size={18} style={{ position: 'absolute', top: '1rem', left: 0, color: 'hsl(var(--text-muted))' }} />
                        <input
                            type="email"
                            placeholder="Email (Optional)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', background: 'none', border: 'none', padding: '1rem 0 1rem 2.25rem', color: 'white', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ position: 'relative', borderBottom: '1px solid hsla(0,0%,100%,0.1)' }}>
                        <Lock size={18} style={{ position: 'absolute', top: '1rem', left: 0, color: 'hsl(var(--text-muted))' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', background: 'none', border: 'none', padding: '1rem 0 1rem 2.25rem', color: 'white', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    {error && (
                        <div style={{ color: 'hsl(var(--danger))', fontSize: '0.85rem', padding: '0.75rem', background: 'hsla(var(--danger), 0.1)', borderRadius: '0.5rem' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            padding: '1.1rem',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: '1rem'
                        }}
                    >
                        {isLoading ? 'Creating...' : (
                            <>Get Started <ArrowRight size={18} /></>
                        )}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <span style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>Already have an account? </span>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                            Sign In
                        </Link>
                    </div>
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <Link to="/" style={{ color: 'hsl(var(--text-muted))', textDecoration: 'none', fontSize: '0.85rem' }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

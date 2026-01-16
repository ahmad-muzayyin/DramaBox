import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Search, Trash2, Crown, Archive, Edit2, X, Plus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Member {
    id: number;
    username: string;
    email: string;
    password?: string;
    tickets?: number;
    role: 'member' | 'vip';
    joinDate: string;
    expiryDate: string | null;
    status: 'active' | 'suspended';
    lastDailyCheck?: string | null;
}

const API_BASE_URL = 'http://35.193.10.17:3001';

export const MemberManagement: React.FC = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState<Member[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'vip' | 'member'>('all');
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [durationDays, setDurationDays] = useState<number>(30);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/members`);
            const data = await res.json();
            setMembers(data);
        } catch (err) {
            console.error("Failed to load members", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveMember = async (member: Member) => {
        if (!member.username || !member.password) {
            alert("Username dan Password wajib diisi!");
            return;
        }

        let finalMember = { ...member };
        if (durationDays > 0) {
            const date = new Date();
            date.setDate(date.getDate() + durationDays);
            finalMember.expiryDate = date.toISOString().split('T')[0];
        } else if (member.id === 0 && durationDays === 0) {
            finalMember.expiryDate = null;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalMember)
            });
            const saved = await res.json();

            setMembers(prev => {
                const exists = prev.find(m => m.id === saved.id);
                if (exists) return prev.map(m => m.id === saved.id ? saved : m);
                return [...prev, saved];
            });
            setEditingMember(null);
            setDurationDays(30);
        } catch (err) {
            console.error("Failed to save member", err);
            alert("Gagal menyimpan member");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus member ini selamanya?')) return;
        try {
            await fetch(`${API_BASE_URL}/api/members/${id}`, { method: 'DELETE' });
            setMembers(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            console.error("Failed to delete member", err);
        }
    };

    const toggleStatus = async (m: Member) => {
        const updated: Member = { ...m, status: m.status === 'active' ? 'suspended' : 'active' };
        handleSaveMember(updated);
    };

    const isVipActive = (member: Member) => {
        if (member.role !== 'vip') return false;
        if (!member.expiryDate) return true;
        return new Date(member.expiryDate) > new Date();
    };

    const filteredMembers = members.filter(m => {
        const matchesSearch = m.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filter === 'all' ? true : m.role === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div style={{ minHeight: '100vh', background: '#09090b', color: '#fafafa', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Minimal Header */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(12px)',
                padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid #27272a'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '0.25rem' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Members</h1>
                        <p style={{ fontSize: '0.75rem', color: '#71717a', margin: 0 }}>Manage your user base</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setEditingMember({
                            id: 0, username: '', email: '', password: '', role: 'member',
                            joinDate: new Date().toISOString().split('T')[0],
                            expiryDate: null, status: 'active'
                        });
                        setDurationDays(30);
                    }}
                    style={{
                        background: '#fafafa', color: '#09090b', border: 'none',
                        padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600,
                        fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        cursor: 'pointer', transition: 'opacity 0.2s'
                    }}
                >
                    <Plus size={16} /> New Member
                </button>
            </div>

            <div className="container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '1 1 300px' }}>
                        <Search size={16} style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', color: '#71717a' }} />
                        <input
                            type="text"
                            placeholder="Filter members..."
                            style={{
                                padding: '0.5rem 0.75rem 0.5rem 2.25rem', width: '100%',
                                background: 'transparent', border: '1px solid #27272a',
                                borderRadius: '0.5rem', color: '#fafafa', fontSize: '0.875rem',
                                outline: 'none'
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', background: '#18181b', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid #27272a', overflowX: 'auto', maxWidth: '100%' }}>
                        {['all', 'vip', 'member'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                style={{
                                    padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 500,
                                    background: filter === f ? '#27272a' : 'transparent',
                                    color: filter === f ? '#fafafa' : '#a1a1aa',
                                    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                    textTransform: 'capitalize', whiteSpace: 'nowrap'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Aesthetic Table */}
                <div style={{
                    background: '#09090b', border: '1px solid #27272a', borderRadius: '0.75rem',
                    overflowX: 'auto', // Enable horizontal scroll
                    WebkitOverflowScrolling: 'touch'
                }}>
                    <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #27272a', color: '#71717a' }}>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>User</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Plan</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Joined</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: '#71717a' }}>Loading...</td></tr>
                            ) : filteredMembers.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: '#71717a' }}>No members found.</td></tr>
                            ) : filteredMembers.map(member => {
                                const activeVip = isVipActive(member);
                                return (
                                    <tr key={member.id} className="table-row" style={{ borderBottom: '1px solid #18181b', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                                                    background: activeVip ? 'rgba(234, 179, 8, 0.1)' : '#18181b',
                                                    color: activeVip ? '#eab308' : '#71717a',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {activeVip ? <Crown size={16} /> : <User size={16} />}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500, color: '#fafafa' }}>{member.username}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{member.email || 'No email'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{
                                                    padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.7rem', fontWeight: 600,
                                                    background: activeVip ? 'rgba(234, 179, 8, 0.1)' : '#18181b',
                                                    color: activeVip ? '#eab308' : '#a1a1aa',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {member.role}
                                                </span>
                                                {activeVip && member.expiryDate && (
                                                    <span style={{ fontSize: '0.7rem', color: '#71717a' }}>until {member.expiryDate}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: member.status === 'active' ? '#22c55e' : '#ef4444' }} />
                                                <span style={{ textTransform: 'capitalize', color: '#fafafa' }}>{member.status}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#71717a' }}>{member.joinDate}</td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button onClick={() => setEditingMember(member)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '0.25rem' }}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => toggleStatus(member)} style={{ background: 'none', border: 'none', color: member.status === 'active' ? '#eab308' : '#22c55e', cursor: 'pointer', padding: '0.25rem' }}>
                                                    <Archive size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(member.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Minimalist Slide-over or Modal for Editing */}
            {editingMember && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        width: '100%', maxWidth: '400px', background: '#09090b',
                        borderRadius: '0.75rem', border: '1px solid #27272a',
                        padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                                {editingMember.id === 0 ? 'Add Member' : 'Edit Member'}
                            </h2>
                            <button onClick={() => setEditingMember(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#a1a1aa' }}>Username</label>
                                <input
                                    type="text"
                                    style={{ padding: '0.5rem 0.75rem', background: 'transparent', border: '1px solid #27272a', borderRadius: '0.375rem', color: '#fafafa', outline: 'none' }}
                                    value={editingMember.username}
                                    onChange={(e) => setEditingMember({ ...editingMember, username: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#a1a1aa' }}>Password</label>
                                <input
                                    type="text"
                                    placeholder="Enter password"
                                    style={{ padding: '0.5rem 0.75rem', background: 'transparent', border: '1px solid #27272a', borderRadius: '0.375rem', color: '#fafafa', outline: 'none' }}
                                    value={editingMember.password || ''}
                                    onChange={(e) => setEditingMember({ ...editingMember, password: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#a1a1aa' }}>Role</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {['member', 'vip'].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setEditingMember({ ...editingMember, role: r as any })}
                                            style={{
                                                flex: 1, padding: '0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600,
                                                background: editingMember.role === r ? '#fafafa' : 'transparent',
                                                color: editingMember.role === r ? '#09090b' : '#a1a1aa',
                                                border: '1px solid #27272a', cursor: 'pointer'
                                            }}
                                        >
                                            {r.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {editingMember.role === 'vip' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#a1a1aa' }}>VIP Duration (Days)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                                        {[7, 30, 365, 0].map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setDurationDays(d)}
                                                style={{
                                                    padding: '0.375rem', borderRadius: '0.375rem', fontSize: '0.7rem', fontWeight: 600,
                                                    background: durationDays === d ? '#27272a' : 'transparent',
                                                    color: durationDays === d ? '#facc15' : '#a1a1aa',
                                                    border: '1px solid #27272a', cursor: 'pointer'
                                                }}
                                            >
                                                {d === 0 ? 'Custom' : `${d}d`}
                                            </button>
                                        ))}
                                    </div>
                                    {durationDays === 0 && (
                                        <input
                                            type="number"
                                            placeholder="Days"
                                            style={{ marginTop: '0.4rem', padding: '0.5rem 0.75rem', background: 'transparent', border: '1px solid #27272a', borderRadius: '0.375rem', color: '#fafafa', outline: 'none' }}
                                            onChange={(e) => setDurationDays(parseInt(e.target.value) || 0)}
                                        />
                                    )}
                                </div>
                            )}

                            <button
                                onClick={() => handleSaveMember(editingMember)}
                                style={{
                                    marginTop: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem',
                                    background: '#fafafa', color: '#09090b', fontWeight: 600, fontSize: '0.875rem',
                                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                }}
                            >
                                <CheckCircle size={18} /> Save Member
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .table-row:hover {
                    background: #0f0f12;
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-thumb {
                    background: #27272a;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

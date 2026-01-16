import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, MessageCircle, Copy, CheckCircle } from 'lucide-react';
import { useAppConfig } from '../context/AppConfigContext';
import { Logo } from '../components/Logo';

export const Payment: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { config } = useAppConfig();
    const [copied, setCopied] = React.useState(false);

    const packageType = searchParams.get('package') || 'monthly';

    // Get package details
    const packages = {
        weekly: {
            name: 'Mingguan',
            price: config.weeklyPrice,
            duration: '7 hari',
            features: ['Akses semua drama', 'Tanpa Iklan', 'Kualitas HD 1080p', 'Download Offline']
        },
        monthly: {
            name: 'Bulanan',
            price: config.monthlyPrice,
            duration: '30 hari',
            features: ['Hemat 17%', 'Akses semua drama', 'Tanpa Iklan', 'Kualitas HD 1080p', 'Download Offline']
        },
        yearly: {
            name: 'Tahunan',
            price: config.yearlyPrice,
            duration: '365 hari',
            features: ['Hemat Super!', 'Akses semua drama', 'Tanpa Iklan', 'Kualitas HD 1080p', 'Prioritas Support']
        }
    };

    const selectedPackage = packages[packageType as keyof typeof packages] || packages.monthly;

    const handleWhatsApp = () => {
        const message = `Halo Admin ${config.appName}, saya ingin berlangganan paket *${selectedPackage.name}* seharga *Rp ${selectedPackage.price.toLocaleString('id-ID')}*. Mohon infonya.`;
        const waLink = `https://wa.me/6282332575257?text=${encodeURIComponent(message)}`;
        window.open(waLink, '_blank');
    };

    const copyAccountNumber = () => {
        navigator.clipboard.writeText('082332575257');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'hsl(var(--bg-main))', paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid hsla(0,0%,100%,0.1)', position: 'sticky', top: 0, background: 'hsl(var(--bg-main))', zIndex: 10 }}>
                <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Pembayaran</h1>
            </div>

            <div className="container" style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
                {/* Logo & App Name */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Logo size="medium" showText={true} />
                </div>

                {/* Package Summary */}
                <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', background: 'linear-gradient(145deg, hsl(var(--bg-card)) 0%, hsla(var(--primary), 0.05) 100%)', border: '2px solid hsl(var(--primary))' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            Paket {selectedPackage.name}
                        </h2>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'hsl(var(--primary))', marginBottom: '0.25rem' }}>
                            Rp {selectedPackage.price.toLocaleString('id-ID')}
                        </div>
                        <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>
                            {selectedPackage.duration} akses penuh
                        </p>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {selectedPackage.features.map((feature, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                <Check size={18} color="hsl(var(--success))" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Payment Instructions */}
                <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageCircle size={20} color="hsl(var(--primary))" />
                        Cara Pembayaran
                    </h3>

                    <div style={{ background: 'hsla(var(--primary), 0.05)', padding: '1.5rem', borderRadius: '0.75rem', borderLeft: '3px solid hsl(var(--primary))', marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                            Pembayaran dilakukan manual melalui <strong>transfer bank</strong> atau <strong>e-wallet</strong>.
                            Setelah transfer, konfirmasi bukti bayar ke admin via WhatsApp untuk aktivasi akun premium Anda.
                        </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', color: 'hsl(var(--text-muted))' }}>
                            Langkah-langkah:
                        </p>
                        <ol style={{ paddingLeft: '1.5rem', margin: 0, lineHeight: 2 }}>
                            <li>Klik tombol "Hubungi Admin" di bawah</li>
                            <li>Chat admin untuk mendapatkan nomor rekening</li>
                            <li>Transfer sesuai nominal paket yang dipilih</li>
                            <li>Kirim bukti transfer ke admin</li>
                            <li>Tunggu konfirmasi aktivasi (max 1x24 jam)</li>
                        </ol>
                    </div>

                    {/* Admin Contact */}
                    <div style={{ background: 'hsla(0,0%,100%,0.03)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginBottom: '1rem' }}>
                            Kontak Admin:
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>WhatsApp</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'hsl(var(--success))' }}>
                                    082332575257
                                </div>
                            </div>
                            <button
                                onClick={copyAccountNumber}
                                className="btn-ghost"
                                style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle size={18} color="hsl(var(--success))" />
                                        <span style={{ fontSize: '0.85rem' }}>Tersalin!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={18} />
                                        <span style={{ fontSize: '0.85rem' }}>Salin</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* WhatsApp Button */}
                    <button
                        onClick={handleWhatsApp}
                        className="btn"
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            padding: '1.25rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)'
                        }}
                    >
                        <MessageCircle size={20} />
                        Hubungi Admin via WhatsApp
                    </button>
                </div>

                {/* Security Note */}
                <div style={{ textAlign: 'center', padding: '1rem', background: 'hsla(0,0%,100%,0.02)', borderRadius: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', margin: 0, lineHeight: 1.6 }}>
                        🔒 Pembayaran aman dan terpercaya. Kami tidak menyimpan informasi kartu kredit atau data sensitif Anda.
                    </p>
                </div>
            </div>
        </div>
    );
};

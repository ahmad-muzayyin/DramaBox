import React from 'react';
import { ArrowLeft, Check, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppConfig } from '../context/AppConfigContext';

const PricingCard: React.FC<{
    title: string;
    price: string;
    duration: string;
    features: string[];
    recommended?: boolean;
    packageType: string;
    navigate: any;
}> = ({ title, price, duration, features, recommended, packageType, navigate }) => {

    // Navigate to payment page
    const handleBuy = () => {
        navigate(`/payment?package=${packageType}`);
    };

    return (
        <div style={{
            background: recommended ? 'linear-gradient(145deg, hsl(var(--card)) 0%, hsla(var(--primary), 0.1) 100%)' : 'hsl(var(--bg-card))',
            border: recommended ? '2px solid hsl(var(--primary))' : '1px solid hsla(0,0%,100%,0.1)',
            borderRadius: '1rem',
            padding: '1.5rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            {recommended && (
                <div style={{
                    position: 'absolute',
                    top: '-0.75rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'hsl(var(--primary))',
                    color: 'white',
                    padding: '0.25rem 1rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                }}>
                    POPULAR
                </div>
            )}

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{price}</span>
                <span style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>/{duration}</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flex: 1 }}>
                {features.map((feat, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>
                        <Check size={16} color="hsl(var(--success))" />
                        {feat}
                    </li>
                ))}
            </ul>

            <button onClick={handleBuy} className="btn" style={{
                width: '100%',
                background: recommended ? 'hsl(var(--primary))' : 'hsla(0,0%,100%,0.1)'
            }}>
                Pilih Paket
            </button>
        </div>
    );
};

export const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const { config } = useAppConfig();

    // Format harga dengan Rupiah
    const formatPrice = (price: number) => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    // Hitung persentase hemat
    const calculateSavings = (monthlyEquivalent: number, actualPrice: number) => {
        const savings = ((monthlyEquivalent - actualPrice) / monthlyEquivalent * 100);
        return Math.round(savings);
    };

    const weeklyPrice = config?.weeklyPrice || 3000;
    const monthlyPrice = config?.monthlyPrice || 10000;
    const yearlyPrice = config?.yearlyPrice || 100000;

    // Hitung hemat untuk bulanan (4 minggu vs 1 bulan)
    const monthlySavings = calculateSavings(weeklyPrice * 4, monthlyPrice);

    // Hitung hemat untuk tahunan (12 bulan vs 1 tahun)
    const yearlySavings = calculateSavings(monthlyPrice * 12, yearlyPrice);

    return (
        <div style={{ paddingBottom: '2rem', background: 'hsl(var(--bg-main))', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Langganan Premium</h1>
            </div>

            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Nonton Tanpa Batas</h2>
                    <p style={{ color: 'hsl(var(--text-muted))' }}>Pilih paket yang sesuai untukmu dan nikmati akses penuh ke semua drama.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <PricingCard
                        title="Mingguan"
                        price={formatPrice(weeklyPrice)}
                        duration="minggu"
                        features={[
                            "Akses semua drama",
                            "Tanpa Iklan",
                            "Kualitas HD 1080p",
                            "Download Offline"
                        ]}
                        packageType="weekly"
                        navigate={navigate}
                    />
                    <PricingCard
                        title="Bulanan"
                        price={formatPrice(monthlyPrice)}
                        duration="bulan"
                        features={[
                            monthlySavings > 0 ? `Hemat ${monthlySavings}%` : "Paket Bulanan",
                            "Akses semua drama",
                            "Tanpa Iklan",
                            "Kualitas HD 1080p",
                            "Download Offline"
                        ]}
                        recommended
                        packageType="monthly"
                        navigate={navigate}
                    />
                    <PricingCard
                        title="Tahunan"
                        price={formatPrice(yearlyPrice)}
                        duration="tahun"
                        features={[
                            yearlySavings > 0 ? `Hemat ${yearlySavings}%` : "Hemat Super!",
                            "Akses semua drama",
                            "Tanpa Iklan",
                            "Kualitas HD 1080p",
                            "Prioritas Support"
                        ]}
                        packageType="yearly"
                        navigate={navigate}
                    />
                </div>

                <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', background: 'hsla(var(--success), 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Smartphone size={24} color="hsl(var(--success))" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Konfirmasi via WhatsApp</h3>
                    <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', marginBottom: '1rem' }}>
                        Pembayaran dilakukan manual melalui transfer bank/e-wallet. Konfirmasi bukti bayar ke admin via WhatsApp untuk aktivasi akun.
                    </p>
                    <button
                        onClick={() => window.open('https://wa.me/6282332575257', '_blank')}
                        className="btn-ghost"
                        style={{ color: 'hsl(var(--success))', border: '1px solid hsla(142, 76%, 36%, 0.5)' }}
                    >
                        Chat Admin Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
};

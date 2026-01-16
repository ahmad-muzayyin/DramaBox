import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppConfig } from '../context/AppConfigContext';
import { ArrowLeft, Save, Settings, Megaphone, DollarSign, Palette, User, Lock, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

export const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const { config, updateConfig } = useAppConfig();
    const navigate = useNavigate();

    // Local state for form inputs
    const [isFree, setIsFree] = useState(config.isFreeApp);
    const [enableAds, setEnableAds] = useState(config.enableAds);
    const [adProvider, setAdProvider] = useState(config.adProvider);
    const [googleKey, setGoogleKey] = useState(config.googleAdsClient);
    const [adsterraKey, setAdsterraKey] = useState(config.adsterraKey);

    // Pricing state
    const [weeklyPrice, setWeeklyPrice] = useState(config.weeklyPrice);
    const [monthlyPrice, setMonthlyPrice] = useState(config.monthlyPrice);
    const [yearlyPrice, setYearlyPrice] = useState(config.yearlyPrice);

    // Branding state
    const [appName, setAppName] = useState(config.appName);
    const [appTagline, setAppTagline] = useState(config.appTagline);
    const [appLogo, setAppLogo] = useState(config.appLogo);

    // Profile / Admin Login state
    const [adminUser, setAdminUser] = useState(config.adminUsername || 'admin');
    const [adminPass, setAdminPass] = useState(config.adminPassword || 'admin');
    const [adminName, setAdminName] = useState(config.adminDisplayName || 'Admin');

    // Cropper State
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isCropping, setIsCropping] = useState(false);

    // Sync local state with config changes (important for persistence!)
    useEffect(() => {
        setIsFree(config.isFreeApp);
        setEnableAds(config.enableAds);
        setAdProvider(config.adProvider);
        setGoogleKey(config.googleAdsClient);
        setAdsterraKey(config.adsterraKey);
        setWeeklyPrice(config.weeklyPrice);
        setMonthlyPrice(config.monthlyPrice);
        setYearlyPrice(config.yearlyPrice);
        setAppName(config.appName);
        setAppTagline(config.appTagline);
        setAppLogo(config.appLogo);
        setAdminUser(config.adminUsername || 'admin');
        setAdminPass(config.adminPassword || 'admin');
        setAdminName(config.adminDisplayName || 'Admin');
    }, [config]);

    if (!user || user.role !== 'owner') {
        return <div className="p-4 text-center">Access Denied</div>;
    }

    const handleSave = () => {
        updateConfig({
            isFreeApp: isFree,
            enableAds: enableAds,
            adProvider: adProvider,
            googleAdsClient: googleKey,
            adsterraKey: adsterraKey,
            weeklyPrice: weeklyPrice,
            monthlyPrice: monthlyPrice,
            yearlyPrice: yearlyPrice,
            appName: appName,
            appTagline: appTagline,
            appLogo: appLogo,
            adminUsername: adminUser,
            adminPassword: adminPass,
            adminDisplayName: adminName
        });
        alert('Pengaturan berhasil disimpan!');
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImage(reader.result as string);
                setIsCropping(true);
            };
        }
    };

    const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const showCroppedImage = async () => {
        try {
            if (image && croppedAreaPixels) {
                const croppedImage = await getCroppedImg(image, croppedAreaPixels);
                setAppLogo(croppedImage);
                setIsCropping(false);
                setImage(null);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'hsl(var(--bg-main))', paddingBottom: '6rem' }}>
            {/* Header */}
            <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid hsla(0,0%,100%,0.1)' }}>
                <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Admin Dashboard</h1>
            </div>

            <div className="container" style={{ padding: '1.5rem' }}>

                {/* Free Mode */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1rem', color: 'hsl(var(--text-muted))', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <Settings size={18} /> Mode Aplikasi
                    </h2>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Gratis Total</div>
                                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', margin: 0 }}>
                                    Jika aktif, semua episode bisa ditonton tanpa tiket dan tanpa premium.
                                </p>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={isFree}
                                    onChange={(e) => setIsFree(e.target.checked)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* App Branding */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1rem', color: 'hsl(var(--text-muted))', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <Palette size={18} /> Branding Aplikasi
                    </h2>
                    <div className="card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                        Nama Aplikasi
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Drama Short"
                                        value={appName}
                                        onChange={(e) => setAppName(e.target.value)}
                                        style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', background: 'hsla(0,0%,100%,0.05)', border: '1px solid hsla(0,0%,100%,0.1)', color: 'white' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                        Tagline
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="By Amue Devs"
                                        value={appTagline}
                                        onChange={(e) => setAppTagline(e.target.value)}
                                        style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', background: 'hsla(0,0%,100%,0.05)', border: '1px solid hsla(0,0%,100%,0.1)', color: 'white' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '1rem', fontWeight: 600 }}>
                                    Logo Aplikasi
                                </label>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="/logo.png"
                                            value={appLogo.startsWith('data:') ? 'Current Custom Logo (Base64)' : appLogo}
                                            readOnly
                                            style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', background: 'hsla(0,0%,100%,0.02)', border: '1px solid hsla(0,0%,100%,0.1)', color: 'hsl(var(--text-muted))' }}
                                        />
                                    </div>
                                    <label className="btn" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', borderRadius: '0.75rem' }}>
                                        <Upload size={18} /> Pilih dari Device
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={onFileChange}
                                        />
                                    </label>
                                    {appLogo.startsWith('data:') && (
                                        <button
                                            onClick={() => setAppLogo('/logo.png')}
                                            className="btn-ghost"
                                            style={{ color: 'hsl(var(--danger))' }}
                                            title="Reset ke Default"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '0.5rem' }}>
                                    Pilih gambar dari perangkat Anda. Anda dapat memotong (crop) gambar setelah memilihnya.
                                </p>
                            </div>

                            {/* Preview */}
                            <div style={{ padding: '1.5rem', background: 'hsla(0,0%,100%,0.03)', borderRadius: '0.75rem', border: '1px solid hsla(0,0%,100%,0.05)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginBottom: '1rem', fontWeight: 600 }}>PREVIEW:</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                                    <Logo size="medium" showText={true} />
                                    <div style={{ height: '30px', width: '1px', background: 'hsla(0,0%,100%,0.1)' }}></div>
                                    <Logo size="small" showText={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Profile & Login Settings */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1rem', color: 'hsl(var(--text-muted))', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <User size={18} /> Profil & Login Admin
                    </h2>
                    <div className="card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                    Nama Display Admin (Profil)
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Admin Premium"
                                    value={adminName}
                                    onChange={(e) => setAdminName(e.target.value)}
                                    style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', background: 'hsla(0,0%,100%,0.05)', border: '1px solid hsla(0,0%,100%,0.1)', color: 'white' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                        Username Admin
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
                                        <input
                                            type="text"
                                            className="input"
                                            value={adminUser}
                                            onChange={(e) => setAdminUser(e.target.value)}
                                            style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.8rem', borderRadius: '0.75rem', background: 'hsla(0,0%,100%,0.05)', border: '1px solid hsla(0,0%,100%,0.1)', color: 'white' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                        Password Admin
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
                                        <input
                                            type="password"
                                            className="input"
                                            value={adminPass}
                                            onChange={(e) => setAdminPass(e.target.value)}
                                            style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.8rem', borderRadius: '0.75rem', background: 'hsla(0,0%,100%,0.05)', border: '1px solid hsla(0,0%,100%,0.1)', color: 'white' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '1rem', background: 'hsla(var(--warning), 0.1)', borderRadius: '0.75rem', borderLeft: '3px solid hsl(var(--warning))' }}>
                                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--warning))', margin: 0 }}>
                                    ⚠️ Perubahan username/password admin akan langsung berlaku setelah disimpan. Pastikan Anda mengingat kredensial baru Anda.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ads Configuration */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1rem', color: 'hsl(var(--text-muted))', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <Megaphone size={18} /> Monetisasi Iklan
                    </h2>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid hsla(0,0%,100%,0.1)', paddingBottom: '1.5rem' }}>
                            <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Aktifkan Iklan</div>
                                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', margin: 0 }}>
                                    Tampilkan banner iklan di halaman detail/home.
                                </p>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={enableAds}
                                    onChange={(e) => setEnableAds(e.target.checked)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        {enableAds && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>Provider Iklan</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            onClick={() => setAdProvider('adsterra')}
                                            className={`btn ${adProvider === 'adsterra' ? '' : 'btn-ghost'}`}
                                            style={{ flex: 1, border: adProvider === 'adsterra' ? 'none' : '1px solid hsla(0,0%,100%,0.2)' }}
                                        >
                                            Adsterra
                                        </button>
                                        <button
                                            onClick={() => setAdProvider('google')}
                                            className={`btn ${adProvider === 'google' ? '' : 'btn-ghost'}`}
                                            style={{ flex: 1, border: adProvider === 'google' ? 'none' : '1px solid hsla(0,0%,100%,0.2)' }}
                                        >
                                            Google Ads
                                        </button>
                                    </div>
                                </div>

                                {adProvider === 'adsterra' ? (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Adsterra Placement Key</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Ex: 837493..."
                                            value={adsterraKey}
                                            onChange={(e) => setAdsterraKey(e.target.value)}
                                            style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', background: 'hsla(0,0%,100%,0.05)', border: '1px solid hsla(0,0%,100%,0.1)', color: 'white' }}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Google Ads Client ID</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Ex: ca-pub-xxxxxxxx"
                                            value={googleKey}
                                            onChange={(e) => setGoogleKey(e.target.value)}
                                            style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', background: 'hsla(0,0%,100%,0.05)', border: '1px solid hsla(0,0%,100%,0.1)', color: 'white' }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing Configuration */}
                <div style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1rem', color: 'hsl(var(--text-muted))', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <DollarSign size={18} /> Pengaturan Harga Paket
                    </h2>
                    <div className="card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            {/* Weekly Package */}
                            <div style={{ background: 'hsla(0,0%,100%,0.03)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid hsla(0,0%,100%,0.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                    <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📅</div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Mingguan</h3>
                                </div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>Harga (Rupiah)</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={weeklyPrice}
                                    onChange={(e) => setWeeklyPrice(Number(e.target.value))}
                                    style={{ fontSize: '1.2rem', fontWeight: 700, textAlign: 'right', background: 'hsla(0,0%,100%,0.05)', border: '1px solid hsla(0,0%,100%,0.1)', borderRadius: '0.75rem' }}
                                />
                            </div>

                            {/* Monthly Package */}
                            <div style={{ background: 'linear-gradient(145deg, hsla(var(--primary), 0.1) 0%, hsla(0,0%,100%,0.03) 100%)', borderRadius: '1rem', padding: '1.5rem', border: '2px solid hsl(var(--primary))', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-0.75rem', right: '1rem', background: 'hsl(var(--primary))', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 700 }}>POPULAR</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                    <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🔥</div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Bulanan</h3>
                                </div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>Harga (Rupiah)</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={monthlyPrice}
                                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                                    style={{ fontSize: '1.2rem', fontWeight: 700, textAlign: 'right', background: 'hsla(0,0%,100%,0.05)', border: '1px solid hsl(var(--primary), 0.3)', borderRadius: '0.75rem' }}
                                />
                            </div>

                            {/* Yearly Package */}
                            <div style={{ background: 'hsla(0,0%,100%,0.03)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid hsla(0,0%,100%,0.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                    <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👑</div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Tahunan</h3>
                                </div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>Harga (Rupiah)</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={yearlyPrice}
                                    onChange={(e) => setYearlyPrice(Number(e.target.value))}
                                    style={{ fontSize: '1.2rem', fontWeight: 700, textAlign: 'right', background: 'hsla(0,0%,100%,0.05)', border: '1px solid hsla(0,0%,100%,0.1)', borderRadius: '0.75rem' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Sticky Save Bar */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1.25rem', background: 'hsl(var(--bg-main))', borderTop: '1px solid hsla(0,0%,100%,0.1)', zIndex: 100, display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={handleSave}
                    className="btn"
                    style={{
                        maxWidth: '400px',
                        width: '100%',
                        padding: '1.1rem',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        boxShadow: '0 8px 32px hsla(var(--primary), 0.3)'
                    }}
                >
                    <Save size={22} /> Simpan Pengaturan
                </button>
            </div>

            {/* Image Cropper Modal */}
            {isCropping && image && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 2000,
                    background: 'black',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid hsla(0,0%,100%,0.1)' }}>
                        <h3 style={{ margin: 0 }}>Potong Logo</h3>
                        <button onClick={() => setIsCropping(false)} className="btn-ghost" style={{ padding: '0.5rem' }}>
                            <X size={24} />
                        </button>
                    </div>

                    <div style={{ flex: 1, position: 'relative', background: '#111' }}>
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>

                    <div style={{ padding: '2rem', background: 'hsl(var(--bg-main))' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>Zoom</label>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setIsCropping(false)} className="btn-ghost" style={{ flex: 1 }}>Batal</button>
                            <button onClick={showCroppedImage} className="btn" style={{ flex: 2 }}>Selesai & Gunakan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

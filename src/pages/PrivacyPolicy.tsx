import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'hsl(var(--bg-main))', paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid hsla(0,0%,100%,0.1)', position: 'sticky', top: 0, background: 'hsl(var(--bg-main))', zIndex: 10 }}>
                <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Privacy Policy</h1>
            </div>

            <div className="container" style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    {/* Introduction */}
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Kebijakan Privasi</h2>
                        <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>
                            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    {/* Content */}
                    <div style={{ lineHeight: 1.8, color: 'hsl(var(--text-secondary))' }}>
                        <section style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'hsl(var(--text-primary))' }}>
                                1. Informasi yang Kami Kumpulkan
                            </h3>
                            <p style={{ marginBottom: '1rem' }}>
                                Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:
                            </p>
                            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                <li>Informasi akun (nama, email, nomor telepon)</li>
                                <li>Preferensi tontonan dan riwayat aktivitas</li>
                                <li>Informasi pembayaran dan transaksi</li>
                                <li>Data perangkat dan informasi teknis</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'hsl(var(--text-primary))' }}>
                                2. Penggunaan Informasi
                            </h3>
                            <p style={{ marginBottom: '1rem' }}>
                                Kami menggunakan informasi yang dikumpulkan untuk:
                            </p>
                            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                <li>Menyediakan, memelihara, dan meningkatkan layanan kami</li>
                                <li>Memproses transaksi dan mengirimkan pemberitahuan terkait</li>
                                <li>Mengirimkan informasi teknis, pembaruan, dan pesan keamanan</li>
                                <li>Merespons komentar, pertanyaan, dan permintaan dukungan pelanggan</li>
                                <li>Menganalisis tren penggunaan dan meningkatkan pengalaman pengguna</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'hsl(var(--text-primary))' }}>
                                3. Berbagi Informasi
                            </h3>
                            <p style={{ marginBottom: '1rem' }}>
                                Kami tidak menjual informasi pribadi Anda. Kami dapat membagikan informasi Anda dalam situasi berikut:
                            </p>
                            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                <li>Dengan penyedia layanan pihak ketiga yang membantu operasi kami</li>
                                <li>Untuk mematuhi kewajiban hukum atau merespons permintaan pemerintah</li>
                                <li>Untuk melindungi hak, properti, atau keselamatan kami dan pengguna lain</li>
                                <li>Dalam hubungan dengan merger, akuisisi, atau penjualan aset</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'hsl(var(--text-primary))' }}>
                                4. Keamanan Data
                            </h3>
                            <p style={{ marginBottom: '1rem' }}>
                                Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Namun, tidak ada metode transmisi melalui internet atau penyimpanan elektronik yang 100% aman.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'hsl(var(--text-primary))' }}>
                                5. Hak Anda
                            </h3>
                            <p style={{ marginBottom: '1rem' }}>
                                Anda memiliki hak untuk:
                            </p>
                            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                <li>Mengakses dan memperbarui informasi pribadi Anda</li>
                                <li>Meminta penghapusan data pribadi Anda</li>
                                <li>Menolak pemrosesan data pribadi Anda</li>
                                <li>Meminta portabilitas data Anda</li>
                                <li>Menarik persetujuan Anda kapan saja</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'hsl(var(--text-primary))' }}>
                                6. Cookie dan Teknologi Pelacakan
                            </h3>
                            <p style={{ marginBottom: '1rem' }}>
                                Kami menggunakan cookie dan teknologi pelacakan serupa untuk mengumpulkan informasi tentang aktivitas Anda di aplikasi kami. Anda dapat mengatur browser Anda untuk menolak semua cookie atau untuk menunjukkan kapan cookie dikirim.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'hsl(var(--text-primary))' }}>
                                7. Privasi Anak-anak
                            </h3>
                            <p style={{ marginBottom: '1rem' }}>
                                Layanan kami tidak ditujukan untuk anak-anak di bawah usia 13 tahun. Kami tidak dengan sengaja mengumpulkan informasi pribadi dari anak-anak di bawah 13 tahun. Jika Anda adalah orang tua atau wali dan mengetahui bahwa anak Anda telah memberikan informasi pribadi kepada kami, silakan hubungi kami.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'hsl(var(--text-primary))' }}>
                                8. Perubahan Kebijakan Privasi
                            </h3>
                            <p style={{ marginBottom: '1rem' }}>
                                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan apa pun dengan memposting kebijakan privasi baru di halaman ini dan memperbarui tanggal "Terakhir diperbarui" di bagian atas kebijakan ini.
                            </p>
                        </section>

                        <section style={{ marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'hsl(var(--text-primary))' }}>
                                9. Hubungi Kami
                            </h3>
                            <p style={{ marginBottom: '1rem' }}>
                                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami:
                            </p>
                            <div style={{
                                background: 'hsla(0,0%,100%,0.03)',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                borderLeft: '3px solid hsl(var(--primary))'
                            }}>
                                <p style={{ margin: 0, marginBottom: '0.5rem' }}>
                                    <strong>Email:</strong> support@dramabox.com
                                </p>
                                <p style={{ margin: 0 }}>
                                    <strong>WhatsApp:</strong> +62 823-3257-5257
                                </p>
                            </div>
                        </section>

                        {/* Signature */}
                        <div style={{
                            marginTop: '3rem',
                            paddingTop: '2rem',
                            borderTop: '2px solid hsla(0,0%,100%,0.1)',
                            textAlign: 'center'
                        }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', marginBottom: '0.5rem' }}>
                                    Hormat kami,
                                </p>
                                <div style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, #f093fb 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    marginBottom: '0.25rem',
                                    letterSpacing: '-0.02em'
                                }}>
                                    Drama Short
                                </div>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: 'hsl(var(--text-muted))',
                                    fontStyle: 'italic',
                                    marginBottom: '1.5rem'
                                }}>
                                    By Amue Devs
                                </p>
                            </div>

                            <div style={{
                                display: 'inline-block',
                                padding: '0.75rem 1.5rem',
                                background: 'hsla(var(--primary), 0.1)',
                                borderRadius: '2rem',
                                border: '1px solid hsla(var(--primary), 0.3)'
                            }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                                    © {new Date().getFullYear()} Drama Short by Amue Devs. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

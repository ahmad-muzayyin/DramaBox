# 🎬 DramaBox Streaming App

Aplikasi streaming video pribadi dengan tampilan modern yang menggunakan API DramaBox untuk menonton drama secara lokal.

## ✨ Fitur

- 🎲 **Random Drama** - Drama acak dari koleksi
- 💝 **Untukmu** - Rekomendasi drama personalized
- 🆕 **Drama Terbaru** - Drama yang baru ditambahkan
- 🔥 **Trending Drama** - Drama yang sedang populer
- 🔍 **Pencarian Populer** - Kata kunci pencarian terpopuler
- 🔎 **Fitur Pencarian Canggih** - Cari drama berdasarkan judul dengan hasil real-time
- 📺 **Video Player HD** - Player video dengan dukungan episode berkualitas tinggi
- 🎬 **Full Episodes Page** - Halaman khusus untuk melihat semua episode dengan tampilan rapi
- ⚡ **Quick Play** - Putar episode pertama langsung dengan satu klik
- 📊 **Episode Status** - Indikator ketersediaan episode dengan ikon visual intuitif
- 🎯 **Multiple Qualities** - Pilih kualitas video (720p, 1080p, 1080p VIP)
- 📺 **Modal Video Player** - Player video fullscreen dengan navigasi episode
- 💝 **Favorit System** - Simpan drama favorit untuk ditonton nanti
- ⌨️ **Keyboard Navigation** - Kontrol dengan keyboard (arrow keys, escape)
- 🌟 **Popularity Metrics** - Tampilan ranking dan statistik popularitas drama
- 🎨 **Modern UI** - Desain dengan gradient, animasi, dan efek glassmorphism
- 👥 **Protagonist Info** - Informasi lengkap pemeran utama setiap drama
- 📱 **Responsive Design** - Tampilan yang sempurna di desktop, tablet, dan mobile

## 🚀 Cara Menjalankan

### Persyaratan
- Node.js (versi 12 atau lebih baru)

### Instalasi dan Menjalankan

1. **Clone atau download** semua file ke folder lokal

2. **Install dependencies** (opsional, aplikasi ini tidak memerlukan dependencies external):
   ```bash
   npm install
   ```

3. **Test API proxy** (opsional):
   ```bash
   npm test
   ```
   atau
   ```bash
   node test-api.js
   ```

4. **Jalankan server**:
   ```bash
   npm start
   ```
   atau
   ```bash
   node server.js
   ```

5. **Buka browser** dan akses:
   ```
   http://localhost:3000
   ```

6. **Test fitur modern**:
   - Klik tab "Populer" untuk melihat konten dengan design terbaru
   - Hover pada drama card untuk efek visual
   - Gunakan tombol "Tonton" dan "Episode" yang menarik
   - Klik "Episode" untuk melihat halaman episode terpisah
   - Test fungsi pencarian dengan hasil yang stylish
   - Gunakan keyboard navigation di halaman episode

### Untuk Windows
Jika menggunakan Windows, Anda bisa menjalankan file `start.bat` (jika ada) atau:
```cmd
node server.js
```

## 📁 Struktur File

```
DramaBox/
├── index.html      # File HTML utama
├── style.css       # Styling modern dengan CSS
├── app.js          # JavaScript untuk fungsionalitas aplikasi
├── server.js       # Server Node.js untuk menjalankan lokal
├── package.json    # Konfigurasi Node.js
└── README.md       # Dokumentasi ini
```

## 🔧 API Endpoints

Aplikasi ini menggunakan API dari `https://dramabox.sansekai.my.id/api` dengan endpoint berikut:

- `GET /dramabox/randomdrama` - Random Drama Video
- `GET /dramabox/foryou` - For You (Untukmu)
- `GET /dramabox/latest` - Drama Terbaru
- `GET /dramabox/trending` - Trending Drama
- `GET /dramabox/populersearch` - Pencarian Populer
- `GET /dramabox/search` - Cari Drama
- `GET /dramabox/allepisode` - Ambil Semua Episode

## 🎨 Tampilan

- **Dark Theme** - Tema gelap yang modern dan nyaman untuk mata
- **Gradient Background** - Background dengan efek gradien
- **Card Layout** - Layout kartu untuk setiap drama
- **Modal Video Player** - Player video dengan daftar episode
- **Responsive** - Mendukung desktop, tablet, dan mobile

## 🔍 Cara Penggunaan

1. **Navigasi Tab** - Klik tab untuk melihat kategori drama berbeda
2. **Pencarian** - Gunakan search box untuk mencari drama spesifik
3. **Klik Drama** - Klik pada kartu drama untuk melihat detail dan episode
4. **Putar Episode** - Klik episode di modal untuk memutar video
5. **Refresh** - Gunakan tombol refresh untuk memuat ulang konten

## 🔧 CORS Fix

Aplikasi ini menggunakan **API Proxy** untuk mengatasi masalah CORS. Semua permintaan API diarahkan melalui server lokal (`/api/`) yang kemudian di-proxy ke `https://dramabox.sansekai.my.id/api/`. Ini memastikan tidak ada masalah CORS karena semua permintaan berasal dari domain yang sama (localhost).

## 🧪 Testing CORS Fix

Buka halaman `cors-test.html` di browser untuk menguji apakah masalah CORS sudah teratasi:
```
http://localhost:3000/cors-test.html
```

## 📺 Halaman Episodes

### ✨ Fitur Halaman Episodes
- **Header Drama**: Informasi lengkap drama dengan cover, judul, dan rating
- **Episode Grid**: Tampilan grid yang rapi untuk semua episode
- **Status Indicator**: Ikon visual untuk episode tersedia/tidak tersedia
- **Modal Player**: Video player fullscreen dengan kontrol navigasi
- **Keyboard Control**: Navigasi dengan arrow keys dan escape
- **Responsive Layout**: Tampilan optimal di semua device

### 🎮 Cara Menggunakan
1. **Dari Halaman Utama**: Klik tombol "Episode (X)" pada drama card
2. **Navigasi Episode**: Klik episode untuk memutar video
3. **Kontrol Player**: Gunakan tombol Previous/Next atau keyboard
4. **Kembali**: Klik tombol "Kembali" untuk kembali ke halaman utama

## 🎨 Desain Modern

### ✨ Fitur Visual Canggih
- **Glassmorphism Effect** - Efek kaca transparan dengan backdrop blur
- **Gradient Backgrounds** - Gradient dinamis pada card dan button
- **Hover Animations** - Animasi smooth saat interaksi
- **Typography Enhancement** - Font dan spacing yang diperbaiki
- **Color-coded Popularity** - Warna berbeda untuk trending/viral content
- **Interactive Buttons** - Button dengan efek ripple dan transform
- **Card Overlay Effects** - Overlay informasi saat hover
- **Pulse Animations** - Animasi halus untuk konten populer

### 🎭 Komponen UI
- **Drama Cards**: Card dengan thumbnail, info lengkap, dan action buttons
- **Popularity Badges**: Badge dengan ikon untuk views/trending
- **Tag System**: Tags berwarna dengan gradient background
- **Protagonist Display**: Info pemeran dengan ikon user
- **Episode Counter**: Penampil jumlah episode dengan badge
- **Favorite Button**: Tombol hati untuk menyimpan favorit
- **Status Indicators**: Icon berbeda untuk status episode

### 📱 Responsive Features
- **Mobile-first Design** - Dioptimalkan untuk perangkat mobile
- **Flexible Grid** - Grid yang menyesuaikan ukuran layar
- **Touch-friendly** - Button dan elemen yang mudah di-tap
- **Adaptive Typography** - Font yang scalable
- **Optimized Images** - Loading gambar yang efisien

## 🛠️ Teknologi

- **HTML5** - Struktur aplikasi dengan semantic markup
- **CSS3 Advanced** - Modern styling dengan CSS Grid, Flexbox, dan animations
- **Vanilla JavaScript** - Fungsi aplikasi tanpa framework external
- **Node.js** - Server lokal untuk aplikasi dan API proxy
- **HTTPS Proxy** - Sistem proxy untuk mengatasi CORS
- **Cache Busting** - Header cache cerdas untuk development
- **Progressive Enhancement** - Fallback untuk browser lama

## 📝 Catatan

- Aplikasi ini berjalan sepenuhnya di lokal (localhost)
- Video streaming bergantung pada ketersediaan API DramaBox
- Tidak memerlukan internet untuk menjalankan aplikasi (kecuali untuk API calls)
- Data video disimpan dan diakses melalui API eksternal

## 🤝 Kontribusi

Silakan berkontribusi dengan membuat issue atau pull request jika ada perbaikan atau fitur tambahan.

## 📄 Lisensi

MIT License - bebas digunakan untuk keperluan pribadi atau komersial.

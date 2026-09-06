# 🌸 Selamat Ulang Tahun, Mela — Website Ulang Tahun Romantis

Website ucapan ulang tahun spesial, romantis, elegan, dan penuh makna yang dibuat menggunakan **HTML5**, **CSS3**, dan **Vanilla JavaScript** murni tanpa framework tambahan.

---

## ✨ Fitur & Bagian Website

| Bagian | Keterangan |
|---|---|
| **Opening Screen** | Layar pembuka sinematik dengan kelopak bunga, pesan manis, dan tombol interaktif |
| **Navigasi** | Navbar glassmorphism melayang dengan menu responsif (mobile hamburger) |
| **Hero Section** | Sambutan utama dengan bingkai foto, ucapan personal, dan efek animasi halus |
| **Hitung Mundur** | Timer countdown langsung menuju hari ulang tahun spesialnya |
| **Galeri Kenangan** | Grid foto responsif dengan efek zoom hover dan modal lightbox |
| **Surat Romantis** | Amplop interaktif yang bisa dibuka untuk membaca surat cinta menyentuh hati |
| **Doa & Harapan** | 5 kartu ucapan/doa dengan ikon dan animasi scroll reveal |
| **Kotak Kejutan** | Kotak kado interaktif yang membuka efek hujan konfeti dan balon hati melayang |
| **Pemutar Musik** | Pemutar lagu di sudut layar dengan animasi equalizer (fallback aman jika file audio belum ada) |
| **Footer** | Footer personal bernuansa hangat |

---

## 📁 Struktur File

```
/
├── index.html              ← Seluruh struktur halaman (Bahasa Indonesia)
├── css/
│   └── style.css           ← Desain, warna, layout, dan animasi
├── js/
│   └── script.js           ← Logika interaktif & konfigurasi (Nama: Mela)
├── assets/
│   ├── images/
│   │   ├── hero-photo.jpg  ← Foto utama Mela
│   │   ├── memory-1.jpg    ← Foto kenangan 1
│   │   ├── memory-2.jpg    ← Foto kenangan 2
│   │   ├── memory-3.jpg    ← Foto kenangan 3
│   │   ├── memory-4.jpg    ← Foto kenangan 4
│   │   ├── memory-5.jpg    ← Foto kenangan 5
│   │   └── memory-6.jpg    ← Foto kenangan 6
│   └── music/
│       └── birthday-song.mp3  ← Lagu latar ulang tahun (opsional)
└── README.md
```

---

## ⚙️ Cara Mengatur / Personalisasi

Buka file `js/script.js` pada bagian `CONFIG` teratas:

```javascript
const CONFIG = {
  herName: 'Mela',                                // Nama penerima
  birthdayDate: new Date('2026-10-15T00:00:00'),  // Tanggal & jam ulang tahun
  letterSignature: 'Seseorang yang selalu peduli ♡', // Tanda tangan surat
  letterDateLocale: 'id-ID',                     // Format tanggal Indonesia
  floatingHeartsCount: 12,                       // Jumlah hati melayang
  confettiCount: 120,                            // Jumlah konfeti saat kado dibuka
};
```

---

## 🖼️ Menambahkan Foto Asli

Masukkan foto-foto ke folder `assets/images/`:
- `hero-photo.jpg` untuk foto di halaman utama (direkomendasikan rasio potret).
- `memory-1.jpg` sampai `memory-6.jpg` untuk galeri kenangan.

> *Jika belum ada foto, website akan otomatis menampilkan placeholder estetik tanpa error.*

---

## 🎵 Menambahkan Lagu

Letakkan file lagu berformat `.mp3` ke folder:
```
assets/music/birthday-song.mp3
```

---

## 🚀 Cara Menjalankan

1. Cukup buka/double-click file `index.html` di browser (Chrome, Edge, Firefox, Safari).
2. Atau jalankan via web server lokal:
   ```bash
   python -m http.server 8080
   ```
   Lalu buka `http://localhost:8080` di browser.

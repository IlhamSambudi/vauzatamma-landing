# Vauzatamma - Premium Landing Page & Admin CMS

Vauzatamma adalah sistem Landing Page dan Panel Administrasi modern (berbasis SSR/React) yang digunakan untuk mengelola serta menampilkan paket perjalanan umroh dan haji secara komprehensif.

## 🚀 Fitur Utama

### 🌟 Landing Page (Public Facing)
- **Hero Section:** Desain modern dengan animasi menarik untuk first-impression yang kuat.
- **Daftar Maskapai & Hotel (Slider/Marquee):** Menampilkan rekanan penerbangan dan akomodasi terpercaya.
- **Section Paket Terbaik (Package Cards):** 
  - Render tier secara dinamis (Net Price, Silver, Gold, Platinum).
  - Indikator sisa Seat (Kursi) / Kuota rombongan.
  - Opsi sortir & filter (Semua, Umroh, Haji).
- **Package Detail Modal:**
  - **Ringkasan & Fasilitas:** Info rinci, deskripsi berformat rapi, dan fasilitas (pesawat/hotel/visa).
  - **Itinerary Timeline:** Rincian jadwal kegiatan harian untuk jamaah (Hari Ke-X).
  - **Harga (Pricing):** Harga mulai dari berbagai opsi tipe kamar (Quad, Triple, Double) serta upgrade tier.
- **Slider Testimoni:** Berbagi review menarik dan nyata dari jamaah yang telah berangkat.
- **Grid Galeri:** Lightbox preview untuk foto pengalaman perjalanan suci yang diambil langsung dari database.
- **WhatsApp Call-to-action (CTA):** Tombol melayang terintegrasi langsung dengan nomor WA admin.

### 💼 Admin Dashboard Panel (CMS)
- **Autentikasi Terpusat:** Login sistem menggunakan arsitektur JSON Web Token (JWT) yang aman.
- **Manajemen Paket (CRUD Lengkap):** 
  - Membuat dan mengedit data tabel utama, keberangkatan (departures multi dates), tiering harga dinamis, tipe hotel, dan fitur-fitur paket.
- **Leads (Inbox Customer):** Mencatat semua pertanyaan / pemesanan dari form masuk.
- **Galeri & Media Library:** Upload file gambar dan kelola library penyimpanan untuk banner paket, itinerary PDF, dsb.
- **Testimoni & FAQ:** Mengatur data review dari pengunjung dan konten Q&A di landing page.
- **Direktori Maskapai & Hotel:** 
  - Input nama hotel, rating bintang.
  - Input profil maskapai berserta logo *flyer* yang akan dirender secara dinamis di halaman depan.
- **Multi-Akun Admin (RBAC):** Pembuatan dan pengaturan password untuk berbagai staff operasional admin.

---

## 🛠 Tech Stack (Teknologi yang Digunakan)

### Backend (API Server)
* **Framework:** Node.js dengan **Express.js**
* **Database:** **PostgreSQL** (`pg` library config) berbasis relational (berbagai macam relasi multi-table).
* **Storage / Upload:** **Multer** untuk memfasilitasi _multipart/form-data_ file upload lokal (Gambar, PDF Itinerary, dsb).
* **Keamanan:** **Bcrypt.js** (untuk enkripsi password) & **JWT / JsonWebToken** (untuk proteksi route admin).

### Frontend (Client-side)
* **Framework Utama:** **Vite** + **React.js**
* **Styling / UI:** **Tailwind CSS** dipadukan dengan utility standard class untuk performa terbaik & **Lucide React** untuk koleksi *icons*.
* **Animation / UX:** **Framer Motion** untuk transisi komponen *(scroll-in view, modals, hover states)*.
* **Component Plugins:** **Swiper.js** untuk Slider carousel UI.
* **API Calls:** **Axios** (terkonfigurasi dengan interceptors JWT handling).
* **Routing:** **React Router DOM**.

---

## 📂 Struktur Direktori

```text
vauzatamma-landing/
├── backend/
│   ├── config/             # Konfigurasi koneksi Database Postgres (db.js)
│   ├── controllers/        # Logika sistem API Admin & Public endpoints
│   ├── middleware/         # Proteksi Auth (auth.js) & File Upload (upload.js)
│   ├── routes/             # Pemetaan endpoint ExpressRouter (api.js)
│   ├── uploads/            # (Ter-gitignore) Folder penyimpanan asset lokal / flyer / galeri
│   ├── server.js           # Entry point Backend Node.js
│   └── ...                 # Package.json, table migrations dsb
│
├── frontend/
│   ├── public/             # Static Assets (favicon, default images)
│   ├── src/
│   │   ├── components/     # UI Komponen dapat digunakan kembali (Modals, PackageCard, Table, Button)
│   │   ├── pages/          # Root Halaman (HomePage.jsx, AdminDashboardPage.jsx, dsb)
│   │   ├── sections/       # Section modular khusus Landing Page
│   │   ├── services/       # axios API service bindings (api.js)
│   │   ├── index.css       # Tailwind entry point dan custom global CSS setup
│   │   ├── App.jsx         # Entry Router Configuration frontend
│   │   └── main.jsx        
│   └── ...                 # Vite.config, tailwind.config, eslint
└── README.md
```

---

## 💻 Panduan Instalasi & Menjalankan Aplikasi

Project ini menerapkan arsitektur terpisah antara _frontend_ dan _backend_ berbasis *monorepo* folder.

### 1. Prasyarat
- **Node.js**: Minimum `v16.x` atau versi terbaru.
- **PostgreSQL**: Pastikan daemon database berjalan di mesin Anda (lokal atau cloud).

### 2. Konfigurasi Backend Server
Masuk ke directori `backend` dan install *dependencies*:

```bash
cd backend
npm install
```

Buat file environment `.env` di dalam folder `backend/` dan isi dengan konfigurasi database kamu:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=vauzatamma_db
DB_PASSWORD=YOUR_PASSWORD
DB_PORT=5432
JWT_SECRET=super_secret_jwt_key
```

Jalankan perintah Migrasi Database kamu (Sesuai script seed yang telah dibuat)
Lalu hidupkan mode *development*:
```bash
npm run dev
```

### 3. Konfigurasi Frontend Vite Server
Buka terminal / tab terminal baru, masuk ke direktori `frontend` dan jalankan:

```bash
cd frontend
npm install
```

Start *development server*:
```bash
npm run dev
```

Secara default, landing page dapat diakses pada **http://localhost:5173**. Halaman portal cms berada di **http://localhost:5173/admin/login**.

---

## 👤 Admin Access Credential

Untuk mengakses CMS sebagai konfigurasi standar / default awal (Bila disemai lewat script schema), silakan gunakan tipe login default seperti berikut (atau sesuai dengan yang kamu konfigurasikan via script hash _Bcrypt_ awal milikmu):
* **Username**: `admin`
* **Password**: `password123` 

_(Harap ganti password langsung di dashboard tab Admin Accounts setelah pertama masuk ke stage produksi!)._

---
> Dibangun dan dikembangkan dengan ❤️ untuk Vauzatamma Tours.

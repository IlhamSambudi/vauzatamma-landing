# Dokumentasi Database Vauza Tamma Landing Page

Dokumentasi ini berisi struktur database, tipe data, serta relasi antar tabel yang digunakan pada sistem Vauza Tamma Landing Page (PostgreSQL). Disertakan juga contoh payload/codingan untuk mempermudah integrasi.

## 1. ERD & Relasi Utama

Sistem ini didesain berpusat pada tabel `packages` (Paket Umroh/Haji). Berikut adalah relasi utamanya:
- `packages` **Many-to-One** dengan `airlines` (Satu paket menggunakan satu maskapai).
- `packages` **One-to-Many** dengan `package_departures` (Satu paket memiliki banyak tanggal keberangkatan).
- `packages` **One-to-Many** dengan `package_prices` (Satu paket memiliki banyak harga berdasarkan tipe kamar/tier).
- `packages` **One-to-Many** dengan `package_features` (Satu paket memiliki banyak fitur/fasilitas).
- `packages` **One-to-Many** dengan `package_hotels` (Satu paket menggunakan lebih dari satu hotel).
- `package_hotels` **Many-to-One** dengan `hotels` (Merelasikan paket dengan master data hotel).
- `packages` **One-to-Many** dengan `package_assets` (Gambar cover, flyer, dll).
- `packages` **One-to-One** / **One-to-Many** dengan `itineraries` (File PDF Itinerary).

---

## 2. Struktur Tabel & Tipe Data

### 2.1. Tabel Master

#### `admins`
Menyimpan data otentikasi admin CMS.
```sql
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `airlines`
Menyimpan master data maskapai penerbangan.
```sql
CREATE TABLE airlines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50),
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `hotels`
Menyimpan master data akomodasi / hotel di Makkah & Madinah.
```sql
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100), -- 'Makkah', 'Madinah', 'Istanbul', dll.
    country VARCHAR(100),
    star_rating INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2. Tabel Paket (Core)

#### `packages`
Tabel utama yang menyimpan informasi dasar sebuah paket.
```sql
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    package_code VARCHAR(50) UNIQUE,
    package_name VARCHAR(255) NOT NULL,
    program_type VARCHAR(50) DEFAULT 'umroh', -- 'umroh', 'haji', 'tour'
    plus_destination VARCHAR(100), -- ex: 'Istanbul', 'Dubai'
    airline_id INT REFERENCES airlines(id) ON DELETE SET NULL,
    description TEXT,
    full_seat INT,
    remaining_seat INT,
    starting VARCHAR(100), -- Lokasi keberangkatan (contoh: Jakarta)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `package_departures`
Menyimpan jadwal keberangkatan paket.
```sql
CREATE TABLE package_departures (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    departure_date DATE NOT NULL
);
```

#### `package_prices`
Menyimpan variasi harga berdasarkan tipe kamar (Quad, Triple, Double).
```sql
CREATE TABLE package_prices (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL, -- 'quad', 'triple', 'double'
    price NUMERIC NOT NULL,
    upgrade_double NUMERIC DEFAULT 0,
    upgrade_triple NUMERIC DEFAULT 0
);
```

#### `package_features`
Menyimpan daftar fasilitas (includes) dari paket.
```sql
CREATE TABLE package_features (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    feature TEXT NOT NULL
);
```

#### `package_hotels`
Menyambungkan paket dengan master data hotel untuk mencatat spesifikasi staycation pada paket.
```sql
CREATE TABLE package_hotels (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    stay_city VARCHAR(100), -- 'makkah', 'madinah'
    nights INT DEFAULT 0
);
```

#### `package_assets` & `itineraries`
Menyimpan link aset gambar dan file dokumen.
```sql
CREATE TABLE package_assets (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    asset_type VARCHAR(50), -- 'cover', 'flyer', 'gallery'
    asset_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itineraries (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    pdf_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3. Tabel Lepas (CMS Pendukung)

#### `gallery`, `media_library`, `testimonials`, `leads`, `faq`
Menyimpan konten website yang berdiri sendiri (tidak memiliki Foreign Key bergantung ke Packages/Master lain).

```sql
CREATE TABLE gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    package_interest VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faq (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media_library (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255),
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(100), -- 'image', 'video', 'document'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100),
    message TEXT NOT NULL,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Contoh Payload (JSON) / Codingan untuk API `createFullPackage`

Gunakan referensi payload Javascript berikut untuk mempermudah integrasi dari frontend ke endpoint `/api/admin/packages/full`. Payload ini sudah distrukturkan agar di-parsing dengan benar oleh kontroler backend yang menggunakan transaksi multitable.

```javascript
// Data harus dikirim melalui objek FormData karena mendukung file uploader (multipart/form-data)
const formData = new FormData();

// 1. Data Utama Package (Tabel packages)
const packageData = {
    package_name: "Umroh Plus Istanbul 12 Hari",
    program_type: "umroh",
    plus_destination: "Istanbul",
    description: "Paket umroh eksklusif dengan kunjungan wisata religi di Istanbul.",
    full_seat: 45,
    airline_id: 3, // ID maskapai Emirates
    starting: "Jakarta (CGK)"
};
formData.append("package", JSON.stringify(packageData));

// 2. Data Departures / Jadwal Keberangkatan (Tabel package_departures)
const departuresData = [
    { departure_date: "2026-05-08" },
    { departure_date: "2026-05-22" }
];
formData.append("departures", JSON.stringify(departuresData));

// 3. Data Prices / Hierarki Harga (Tabel package_prices)
const pricesData = [
    { tier: "quad", price: 38000000 },
    { tier: "triple", price: 42000000, upgrade_triple: 0 },
    { tier: "double", price: 47000000, upgrade_double: 0 }
];
formData.append("prices", JSON.stringify(pricesData));

// 4. Data Features / Fasilitas (Tabel package_features)
const featuresData = [
    "Tiket Pesawat PP (Emirates)",
    "Hotel Bintang 5 Makkah & Madinah",
    "Biaya Visa Umroh & Turki",
    "City Tour Istanbul"
];
formData.append("features", JSON.stringify(featuresData));

// 5. Data Hotels / Relasi Akomodasi (Tabel package_hotels)
const hotelsData = [
    { hotel_id: 1, stay_city: "madinah", nights: 3 }, // ID 1 dari tabel hotels
    { hotel_id: 2, stay_city: "makkah", nights: 5 }   // ID 2 dari tabel hotels
];
formData.append("hotels", JSON.stringify(hotelsData));

// 6. Data Files (Opsional : jika user upload image cover/pdf itinerary)
/* 
// Asumsi ada input type file HTML
const flyerInput = document.querySelector('input[name="flyer"]').files[0];
if (flyerInput) formData.append("flyer", flyerInput); // Disimpan ke package_assets

const pdfFile = document.querySelector('input[name="itinerary_pdf"]').files[0];
if (pdfFile) formData.append("itinerary_pdf", pdfFile); // Disimpan ke itineraries
*/

// 7. Proses fetch ke endpoint backend Axios / Fetch API
fetch('/api/admin/packages/full', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}` // Lampirkan JWT jika route dilindungi middleware protect/admin
    },
    body: formData
})
.then(res => res.json())
.then(data => {
    if(data.success) {
        console.log("Paket berhasil dibuat dengan ID:", data.package_id);
    } else {
        console.error("Gagal membuat paket:", data.message);
    }
})
.catch(err => console.error("Error jaringan:", err));
```

## 4. Proses Eksekusi Relasional Pada Database (Secara Backend)

Pada saat endpoint untuk membuat `Packages` dipanggil, urutan sistematis menggunakan PostgreSQL Transaction (`BEGIN` dan `COMMIT`) adalah sebagai berikut supaya menjamin *Data Integrity*:
1. `INSERT INTO packages` lalu sistem akan memanggil perintah SQL `RETURNING id` untuk mendapatkan *Primary Key ID Package* yang baru dibuat.
2. Melakukan proses *looping*/iterasi ke tabel `package_departures` menggunakan `package_id` baru tersebut secara bertahap.
3. Melakukan eksekusi iterasi yang berpusat ke tabel `package_prices`.
4. Melakukan eksekusi iterasi menanamkan fitur-fitur paket ke `package_features`.
5. Melakukan kombinasi relasi menyuntikkan ID paket dan `hotel_id` dari tabel Master Hotel ke dalam keranjang `package_hotels`.
6. Melakukan *handling request.files* (multer) dan menanamkan path lokasi file/gambar ke tabel `package_assets` atau `itineraries`.
7. Mengamankan keandalan dengan `COMMIT`. Apabila terdapat satupun *record* yang gagal masuk ke database akibat format tidak valid, `Postgres` akan mengeksekusi `ROLLBACK` (*Revert All*) yang membatalkan seluruh insert dari awal (*tidak ada package ID yang tertinggal dalam status ngambang*).

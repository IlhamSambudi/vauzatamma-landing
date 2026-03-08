-- =============================================
-- Vauza Tamma Abadi — Full DB Reset & Seed
-- Run: psql -U ilhamsambudi -d landingpage -f database/reset_and_seed.sql
-- =============================================

-- -----------------------------------------------
-- 1. CLEAR all data (respecting FK ordering)
-- -----------------------------------------------
TRUNCATE TABLE
    itineraries,
    package_assets,
    package_features,
    package_hotels,
    package_departures,
    package_prices,
    packages,
    hotels,
    airlines,
    gallery,
    media_library,
    testimonials,
    leads,
    faq,
    admins
RESTART IDENTITY CASCADE;

-- -----------------------------------------------
-- 2. ADMINS
-- -----------------------------------------------
-- password: admin123 (bcrypt rounds=10)
INSERT INTO admins (username, password_hash, created_at) VALUES
('admin', '$2a$10$J12GXbtY4a3JV4NMUkEZsOA2t9Aj3qJPNkDLHXUx07S7dnXm7AZT2', NOW());

-- -----------------------------------------------
-- 3. AIRLINES
-- -----------------------------------------------
INSERT INTO airlines (name, code, logo_url, created_at) VALUES
('Garuda Indonesia', 'GA', NULL, NOW()),
('Saudi Arabian Airlines', 'SV', NULL, NOW()),
('Emirates', 'EK', NULL, NOW()),
('Oman Air', 'WY', NULL, NOW());

-- -----------------------------------------------
-- 4. HOTELS
-- -----------------------------------------------
INSERT INTO hotels (name, city, country, star_rating, created_at) VALUES
('Hotel Dar Al Hijra Intercontinental', 'Madinah', 'Saudi Arabia', 5, NOW()),
('Pullman Zamzam', 'Makkah', 'Saudi Arabia', 5, NOW()),
('Concorde Al Salam', 'Madinah', 'Saudi Arabia', 4, NOW()),
('Mövenpick Hajar Tower', 'Makkah', 'Saudi Arabia', 5, NOW()),
('Al Shohada Hotel', 'Makkah', 'Saudi Arabia', 4, NOW()),
('Millennium Hotel Makkah', 'Makkah', 'Saudi Arabia', 4, NOW());

-- -----------------------------------------------
-- 5. PACKAGES (uses airline IDs above: GA=1, SV=2, EK=3, WY=4)
-- -----------------------------------------------
INSERT INTO packages (package_code, package_name, program_type, plus_destination, airline_id, description, full_seat, remaining_seat, created_at) VALUES
('VT-9D-2026A', 'Umroh Reguler 9 Hari – April 2026', 'umroh', NULL, 2,
 'Paket umroh ekonomis dengan fasilitas hotel bintang 4, pembimbing bersertifikat Kemenag, dan akomodasi lengkap. Cocok untuk jamaah pertama kali.',
 45, 38, NOW()),

('VT-12D-2026B', 'Umroh Plus Istanbul 12 Hari – Mei 2026', 'umroh', 'Istanbul',  3,
 'Paket umroh eksklusif dengan kunjungan wisata religi di Istanbul, Turki. Hotel bintang 5 di Makkah & Madinah.',
 30, 22, NOW()),

('VT-9D-2026C', 'Umroh Reguler 9 Hari – Juni 2026', 'umroh', NULL, 2,
 'Paket umroh reguler bulan Juni 2026 dengan harga terjangkau. Hotel bintang 4 pilihan.',
 50, 50, NOW()),

('VT-RAMADAN-2027', 'Umroh Ramadan 15 Hari – 2027', 'umroh', NULL, 1,
 'Paket spesial Ramadan 15 hari, menginap di Makkah & Madinah selama Ramadan dengan hotel bintang 5.',
 40, 40, NOW());

-- -----------------------------------------------
-- 6. PACKAGE DEPARTURES
-- -----------------------------------------------
INSERT INTO package_departures (package_id, departure_date) VALUES
(1, '2026-04-10'),
(1, '2026-04-24'),
(2, '2026-05-08'),
(3, '2026-06-05'),
(3, '2026-06-19'),
(4, '2027-03-01');

-- -----------------------------------------------
-- 7. PACKAGE PRICES
-- -----------------------------------------------
INSERT INTO package_prices (package_id, tier, price, upgrade_double, upgrade_triple) VALUES
(1, 'triple', 28500000, 3500000, 0),
(1, 'double', 32000000, 0, 0),
(1, 'quad',   25000000, 0, 0),

(2, 'triple', 42000000, 5000000, 0),
(2, 'double', 47000000, 0, 0),
(2, 'quad',   38000000, 0, 0),

(3, 'triple', 27500000, 3000000, 0),
(3, 'double', 30500000, 0, 0),
(3, 'quad',   24500000, 0, 0),

(4, 'triple', 55000000, 7000000, 0),
(4, 'double', 62000000, 0, 0);

-- -----------------------------------------------
-- 8. PACKAGE FEATURES (fasilitas)
-- -----------------------------------------------
INSERT INTO package_features (package_id, feature) VALUES
-- Package 1
(1, 'Tiket Pesawat PP (Garuda/Saudia)'),
(1, 'Hotel Bintang 4 Makkah & Madinah'),
(1, 'Konsumsi 3x Sehari'),
(1, 'Transportasi AC'),
(1, 'Biaya Visa Umroh'),
(1, 'Perlengkapan Ibadah (Koper, Baju Ihram, Buku Doa)'),
(1, 'Pembimbing Ibadah Bersertifikat Kemenag'),

-- Package 2
(2, 'Tiket Pesawat PP (Emirates)'),
(2, 'Hotel Bintang 5 Makkah & Madinah'),
(2, 'Hotel Bintang 4 Istanbul'),
(2, 'Konsumsi 3x Sehari'),
(2, 'Transportasi AC'),
(2, 'Biaya Visa Umroh'),
(2, 'Biaya Visa Turkey'),
(2, 'City Tour Istanbul'),
(2, 'Perlengkapan Ibadah Lengkap'),
(2, 'Pembimbing Ibadah Bersertifikat Kemenag'),

-- Package 3
(3, 'Tiket Pesawat PP (Saudia)'),
(3, 'Hotel Bintang 4 Makkah & Madinah'),
(3, 'Konsumsi 3x Sehari'),
(3, 'Transportasi AC'),
(3, 'Biaya Visa Umroh'),
(3, 'Perlengkapan Ibadah'),
(3, 'Pembimbing Ibadah Bersertifikat Kemenag'),

-- Package 4
(4, 'Tiket Pesawat PP (Garuda)'),
(4, 'Hotel Bintang 5 Makkah & Madinah (Ramadan)'),
(4, 'Konsumsi 3x Sehari + Sahur & Buka Puasa'),
(4, 'Transportasi AC'),
(4, 'Biaya Visa Umroh'),
(4, 'Perlengkapan Ibadah Lengkap'),
(4, 'Pembimbing Ibadah Bersertifikat Kemenag'),
(4, 'Laundry'),
(4, 'City Tour Madinah');

-- -----------------------------------------------
-- 9. PACKAGE HOTELS (link packages ↔ hotels)
-- -----------------------------------------------
INSERT INTO package_hotels (package_id, hotel_id, stay_city, nights) VALUES
-- Package 1: Madinah 3 nights, Makkah 5 nights
(1, 1, 'madinah', 3),   -- Dar Al Hijra
(1, 5, 'makkah', 5),    -- Al Shohada

-- Package 2: Madinah 3n, Makkah 5n
(2, 1, 'madinah', 3),   -- Dar Al Hijra
(2, 2, 'makkah', 5),    -- Pullman Zamzam

-- Package 3
(3, 3, 'madinah', 3),   -- Concorde Al Salam
(3, 6, 'makkah', 5),    -- Millennium

-- Package 4 (Ramadan, 5★)
(4, 1, 'madinah', 6),   -- Dar Al Hijra
(4, 4, 'makkah', 8);    -- Mövenpick

-- -----------------------------------------------
-- 10. FAQ
-- -----------------------------------------------
INSERT INTO faq (question, answer, created_at) VALUES
('Berapa lama proses pendaftaran umroh?', 'Proses pendaftaran membutuhkan waktu 7–14 hari kerja, termasuk pengurusan visa dan dokumen lainnya.', NOW()),
('Dokumen apa saja yang diperlukan?', 'Anda memerlukan paspor (minimal 6 bulan berlaku), KTP, KK, buku nikah/akta lahir, pas foto, dan vaksin meningitis.', NOW()),
('Apakah ada cicilan untuk paket umroh?', 'Ya, kami menyediakan program cicilan yang fleksibel. Hubungi tim kami untuk informasi lebih lanjut.', NOW()),
('Apakah ada pembimbing ibadah resmi?', 'Setiap grup dipimpin oleh ustaz pembimbing bersertifikat dari Kemenag yang berpengalaman.', NOW()),
('Bagaimana dengan anak di bawah umur?', 'Anak-anak diizinkan berangkat umroh dengan persyaratan dokumen tertentu. Tim kami akan memandu prosesnya.', NOW()),
('Apa yang termasuk dalam paket All-Inclusive?', 'Tiket pesawat (PP), akomodasi hotel, konsumsi 3x sehari, transportasi, biaya visa, perlengkapan ibadah, dan bimbingan ibadah.', NOW()),
('Kapan batas pelunasan biaya umroh?', 'Pelunasan dilakukan paling lambat 45 hari sebelum keberangkatan.', NOW()),
('Apakah harga sudah termasuk biaya visa?', 'Ya, semua paket Vauza Tamma sudah termasuk biaya pengurusan visa umroh.', NOW());

-- -----------------------------------------------
-- 11. TESTIMONIALS (sample)
-- -----------------------------------------------
INSERT INTO testimonials (name, city, message, photo_url, created_at) VALUES
('Siti Rahayu', 'Jakarta', 'Alhamdulillah, perjalanan umroh bersama Vauza Tamma sangat berkesan. Pelayanan super, pembimbing sabar dan profesional. Sangat direkomendasikan!', NULL, NOW()),
('Bapak Hendra Kusuma', 'Surabaya', 'Paket umroh plus Istanbul benar-benar beyond expectation. Hotel bintang 5, makanan enak, dan pemandu yang luar biasa. Insyaallah akan kembali bersama Vauza Tamma.', NULL, NOW()),
('Ibu Dewi Hartati', 'Bandung', 'Terima kasih Vauza Tamma! Proses pendaftaran mudah, dokumen diurus semua, kami tinggal berangkat. Ini umroh pertama saya dan tidak bisa lebih baik dari ini.', NULL, NOW()),
('Pak Ahmad Syafii', 'Medan', 'Umroh Ramadan bersama Vauza Tamma, masya Allah. Shalat tarawih di Masjidil Haram, sahur bersama jamaah lain... pengalaman tak terlupakan seumur hidup.', NULL, NOW()),
('Nur Khasanah', 'Yogyakarta', 'Paket reguler 9 hari tapi terasa lengkap sekali. Ziarah Madinah dan Makkah semua terpenuhi. Harga sangat sepadan dengan pelayanannya.', NULL, NOW());

-- -----------------------------------------------
-- 12. LEADS (sample test inquiries)
-- -----------------------------------------------
INSERT INTO leads (name, phone, package_interest, message, created_at) VALUES
('Rina Oktavia', '08111234567', 'Umroh Reguler 9 Hari – April 2026', 'Saya tertarik dengan paket reguler April. Apakah masih ada slot?', NOW()),
('Budi Santoso', '08220987654', 'Umroh Plus Istanbul 12 Hari – Mei 2026', 'Ingin info lebih lanjut tentang paket Istanbul. Budget saya sekitar 45 juta.', NOW()),
('Fatimah Zahra', '08567891234', 'Umroh Ramadan 15 Hari – 2027', 'Saya ingin daftar untuk Ramadan 2027 dengan suami. Bisa dicicil?', NOW());

-- -----------------------------------------------
-- Done! Check counts:
-- -----------------------------------------------
SELECT 'admins' AS tbl, COUNT(*) FROM admins
UNION ALL SELECT 'airlines', COUNT(*) FROM airlines
UNION ALL SELECT 'hotels', COUNT(*) FROM hotels
UNION ALL SELECT 'packages', COUNT(*) FROM packages
UNION ALL SELECT 'package_departures', COUNT(*) FROM package_departures
UNION ALL SELECT 'package_prices', COUNT(*) FROM package_prices
UNION ALL SELECT 'package_features', COUNT(*) FROM package_features
UNION ALL SELECT 'package_hotels', COUNT(*) FROM package_hotels
UNION ALL SELECT 'faq', COUNT(*) FROM faq
UNION ALL SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL SELECT 'leads', COUNT(*) FROM leads;

-- =============================================
-- Vauza Tamma Abadi - Seed Admin User
-- Run: psql -U postgres -d vauzatamma_db -f seed.sql
-- =============================================

-- Create admin (password: admin123 - CHANGE IN PRODUCTION)
-- Hash generated with bcryptjs rounds=10
INSERT INTO admins (email, password_hash, name, role, created_at)
VALUES (
  'admin@vauzatamma.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
  'Super Admin',
  'super_admin',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Sample FAQ
INSERT INTO faq (question, answer, is_active, sort_order, created_at) VALUES
('Berapa lama proses pendaftaran umroh?', 'Proses pendaftaran membutuhkan waktu 7–14 hari kerja, termasuk pengurusan visa dan dokumen lainnya.', true, 1, NOW()),
('Dokumen apa saja yang diperlukan?', 'Anda memerlukan paspor (minimal 6 bulan berlaku), KTP, KK, buku nikah/akta lahir, pas foto, dan vaksin meningitis.', true, 2, NOW()),
('Apakah ada cicilan untuk paket umroh?', 'Ya, kami menyediakan program cicilan yang fleksibel. Hubungi tim kami untuk informasi lebih lanjut.', true, 3, NOW()),
('Apakah ada pembimbing ibadah resmi?', 'Setiap grup dipimpin oleh ustaz pembimbing bersertifikat dari Kemenag yang berpengalaman.', true, 4, NOW()),
('Bagaimana dengan anak di bawah umur?', 'Anak-anak diizinkan berangkat umroh dengan persyaratan dokumen tertentu. Tim kami akan memandu prosesnya.', true, 5, NOW()),
('Apa yang termasuk dalam paket All-Inclusive?', 'Tiket pesawat (PP), akomodasi hotel, konsumsi 3x sehari, transportasi, biaya visa, perlengkapan ibadah, dan bimbingan ibadah.', true, 6, NOW())
ON CONFLICT DO NOTHING;

-- Sample airline
INSERT INTO airlines (airline_name, airline_code, logo_url, created_at) VALUES
('Garuda Indonesia', 'GA', null, NOW()),
('Saudi Arabian Airlines', 'SV', null, NOW()),
('Emirates', 'EK', null, NOW())
ON CONFLICT DO NOTHING;

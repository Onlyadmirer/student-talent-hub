-- =====================================================
-- SEED DATA FOR STUDENT TALENT HUB
-- Database: PostgreSQL
-- Password for all users: password123
-- Hash: $2b$12$zPbFDmMNm9VBT1UdBtmuHeuNqKjggVEN5XzDzRSbCEeVtlJfYgIdy
-- =====================================================

-- Hapus data yang sudah ada (urutan terbalik dari dependency)
DELETE FROM saved_students;
DELETE FROM collaboration_requests;
DELETE FROM endorsements;
DELETE FROM project_contributors;
DELETE FROM projects;
DELETE FROM user_skills;
DELETE FROM users;
DELETE FROM skill_categories;

-- Reset sequence IDs
ALTER SEQUENCE skill_categories_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE user_skills_id_seq RESTART WITH 1;
ALTER SEQUENCE projects_id_seq RESTART WITH 1;
ALTER SEQUENCE project_contributors_id_seq RESTART WITH 1;
ALTER SEQUENCE endorsements_id_seq RESTART WITH 1;
ALTER SEQUENCE collaboration_requests_id_seq RESTART WITH 1;
ALTER SEQUENCE saved_students_id_seq RESTART WITH 1;

-- =====================================================
-- 1. SKILL CATEGORIES
-- =====================================================
INSERT INTO skill_categories (id, name, description) VALUES
(1,  'Web Development',       'Frontend dan Backend web development menggunakan framework modern seperti React, Laravel, Django'),
(2,  'Mobile Development',    'Pengembangan aplikasi mobile Android (Kotlin/Java) dan iOS (Swift)'),
(3,  'UI/UX Design',          'Perancangan antarmuka dan pengalaman pengguna menggunakan Figma, Adobe XD'),
(4,  'QA Testing',            'Quality assurance, manual testing, dan automated testing'),
(5,  'Data Science',          'Analisis data, machine learning, dan kecerdasan buatan dengan Python/R'),
(6,  'DevOps',                'CI/CD, Docker, Kubernetes, infrastruktur sebagai kode'),
(7,  'Cybersecurity',         'Keamanan jaringan, penetration testing, dan enkripsi'),
(8,  'Cloud Computing',       'Layanan cloud AWS, Google Cloud, Microsoft Azure'),
(9,  'Game Development',      'Pengembangan game 2D/3D menggunakan Unity, Unreal Engine'),
(10, 'Artificial Intelligence / Machine Learning', 'Pengembangan model AI/ML, deep learning, NLP, computer vision');

-- =====================================================
-- 2. USERS
-- =====================================================
INSERT INTO users (id, email, hashed_password, nim, name, major, role, status, bio, profile_picture) VALUES
(1,  'admin@example.com',          '$2b$12$zPbFDmMNm9VBT1UdBtmuHeuNqKjggVEN5XzDzRSbCEeVtlJfYgIdy', NULL,    'Admin User',            NULL,                        'admin',    'active', NULL, NULL),

(2,  'andi.pratama@example.com',   '$2b$12$zPbFDmMNm9VBT1UdBtmuHeuNqKjggVEN5XzDzRSbCEeVtlJfYgIdy', '1201220001', 'Andi Pratama',          'Informatika',              'student',  'active', 'Mahasiswa Informatika yang tertarik dengan pengembangan web dan mobile. Aktif di organisasi himpunan mahasiswa.', NULL),
(3,  'sari.wulandari@example.com', '$2b$12$zPbFDmMNm9VBT1UdBtmuHeuNqKjggVEN5XzDzRSbCEeVtlJfYgIdy', '1201220002', 'Sari Wulandari',        'Sistem Informasi',         'student',  'active', 'Desainer UI/UX yang passionate dalam menciptakan pengalaman digital yang intuitif.', NULL),
(4,  'budi.hartono@example.com',   '$2b$12$zPbFDmMNm9VBT1UdBtmuHeuNqKjggVEN5XzDzRSbCEeVtlJfYgIdy', '1201220003', 'Budi Hartono',          'Ilmu Komputer',            'student',  'active', 'Tertarik di bidang data science dan AI. Sedang mengerjakan penelitian tentang NLP.', NULL),
(5,  'dewi.anggraini@example.com', '$2b$12$zPbFDmMNm9VBT1UdBtmuHeuNqKjggVEN5XzDzRSbCEeVtlJfYgIdy', '1201220004', 'Dewi Anggraini',        'Informatika',              'student',  'active', 'Full-stack developer dan kontributor open source. Suka belajar teknologi baru.', NULL),
(6,  'rudi.hermawan@example.com',  '$2b$12$zPbFDmMNm9VBT1UdBtmuHeuNqKjggVEN5XzDzRSbCEeVtlJfYgIdy', '1201220005', 'Rudi Hermawan',         'Sistem Informasi',         'student',  'active', 'Mobile developer spesialis Android. Pengalaman membuat 3 aplikasi yang sudah di Play Store.', NULL),
(7,  'citra.dewi@example.com',     '$2b$12$zPbFDmMNm9VBT1UdBtmuHeuNqKjggVEN5XzDzRSbCEeVtlJfYgIdy', '1201220006', 'Citra Dewi Kusuma',     'Desain Komunikasi Visual', 'student',  'inactive', 'Desainer grafis dan illustrator. Beralih ke UI/UX design dan game design.', NULL),

(8,  'recruiter.binus@example.com',  '$2b$12$zPbFDmMNm9VBT1UdBtmuHeuNqKjggVEN5XzDzRSbCEeVtlJfYgIdy', NULL, 'Bina Nusantara Corp',   NULL, 'recruiter', 'active', 'Perusahaan teknologi mencari talenta muda berbakat di bidang software engineering.', NULL),
(9,  'recruiter.tech@example.com',   '$2b$12$zPbFDmMNm9VBT1UdBtmuHeuNqKjggVEN5XzDzRSbCEeVtlJfYgIdy', NULL, 'Tech Innovation Inc',  NULL, 'recruiter', 'active', 'Startup teknologi yang berkembang pesat. Membuka banyak posisi untuk fresh graduate.', NULL),

(10, 'dosen.fauzi@example.com',    '$2b$12$zPbFDmMNm9VBT1UdBtmuHeuNqKjggVEN5XzDzRSbCEeVtlJfYgIdy', NULL,    'Dr. Ahmad Fauzi',       'Fakultas Ilmu Komputer',   'dosen',    'active', 'Dosen pembimbing yang aktif dalam penelitian dan pengembangan sistem informasi.', NULL);

-- =====================================================
-- 3. USER SKILLS
-- =====================================================
INSERT INTO user_skills (id, user_id, skill_id, proficiency_level) VALUES
-- Andi: Web Dev expert, Mobile intermed, Cloud beginner
(1,  2, 1,  'expert'),
(2,  2, 2,  'intermediate'),
(3,  2, 8,  'beginner'),

-- Sari: UI/UX expert, Web Dev intermed
(4,  3, 3,  'expert'),
(5,  3, 1,  'intermediate'),

-- Budi: Data Science expert, AI/ML intermed
(6,  4, 5,  'expert'),
(7,  4, 10, 'intermediate'),

-- Dewi: Web Dev expert, UI/UX intermed, DevOps beginner
(8,  5, 1,  'expert'),
(9,  5, 3,  'intermediate'),
(10, 5, 6,  'beginner'),

-- Rudi: Mobile expert, Cloud intermed
(11, 6, 2,  'expert'),
(12, 6, 8,  'intermediate'),

-- Citra: UI/UX expert, Game Dev intermed
(13, 7, 3,  'expert'),
(14, 7, 9,  'intermediate');

-- =====================================================
-- 4. PROJECTS
-- =====================================================
INSERT INTO projects (id, title, description, github_link, figma_link, thumbnail_url, is_open, status, owner_id) VALUES
(1, 'Student Talent Hub',
    'Platform untuk menghubungkan mahasiswa dengan recruiter melalui portofolio project. Fitur: authentikasi, CRUD project, endorsements, search.',
    'https://github.com/andipratama/student-talent-hub',
    'https://figma.com/file/student-talent-hub',
    'https://via.placeholder.com/300x200?text=Student+Talent+Hub',
    TRUE, 'published', 2),

(2, 'E-Commerce Mobile App',
    'Aplikasi e-commerce untuk platform mobile Android. Fitur: katalog produk, keranjang belanja, checkout, dan payment gateway.',
    'https://github.com/rudihermawan/ecommerce-app',
    'https://figma.com/file/ecommerce-mobile',
    'https://via.placeholder.com/300x200?text=E-Commerce+App',
    FALSE, 'published', 6),

(3, 'Portfolio Website',
    'Website portofolio pribadi yang menampilkan project, skill, dan pengalaman. Dibangun dengan React.js dan Tailwind CSS.',
    'https://github.com/sariwulandari/portfolio',
    'https://figma.com/file/portfolio-design',
    'https://via.placeholder.com/300x200?text=Portfolio+Website',
    TRUE, 'published', 3),

(4, 'Smart Campus Dashboard',
    'Dashboard monitoring aktivitas kampus berbasis web. Menampilkan data real-time: kehadiran, nilai, dan jadwal perkuliahan.',
    'https://github.com/dewianggraini/smart-campus',
    'https://figma.com/file/smart-campus',
    'https://via.placeholder.com/300x200?text=Smart+Campus',
    TRUE, 'published', 5),

(5, 'Data Analytics Platform',
    'Platform analisis data untuk riset akademik. Mendukung visualisasi data, export laporan, dan integrasi dengan Google Colab.',
    'https://github.com/budihartono/data-analytics',
    NULL,
    'https://via.placeholder.com/300x200?text=Data+Analytics',
    FALSE, 'published', 4),

(6, 'Game Edukasi Interaktif',
    'Game edukasi untuk anak-anak belajar matematika dasar. Dibangun dengan Unity, tersedia di platform Android.',
    'https://github.com/citradewi/edu-game',
    'https://figma.com/file/edu-game-design',
    'https://via.placeholder.com/300x200?text=Game+Edukasi',
    TRUE, 'published', 7),

(7, 'Library Management System',
    'Sistem manajemen perpustakaan berbasis web. Fitur: manajemen buku, anggota, peminjaman, dan laporan.',
    'https://github.com/andipratama/library-system',
    NULL,
    'https://via.placeholder.com/300x200?text=Library+System',
    FALSE, 'published', 2),

(8, 'Company Profile Website',
    'Website company profile untuk bisnis lokal. Fitur: halaman about, services, gallery, contact form, dan blog.',
    'https://github.com/sariwulandari/company-profile',
    'https://figma.com/file/company-profile',
    'https://via.placeholder.com/300x200?text=Company+Profile',
    TRUE, 'published', 3);

-- =====================================================
-- 5. PROJECT CONTRIBUTORS
-- =====================================================
INSERT INTO project_contributors (id, user_id, project_id, role) VALUES
-- Project 1: Student Talent Hub
(1, 2, 1, 'Backend Developer'),
(2, 5, 1, 'Frontend Developer'),
(3, 3, 1, 'UI/UX Designer'),

-- Project 2: E-Commerce Mobile App
(4, 6, 2, 'Mobile Developer'),
(5, 2, 2, 'Backend Developer'),

-- Project 4: Smart Campus Dashboard
(6, 5, 4, 'Full-stack Developer'),
(7, 4, 4, 'Data Analyst'),

-- Project 6: Game Edukasi
(8, 7, 6, 'Game Designer'),
(9, 3, 6, 'UI/UX Designer'),

-- Project 8: Company Profile Website
(10, 3, 8, 'Frontend Developer');

-- =====================================================
-- 6. ENDORSEMENTS
-- =====================================================
INSERT INTO endorsements (id, from_user_id, to_user_id, skill_id, project_id, message) VALUES
(1, 3, 2, 1, 1, 'Andi sangat handal dalam backend development. Kode yang ditulis bersih dan terstruktur dengan baik.'),
(2, 2, 3, 3, 1, 'Desain UI/UX dari Sari sangat intuitif. Pengguna memberikan feedback positif.'),
(3, 5, 6, 2, 2, 'Rudi ahli dalam pengembangan Android. Aplikasi yang dibuat memiliki performa yang sangat baik.'),
(4, 8, 2, 1, NULL, 'Terkesan dengan kemampuan web development Andi. Kami tertarik untuk merekrut.'),
(5, 10, 4, 5, 5, 'Analisis data Budi sangat mendalam dan akurat. Cocok untuk riset akademik.'),
(6, 2, 5, 1, 4, 'Dewi adalah full-stack developer yang luar biasa. Dashboard yang dibuat sangat informatif.');

-- =====================================================
-- 7. COLLABORATION REQUESTS
-- =====================================================
INSERT INTO collaboration_requests (id, project_id, requester_id, role, message, status, created_at) VALUES
(1, 1, 3, 'UI/UX Designer',
    'Halo, saya tertarik untuk berkontribusi di project Student Talent Hub sebagai UI/UX Designer. Saya punya pengalaman di bidang design selama 2 tahun.',
    'accepted', NOW() - INTERVAL '7 days'),

(2, 1, 4, 'Data Analyst',
    'Saya ingin membantu mengimplementasikan fitur analytics di Student Talent Hub. Saya punya pengalaman dengan Python dan visualization tools.',
    'pending', NOW() - INTERVAL '3 days'),

(3, 4, 6, 'Mobile Developer',
    'Saya tertarik untuk membuat versi mobile dari Smart Campus Dashboard. Saya sudah berpengalaman dengan React Native.',
    'pending', NOW() - INTERVAL '2 days'),

(4, 6, 4, 'Game Developer',
    'Saya ingin bergabung mengembangkan Game Edukasi. Saya punya pengalaman dengan Unity dan C#.',
    'rejected', NOW() - INTERVAL '5 days'),

(5, 3, 5, 'Backend Developer',
    'Saya bisa membantu menambahkan fitur blog dan CMS di Portfolio Website. Saya ahli dengan Laravel dan MySQL.',
    'pending', NOW() - INTERVAL '1 day');

-- =====================================================
-- 8. SAVED STUDENTS
-- =====================================================
INSERT INTO saved_students (id, recruiter_id, student_id, created_at) VALUES
(1, 8, 2, NOW() - INTERVAL '10 days'),
(2, 8, 5, NOW() - INTERVAL '8 days'),
(3, 9, 3, NOW() - INTERVAL '5 days'),
(4, 9, 6, NOW() - INTERVAL '2 days');

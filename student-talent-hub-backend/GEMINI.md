# GEMINI.md

## 🚀 Panduan Pengembangan Backend: Student Talent & Project Hub

Dokumen ini berisi instruksi lengkap untuk membangun seluruh API Endpoint menggunakan FastAPI, SQLAlchemy (Async), dan PostgreSQL (Neon) tanpa menggunakan Alembic.

---

## 🛠️ Aturan Umum Pengodean API

Sebelum menulis kode di layer endpoints, pastikan semua developer mematuhi arsitektur asinkron berikut:

- Setiap fungsi endpoint wajib menggunakan keyword async def.
- Semua operasi database ke SQLAlchemy wajib menggunakan await dan dieksekusi melalui db: AsyncSession = Depends(get_db).
- Validasi input data menggunakan Pydantic Schemas (app/schemas/), sedangkan representasi tabel menggunakan SQLAlchemy Models (app/models/).
- Gunakan penanganan error yang tepat menggunakan HTTPException dari FastAPI dengan status kode HTTP yang sesuai.

---

## 📂 Struktur File Router & Endpoints

Seluruh endpoint di bawah ini harus didaftarkan ke dalam file app/api/v1/router.py:

from fastapi import APIRouter
from app.api.v1.endpoints import users, skills, projects, endorsements

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["Users & Auth"])
api_router.include_router(skills.router, prefix="/skills", tags=["Skills"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(endorsements.router, prefix="/endorsements", tags=["Endorsements"])

---

## 📌 Instruksi Pembuatan Endpoint per Domain

### 1. Domain: Users & Authentication (app/api/v1/endpoints/users.py)

Domain ini menangani manajemen akun pengguna dengan 3 peran berbeda (student, recruiter, admin) dan pengecekan status (active, banned).

- POST /users/register (Registrasi Akun)
  - Input (Schema): UserCreate (nama, email, password, role, nim/optional, major/optional).
  - Logika:
    1. Cek apakah email sudah terdaftar melalui crud_user.get_user_by_email. Jika ya, lempar HTTPException(400, "Email already registered").
    2. Jika user menginput NIM, cek duplikasi NIM di database. Jika ada, lempar HTTPException(400, "NIM already registered").
    3. Lakukan hashing pada password menggunakan core.security.get_password_hash.
    4. Simpan ke database dengan status default active.
  - Output (Schema): UserResponse (HTTP 201 Created).

- POST /users/login (Autentikasi Token)
  - Input: OAuth2PasswordRequestForm (menggunakan data username sebagai penampung email dan password). Dikirim melalui format x-www-form-urlencoded.
  - Logika:
    1. Cari user berdasarkan email (form_data.username).
    2. Jika user tidak ditemukan atau password salah (cek via verify_password), lempar HTTPException(401, "Incorrect email or password").
    3. Jika status user adalah banned, lempar HTTPException(403, "Your account has been banned").
    4. Generate JWT Token menggunakan create_access_token dengan data sub berisi email user.
  - Output (Schema): Token (berisi access_token dan token_type: bearer).

- GET /users/me (Cek Profil Sendiri)
  - Proteksi: Menggunakan dependency current_user: User = Depends(get_current_user).
  - Output (Schema): UserResponse (Mengembalikan data user yang sedang login saat ini).

- GET /users/ (Ambil Semua User - Admin Panel)
  - Proteksi: Wajib cek apakah current_user.role == "admin". Jika bukan, lempar HTTPException(403, "Not enough permissions").
  - Output (Schema): List[UserResponse].

---

### 2. Domain: Skills Management (app/api/v1/endpoints/skills.py)

Domain ini mengelola master kategori keahlian (skill_categories) dan keahlian yang dimiliki mahasiswa (user_skills).

- POST /skills/categories (Tambah Master Kategori - Admin Only)
  - Proteksi: Depends(get_current_user) + Cek role == "admin".
  - Input (Schema): SkillCategoryCreate (name, description).
  - Output: SkillCategoryResponse (HTTP 201 Created).

- GET /skills/categories (Lihat Semua Master Kategori - Publik)
  - Logika: Mengambil semua daftar keahlian master dari tabel skill_categories untuk ditampilkan di dropdown pilihan Frontend.
  - Output: List[SkillCategoryResponse].

- POST /skills/user-skills (Klaim Keahlian Mahasiswa)
  - Proteksi: Depends(get_current_user) + Cek role == "student".
  - Input (Schema): UserSkillCreate (skill_id, proficiency_level dengan validasi enum: beginner, intermediate, expert).
  - Logika: Hubungkan user_id (dari token) dengan skill_id. Pastikan kombinasi user_id dan skill_id belum duplikat di tabel user_skills.
  - Output: UserSkillResponse.

- DELETE /skills/user-skills/{skill_id} (Hapus Keahlian Mahasiswa)
  - Proteksi: Depends(get_current_user) + Cek role == "student".
  - Logika: Menghapus baris keahlian spesifik milik mahasiswa tersebut di tabel user_skills.

---

### 3. Domain: Project Hub & Collaboration (app/api/v1/endpoints/projects.py)

Domain transaksional utama untuk mengelola proyek (projects) dan kontributor tim (project_contributors).

- POST /projects/ (Buat Proyek Baru)
  - Proteksi: Depends(get_current_user) + Cek role == "student".
  - Input (Schema): ProjectCreate (title, description, github_link, figma_link, thumbnail_url, is_open).
  - Logika: Set owner_id secara otomatis menggunakan ID mahasiswa yang sedang login. Set status default proyek menjadi published.
  - Output: ProjectResponse.

- GET /projects/ (Eksplorasi Proyek dengan Filter)
  - Query Parameter: is_open: Optional[bool] = None (Jika true, hanya tampilkan proyek yang sedang membuka lowongan kolaborasi).
  - Output: List[ProjectResponse].

- GET /projects/{project_id} (Detail Proyek & Anggota)
  - Logika: Ambil data proyek secara detail berdasarkan ID, lakukan join atau muat relationship untuk menyertakan daftar anggota dari tabel project_contributors.
  - Output: ProjectDetailResponse (Membawa objek data proyek beserta array data kontributor).

- POST /projects/{project_id}/contributors (Tambah Rekan Kolaborator)
  - Proteksi: Depends(get_current_user).
  - Input (Schema): ContributorCreate (user_id yang diajak, role tim misalnya 'UI/UX' atau 'Backend').
  - Logika:
    1. Cek apakah user yang mengeksekusi endpoint ini adalah benar-benar pemilik proyek (owner_id == current_user.id). Jika bukan pemilik, lempar HTTPException(403, "Only the project owner can add contributors").
    2. Masukkan data ke tabel project_contributors.

---

### 4. Domain: Endorsements & Appreciation (app/api/v1/endpoints/endorsements.py)

Sistem pembuktian sosial (social proof) di mana user memberikan rekomendasi/apresiasi terhadap skill atau kontribusi user lain.

- POST /endorsements/ (Berikan Endorsement)
  - Proteksi: Depends(get_current_user).
  - Input (Schema): EndorsementCreate (to_user_id, skill_id atau project_id bersifat nullable/opsional, message).
  - Logika: Set from_user_id otomatis dari ID user yang login. Pastikan from_user_id tidak sama dengan to_user_id (tidak boleh meng-endorse diri sendiri).
  - Output: EndorsementResponse.

- GET /endorsements/user/{user_id} (Ambil Feed Endorsement User)
  - Logika: Mengambil daftar seluruh endorsement yang diterima oleh seorang mahasiswa (to_user_id == user_id) untuk dipajang di halaman profil publik.
  - Output: List[EndorsementResponse].

---

## 🛡️ Langkah Pengujian di Postman

1. Jalankan server lokal: uvicorn app.main:app --reload.
2. Tembak endpoint POST /users/register untuk membuat akun mahasiswa dan akun recruiter.
3. Tembak endpoint POST /users/login menggunakan tipe bodi x-www-form-urlencoded untuk mendapatkan token JWT.
4. Salin string access_token yang keluar, lalu pasang di tab Authorization -> Bearer Token pada Postman untuk menguji endpoint-endpoint yang terproteksi (/me, /projects/, dll).

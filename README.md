# 🛒 Stockmart — Sistem Manajemen Stok Supermarket

Aplikasi web fullstack untuk manajemen stok supermarket dengan fitur lengkap: CRUD, Soft/Hard Delete, Auth JWT, dan Laporan JOIN multi-tabel.

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React.js (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcrypt |

## 👥 Akun Default

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@stockmart.com | admin123 |
| Staff | budi@stockmart.com | staff123 |
| Staff | sari@stockmart.com | staff123 |

## 📁 Struktur Folder

```
stockmart/
├── client/               # React.js (Vite) Frontend
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar, Modal, SearchBar, ConfirmDialog
│   │   ├── pages/        # Login, Dashboard, Produk, Kategori, Transaksi, Users
│   │   ├── context/      # AuthContext (JWT)
│   │   └── api/          # axios instance
└── server/               # Express.js Backend
    ├── src/
    │   ├── routes/        # auth, users, kategori, produk, transaksi
    │   ├── controllers/   # Logic bisnis setiap entitas
    │   └── middleware/    # JWT auth + role check
    └── prisma/
        ├── schema.prisma  # Database schema (4 tabel)
        └── seed.js        # Data awal
```

## 🚀 Cara Setup & Menjalankan

### 1. Siapkan Database PostgreSQL

Buat database baru:
```sql
CREATE DATABASE stockmart_db;
```

### 2. Setup Backend (server/)

```bash
cd server
npm install
```

Salin `.env.example` ke `.env` dan isi konfigurasi:
```bash
cp .env.example .env
```

Edit `server/.env`:
```env
DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/stockmart_db?schema=public"
JWT_SECRET="stockmart_super_secret_jwt_key_2024"
PORT=5000
```

Jalankan migrasi Prisma:
```bash
npx prisma migrate dev --name init
```

Isi data awal (seed):
```bash
npm run seed
```

Jalankan server:
```bash
npm run dev
```

Server berjalan di: **http://localhost:5000**

### 3. Setup Frontend (client/)

```bash
cd client
npm install
npm run dev
```

Frontend berjalan di: **http://localhost:5173**

## 📄 Fitur Lengkap

### ✅ Autentikasi
- Login dengan email + password (JWT)
- Token tersimpan di localStorage
- Auto redirect ke login jika token expired
- Protected routes berdasarkan role

### ✅ Dashboard
- Total produk, total kategori, produk stok menipis (<10)
- Tabel 8 produk terbaru dengan badge stok berwarna

### ✅ Manajemen Produk
- CRUD lengkap (Tambah, Edit, Soft Delete, Hard Delete)
- Tab Aktif dan Arsip
- Restore produk dari arsip
- Search real-time
- Badge stok: merah (<10), kuning (<30), hijau (≥30)

### ✅ Manajemen Kategori
- CRUD lengkap dengan tab Arsip
- Tampilkan jumlah produk per kategori
- Search real-time

### ✅ Laporan Transaksi (JOIN 4 Tabel)
- JOIN: transaksi_stok + produk + kategori + users
- Filter berdasarkan jenis (masuk/keluar)
- Search berdasarkan nama produk/user/keterangan
- Tambah transaksi baru (update stok otomatis)

### ✅ Manajemen User (Admin Only)
- CRUD user dengan role Admin/Staff
- Tidak bisa menghapus akun sendiri
- Tab Arsip untuk user yang dinonaktifkan

## 🗃️ ERD Singkat

```
users (1) ────────── (N) transaksi_stok
produk (1) ─────────(N) transaksi_stok  
kategori (1) ───────(N) produk
```

**Constraint:** `email` UNIQUE di tabel `users`

## 🔐 Role & Akses

| Fitur | Admin | Staff |
|-------|-------|-------|
| Dashboard | ✅ | ✅ |
| Lihat Produk | ✅ | ✅ |
| Tambah/Edit Produk | ✅ | Edit stok saja |
| Soft/Hard Delete Produk | ✅ | ❌ |
| Kelola Kategori | ✅ | Lihat saja |
| Laporan Transaksi | ✅ | ✅ |
| Tambah Transaksi | ✅ | ✅ |
| Manajemen User | ✅ | ❌ |

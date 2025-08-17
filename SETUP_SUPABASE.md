# 🚀 Setup Supabase Project Baru

Ikuti langkah-langkah berikut untuk mengkonfigurasi proyek Supabase baru Anda:

## 1. Dapatkan Kredensial Supabase

1. Buka [Dashboard Supabase](https://app.supabase.com)
2. Pilih proyek baru Anda
3. Pergi ke **Settings** → **API**
4. Salin:
   - **Project URL** (contoh: `https://abcdefgh.supabase.co`)
   - **anon public key** (token panjang yang dimulai dengan `eyJ...`)

## 2. Update Konfigurasi Aplikasi

1. Buka file `src/lib/supabase.ts`
2. Ganti `YOUR_NEW_SUPABASE_URL_HERE` dengan Project URL Anda
3. Ganti `YOUR_NEW_ANON_PUBLIC_KEY_HERE` dengan anon public key Anda

```typescript
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'eyJ...'; // anon public key Anda
```

## 3. Buat Skema Database

1. Buka **SQL Editor** di Dashboard Supabase
2. Salin seluruh isi file `supabase/migrations/create_initial_schema.sql`
3. Paste dan jalankan di SQL Editor

## 4. Verifikasi Setup

1. Jalankan aplikasi: `npm run dev`
2. Coba akses halaman registrasi: `http://localhost:5173/register`
3. Isi form dan submit untuk test koneksi database

## 5. Troubleshooting

### Error "new row violates row-level security policy"
- Pastikan Anda sudah menjalankan SQL migration di langkah 3
- Periksa apakah RLS policies sudah terbuat di **Authentication** → **Policies**

### Error "Invalid API key"
- Pastikan Anda menggunakan **anon public key**, bukan service_role key
- Periksa apakah URL dan key sudah benar di `src/lib/supabase.ts`

### Storage bucket tidak ditemukan
- Periksa di **Storage** apakah bucket `portfolios` dan `cvs` sudah terbuat
- Jika belum, jalankan ulang SQL migration

## 6. Fitur yang Tersedia

✅ **Registrasi Volunteer**: Form multi-step dengan validasi
✅ **Upload File**: Portfolio dan CV ke Supabase Storage  
✅ **Admin Dashboard**: Kelola aplikasi volunteer
✅ **RLS Security**: Keamanan tingkat baris untuk data protection

---

**Catatan Penting**: 
- JANGAN PERNAH commit service_role key ke repository
- Gunakan hanya anon public key di frontend
- Backup database secara berkala
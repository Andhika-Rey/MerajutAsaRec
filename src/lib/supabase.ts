import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// PENTING: Ganti dengan URL dan kunci dari proyek Supabase BARU Anda
// Anda dapat menemukan ini di Dashboard Supabase > Settings > API

// TODO: Ganti dengan URL proyek Supabase baru Anda
const supabaseUrl = 'https://gqykvqlvhsjgbxezxsjy.supabase.co';

// TODO: Ganti dengan anon public key dari proyek Supabase baru Anda
// HANYA gunakan anon public key, JANGAN PERNAH gunakan service_role key di frontend!
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeWt2cWx2aHNqZ2J4ZXp4c2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjQ5MzEsImV4cCI6MjA3MDM0MDkzMX0.5WoWCgum5qxupdMuKnsYMfa1XhrEdx-_fKratMHKBDI';

// Validasi bahwa kunci sudah diatur dengan benar
if (!supabaseUrl || supabaseUrl === 'YOUR_NEW_SUPABASE_URL_HERE') {
  throw new Error('❌ Silakan ganti YOUR_NEW_SUPABASE_URL_HERE dengan URL proyek Supabase baru Anda di src/lib/supabase.ts');
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_NEW_ANON_PUBLIC_KEY_HERE') {
  throw new Error('❌ Silakan ganti YOUR_NEW_ANON_PUBLIC_KEY_HERE dengan anon public key proyek Supabase baru Anda di src/lib/supabase.ts');
}

// Validasi format kunci anon (harus dimulai dengan 'eyJ')
if (!supabaseAnonKey.startsWith('eyJ')) {
  throw new Error('❌ Anon public key harus dimulai dengan "eyJ". Pastikan Anda menggunakan anon public key, bukan service_role key!');
}

// Buat dan ekspor client Supabase - ini adalah SATU-SATUNYA tempat createClient dipanggil
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Test koneksi database
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.error('❌ Test koneksi database gagal:', error);
      return false;
    }

    console.log('✅ Koneksi database berhasil');
    return true;
  } catch (error) {
    console.error('❌ Error test koneksi:', error);
    return false;
  }
};
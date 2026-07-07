const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Inisialisasi Supabase dengan SERVICE_ROLE_KEY (Aman dari RLS)
const SUPABASE_URL = 'https://xyzcompany.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Ganti dengan key kamu

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BUCKET_NAME = 'nama-bucket-kamu';

async function uploadFileKeKamar(namaFileLokal, namaOrgz, namaProperti, namaRoom) {
  try {
    // Path file lokal yang mau diupload (misal dari folder /rooms)
    const filePathLokal = path.join(__dirname, namaFileLokal); 
    
    if (!fs.existsSync(filePathLokal)) {
      console.error(`File lokal ${namaFileLokal} tidak ditemukan.`);
      return;
    }

    // Baca file menjadi Buffer
    const fileBuffer = fs.readFileSync(filePathLokal);

    // 2. Susun path tujuan di Supabase Storage (Otomatis generate folder)
    const pathTujuanStorage = `${namaOrgz}/${namaProperti}/${namaRoom}/${namaFileLokal}`;

    console.log(`Mengupload ke: ${pathTujuanStorage}...`);

    // 3. Eksekusi upload via SDK
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(pathTujuanStorage, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true // true = jika file sudah ada, akan ditimpa (overwrite)
      });

    if (error) {
      throw error;
    }

    console.log(`🚀 Sukses upload! Path: ${data.path}`);

  } catch (err) {
    console.error('Gagal upload:', err.message);
  }
}

// --- CONTOH CARA JALANKANNYA ---
// Kamu bisa looping isi base.txt atau array, lalu panggil fungsinya seperti ini:
uploadFileKeKamar(
  'kamar-101-andalus54-1776504500.jpeg', // Nama file asal
  'andalus-group',                       // [nama-orgz]
  'andalus54',                           // [nama-properti]
  'kamar-101'                            // [nama-room] (Pecah per folder room)
);
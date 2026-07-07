import os

# 1. Definisikan daftar folder yang mau diambil datanya
daftar_folder = ['./kamar', './kamar2', './toilet', './toilet2']
file_log = 'base.txt'

try:
    # Buka file base.txt sekali di awal ('w' untuk overwrite isi lama)
    with open(file_log, 'w', encoding='utf-8') as f:
        
        # 2. Iterasi masuk ke setiap folder di dalam daftar
        for folder in daftar_folder:
            if not os.path.exists(folder):
                print(f"Peringatan: Folder '{folder}' tidak ditemukan, dilewati.")
                continue
                
            isi_folder = os.listdir(folder)
            # Filter hanya file valid (bukan file sistem tersembunyi)
            list_nama = [item for item in isi_folder if not item.startswith('.')]
            
            print(f"\n--- Memproses Folder: {folder} ({len(list_nama)} file) ---")
            
            # 3. Iterasi setiap file di folder saat ini
            for nama_item in list_nama:
                # Pisahkan nama file dari ekstensinya
                nama_tanpa_ekstensi, _ = os.path.splitext(nama_item)
                
                # Jaga-jaga jika ada format underscore
                nama_bersih = nama_tanpa_ekstensi.replace('_', '-')
                
                # Standarisasi dengan ekstensi .jpeg
                nama_baru = f"{nama_bersih}.jpeg"
                
                # 4. Tulis langsung ke base.txt
                f.write(f"{nama_baru}\n")
                print(f"Dicatat dari {folder}: {nama_baru}")
        
    print(f"\n🎯 Sukses! Semua list nama dari 4 folder berhasil digabung di {file_log}")

except Exception as e:
    print(f"Terjadi error: {e}")